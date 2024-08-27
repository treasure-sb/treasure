create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."event_tickets" alter column "created_at" set default now();


