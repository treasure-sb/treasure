create type "public"."Checkout Price Type" as enum ('RSVP', 'REGULAR');

drop policy "enable select for authenticated users" on "public"."event_codes";

drop policy "enable update for authenticated users" on "public"."event_codes";

drop policy "delete auth user" on "public"."links";

drop policy "insert access to all users" on "public"."links";

drop policy "user can update theirs" on "public"."links";

drop policy "Enable update for users based on id" on "public"."profiles";

drop policy "Enable insert for authenticated users only" on "public"."vendor_applications";

drop policy "Enable read access for all users" on "public"."vendor_applications";

drop policy "enable anyone to delete FIXME" on "public"."vendor_applications";

drop policy "enable update for everyone FIXME" on "public"."vendor_applications";

revoke delete on table "public"."vendor_applications" from "anon";

revoke insert on table "public"."vendor_applications" from "anon";

revoke references on table "public"."vendor_applications" from "anon";

revoke select on table "public"."vendor_applications" from "anon";

revoke trigger on table "public"."vendor_applications" from "anon";

revoke truncate on table "public"."vendor_applications" from "anon";

revoke update on table "public"."vendor_applications" from "anon";

revoke delete on table "public"."vendor_applications" from "authenticated";

revoke insert on table "public"."vendor_applications" from "authenticated";

revoke references on table "public"."vendor_applications" from "authenticated";

revoke select on table "public"."vendor_applications" from "authenticated";

revoke trigger on table "public"."vendor_applications" from "authenticated";

revoke truncate on table "public"."vendor_applications" from "authenticated";

revoke update on table "public"."vendor_applications" from "authenticated";

revoke delete on table "public"."vendor_applications" from "service_role";

revoke insert on table "public"."vendor_applications" from "service_role";

revoke references on table "public"."vendor_applications" from "service_role";

revoke select on table "public"."vendor_applications" from "service_role";

revoke trigger on table "public"."vendor_applications" from "service_role";

revoke truncate on table "public"."vendor_applications" from "service_role";

revoke update on table "public"."vendor_applications" from "service_role";

alter table "public"."event_guests" drop constraint "public_event_guests_guest_id_fkey";

alter table "public"."orders" drop constraint "orders_user_id_fkey";

alter table "public"."vendor_applications" drop constraint "vendor_applications_event_id_fkey";

alter table "public"."vendor_applications" drop constraint "vendor_applications_vendor_id_fkey";

alter table "public"."event_guests" drop constraint "event_guests_event_id_fkey";

alter table "public"."vendor_applications" drop constraint "vendor_applications_pkey";

alter table "public"."event_guests" drop constraint "event_guests_pkey";

drop index if exists "public"."vendor_applications_pkey";

drop index if exists "public"."event_guests_pkey";

drop table "public"."vendor_applications";

alter table "public"."event_vendors" alter column "application_status" drop default;

alter type "public"."Application Status" rename to "Application Status__old_version_to_be_dropped";

create type "public"."Application Status" as enum ('REJECTED', 'DRAFT', 'PENDING', 'ACCEPTED', 'WAITLISTED');

create table "public"."event_highlights" (
    "id" uuid not null default gen_random_uuid(),
    "uploaded_at" timestamp with time zone not null default now(),
    "picture_url" text not null,
    "event_id" uuid not null default gen_random_uuid()
);


alter table "public"."event_highlights" enable row level security;

create table "public"."event_vendor_tags" (
    "event_id" uuid not null,
    "vendor_id" uuid not null,
    "tag_id" uuid not null
);


alter table "public"."event_vendor_tags" enable row level security;

create table "public"."event_views" (
    "id" uuid not null default gen_random_uuid(),
    "visited_at" timestamp with time zone not null default now(),
    "visitor_id" uuid default gen_random_uuid(),
    "event_id" uuid not null default gen_random_uuid()
);


alter table "public"."event_views" enable row level security;

create table "public"."line_items" (
    "id" uuid not null default gen_random_uuid(),
    "quantity" integer not null,
    "price" double precision not null,
    "item_id" uuid not null,
    "item_type" "Checkout Ticket Types" not null,
    "order_id" bigint not null
);


alter table "public"."line_items" enable row level security;

create table "public"."temporary_profiles_vendors" (
    "id" uuid not null default gen_random_uuid(),
    "creator_id" uuid not null default gen_random_uuid(),
    "avatar_url" text not null,
    "business_name" text not null,
    "email" text,
    "instagram" text
);


alter table "public"."temporary_profiles_vendors" enable row level security;

create table "public"."temporary_vendors" (
    "event_id" uuid not null,
    "vendor_id" uuid not null,
    "assignment" smallint,
    "tag_id" uuid
);


alter table "public"."temporary_vendors" enable row level security;

alter table "public"."event_vendors" alter column application_status type "public"."Application Status" using application_status::text::"public"."Application Status";

alter table "public"."event_vendors" alter column "application_status" set default 'PENDING'::"Application Status";

drop type "public"."Application Status__old_version_to_be_dropped";

alter table "public"."checkout_sessions" add column "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'est'::text);

alter table "public"."checkout_sessions" add column "metadata" json;

alter table "public"."checkout_sessions" add column "price_type" "Checkout Price Type" not null default 'REGULAR'::"Checkout Price Type";

alter table "public"."checkout_sessions" add column "promo_id" uuid;

alter table "public"."event_codes" add column "created_at" timestamp with time zone not null default now();

alter table "public"."event_guests" drop column "guest_id";

alter table "public"."event_guests" add column "avatar_url" text not null;

alter table "public"."event_guests" add column "bio" text not null default ''::text;

alter table "public"."event_guests" add column "id" uuid not null default gen_random_uuid();

alter table "public"."event_guests" add column "name" text not null default ''::text;

alter table "public"."event_likes" add column "liked_on" timestamp with time zone not null default now();

alter table "public"."event_tickets" add column "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'est'::text);

alter table "public"."event_tickets" add column "email" text;

alter table "public"."event_vendors" add column "assignment" smallint;

alter table "public"."event_vendors" add column "checked_in" boolean not null default false;

alter table "public"."event_vendors" add column "notified_of_assignment" boolean not null default false;

alter table "public"."orders" drop column "user_id";

alter table "public"."orders" add column "amount_paid" double precision not null;

alter table "public"."orders" add column "customer_id" uuid not null;

alter table "public"."orders" add column "event_id" uuid not null;

alter table "public"."orders" add column "metadata" json;

alter table "public"."orders" alter column "id" drop default;

alter table "public"."orders" alter column "id" add generated by default as identity;

alter table "public"."orders" alter column "id" set data type bigint using "id"::bigint;

alter table "public"."orders" enable row level security;

alter table "public"."tables" drop column "stripe_price_id";

alter table "public"."tables" drop column "stripe_product_id";

alter table "public"."tables" add column "total_tables" integer not null default 0;

alter table "public"."tables" alter column "space_allocated" set not null;

alter table "public"."temporary_profiles" drop column "created_at";

alter table "public"."tickets" drop column "stripe_price_id";

alter table "public"."tickets" drop column "stripe_product_id";

alter table "public"."tickets" add column "description" text;

alter table "public"."tickets" add column "total_tickets" bigint not null default '0'::bigint;

alter table "public"."tickets" alter column "quantity" set not null;

CREATE UNIQUE INDEX event_highlights_picture_url_key ON public.event_highlights USING btree (picture_url);

CREATE UNIQUE INDEX event_highlights_pkey ON public.event_highlights USING btree (id);

CREATE UNIQUE INDEX event_page_views_pkey ON public.event_views USING btree (id);

CREATE UNIQUE INDEX event_vendor_tags_pkey ON public.event_vendor_tags USING btree (event_id, vendor_id, tag_id);

CREATE UNIQUE INDEX line_items_pkey ON public.line_items USING btree (id);

CREATE UNIQUE INDEX temporary_profiles_vendors_pkey ON public.temporary_profiles_vendors USING btree (id);

CREATE UNIQUE INDEX temporary_vendors_pkey ON public.temporary_vendors USING btree (event_id, vendor_id);

CREATE UNIQUE INDEX event_guests_pkey ON public.event_guests USING btree (id);

alter table "public"."event_highlights" add constraint "event_highlights_pkey" PRIMARY KEY using index "event_highlights_pkey";

alter table "public"."event_vendor_tags" add constraint "event_vendor_tags_pkey" PRIMARY KEY using index "event_vendor_tags_pkey";

alter table "public"."event_views" add constraint "event_page_views_pkey" PRIMARY KEY using index "event_page_views_pkey";

alter table "public"."line_items" add constraint "line_items_pkey" PRIMARY KEY using index "line_items_pkey";

alter table "public"."temporary_profiles_vendors" add constraint "temporary_profiles_vendors_pkey" PRIMARY KEY using index "temporary_profiles_vendors_pkey";

alter table "public"."temporary_vendors" add constraint "temporary_vendors_pkey" PRIMARY KEY using index "temporary_vendors_pkey";

alter table "public"."event_guests" add constraint "event_guests_pkey" PRIMARY KEY using index "event_guests_pkey";

alter table "public"."checkout_sessions" add constraint "checkout_sessions_promo_id_fkey" FOREIGN KEY (promo_id) REFERENCES event_codes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."checkout_sessions" validate constraint "checkout_sessions_promo_id_fkey";

alter table "public"."event_highlights" add constraint "event_highlights_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_highlights" validate constraint "event_highlights_event_id_fkey";

alter table "public"."event_highlights" add constraint "event_highlights_picture_url_key" UNIQUE using index "event_highlights_picture_url_key";

alter table "public"."event_vendor_tags" add constraint "event_vendor_tags_event_id_vendor_id_fkey" FOREIGN KEY (event_id, vendor_id) REFERENCES event_vendors(event_id, vendor_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_vendor_tags" validate constraint "event_vendor_tags_event_id_vendor_id_fkey";

alter table "public"."event_vendor_tags" add constraint "event_vendor_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) not valid;

alter table "public"."event_vendor_tags" validate constraint "event_vendor_tags_tag_id_fkey";

alter table "public"."event_views" add constraint "event_page_views_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_views" validate constraint "event_page_views_event_id_fkey";

alter table "public"."event_views" add constraint "event_page_views_visitor_id_fkey" FOREIGN KEY (visitor_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."event_views" validate constraint "event_page_views_visitor_id_fkey";

alter table "public"."line_items" add constraint "line_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."line_items" validate constraint "line_items_order_id_fkey";

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."orders" add constraint "orders_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_event_id_fkey";

alter table "public"."temporary_profiles_vendors" add constraint "temporary_profiles_vendors_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."temporary_profiles_vendors" validate constraint "temporary_profiles_vendors_creator_id_fkey";

alter table "public"."temporary_vendors" add constraint "temporary_vendors_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) not valid;

alter table "public"."temporary_vendors" validate constraint "temporary_vendors_event_id_fkey";

alter table "public"."temporary_vendors" add constraint "temporary_vendors_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."temporary_vendors" validate constraint "temporary_vendors_tag_id_fkey";

alter table "public"."temporary_vendors" add constraint "temporary_vendors_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES temporary_profiles_vendors(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."temporary_vendors" validate constraint "temporary_vendors_vendor_id_fkey";

alter table "public"."event_guests" add constraint "event_guests_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_guests" validate constraint "event_guests_event_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_order(user_id uuid, event_id uuid, item_id uuid, item_type "Checkout Ticket Types", purchase_quantity integer, price double precision)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_order_id UUID;
BEGIN
  -- Check for valid quantity
  IF purchase_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;

  -- Insert row into orders table
  INSERT INTO orders (customer_id, amount_paid, event_id) 
  VALUES (user_id, price, event_id)
  RETURNING id INTO new_order_id;

  -- Create line items
  INSERT INTO line_items (order_id, item_type, item_id, quantity, price) 
  VALUES (new_order_id, item_type, item_id, purchase_quantity, price / purchase_quantity);

  RETURN new_order_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating order: %', SQLERRM;
    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_nearby_events(user_lat double precision, user_lon double precision, radius double precision)
 RETURNS SETOF events
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN QUERY
    SELECT *
    FROM events e
    WHERE
        haversine_distance(user_lat, user_lon, e.lat, e.lng) <= radius;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_tagged_nearby_events(user_lat double precision, user_lon double precision, radius double precision, tagid uuid)
 RETURNS SETOF events
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN QUERY
    SELECT e.*
    FROM events e
    INNER JOIN event_tags et ON e.id = et.event_id
    WHERE
        haversine_distance(user_lat, user_lon, e.lat, e.lng) <= radius AND et.tag_id = tagId;
END;$function$
;

CREATE OR REPLACE FUNCTION public.haversine_distance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
DECLARE
    r DOUBLE PRECISION := 3959; -- Radius of the Earth in miles
    dlat DOUBLE PRECISION;
    dlon DOUBLE PRECISION;
    a DOUBLE PRECISION;
    c DOUBLE PRECISION;
BEGIN
    dlat := RADIANS(lat2 - lat1);
    dlon := RADIANS(lon2 - lon1);
    a := SIN(dlat / 2) * SIN(dlat / 2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlon / 2) * SIN(dlon / 2);
    c := 2 * ATAN2(SQRT(a), SQRT(1 - a));
    RETURN r * c;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_promo(promo_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE 
  new_num_used INT;
BEGIN
  -- Select the current num_used value into new_num_used
  SELECT num_used INTO new_num_used
  FROM public.event_codes
  WHERE id = promo_id;

  -- Increment the new_num_used variable
  new_num_used := new_num_used + 1;

  -- Update the num_used column in the event_codes table
  UPDATE public.event_codes
  SET num_used = new_num_used
  WHERE id = promo_id;

  return new_num_used;
END $function$
;

CREATE OR REPLACE FUNCTION public.purchase_table(table_id uuid, event_id uuid, user_id uuid, purchase_quantity integer)
 RETURNS TABLE(order_id integer, event_name text, organizer_id uuid, event_date timestamp with time zone, event_address text, event_description text, event_cleaned_name text, event_poster_url text, table_section_name text, table_price double precision, vendor_first_name text, vendor_last_name text, vendor_business_name text, vendor_application_email text, vendor_application_phone text, vendor_table_quantity integer, vendor_inventory text, vendor_vendors_at_table integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
  table_quantity INT;
  table_price FLOAT;
  new_order_id INT;
  amount_paid FLOAT;
BEGIN
  IF purchase_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;

  -- Select table quantity and price with given table_id
  SELECT quantity, price INTO table_quantity, table_price
  FROM tables
  WHERE id = table_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Table not found';
  END IF;

  -- Check to see if table has sufficient quantity
  IF table_quantity < purchase_quantity THEN
    RAISE EXCEPTION 'ERROR: insufficient table quantity';
  END IF;

  -- Update table quantity
  UPDATE tables 
  SET quantity = table_quantity - purchase_quantity 
  WHERE id = table_id;

  IF NOT FOUND THEN  
    RAISE EXCEPTION 'Error handling table quantity';
  END IF;

  -- Update event vendors to be PAID
  UPDATE event_vendors ev
  SET payment_status = 'PAID' 
  WHERE ev.event_id = purchase_table.event_id 
    AND ev.vendor_id = purchase_table.user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event vendor not found';
  END IF;

  amount_paid := purchase_quantity * table_price;

  -- Insert row into orders table
  INSERT INTO orders (customer_id, amount_paid, event_id) 
  VALUES (user_id, amount_paid, event_id)
  RETURNING id INTO new_order_id;

    -- Create line items
  INSERT INTO line_items (order_id, item_type, item_id, quantity, price) 
  VALUES (new_order_id, 'TABLE'::"Checkout Ticket Types", table_id, purchase_quantity, amount_paid / purchase_quantity);

  -- Return query with all necessary data
  RETURN QUERY
  SELECT 
    new_order_id AS order_id,
    e.name AS event_name,
    e.organizer_id,
    e.date::TIMESTAMP WITH TIME ZONE AS event_date,
    e.address AS event_address,
    e.description AS event_description,
    e.cleaned_name AS event_cleaned_name,
    e.poster_url as event_poster_url,
    t.section_name AS table_section_name,
    t.price AS table_price,
    p.first_name AS vendor_first_name,
    p.last_name AS vendor_last_name,
    p.business_name AS vendor_business_name,
    ev.application_email AS vendor_application_email,
    ev.application_phone AS vendor_application_phone,
    ev.table_quantity::INT AS vendor_table_quantity,
    ev.inventory AS vendor_inventory,
    ev.vendors_at_table::INT AS vendor_vendors_at_table
  FROM 
    event_vendors ev
    JOIN events e ON ev.event_id = e.id
    JOIN profiles p ON ev.vendor_id = p.id
    JOIN tables t ON t.id = purchase_table.table_id
  WHERE 
    ev.event_id = purchase_table.event_id 
    AND ev.vendor_id = purchase_table.user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No data found for the given event and vendor';
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.purchase_tickets(ticket_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, email text, amount_paid double precision, metadata json DEFAULT NULL::json, promo_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(order_id integer, event_ticket_ids uuid[], event_name text, event_date timestamp with time zone, event_address text, event_description text, event_cleaned_name text, event_poster_url text, event_organizer_id uuid, ticket_name text, ticket_price double precision, attendee_first_name text, attendee_last_name text, attendee_business_name text, attendee_email text, attendee_phone text, organizer_id uuid, organizer_phone text)
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_order_id INT;
  ticket_quantity INT;
  ticket_price FLOAT;
  promo_num_used INT;
  new_event_ticket_ids UUID[];
BEGIN 
  IF purchase_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;
  
  -- Select ticket quantity and price with given ticket_id
  SELECT quantity, price INTO ticket_quantity, ticket_price
  FROM tickets
  WHERE id = ticket_id;

  IF NOT FOUND THEN  -- Add check if ticket exists
    RAISE EXCEPTION 'Ticket not found';
  END IF;

  -- Check quantity of tickets
  IF ticket_quantity < purchase_quantity THEN
    RAISE EXCEPTION 'ERROR: insufficient ticket quantity';
  END IF;

  -- Update ticket quantity
  UPDATE tickets
  SET quantity = ticket_quantity - purchase_quantity 
  WHERE id = ticket_id;

  IF NOT FOUND THEN  -- Add check if update was successful
    RAISE EXCEPTION 'Error updating ticket quantity';
  END IF;

  -- Insert tickets into event_tickets
  WITH inserted_tickets AS (
    INSERT INTO event_tickets (attendee_id, event_id, ticket_id, email)
    SELECT user_id, event_id, ticket_id, email
    FROM generate_series(1, purchase_quantity)
    RETURNING id
  )
  SELECT array_agg(id) INTO new_event_ticket_ids FROM inserted_tickets;

  -- Create order
  INSERT INTO orders (customer_id, amount_paid, event_id, metadata)
  VALUES (user_id, amount_paid, event_id, metadata)
  RETURNING id INTO new_order_id;

  -- Insert line item
  INSERT INTO line_items (order_id, item_type, item_id, quantity, price)
  VALUES (new_order_id, 'TICKET'::"Checkout Ticket Types", ticket_id, purchase_quantity, amount_paid / purchase_quantity);

  -- Check if promo was used. if it was update num used
  IF promo_id IS NOT NULL THEN  
    SELECT num_used INTO promo_num_used
    FROM event_codes
    WHERE id = promo_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Promo code not found';
    END IF;

    UPDATE event_codes
    SET num_used = promo_num_used + 1
    WHERE id = promo_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Error updating promo code usage';
    END IF;
  END IF;

  -- Return query
  RETURN QUERY
  SELECT 
    new_order_id AS order_id,
    new_event_ticket_ids AS event_ticket_ids,
    e.name AS event_name,
    e.date::TIMESTAMP WITH TIME ZONE AS event_date,
    e.address AS event_address,
    e.description AS event_description,
    e.cleaned_name AS event_cleaned_name,
    e.poster_url AS event_poster_url,
    e.organizer_id AS event_organizer_id,
    t.name AS ticket_name,
    t.price AS ticket_price,
    p.first_name AS attendee_first_name,
    p.last_name AS attendee_last_name,
    p.business_name AS attendee_business_name,
    p.email AS attendee_email,
    p.phone AS attendee_phone,
    e.organizer_id,
    op.phone AS organizer_phone
  FROM 
    events e
    JOIN tickets t ON t.id = purchase_tickets.ticket_id
    JOIN profiles p ON p.id = purchase_tickets.user_id
    JOIN profiles op ON e.organizer_id = op.id
  WHERE 
    e.id = purchase_tickets.event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No data found for the purchased tickets';
  END IF;
END;
$function$
;

grant delete on table "public"."event_highlights" to "anon";

grant insert on table "public"."event_highlights" to "anon";

grant references on table "public"."event_highlights" to "anon";

grant select on table "public"."event_highlights" to "anon";

grant trigger on table "public"."event_highlights" to "anon";

grant truncate on table "public"."event_highlights" to "anon";

grant update on table "public"."event_highlights" to "anon";

grant delete on table "public"."event_highlights" to "authenticated";

grant insert on table "public"."event_highlights" to "authenticated";

grant references on table "public"."event_highlights" to "authenticated";

grant select on table "public"."event_highlights" to "authenticated";

grant trigger on table "public"."event_highlights" to "authenticated";

grant truncate on table "public"."event_highlights" to "authenticated";

grant update on table "public"."event_highlights" to "authenticated";

grant delete on table "public"."event_highlights" to "service_role";

grant insert on table "public"."event_highlights" to "service_role";

grant references on table "public"."event_highlights" to "service_role";

grant select on table "public"."event_highlights" to "service_role";

grant trigger on table "public"."event_highlights" to "service_role";

grant truncate on table "public"."event_highlights" to "service_role";

grant update on table "public"."event_highlights" to "service_role";

grant delete on table "public"."event_vendor_tags" to "anon";

grant insert on table "public"."event_vendor_tags" to "anon";

grant references on table "public"."event_vendor_tags" to "anon";

grant select on table "public"."event_vendor_tags" to "anon";

grant trigger on table "public"."event_vendor_tags" to "anon";

grant truncate on table "public"."event_vendor_tags" to "anon";

grant update on table "public"."event_vendor_tags" to "anon";

grant delete on table "public"."event_vendor_tags" to "authenticated";

grant insert on table "public"."event_vendor_tags" to "authenticated";

grant references on table "public"."event_vendor_tags" to "authenticated";

grant select on table "public"."event_vendor_tags" to "authenticated";

grant trigger on table "public"."event_vendor_tags" to "authenticated";

grant truncate on table "public"."event_vendor_tags" to "authenticated";

grant update on table "public"."event_vendor_tags" to "authenticated";

grant delete on table "public"."event_vendor_tags" to "service_role";

grant insert on table "public"."event_vendor_tags" to "service_role";

grant references on table "public"."event_vendor_tags" to "service_role";

grant select on table "public"."event_vendor_tags" to "service_role";

grant trigger on table "public"."event_vendor_tags" to "service_role";

grant truncate on table "public"."event_vendor_tags" to "service_role";

grant update on table "public"."event_vendor_tags" to "service_role";

grant delete on table "public"."event_views" to "anon";

grant insert on table "public"."event_views" to "anon";

grant references on table "public"."event_views" to "anon";

grant select on table "public"."event_views" to "anon";

grant trigger on table "public"."event_views" to "anon";

grant truncate on table "public"."event_views" to "anon";

grant update on table "public"."event_views" to "anon";

grant delete on table "public"."event_views" to "authenticated";

grant insert on table "public"."event_views" to "authenticated";

grant references on table "public"."event_views" to "authenticated";

grant select on table "public"."event_views" to "authenticated";

grant trigger on table "public"."event_views" to "authenticated";

grant truncate on table "public"."event_views" to "authenticated";

grant update on table "public"."event_views" to "authenticated";

grant delete on table "public"."event_views" to "service_role";

grant insert on table "public"."event_views" to "service_role";

grant references on table "public"."event_views" to "service_role";

grant select on table "public"."event_views" to "service_role";

grant trigger on table "public"."event_views" to "service_role";

grant truncate on table "public"."event_views" to "service_role";

grant update on table "public"."event_views" to "service_role";

grant delete on table "public"."line_items" to "anon";

grant insert on table "public"."line_items" to "anon";

grant references on table "public"."line_items" to "anon";

grant select on table "public"."line_items" to "anon";

grant trigger on table "public"."line_items" to "anon";

grant truncate on table "public"."line_items" to "anon";

grant update on table "public"."line_items" to "anon";

grant delete on table "public"."line_items" to "authenticated";

grant insert on table "public"."line_items" to "authenticated";

grant references on table "public"."line_items" to "authenticated";

grant select on table "public"."line_items" to "authenticated";

grant trigger on table "public"."line_items" to "authenticated";

grant truncate on table "public"."line_items" to "authenticated";

grant update on table "public"."line_items" to "authenticated";

grant delete on table "public"."line_items" to "service_role";

grant insert on table "public"."line_items" to "service_role";

grant references on table "public"."line_items" to "service_role";

grant select on table "public"."line_items" to "service_role";

grant trigger on table "public"."line_items" to "service_role";

grant truncate on table "public"."line_items" to "service_role";

grant update on table "public"."line_items" to "service_role";

grant delete on table "public"."temporary_profiles_vendors" to "anon";

grant insert on table "public"."temporary_profiles_vendors" to "anon";

grant references on table "public"."temporary_profiles_vendors" to "anon";

grant select on table "public"."temporary_profiles_vendors" to "anon";

grant trigger on table "public"."temporary_profiles_vendors" to "anon";

grant truncate on table "public"."temporary_profiles_vendors" to "anon";

grant update on table "public"."temporary_profiles_vendors" to "anon";

grant delete on table "public"."temporary_profiles_vendors" to "authenticated";

grant insert on table "public"."temporary_profiles_vendors" to "authenticated";

grant references on table "public"."temporary_profiles_vendors" to "authenticated";

grant select on table "public"."temporary_profiles_vendors" to "authenticated";

grant trigger on table "public"."temporary_profiles_vendors" to "authenticated";

grant truncate on table "public"."temporary_profiles_vendors" to "authenticated";

grant update on table "public"."temporary_profiles_vendors" to "authenticated";

grant delete on table "public"."temporary_profiles_vendors" to "service_role";

grant insert on table "public"."temporary_profiles_vendors" to "service_role";

grant references on table "public"."temporary_profiles_vendors" to "service_role";

grant select on table "public"."temporary_profiles_vendors" to "service_role";

grant trigger on table "public"."temporary_profiles_vendors" to "service_role";

grant truncate on table "public"."temporary_profiles_vendors" to "service_role";

grant update on table "public"."temporary_profiles_vendors" to "service_role";

grant delete on table "public"."temporary_vendors" to "anon";

grant insert on table "public"."temporary_vendors" to "anon";

grant references on table "public"."temporary_vendors" to "anon";

grant select on table "public"."temporary_vendors" to "anon";

grant trigger on table "public"."temporary_vendors" to "anon";

grant truncate on table "public"."temporary_vendors" to "anon";

grant update on table "public"."temporary_vendors" to "anon";

grant delete on table "public"."temporary_vendors" to "authenticated";

grant insert on table "public"."temporary_vendors" to "authenticated";

grant references on table "public"."temporary_vendors" to "authenticated";

grant select on table "public"."temporary_vendors" to "authenticated";

grant trigger on table "public"."temporary_vendors" to "authenticated";

grant truncate on table "public"."temporary_vendors" to "authenticated";

grant update on table "public"."temporary_vendors" to "authenticated";

grant delete on table "public"."temporary_vendors" to "service_role";

grant insert on table "public"."temporary_vendors" to "service_role";

grant references on table "public"."temporary_vendors" to "service_role";

grant select on table "public"."temporary_vendors" to "service_role";

grant trigger on table "public"."temporary_vendors" to "service_role";

grant truncate on table "public"."temporary_vendors" to "service_role";

grant update on table "public"."temporary_vendors" to "service_role";

create policy "Enable update for users based on id"
on "public"."checkout_sessions"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "allow public updates"
on "public"."event_codes"
as permissive
for update
to public
using (true);


create policy "enable select for all sers"
on "public"."event_codes"
as permissive
for select
to public
using (true);


create policy "Enable delete for event organizer or admin"
on "public"."event_highlights"
as permissive
for delete
to public
using (((EXISTS ( SELECT 1
   FROM events
  WHERE ((events.id = event_highlights.event_id) AND (events.organizer_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))));


create policy "Enable insert for authenticated users only"
on "public"."event_highlights"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."event_highlights"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."event_vendor_tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."event_vendor_tags"
as permissive
for select
to public
using (true);


create policy "Enable insert access for all users"
on "public"."event_views"
as permissive
for insert
to public
with check (true);


create policy "Enable select for authenticated users only"
on "public"."event_views"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for all users"
on "public"."line_items"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."line_items"
as permissive
for select
to public
using (true);


create policy "allow delete to auth users"
on "public"."links"
as permissive
for delete
to authenticated
using (true);


create policy "insert access to auth users"
on "public"."links"
as permissive
for insert
to authenticated
with check (true);


create policy "user can update theirs or admin can"
on "public"."links"
as permissive
for update
to public
using (((auth.uid() = user_id) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text)))
with check (((auth.uid() = user_id) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text)));


create policy "Enable insert for all users"
on "public"."orders"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."orders"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on id or admin"
on "public"."profiles"
as permissive
for update
to public
using (((auth.uid() = id) OR (( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())) = 'admin'::text)))
with check (((auth.uid() = id) OR (( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())) = 'admin'::text)));


create policy "Enable insert for authenticated users only"
on "public"."temporary_profiles_vendors"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for creators of temp vendors"
on "public"."temporary_profiles_vendors"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = creator_id));


create policy "Allow delete to auth users"
on "public"."temporary_vendors"
as permissive
for delete
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."temporary_vendors"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."temporary_vendors"
as permissive
for select
to public
using (true);


create policy "Update"
on "public"."temporary_vendors"
as permissive
for update
to authenticated
using (true);



