create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."event_vendors" add column "created_at" timestamp with time zone not null default now();

alter table "public"."event_vendors" add column "updated_at" timestamp with time zone not null default now();


