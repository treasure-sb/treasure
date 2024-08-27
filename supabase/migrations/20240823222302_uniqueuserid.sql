create extension if not exists "uuid-ossp" with schema "public" version '1.1';

alter table "public"."subscriptions" drop constraint "subscriptions_subscription_product_id_key";

drop index if exists "public"."subscriptions_subscription_product_id_key";

CREATE UNIQUE INDEX subscriptions_user_id_key ON public.subscriptions USING btree (user_id);

alter table "public"."subscriptions" add constraint "subscriptions_user_id_key" UNIQUE using index "subscriptions_user_id_key";


