create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."application_terms_and_conditions" alter column "term" drop not null;

alter table "public"."application_vendor_information" alter column "check_in_location" drop not null;

alter table "public"."application_vendor_information" alter column "check_in_time" drop not null;

alter table "public"."tables" alter column "number_vendors_allowed" drop not null;

alter table "public"."tables" alter column "quantity" drop not null;

alter table "public"."tables" alter column "section_name" drop not null;

alter table "public"."tables" alter column "space_allocated" drop not null;

alter table "public"."tables" alter column "total_tables" drop not null;

set check_function_bodies = off;

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
      NULLIF(p_table->>'quantity', '')::INTEGER,
      NULLIF(p_table->>'quantity', '')::INTEGER,
      NULLIF(p_table->>'name', '')::TEXT,
      (p_table->>'tableProvided')::BOOLEAN,
      NULLIF(p_table->>'spaceAllocated', '')::INTEGER,
      NULLIF(p_table->>'numberVendorsAllowed', '')::INTEGER,
      NULLIF(p_table->>'additionalInformation', '')::TEXT
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating tables: %', SQLERRM;
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
      (ticket->>'price')::NUMERIC, 
      NULLIF(ticket->>'quantity', '')::INTEGER,
      NULLIF(ticket->>'quantity', '')::INTEGER,
      NULLIF(ticket->>'name', '')::TEXT,
      NULLIF(ticket->>'description', '')::TEXT
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
    NULLIF(vendor_info->>'checkInTime', '')::TIME,
    NULLIF(vendor_info->>'checkInLocation', '')::TEXT,
    (vendor_info->>'wifiAvailability')::BOOLEAN,
    NULLIF(vendor_info->>'additionalInfo', '')::TEXT
  );

  FOR term IN SELECT * FROM jsonb_array_elements((vendor_info->'terms')::jsonb)
  LOOP 
    INSERT INTO application_terms_and_conditions (event_id, term)
    VALUES (
      p_event_id,
      NULLIF(term->>'term', '')::TEXT
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating vendor application information: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_event(event_details json, event_poster_url text, event_venue_map_url text, event_dates json, status "Event Status", event_cleaned_name text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_event_id UUID;
  min_date DATE;
  max_date DATE;
BEGIN
  SELECT 
    MIN(
      CASE
        WHEN date->>'date' is NOT NULL
        THEN (date->>'date')::DATE
        ELSE NULL
      END),
    MAX(CASE
        WHEN date->>'date' is NOT NULL
        THEN (date->>'date')::DATE
        ELSE NULL
      END)
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
    max_date,
    status
  )
  VALUES (
    event_details->>'name',
    NULLIF(event_details->>'description', '')::TEXT,
    event_poster_url,
    NULLIF(event_details->'venueAddress'->>'address', '')::TEXT,
    NULLIF(event_details->'venueAddress'->>'lat'::TEXT, '0')::FLOAT,
    NULLIF(event_details->'venueAddress'->>'lng'::TEXT, '0')::FLOAT,
    NULLIF(event_details->>'venueName', '')::TEXT,
    event_venue_map_url,
    event_cleaned_name,
    NULLIF(event_details->'venueAddress'->>'city', '')::TEXT,
    NULLIF(event_details->'venueAddress'->>'state', '')::TEXT,
    min_date,
    max_date,
    status
  ) RETURNING id INTO new_event_id;

  RETURN new_event_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating event: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.save_draft(event_data json, user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE 
  event_id UUID;
BEGIN
  event_id := insert_event(
    event_data->'basicDetails',
    event_data->>'poster',
    event_data->>'venueMap',
    event_data->'dates',
    'DRAFT',
    NULL
  );
  perform create_host(event_id, user_id);
  perform create_event_dates(event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(event_id, event_data->'tickets');
  perform create_tags(event_id, event_data->'tags');
  perform create_tables(event_id, event_data->'tables');
  perform create_vendor_app_info(event_id, event_data->'vendorInfo');
  RETURN event_id;
END;
$function$
;


