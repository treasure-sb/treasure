create extension if not exists "uuid-ossp" with schema "public" version '1.1';


create table "public"."categories" (
    "id" uuid not null default gen_random_uuid(),
    "name" text
);


create table "public"."event_categories" (
    "event_id" uuid,
    "category_id" uuid
);


CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."event_categories" add constraint "event_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."event_categories" validate constraint "event_categories_category_id_fkey";

alter table "public"."event_categories" add constraint "event_categories_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) not valid;

alter table "public"."event_categories" validate constraint "event_categories_event_id_fkey";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."event_categories" to "anon";

grant insert on table "public"."event_categories" to "anon";

grant references on table "public"."event_categories" to "anon";

grant select on table "public"."event_categories" to "anon";

grant trigger on table "public"."event_categories" to "anon";

grant truncate on table "public"."event_categories" to "anon";

grant update on table "public"."event_categories" to "anon";

grant delete on table "public"."event_categories" to "authenticated";

grant insert on table "public"."event_categories" to "authenticated";

grant references on table "public"."event_categories" to "authenticated";

grant select on table "public"."event_categories" to "authenticated";

grant trigger on table "public"."event_categories" to "authenticated";

grant truncate on table "public"."event_categories" to "authenticated";

grant update on table "public"."event_categories" to "authenticated";

grant delete on table "public"."event_categories" to "service_role";

grant insert on table "public"."event_categories" to "service_role";

grant references on table "public"."event_categories" to "service_role";

grant select on table "public"."event_categories" to "service_role";

grant trigger on table "public"."event_categories" to "service_role";

grant truncate on table "public"."event_categories" to "service_role";

grant update on table "public"."event_categories" to "service_role";

