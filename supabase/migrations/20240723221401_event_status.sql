create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create type "public"."Event Status" as enum ('LIVE', 'DRAFT');

alter table "public"."events" drop column "vendor_exclusivity";

alter table "public"."events" add column "event_status" "Event Status" not null default 'LIVE'::"Event Status";


