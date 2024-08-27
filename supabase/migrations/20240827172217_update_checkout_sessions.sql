create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop policy "Enable insert for authenticated users only" on "public"."checkout_sessions";

drop policy "Enable update for users based on id" on "public"."checkout_sessions";

alter table "public"."checkout_sessions" alter column "user_id" drop not null;

create policy "Enable insert for all users"
on "public"."checkout_sessions"
as permissive
for insert
to public
with check (true);


create policy "Enable update for public"
on "public"."checkout_sessions"
as permissive
for update
to public
using (true)
with check (true);



