create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop function if exists "public"."save_draft"(event_data json, user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.save_draft(event_data json, user_id uuid, cleaned_name text, event_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE 
  draft_event_id UUID;
  draft_min_date DATE;
  draft_max_date DATE;
BEGIN
  IF event_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM events WHERE id = event_id AND status = 'DRAFT') THEN
        RAISE EXCEPTION 'Event not found or not in draft status';
    END IF;
    
    DELETE FROM event_tags WHERE event_id = save_draft_event.event_id;
    DELETE FROM application_terms_and_conditions WHERE event_id = save_draft_event.event_id;
    DELETE FROM application_vendor_information WHERE event_id = save_draft_event.event_id;
    DELETE FROM tables WHERE event_id = save_draft_event.event_id;
    DELETE FROM ticket_dates WHERE ticket_id IN (SELECT id FROM tickets WHERE event_id = save_draft_event.event_id);
    DELETE FROM tickets WHERE event_id = save_draft_event.event_id;
    DELETE FROM event_dates WHERE event_id = save_draft_event.event_id;
    DELETE FROM event_roles WHERE event_id = save_draft_event.event_id;

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
    INTO draft_min_date, draft_max_date
    FROM json_array_elements(event_data->'dates') AS date;

    UPDATE events
      SET 
        name = event_data->'basicDetails'->>'name',
        description = NULLIF(event_details->>'description', '')::TEXT,
        poster_url = event_data->>'poster',
        address = NULLIF(event_details->'venueAddress'->>'address', '')::TEXT,
        lat = NULLIF(event_details->'venueAddress'->>'lat'::TEXT, '0')::FLOAT,
        lng = NULLIF(event_details->'venueAddress'->>'lng'::TEXT, '0')::FLOAT,
        venue_name = NULLIF(event_details->>'venueName', '')::TEXT,
        venue_map_url = event_data->>'venueMap',
        city = NULLIF(event_details->'venueAddress'->>'city', '')::TEXT,
        state = NULLIF(event_details->'venueAddress'->>'state', '')::TEXT,
        min_date = draft_min_date,
        max_date = max_draft_date,
        status = 'DRAFT'
      WHERE id = save_draft_event.event_id
      RETURNING id INTO draft_event_id;
    ELSE
      draft_event_id := insert_event( 
        event_data->'basicDetails', 
        event_data->>'poster', 
        event_data->>'venueMap', 
        cleaned_name, 
        event_data->'dates',
        'DRAFT'
      );
  END IF;

  perform create_host(draft_event_id, user_id);
  perform create_event_dates(draft_event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(draft_event_id, event_data->'tickets');
  perform create_tags(draft_event_id, event_data->'tags');
  perform create_tables(draft_event_id, event_data->'tables');
  perform create_vendor_app_info(draft_event_id, event_data->'vendorInfo');

  RETURN draft_event_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.save_draft(event_data json, user_id uuid, p_event_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE 
  draft_event_id UUID;
  draft_min_date DATE;
  draft_max_date DATE;
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
    INTO draft_min_date, draft_max_date
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
        min_date = draft_min_date,
        max_date = draft_max_date,
        status = 'DRAFT'
      WHERE id = p_event_id
      RETURNING id INTO draft_event_id;
  ELSE
    draft_event_id := insert_event( 
      event_data->'basicDetails', 
      event_data->>'poster', 
      event_data->>'venueMap', 
      event_data->'dates',
      'DRAFT'
    );
  END IF;

  IF p_event_id IS NULL THEN
    perform create_host(draft_event_id, user_id);
  END IF;

  perform create_event_dates(draft_event_id, event_data->'dates');
  perform create_tickets_and_ticket_dates(draft_event_id, event_data->'tickets');
  perform create_tags(draft_event_id, event_data->'tags');
  perform create_tables(draft_event_id, event_data->'tables');
  perform create_vendor_app_info(draft_event_id, event_data->'vendorInfo');

  RETURN draft_event_id;
END;
$function$
;


