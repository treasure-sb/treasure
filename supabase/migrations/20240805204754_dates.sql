create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."events" alter column "max_date" set default now();

alter table "public"."events" alter column "max_date" set not null;

alter table "public"."events" alter column "min_date" set default now();

alter table "public"."events" alter column "min_date" set not null;

create policy "Enable delete for users"
on "public"."event_dates"
as permissive
for delete
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."event_dates"
as permissive
for insert
to authenticated
with check (true);



