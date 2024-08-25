create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."event_tickets" drop column "valid";

alter table "public"."events" drop column "date";

alter table "public"."events" drop column "end_time";

alter table "public"."events" drop column "start_time";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_attendee_data(event_id uuid)
 RETURNS TABLE(attendee_id uuid, first_name text, last_name text, email text, avatar_url text, phone text, number_tickets_purchased bigint, date_of_last_purchase timestamp with time zone, number_tickets_scanned bigint, ticket_names text[])
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    et.email,
    p.avatar_url,
    p.phone,
    COUNT(DISTINCT et)::BIGINT AS number_tickets_purchased,
    MAX(et.created_at) AS date_of_last_purchase,
    SUM(CASE WHEN td.valid THEN 0 ELSE 1 END)::BIGINT AS number_tickets_scanned,
    ARRAY_AGG(DISTINCT t.name) AS ticket_names
  FROM 
    event_tickets et
  JOIN 
    profiles p ON et.attendee_id = p.id
  JOIN 
    tickets t ON et.ticket_id = t.id
  JOIN
    event_tickets_dates td ON et.id = td.event_ticket_id
  WHERE 
    et.event_id = get_attendee_data.event_id
  GROUP BY 
    p.id, et.email
  ORDER BY 
    number_tickets_purchased DESC;
END;$function$
;

create policy "Enable read access for all users"
on "public"."event_tickets_dates"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."ticket_dates"
as permissive
for select
to public
using (true);



