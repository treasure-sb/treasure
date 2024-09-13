create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."events" alter column "sales_status" set default 'SELLING_ALL'::"Event Ticket Status";

CREATE UNIQUE INDEX events_cleaned_name_key ON public.events USING btree (cleaned_name);

alter table "public"."events" add constraint "events_cleaned_name_key" UNIQUE using index "events_cleaned_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_event(event_data json, user_id uuid, cleaned_name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE 
  event_id UUID; 
BEGIN 
  event_id := insert_event( 
    event_data->'basicDetails', 
    event_data->>'poster', 
    event_data->>'venueMap', 
    cleaned_name, 
    event_data->'dates' 
  );
  perform create_host(event_id, user_id);
  perform create_event_dates(event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(event_id, event_data->'tickets');
  perform create_tables(event_id, event_data->'tables');
  perform create_vendor_app_info(event_id, event_data->'vendorInfo');
  perform create_tags(event_id, event_data->'tags');
  RETURN cleaned_name;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_event_dates(event_id uuid, event_dates json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  FOR i IN 0..jsonb_array_length(event_dates::jsonb) - 1 LOOP
    INSERT INTO event_dates (event_id, date, start_time, end_time)
    VALUES (
      event_id,
      (event_dates->i->>'date')::DATE,
      (event_dates->i->>'startTime')::TIME,
      (event_dates->i->>'endTime')::TIME
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating event dates: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_host(event_id uuid, user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
  host_id UUID;
BEGIN
  INSERT INTO event_roles (
    event_id, 
    user_id, 
    role, 
    status
  )
  VALUES (
    create_host.event_id,
    create_host.user_id,
    'HOST',
    'ACTIVE'
  ) RETURNING id into host_id;
  RETURN host_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating event host: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_tables(p_event_id uuid, event_tables json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  p_table JSON;
BEGIN
  FOR p_table IN SELECT * from jsonb_array_elements(event_tables::jsonb)
  LOOP
    INSERT INTO tables (
      event_id, 
      price, 
      quantity, 
      total_tables, 
      section_name, 
      table_provided, 
      space_allocated, 
      number_vendors_allowed, 
      additional_information
    )
    VALUES (
      p_event_id,
      (p_table->>'price')::FLOAT,
      (p_table->>'quantity')::INTEGER,
      (p_table->>'quantity')::INTEGER,
      p_table->>'name',
      (p_table->>'tableProvided')::BOOLEAN,
      (p_table->>'spaceAllocated')::INTEGER,
      (p_table->>'numberVendorsAllowed')::INTEGER,
      p_table->>'additionalInformation'
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating tables: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_tags(p_event_id uuid, tags json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  tag JSON;
BEGIN
  FOR tag IN SELECT * FROM jsonb_array_elements(tags::jsonb)
  LOOP
    INSERT INTO event_tags (event_id, tag_id)
    VALUES (
      p_event_id,
      (tag->>'id')::UUID
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating tags: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_tickets_and_ticket_dates(p_event_id uuid, event_tickets json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  p_ticket_id UUID;
  p_event_date_id UUID;
  ticket JSON;
  ticket_date DATE;
BEGIN
  -- Loop through each ticket in the event_tickets array
  FOR ticket IN SELECT * FROM jsonb_array_elements(event_tickets::jsonb)
  LOOP
    -- Insert a row for the ticket into the tickets table
    INSERT INTO tickets (event_id, price, quantity, total_tickets, name, description)
    VALUES (
      p_event_id,
      (ticket->>'price')::NUMERIC,  -- Changed to NUMERIC for currency
      (ticket->>'quantity')::INTEGER,
      (ticket->>'quantity')::INTEGER,
      ticket->>'name',
      ticket->>'description'
    ) RETURNING id INTO p_ticket_id;

    -- For each of this ticket's valid dates, insert a row into ticket_dates
    FOR ticket_date IN SELECT * FROM jsonb_array_elements((ticket->'dates')::jsonb)
    LOOP
      -- Find the entry in event_dates for this valid ticket date
      SELECT id INTO p_event_date_id
      FROM event_dates
      WHERE event_id = p_event_id
        AND date = ticket_date::DATE;

      IF p_event_date_id IS NULL THEN
        RAISE EXCEPTION 'No matching event date found for ticket % on %', p_ticket_id, ticket_date;
      END IF;

      INSERT INTO ticket_dates (ticket_id, event_date_id)
      VALUES (p_ticket_id, p_event_date_id);
    END LOOP;
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating tickets and ticket dates: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_vendor_app_info(p_event_id uuid, vendor_info json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  term JSON;
BEGIN
  INSERT INTO application_vendor_information (event_id, check_in_time, check_in_location, wifi_availability, additional_information) 
  VALUES (
    p_event_id,
    (vendor_info->>'checkInTime')::TIME,
    vendor_info->>'checkInLocation',
    (vendor_info->>'wifiAvailability')::BOOLEAN,
    vendor_info->>'additionalInfo'
  );

  FOR term IN SELECT * FROM jsonb_array_elements((vendor_info->'terms')::jsonb)
  LOOP 
    INSERT INTO application_terms_and_conditions (event_id, term)
    VALUES (
      p_event_id,
      term->>'term'
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating vendor application information: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_event(event_details json, event_poster_url text, event_venue_map_url text, event_cleaned_name text, event_dates json)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_event_id UUID;
  min_date DATE;
  max_date DATE;
BEGIN
  SELECT 
    MIN((date->>'date')::DATE),
    MAX((date->>'date')::DATE)
  INTO min_date, max_date
  FROM json_array_elements(event_dates) AS date;

  INSERT INTO EVENTS (
    name, 
    description, 
    poster_url, 
    address, 
    lat, 
    lng, 
    venue_name,
    venue_map_url, 
    cleaned_name, 
    city, 
    state, 
    min_date, 
    max_date
  )
  VALUES (
    event_details->>'name',
    event_details->>'description',
    event_poster_url,
    event_details->'venueAddress'->>'address',
    (event_details->'venueAddress'->>'lat')::FLOAT,
    (event_details->'venueAddress'->>'lng')::FLOAT,
    event_details->>'venueName',
    event_venue_map_url,
    event_cleaned_name,
    event_details->'venueAddress'->>'city',
    event_details->'venueAddress'->>'state',
    min_date,
    max_date
  ) RETURNING id INTO new_event_id;

  RETURN new_event_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating event: %', SQLERRM;
END;
$function$
;


