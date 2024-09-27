create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."event_dates" alter column "start_time" drop not null;

alter table "public"."tickets" alter column "name" drop not null;

alter table "public"."tickets" alter column "quantity" drop not null;

alter table "public"."tickets" alter column "total_tickets" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_event_dates(event_id uuid, event_dates json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  FOR i IN 0..jsonb_array_length(event_dates::jsonb) - 1 LOOP
    INSERT INTO event_dates (event_id, date, start_time, end_time)
    VALUES (
      event_id,
      CASE WHEN
        (event_dates->i->>'date') is NOT NULL
        THEN (event_dates->i->>'date')::DATE
        ELSE NULL
      END,
      NULLIF((event_dates->i->>'startTime'), '')::TIME,
      NULLIF((event_dates->i->>'endTime'), '')::TIME
    );
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating event dates: %', SQLERRM;
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
  RETURN event_id;
END;
$function$
;


