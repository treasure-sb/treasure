create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create policy "Enable insert for authenticated users only"
on "public"."ticket_dates"
as permissive
for insert
to authenticated
with check (true);



