create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop function if exists "public"."get_attendee_data"(event_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_attendee_data(event_id uuid)
 RETURNS TABLE(attendee_id uuid, first_name text, last_name text, email text, avatar_url text, phone text, number_tickets_purchased bigint, date_of_last_purchase timestamp with time zone, number_tickets_scanned bigint, ticket_names text[])
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    et.email,
    p.avatar_url,
    p.phone,
    COUNT(*)::BIGINT AS number_tickets_purchased,
    MAX(et.created_at) AS date_of_last_purchase,
    SUM(CASE WHEN et.valid THEN 0 ELSE 1 END)::BIGINT AS number_tickets_scanned,
    ARRAY_AGG(DISTINCT t.name) AS ticket_names
  FROM 
    event_tickets et
  JOIN 
    profiles p ON et.attendee_id = p.id
  JOIN 
    tickets t ON et.ticket_id = t.id
  WHERE 
    et.event_id = get_attendee_data.event_id
  GROUP BY 
    p.id, et.email
  ORDER BY 
    number_tickets_purchased DESC;
END;
$function$
;


