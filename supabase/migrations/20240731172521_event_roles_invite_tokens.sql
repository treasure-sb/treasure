create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create type "public"."Event Roles" as enum ('HOST', 'COHOST', 'STAFF', 'SCANNER');

drop policy "Enable read access for all users" on "public"."event_dates";

create table "public"."event_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null default gen_random_uuid(),
    "role" "Event Roles" not null
);


alter table "public"."event_roles" enable row level security;

create table "public"."event_roles_invite_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "role" "Event Roles" not null,
    "event_id" uuid not null default gen_random_uuid(),
    "member_id" uuid not null default gen_random_uuid()
);


CREATE UNIQUE INDEX event_roles_invite_tokens_pkey ON public.event_roles_invite_tokens USING btree (id);

CREATE UNIQUE INDEX event_roles_pkey ON public.event_roles USING btree (id);

alter table "public"."event_roles" add constraint "event_roles_pkey" PRIMARY KEY using index "event_roles_pkey";

alter table "public"."event_roles_invite_tokens" add constraint "event_roles_invite_tokens_pkey" PRIMARY KEY using index "event_roles_invite_tokens_pkey";

alter table "public"."event_roles" add constraint "event_roles_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_roles" validate constraint "event_roles_event_id_fkey";

alter table "public"."event_roles" add constraint "event_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_roles" validate constraint "event_roles_user_id_fkey";

alter table "public"."event_roles_invite_tokens" add constraint "event_roles_invite_tokens_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_roles_invite_tokens" validate constraint "event_roles_invite_tokens_event_id_fkey";

alter table "public"."event_roles_invite_tokens" add constraint "event_roles_invite_tokens_member_id_fkey" FOREIGN KEY (member_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_roles_invite_tokens" validate constraint "event_roles_invite_tokens_member_id_fkey";

grant delete on table "public"."event_roles" to "anon";

grant insert on table "public"."event_roles" to "anon";

grant references on table "public"."event_roles" to "anon";

grant select on table "public"."event_roles" to "anon";

grant trigger on table "public"."event_roles" to "anon";

grant truncate on table "public"."event_roles" to "anon";

grant update on table "public"."event_roles" to "anon";

grant delete on table "public"."event_roles" to "authenticated";

grant insert on table "public"."event_roles" to "authenticated";

grant references on table "public"."event_roles" to "authenticated";

grant select on table "public"."event_roles" to "authenticated";

grant trigger on table "public"."event_roles" to "authenticated";

grant truncate on table "public"."event_roles" to "authenticated";

grant update on table "public"."event_roles" to "authenticated";

grant delete on table "public"."event_roles" to "service_role";

grant insert on table "public"."event_roles" to "service_role";

grant references on table "public"."event_roles" to "service_role";

grant select on table "public"."event_roles" to "service_role";

grant trigger on table "public"."event_roles" to "service_role";

grant truncate on table "public"."event_roles" to "service_role";

grant update on table "public"."event_roles" to "service_role";

grant delete on table "public"."event_roles_invite_tokens" to "anon";

grant insert on table "public"."event_roles_invite_tokens" to "anon";

grant references on table "public"."event_roles_invite_tokens" to "anon";

grant select on table "public"."event_roles_invite_tokens" to "anon";

grant trigger on table "public"."event_roles_invite_tokens" to "anon";

grant truncate on table "public"."event_roles_invite_tokens" to "anon";

grant update on table "public"."event_roles_invite_tokens" to "anon";

grant delete on table "public"."event_roles_invite_tokens" to "authenticated";

grant insert on table "public"."event_roles_invite_tokens" to "authenticated";

grant references on table "public"."event_roles_invite_tokens" to "authenticated";

grant select on table "public"."event_roles_invite_tokens" to "authenticated";

grant trigger on table "public"."event_roles_invite_tokens" to "authenticated";

grant truncate on table "public"."event_roles_invite_tokens" to "authenticated";

grant update on table "public"."event_roles_invite_tokens" to "authenticated";

grant delete on table "public"."event_roles_invite_tokens" to "service_role";

grant insert on table "public"."event_roles_invite_tokens" to "service_role";

grant references on table "public"."event_roles_invite_tokens" to "service_role";

grant select on table "public"."event_roles_invite_tokens" to "service_role";

grant trigger on table "public"."event_roles_invite_tokens" to "service_role";

grant truncate on table "public"."event_roles_invite_tokens" to "service_role";

grant update on table "public"."event_roles_invite_tokens" to "service_role";

create policy "Select for all users"
on "public"."event_roles"
as permissive
for select
to public
using (true);



