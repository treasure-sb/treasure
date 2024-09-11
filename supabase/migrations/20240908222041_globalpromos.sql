create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."event_codes" add column "treasure_sponsored" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.purchase_tickets(ticket_id uuid, event_id uuid, user_id uuid, purchase_quantity integer, email text, amount_paid double precision, metadata json DEFAULT NULL::json, promo_id uuid DEFAULT NULL::uuid, fees_paid double precision DEFAULT 0)
 RETURNS TABLE(order_id integer, event_ticket_ids uuid[], event_name text, event_dates timestamp with time zone[], event_address text, event_description text, event_cleaned_name text, event_poster_url text, ticket_name text, ticket_price double precision, attendee_first_name text, attendee_last_name text, attendee_business_name text, attendee_email text, attendee_phone text)
 LANGUAGE plpgsql
AS $function$DECLARE
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
  INSERT INTO orders (customer_id, amount_paid, event_id, metadata,promo_code_id, fees_paid)
  VALUES (user_id, amount_paid, event_id, metadata, promo_id, fees_paid)
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
    t.name AS ticket_name,
    t.price AS ticket_price,
    p.first_name AS attendee_first_name,
    p.last_name AS attendee_last_name,
    p.business_name AS attendee_business_name,
    p.email AS attendee_email,
    p.phone AS attendee_phone
  FROM 
    events e
    JOIN tickets t ON t.id = purchase_tickets.ticket_id
    JOIN profiles p ON p.id = purchase_tickets.user_id
  WHERE 
    e.id = purchase_tickets.event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No data found for the purchased tickets';
  END IF;
END;$function$
;


