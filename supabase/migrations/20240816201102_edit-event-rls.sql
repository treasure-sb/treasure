create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create policy "Enable update for authenticated users"
on "public"."event_dates"
as permissive
for update
to authenticated
using (true)
with check (true);



