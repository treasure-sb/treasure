create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create type "public"."Event Role Status" as enum ('PENDING', 'ACTIVE', 'DECLINED');

alter table "public"."event_roles" add column "status" "Event Role Status" not null default 'PENDING'::"Event Role Status";

create policy "Enable insert for authenticated users only"
on "public"."event_roles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on email"
on "public"."event_roles"
as permissive
for update
to public
using (true)
with check (true);



