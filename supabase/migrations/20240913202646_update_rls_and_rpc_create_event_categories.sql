create extension if not exists "uuid-ossp" with schema "public" version '1.1';

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

create policy "Enable insert for authenticated users only"
on "public"."event_categories"
as permissive
for insert
to authenticated
with check (true);



