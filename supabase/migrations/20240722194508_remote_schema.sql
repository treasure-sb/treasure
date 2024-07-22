create table "public"."event_dates" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "start_time" time without time zone not null,
    "end_time" time without time zone,
    "date" date not null
);


alter table "public"."event_dates" enable row level security;

create table "public"."event_tickets_dates" (
    "id" uuid not null default gen_random_uuid(),
    "event_ticket_id" uuid not null,
    "event_dates_id" uuid not null,
    "valid" boolean not null default true,
    "checked_in_at" timestamp with time zone
);


alter table "public"."event_tickets_dates" enable row level security;

create table "public"."ticket_dates" (
    "ticket_id" uuid not null,
    "event_date_id" uuid not null,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."ticket_dates" enable row level security;

CREATE UNIQUE INDEX event_dates_pkey ON public.event_dates USING btree (id);

CREATE UNIQUE INDEX event_tickets_dates_pkey ON public.event_tickets_dates USING btree (id);

CREATE UNIQUE INDEX ticket_dates_id_key ON public.ticket_dates USING btree (id);

CREATE UNIQUE INDEX ticket_dates_pkey ON public.ticket_dates USING btree (ticket_id, event_date_id);

alter table "public"."event_dates" add constraint "event_dates_pkey" PRIMARY KEY using index "event_dates_pkey";

alter table "public"."event_tickets_dates" add constraint "event_tickets_dates_pkey" PRIMARY KEY using index "event_tickets_dates_pkey";

alter table "public"."ticket_dates" add constraint "ticket_dates_pkey" PRIMARY KEY using index "ticket_dates_pkey";

alter table "public"."event_dates" add constraint "event_dates_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_dates" validate constraint "event_dates_event_id_fkey";

alter table "public"."event_tickets_dates" add constraint "event_tickets_dates_event_dates_id_fkey" FOREIGN KEY (event_dates_id) REFERENCES event_dates(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_tickets_dates" validate constraint "event_tickets_dates_event_dates_id_fkey";

alter table "public"."event_tickets_dates" add constraint "event_tickets_dates_event_ticket_id_fkey" FOREIGN KEY (event_ticket_id) REFERENCES event_tickets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_tickets_dates" validate constraint "event_tickets_dates_event_ticket_id_fkey";

alter table "public"."ticket_dates" add constraint "ticket_dates_event_date_id_fkey" FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_dates" validate constraint "ticket_dates_event_date_id_fkey";

alter table "public"."ticket_dates" add constraint "ticket_dates_id_key" UNIQUE using index "ticket_dates_id_key";

alter table "public"."ticket_dates" add constraint "ticket_dates_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_dates" validate constraint "ticket_dates_ticket_id_fkey";

grant delete on table "public"."event_dates" to "anon";

grant insert on table "public"."event_dates" to "anon";

grant references on table "public"."event_dates" to "anon";

grant select on table "public"."event_dates" to "anon";

grant trigger on table "public"."event_dates" to "anon";

grant truncate on table "public"."event_dates" to "anon";

grant update on table "public"."event_dates" to "anon";

grant delete on table "public"."event_dates" to "authenticated";

grant insert on table "public"."event_dates" to "authenticated";

grant references on table "public"."event_dates" to "authenticated";

grant select on table "public"."event_dates" to "authenticated";

grant trigger on table "public"."event_dates" to "authenticated";

grant truncate on table "public"."event_dates" to "authenticated";

grant update on table "public"."event_dates" to "authenticated";

grant delete on table "public"."event_dates" to "service_role";

grant insert on table "public"."event_dates" to "service_role";

grant references on table "public"."event_dates" to "service_role";

grant select on table "public"."event_dates" to "service_role";

grant trigger on table "public"."event_dates" to "service_role";

grant truncate on table "public"."event_dates" to "service_role";

grant update on table "public"."event_dates" to "service_role";

grant delete on table "public"."event_tickets_dates" to "anon";

grant insert on table "public"."event_tickets_dates" to "anon";

grant references on table "public"."event_tickets_dates" to "anon";

grant select on table "public"."event_tickets_dates" to "anon";

grant trigger on table "public"."event_tickets_dates" to "anon";

grant truncate on table "public"."event_tickets_dates" to "anon";

grant update on table "public"."event_tickets_dates" to "anon";

grant delete on table "public"."event_tickets_dates" to "authenticated";

grant insert on table "public"."event_tickets_dates" to "authenticated";

grant references on table "public"."event_tickets_dates" to "authenticated";

grant select on table "public"."event_tickets_dates" to "authenticated";

grant trigger on table "public"."event_tickets_dates" to "authenticated";

grant truncate on table "public"."event_tickets_dates" to "authenticated";

grant update on table "public"."event_tickets_dates" to "authenticated";

grant delete on table "public"."event_tickets_dates" to "service_role";

grant insert on table "public"."event_tickets_dates" to "service_role";

grant references on table "public"."event_tickets_dates" to "service_role";

grant select on table "public"."event_tickets_dates" to "service_role";

grant trigger on table "public"."event_tickets_dates" to "service_role";

grant truncate on table "public"."event_tickets_dates" to "service_role";

grant update on table "public"."event_tickets_dates" to "service_role";

grant delete on table "public"."ticket_dates" to "anon";

grant insert on table "public"."ticket_dates" to "anon";

grant references on table "public"."ticket_dates" to "anon";

grant select on table "public"."ticket_dates" to "anon";

grant trigger on table "public"."ticket_dates" to "anon";

grant truncate on table "public"."ticket_dates" to "anon";

grant update on table "public"."ticket_dates" to "anon";

grant delete on table "public"."ticket_dates" to "authenticated";

grant insert on table "public"."ticket_dates" to "authenticated";

grant references on table "public"."ticket_dates" to "authenticated";

grant select on table "public"."ticket_dates" to "authenticated";

grant trigger on table "public"."ticket_dates" to "authenticated";

grant truncate on table "public"."ticket_dates" to "authenticated";

grant update on table "public"."ticket_dates" to "authenticated";

grant delete on table "public"."ticket_dates" to "service_role";

grant insert on table "public"."ticket_dates" to "service_role";

grant references on table "public"."ticket_dates" to "service_role";

grant select on table "public"."ticket_dates" to "service_role";

grant trigger on table "public"."ticket_dates" to "service_role";

grant truncate on table "public"."ticket_dates" to "service_role";

grant update on table "public"."ticket_dates" to "service_role";


