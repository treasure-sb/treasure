create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop policy "Enable update for users based on email" on "public"."event_roles";

alter table "public"."event_roles_invite_tokens" enable row level security;

CREATE UNIQUE INDEX unique_user_event ON public.event_roles USING btree (user_id, event_id);

alter table "public"."event_roles" add constraint "unique_user_event" UNIQUE using index "unique_user_event";

create policy "Enable update for users"
on "public"."event_roles"
as permissive
for update
to public
using (true)
with check (true);


create policy "Enable delete for users based on user_id"
on "public"."event_roles_invite_tokens"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = member_id));


create policy "Enable insert for authenticated users only"
on "public"."event_roles_invite_tokens"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."event_roles_invite_tokens"
as permissive
for select
to public
using (true);



