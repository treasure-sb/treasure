create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create policy "Enable read access for all users"
on "public"."event_dates"
as permissive
for select
to public
using (true);



