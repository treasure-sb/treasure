create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."events" add column "max_date" date;

alter table "public"."events" add column "min_date" date;


