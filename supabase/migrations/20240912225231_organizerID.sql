create extension if not exists "uuid-ossp" with schema "public" version '1.1';

drop policy "Enable delete for event organizer or admin" on "public"."event_highlights";

drop policy "Enable delete for users based on organizer_id" on "public"."events";

drop policy "Enable update for users based on uid or if user is admin" on "public"."events";

alter table "public"."events" drop column "organizer_id";

alter table "public"."events" drop column "organizer_type";

create policy "Enable delete for everyone"
on "public"."event_highlights"
as permissive
for delete
to public
using (true);


create policy "Enable delete for everyone"
on "public"."events"
as permissive
for delete
to public
using (true);


create policy "Enable update for everyone"
on "public"."events"
as permissive
for update
to public
using (true)
with check (true);



