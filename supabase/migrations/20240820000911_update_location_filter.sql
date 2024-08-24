create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop function if exists "public"."get_nearby_events"(user_lat double precision, user_lon double precision, radius double precision);

drop function if exists "public"."get_tagged_nearby_events"(user_lat double precision, user_lon double precision, radius double precision, tagid uuid);

set check_function_bodies = off;

create type "public"."eventdate" as ("date" date, "start_time" time without time zone, "end_time" time without time zone);

create type "public"."eventwithdates" as ("id" uuid, "created_at" timestamp with time zone, "name" text, "description" text, "poster_url" text, "organizer_id" uuid, "organizer_type" text, "address" text, "lat" double precision, "lng" double precision, "venue_name" text, "venue_map_url" text, "featured" smallint, "cleaned_name" text, "city" text, "state" text, "sales_status" "Event Ticket Status", "vendor_exclusivity" "Vendor Exclusivity", "max_date" date, "min_date" date, "dates" eventdate[]);

CREATE OR REPLACE FUNCTION public.get_nearby_events(user_lat double precision, user_lon double precision, radius double precision, tag_id uuid DEFAULT NULL::uuid)
 RETURNS SETOF eventwithdates
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.created_at,
        e.name,
        e.description,
        e.poster_url,
        e.organizer_id,
        e.organizer_type,
        e.address,
        e.lat,
        e.lng,
        e.venue_name,
        e.venue_map_url,
        e.featured,
        e.cleaned_name,
        e.city,
        e.state,
        e.sales_status,
        e.vendor_exclusivity,
        e.max_date,
        e.min_date,
        (
            SELECT array_agg((ed.date, ed.start_time, ed.end_time)::EventDate ORDER BY ed.date ASC)
            FROM event_dates ed
            WHERE ed.event_id = e.id
        ) AS dates
    FROM events e
    WHERE haversine_distance(user_lat, user_lon, e.lat, e.lng) <= radius
    AND (
          get_nearby_events.tag_id IS NULL 
          OR 
          e.id IN (SELECT event_id FROM event_tags et WHERE et.tag_id = get_nearby_events.tag_id)
      )
    ORDER BY e.featured DESC, e.min_date ASC;
END;
$function$
;


