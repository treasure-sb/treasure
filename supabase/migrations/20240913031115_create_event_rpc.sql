create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."events" alter column "poster_url" set default 'poster_coming_soon'::text;

alter table "public"."tables" alter column "table_provided" set default true;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_event(event_data json, cleaned_name text)
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
    cleaned_name,
    event_data->'dates'
  );
    RETURN event_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_event(event_data json, user_id uuid, cleaned_name text)
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
    cleaned_name, 
    event_data->'dates' 
  );
  perform create_host(event_id, user_id);
  perform create_event_dates(event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(event_id, event_data->'tickets');
  perform create_tables(event_id, event_data->'tables');
  perform create_vendor_app_info(event_id, event_data->'vendorInfo');
  perform create_tags(event_id, event_data->'tags');
  RETURN event_id;
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
    RAISE EXCEPTION 'Error creating event dates: %', SQLERM;
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
    RAISE EXCEPTION 'Error creating event host: %', SQLERM;
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
    RAISE EXCEPTION 'Error creating tables: %', SQLERM;
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
    RAISE EXCEPTION 'Error creating tags: %', SQLERM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_ticket_and_ticket_dates(p_event_id uuid, event_tickets json)
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
  FOR ticket IN SELECT * FROM json_array_elements(event_tickets::jsonb)
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
    FOR ticket_date IN SELECT * FROM json_array_elements_text(ticket->'dates')
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
    RAISE EXCEPTION 'Error creating tickets and ticket dates: %', SQLERM;
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
    RAISE EXCEPTION 'Error creating vendor application information: %', SQLERM;
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
    RAISE EXCEPTION 'Error creating event: %', SQLERM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.purchase_tickets(ticket_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, email text, amount_paid double precision, metadata json DEFAULT NULL::json, promo_id uuid DEFAULT NULL::uuid, fees_paid double precision DEFAULT 0)
 RETURNS TABLE(order_id integer, event_ticket_ids uuid[], event_name text, event_dates timestamp with time zone[], event_address text, event_description text, event_cleaned_name text, event_poster_url text, ticket_name text, ticket_price double precision, attendee_first_name text, attendee_last_name text, attendee_business_name text, attendee_email text, attendee_phone text)
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_order_id INT;
  ticket_quantity INT;
  ticket_price FLOAT;
  promo_num_used INT;
  new_event_ticket_ids UUID[];
  valid_ticket_date_ids UUID[];
  ticket_dates TIMESTAMPTZ[];
  new_ticket_id UUID; 
BEGIN 
  IF purchase_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;
  
  -- Select ticket quantity and price with given ticket_id
  SELECT quantity, price INTO ticket_quantity, ticket_price
  FROM tickets
  WHERE id = ticket_id;

  IF NOT FOUND THEN  -- Add check if ticket exists
    RAISE EXCEPTION 'Ticket not found';
  END IF;

  -- Check quantity of tickets
  IF ticket_quantity < purchase_quantity THEN
    RAISE EXCEPTION 'ERROR: insufficient ticket quantity';
  END IF;

  -- Update ticket quantity
  UPDATE tickets
  SET quantity = ticket_quantity - purchase_quantity 
  WHERE id = ticket_id;

  IF NOT FOUND THEN  -- Add check if update was successful
    RAISE EXCEPTION 'Error updating ticket quantity';
  END IF;

  -- Insert tickets into event_tickets
  WITH inserted_tickets AS (
    INSERT INTO event_tickets (attendee_id, event_id, ticket_id, email)
    SELECT user_id, event_id, ticket_id, email
    FROM generate_series(1, purchase_quantity)
    RETURNING id
  )
  SELECT array_agg(id) INTO new_event_ticket_ids FROM inserted_tickets;

  -- Get valid date ids for the ticket the user is purchasing
  WITH valid_dates_ids AS (
    SELECT td.event_date_id 
    FROM ticket_dates td
    WHERE td.ticket_id = purchase_tickets.ticket_id
  )
  SELECT array_agg(event_date_id) INTO valid_ticket_date_ids FROM valid_dates_ids;

  -- Get valid dates for the tick user is purchasing
  WITH valid_dates AS (
    SELECT ed.date
    FROM ticket_dates td
    JOIN event_dates ed ON ed.id = td.event_date_id
    WHERE td.ticket_id = purchase_tickets.ticket_id
    ORDER BY ed.date ASC
  )
  SELECT array_agg(date) INTO ticket_dates FROM valid_dates;

  -- For each new event ticket id, insert a row into event_ticket_dates for each valid date
  FOREACH new_ticket_id IN ARRAY new_event_ticket_ids
  LOOP
    INSERT INTO event_tickets_dates (event_ticket_id, event_dates_id)
    SELECT new_ticket_id, unnest(valid_ticket_date_ids);
  END LOOP;

  -- Create order
  INSERT INTO orders (customer_id, amount_paid, event_id, metadata, fees_paid)
  VALUES (user_id, amount_paid, event_id, metadata, fees_paid)
  RETURNING id INTO new_order_id;

  -- Insert line item
  INSERT INTO line_items (order_id, item_type, item_id, quantity, price)
  VALUES (new_order_id, 'TICKET'::"Checkout Ticket Types", ticket_id, purchase_quantity, amount_paid / purchase_quantity);

  -- Check if promo was used. if it was update num used
  IF promo_id IS NOT NULL THEN  
    SELECT num_used INTO promo_num_used
    FROM event_codes
    WHERE id = promo_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Promo code not found';
    END IF;

    UPDATE event_codes
    SET num_used = promo_num_used + 1
    WHERE id = promo_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Error updating promo code usage';
    END IF;
  END IF;

  -- Return query
  RETURN QUERY
  SELECT 
    new_order_id AS order_id,
    new_event_ticket_ids AS event_ticket_ids,
    e.name AS event_name,
    ticket_dates AS event_dates,
    e.address AS event_address,
    e.description AS event_description,
    e.cleaned_name AS event_cleaned_name,
    e.poster_url AS event_poster_url,
    t.name AS ticket_name,
    t.price AS ticket_price,
    p.first_name AS attendee_first_name,
    p.last_name AS attendee_last_name,
    p.business_name AS attendee_business_name,
    p.email AS attendee_email,
    p.phone AS attendee_phone
  FROM 
    events e
    JOIN tickets t ON t.id = purchase_tickets.ticket_id
    JOIN profiles p ON p.id = purchase_tickets.user_id
  WHERE 
    e.id = purchase_tickets.event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No data found for the purchased tickets';
  END IF;
END;
$function$
;


