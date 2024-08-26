create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."orders" alter column "fees_paid" set default '0'::real;

alter table "public"."orders" alter column "fees_paid" set not null;


