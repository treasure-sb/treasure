create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop function if exists "public"."purchase_table"(table_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, amount_paid double precision, promo_id uuid);

drop function if exists "public"."purchase_tickets"(ticket_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, email text, amount_paid double precision, metadata json, promo_id uuid);


