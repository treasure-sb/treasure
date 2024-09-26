create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create type "public"."Event Status" as enum ('LIVE', 'DRAFT');

drop function if exists "public"."insert_event"(event_details json, event_poster_url text, event_venue_map_url text, event_cleaned_name text, event_dates json);

alter table "public"."event_dates" alter column "date" drop not null;

alter table "public"."events" add column "status" "Event Status" not null default 'LIVE'::"Event Status";

alter table "public"."events" alter column "address" drop not null;

alter table "public"."events" alter column "city" drop not null;

alter table "public"."events" alter column "cleaned_name" drop not null;

alter table "public"."events" alter column "description" drop not null;

alter table "public"."events" alter column "lat" drop not null;

alter table "public"."events" alter column "lng" drop not null;

alter table "public"."events" alter column "max_date" drop not null;

alter table "public"."events" alter column "min_date" drop not null;

alter table "public"."events" alter column "state" drop not null;

alter table "public"."events" alter column "vendor_exclusivity" set default 'APPLICATIONS'::"Vendor Exclusivity";

alter table "public"."events" alter column "venue_name" drop not null;

alter table "public"."events" add constraint "events_name_check" CHECK ((length(name) > 0)) not valid;

alter table "public"."events" validate constraint "events_name_check";

set check_function_bodies = off;

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
  RETURN event_id;
END;
$function$
;

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
    event_data->'dates' 
    'LIVE',
    cleaned_name
  );
  perform create_host(event_id, user_id);
  perform create_event_dates(event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(event_id, event_data->'tickets');
  perform create_tables(event_id, event_data->'tables');
  perform create_vendor_app_info(event_id, event_data->'vendorInfo');
  perform create_tags(event_id, event_data->'tags');

    -- insert event as collectables category
  INSERT INTO event_categories (
    event_id,
    category_id
  )
  VALUES (
    event_id,
    (SELECT id FROM categories WHERE name = 'collectables')
  );

  RETURN cleaned_name;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE;
END;
$function$
;


