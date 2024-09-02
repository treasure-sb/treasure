create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create policy "Enable update for all users"
on "public"."event_guests"
as permissive
for update
to public
using (true)
with check (true);



