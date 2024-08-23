create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."subscription_products" alter column "stripe_product_id" drop not null;


