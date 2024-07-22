create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."categories" enable row level security;

alter table "public"."event_categories" alter column "category_id" set not null;

alter table "public"."event_categories" alter column "event_id" set not null;

alter table "public"."event_categories" enable row level security;

CREATE UNIQUE INDEX event_categories_pkey ON public.event_categories USING btree (event_id, category_id);

alter table "public"."event_categories" add constraint "event_categories_pkey" PRIMARY KEY using index "event_categories_pkey";

create policy "Enable read access for all users"
on "public"."categories"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."event_categories"
as permissive
for select
to public
using (true);

INSERT INTO
  "public"."categories" ("name")
VALUES
  ('sneakers'),
  ('collectables'),
  ('cultural');




