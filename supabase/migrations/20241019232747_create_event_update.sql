create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop function if exists "public"."create_event"(event_data json, user_id uuid, cleaned_name text);

drop function if exists "public"."save_draft"(event_data json, user_id uuid, cleaned_name text, event_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_event(event_data json, user_id uuid, p_cleaned_name text, p_event_id uuid DEFAULT NULL::uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE 
  f_event_id UUID; 
  f_min_date DATE;
  f_max_date DATE;
BEGIN 
  IF p_event_id IS NOT NULL THEN 
    IF NOT EXISTS (SELECT 1 FROM events WHERE id = p_event_id AND status = 'DRAFT') THEN
        RAISE EXCEPTION 'Event not found or not in draft status';
    END IF;

    DELETE FROM event_tags WHERE event_id = p_event_id;
    DELETE FROM application_terms_and_conditions WHERE event_id = p_event_id;
    DELETE FROM application_vendor_information WHERE event_id = p_event_id;
    DELETE FROM tables WHERE event_id = p_event_id;
    DELETE FROM ticket_dates WHERE ticket_id IN (SELECT id FROM tickets WHERE event_id = p_event_id);
    DELETE FROM tickets WHERE event_id = p_event_id;
    DELETE FROM event_dates WHERE event_id = p_event_id;

    SELECT 
      MIN(CASE WHEN date->>'date' IS NOT NULL THEN (date->>'date')::DATE ELSE NULL END),
      MAX(CASE WHEN date->>'date' IS NOT NULL THEN (date->>'date')::DATE ELSE NULL END)
    INTO f_min_date, f_max_date
    FROM json_array_elements(event_data->'dates') AS date;

    UPDATE events
    SET 
      name = event_data->'basicDetails'->>'name',
      description = NULLIF(event_data->'basicDetails'->>'description', '')::TEXT,
      poster_url = event_data->>'poster',
      address = NULLIF(event_data->'basicDetails'->'venueAddress'->>'address', '')::TEXT,
      lat = NULLIF((event_data->'basicDetails'->'venueAddress'->>'lat')::TEXT, '0')::FLOAT,
      lng = NULLIF((event_data->'basicDetails'->'venueAddress'->>'lng')::TEXT, '0')::FLOAT,
      venue_name = NULLIF(event_data->'basicDetails'->>'venueName', '')::TEXT,
      venue_map_url = event_data->>'venueMap',
      city = NULLIF(event_data->'basicDetails'->'venueAddress'->>'city', '')::TEXT,
      state = NULLIF(event_data->'basicDetails'->'venueAddress'->>'state', '')::TEXT,
      min_date = f_min_date,
      max_date = f_max_date,
      status = 'LIVE',
      cleaned_name = p_cleaned_name
    WHERE id = p_event_id
    RETURNING id INTO f_event_id;
  ELSE
    f_event_id := insert_event( 
      event_data->'basicDetails', 
      event_data->>'poster', 
      event_data->>'venueMap', 
      event_data->'dates',
      'LIVE',
      p_cleaned_name
    );
    perform create_host(f_event_id, user_id);
  END IF;

  perform create_event_dates(f_event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(f_event_id, event_data->'tickets');
  perform create_tables(f_event_id, event_data->'tables');
  perform create_vendor_app_info(f_event_id, event_data->'vendorInfo');
  perform create_tags(f_event_id, event_data->'tags');

    -- insert event as collectables category
  INSERT INTO event_categories (
    event_id,
    category_id
  )
  VALUES (
    f_event_id,
    (SELECT id FROM categories WHERE name = 'collectables')
  );

  RETURN p_cleaned_name;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE;
END;
$function$
;


