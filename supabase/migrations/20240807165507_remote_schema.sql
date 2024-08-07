alter table "public"."event_categories" drop constraint "event_categories_event_id_fkey";

create table "public"."temporary_hosts" (
    "event_id" uuid not null,
    "host_id" uuid not null default gen_random_uuid()
);


alter table "public"."temporary_hosts" enable row level security;

alter table "public"."temporary_profiles" alter column "avatar_url" set default 'default_avatar'::text;

CREATE UNIQUE INDEX temporary_hosts_pkey ON public.temporary_hosts USING btree (event_id, host_id);

alter table "public"."temporary_hosts" add constraint "temporary_hosts_pkey" PRIMARY KEY using index "temporary_hosts_pkey";

alter table "public"."temporary_hosts" add constraint "temporary_hosts_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."temporary_hosts" validate constraint "temporary_hosts_event_id_fkey";

alter table "public"."temporary_hosts" add constraint "temporary_hosts_host_id_fkey" FOREIGN KEY (host_id) REFERENCES temporary_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."temporary_hosts" validate constraint "temporary_hosts_host_id_fkey";

alter table "public"."event_categories" add constraint "event_categories_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_categories" validate constraint "event_categories_event_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.purchase_table(table_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, amount_paid double precision, promo_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(order_id integer, event_name text, organizer_id uuid, event_date timestamp with time zone, event_address text, event_description text, event_cleaned_name text, event_poster_url text, table_section_name text, table_price double precision, vendor_first_name text, vendor_last_name text, vendor_business_name text, vendor_application_email text, vendor_application_phone text, vendor_table_quantity integer, vendor_inventory text, vendor_vendors_at_table integer)
 LANGUAGE plpgsql
AS $function$DECLARE
  table_quantity INT;
  table_price FLOAT;
  new_order_id INT;
  promo_num_used INT;
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

  -- Insert row into orders table
  INSERT INTO orders (customer_id, amount_paid, event_id, promo_code_id) 
  VALUES (user_id, amount_paid, event_id, promo_id)
  RETURNING id INTO new_order_id;

    -- Create line items
  INSERT INTO line_items (order_id, item_type, item_id, quantity, price) 
  VALUES (new_order_id, 'TABLE'::"Checkout Ticket Types", table_id, purchase_quantity, amount_paid / purchase_quantity);

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
END;$function$
;

grant delete on table "public"."temporary_hosts" to "anon";

grant insert on table "public"."temporary_hosts" to "anon";

grant references on table "public"."temporary_hosts" to "anon";

grant select on table "public"."temporary_hosts" to "anon";

grant trigger on table "public"."temporary_hosts" to "anon";

grant truncate on table "public"."temporary_hosts" to "anon";

grant update on table "public"."temporary_hosts" to "anon";

grant delete on table "public"."temporary_hosts" to "authenticated";

grant insert on table "public"."temporary_hosts" to "authenticated";

grant references on table "public"."temporary_hosts" to "authenticated";

grant select on table "public"."temporary_hosts" to "authenticated";

grant trigger on table "public"."temporary_hosts" to "authenticated";

grant truncate on table "public"."temporary_hosts" to "authenticated";

grant update on table "public"."temporary_hosts" to "authenticated";

grant delete on table "public"."temporary_hosts" to "service_role";

grant insert on table "public"."temporary_hosts" to "service_role";

grant references on table "public"."temporary_hosts" to "service_role";

grant select on table "public"."temporary_hosts" to "service_role";

grant trigger on table "public"."temporary_hosts" to "service_role";

grant truncate on table "public"."temporary_hosts" to "service_role";

grant update on table "public"."temporary_hosts" to "service_role";

create policy "Enable delete for users"
on "public"."event_dates"
as permissive
for delete
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."event_dates"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable delete for users "
on "public"."temporary_hosts"
as permissive
for delete
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."temporary_hosts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."temporary_hosts"
as permissive
for select
to public
using (true);



