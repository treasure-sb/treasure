create extension if not exists "uuid-ossp" with schema "public" version '1.1';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_all_events_attendees_count(user_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
 attendee_count bigint;
begin
 select count(distinct attendee_id) into attendee_count
 from event_tickets et
 join events e on e.id = et.event_id
 join event_roles er on er.event_id = e.id
 where (er.user_id = get_all_events_attendees_count.user_id and er.status = 'ACTIVE');
 
 return attendee_count;
end;
$function$
;


