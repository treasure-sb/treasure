revoke delete on table "public"."event_roles" from "anon";

revoke insert on table "public"."event_roles" from "anon";

revoke references on table "public"."event_roles" from "anon";

revoke select on table "public"."event_roles" from "anon";

revoke trigger on table "public"."event_roles" from "anon";

revoke truncate on table "public"."event_roles" from "anon";

revoke update on table "public"."event_roles" from "anon";

revoke delete on table "public"."event_roles" from "authenticated";

revoke insert on table "public"."event_roles" from "authenticated";

revoke references on table "public"."event_roles" from "authenticated";

revoke select on table "public"."event_roles" from "authenticated";

revoke trigger on table "public"."event_roles" from "authenticated";

revoke truncate on table "public"."event_roles" from "authenticated";

revoke update on table "public"."event_roles" from "authenticated";

revoke delete on table "public"."event_roles" from "service_role";

revoke insert on table "public"."event_roles" from "service_role";

revoke references on table "public"."event_roles" from "service_role";

revoke select on table "public"."event_roles" from "service_role";

revoke trigger on table "public"."event_roles" from "service_role";

revoke truncate on table "public"."event_roles" from "service_role";

revoke update on table "public"."event_roles" from "service_role";

alter table "public"."event_roles" drop constraint "event_roles_event_id_fkey";

alter table "public"."event_roles" drop constraint "event_roles_user_id_fkey";

alter table "public"."event_roles" drop constraint "event_roles_pkey";

drop index if exists "public"."event_roles_pkey";

drop table "public"."event_roles";

drop type "public"."Event Roles";

create policy "Enable read access for all users"
on "public"."event_dates"
as permissive
for select
to public
using (true);



