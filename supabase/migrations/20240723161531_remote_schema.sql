alter table "public"."categories" alter column "name" set not null;

alter table "public"."event_categories" alter column "category_id" set default gen_random_uuid();

alter table "public"."event_categories" alter column "event_id" set default gen_random_uuid();


