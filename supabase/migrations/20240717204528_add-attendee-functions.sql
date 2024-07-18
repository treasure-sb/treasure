create extension if not exists "uuid-ossp" with schema "public" version '1.1';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_attendee_count(event_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
  attendee_count bigint;
begin
  select count(distinct attendee_id) into attendee_count
  from event_tickets et
  where et.event_id = get_attendee_count.event_id;

  return attendee_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_attendee_data(event_id uuid)
 RETURNS TABLE(first_name text, last_name text, email text, avatar_url text, phone text, number_tickets_purchased bigint, date_of_last_purchase timestamp with time zone, number_tickets_scanned bigint, ticket_names text[])
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.first_name,
    p.last_name,
    p.email,
    p.avatar_url,
    p.email,
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
    p.id
  ORDER BY 
    number_tickets_purchased DESC;
END;
$function$
;


