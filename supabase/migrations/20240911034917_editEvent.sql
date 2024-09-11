create extension if not exists "uuid-ossp" with schema "public" version '1.1';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_multiple_tickets(ticket_info_array jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    new_ticket_id uuid;
    ticket_date_id uuid;
    ticket_info jsonb;
BEGIN
    -- Loop through each ticket info in the array
    FOREACH ticket_info IN ARRAY ticket_info_array
    LOOP
        
        -- Insert into tickets table and return the generated id
        INSERT INTO tickets (name, quantity, price, event_id, description, total_tickets)
        VALUES (
            ticket_info->>'name',
            (ticket_info->>'quantity')::integer,
            (ticket_info->>'price')::double precision,
            (ticket_info->>'event_id')::uuid,
            ticket_info->>'description',
            (ticket_info->>'total_tickets')::integer
        )
        RETURNING id INTO new_ticket_id;
        
        -- Insert into ticket_dates table for each ticket_date in the array
        FOR ticket_date_id IN (SELECT jsonb_array_elements_text(ticket_info->'ticket_dates')::uuid)
        LOOP
            INSERT INTO ticket_dates (ticket_id, event_date_id)
            VALUES (new_ticket_id, ticket_date_id);
        END LOOP;
    END LOOP;
END;$function$
;


