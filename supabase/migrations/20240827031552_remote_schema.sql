alter table "public"."event_codes" alter column "event_id" drop not null;

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

CREATE OR REPLACE FUNCTION public.delete_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    DELETE FROM auth.users WHERE id = OLD.id;
    RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_all_events_attendees_count(user_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
 attendee_count bigint;
begin
 select count(distinct attendee_id) into attendee_count
 from event_tickets et
 join events e on e.id = et.event_id
 join event_roles er on er.event_id = e.id
 where (er.user_id = get_all_events_attendees_count.user_id and er.status = 'ACTIVE');
 
 return attendee_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_attendee_count(event_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
  attendee_count bigint;
begin
  select count(distinct attendee_id) into attendee_count
  from event_tickets et
  where et.event_id = get_attendee_count.event_id;

  return attendee_count;
end;
$function$
;

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
        EXISTS (SELECT 1 FROM event_tags et WHERE et.event_id = e.id AND et.tag_id = get_nearby_events.tag_id)
    )
    AND EXISTS (
        SELECT 1 
        FROM event_categories ec 
        JOIN categories c ON ec.category_id = c.id 
        WHERE ec.event_id = e.id AND c.name = 'collectables'
    )
    ORDER BY e.featured DESC, e.min_date ASC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_profile_transfer()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin 
  update events 
  set organizer_id = new.new_user_id,
      organizer_type = 'profile'
  where organizer_id = new.temp_profile_id;

  delete from profile_transfers
  where temp_profile_id = new.temp_profile_id;
  
  delete from temporary_profiles
  where id = new.temp_profile_id;

  delete from signup_invite_tokens
  where temp_profile_id = new.temp_profile_id;

  return new;
end;$function$
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

CREATE OR REPLACE FUNCTION public.purchase_table(table_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, amount_paid double precision, promo_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(order_id integer, event_name text, organizer_id uuid, event_max_date timestamp with time zone, event_min_date timestamp with time zone, event_address text, event_description text, event_cleaned_name text, event_poster_url text, table_section_name text, table_price double precision, vendor_first_name text, vendor_last_name text, vendor_business_name text, vendor_application_email text, vendor_application_phone text, vendor_table_quantity integer, vendor_inventory text, vendor_vendors_at_table integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
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
    e.max_date::TIMESTAMP WITH TIME ZONE AS event_max_date,
    e.min_date::TIMESTAMP WITH TIME ZONE AS event_min_date,
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
 RETURNS TABLE(order_id integer, event_ticket_ids uuid[], event_name text, event_dates timestamp with time zone[], event_address text, event_description text, event_cleaned_name text, event_poster_url text, event_organizer_id uuid, ticket_name text, ticket_price double precision, attendee_first_name text, attendee_last_name text, attendee_business_name text, attendee_email text, attendee_phone text, organizer_id uuid, organizer_phone text)
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_order_id INT;
  ticket_quantity INT;
  ticket_price FLOAT;
  promo_num_used INT;
  new_event_ticket_ids UUID[];
  valid_ticket_date_ids UUID[];
  ticket_dates TIMESTAMPTZ[];
  new_ticket_id UUID; 
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

  -- Get valid date ids for the ticket the user is purchasing
  WITH valid_dates_ids AS (
    SELECT td.event_date_id 
    FROM ticket_dates td
    WHERE td.ticket_id = purchase_tickets.ticket_id
  )
  SELECT array_agg(event_date_id) INTO valid_ticket_date_ids FROM valid_dates_ids;

  -- Get valid dates for the tick user is purchasing
  WITH valid_dates AS (
    SELECT ed.date
    FROM ticket_dates td
    JOIN event_dates ed ON ed.id = td.event_date_id
    WHERE td.ticket_id = purchase_tickets.ticket_id
    ORDER BY ed.date ASC
  )
  SELECT array_agg(date) INTO ticket_dates FROM valid_dates;

  -- For each new event ticket id, insert a row into event_ticket_dates for each valid date
  FOREACH new_ticket_id IN ARRAY new_event_ticket_ids
  LOOP
    INSERT INTO event_tickets_dates (event_ticket_id, event_dates_id)
    SELECT new_ticket_id, unnest(valid_ticket_date_ids);
  END LOOP;

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
    ticket_dates AS event_dates,
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

create policy "update"
on "public"."event_tickets_dates"
as permissive
for update
to public
using (true);



