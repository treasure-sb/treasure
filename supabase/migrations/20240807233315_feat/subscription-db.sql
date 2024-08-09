create extension if not exists "uuid-ossp" with schema "public" version '1.1';

create type "public"."Subscription Status" as enum ('ACTIVE', 'CANCELLED');

create table "public"."subscription_invoices" (
    "id" uuid not null default gen_random_uuid(),
    "subscription_id" uuid not null,
    "stripe_invoice_id" text,
    "amount_paid" real,
    "paid_on" timestamp without time zone
);


alter table "public"."subscription_invoices" enable row level security;

create table "public"."subscription_products" (
    "id" uuid not null default gen_random_uuid(),
    "stripe_product_id" text not null,
    "stripe_price_id" text,
    "name" text
);


alter table "public"."subscription_products" enable row level security;

create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "subscribed_product_id" uuid,
    "status" "Subscription Status",
    "start_date" timestamp without time zone default now(),
    "end_date" timestamp without time zone,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "stripe_subscription_id" text
);


alter table "public"."subscriptions" enable row level security;

CREATE UNIQUE INDEX subscription_invoices_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscription_invoices_pkey1 ON public.subscription_invoices USING btree (id);

CREATE UNIQUE INDEX subscription_invoices_stripe_invoice_id_key ON public.subscription_invoices USING btree (stripe_invoice_id);

CREATE UNIQUE INDEX subscription_products_pkey ON public.subscription_products USING btree (id);

CREATE UNIQUE INDEX subscription_products_stripe_price_id_key ON public.subscription_products USING btree (stripe_price_id);

CREATE UNIQUE INDEX subscription_products_stripe_product_id_key ON public.subscription_products USING btree (stripe_product_id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX subscriptions_subscription_product_id_key ON public.subscriptions USING btree (subscribed_product_id);

alter table "public"."subscription_invoices" add constraint "subscription_invoices_pkey1" PRIMARY KEY using index "subscription_invoices_pkey1";

alter table "public"."subscription_products" add constraint "subscription_products_pkey" PRIMARY KEY using index "subscription_products_pkey";

alter table "public"."subscriptions" add constraint "subscription_invoices_pkey" PRIMARY KEY using index "subscription_invoices_pkey";

alter table "public"."subscription_invoices" add constraint "subscription_invoices_stripe_invoice_id_key" UNIQUE using index "subscription_invoices_stripe_invoice_id_key";

alter table "public"."subscription_invoices" add constraint "subscription_invoices_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) not valid;

alter table "public"."subscription_invoices" validate constraint "subscription_invoices_subscription_id_fkey";

alter table "public"."subscription_products" add constraint "subscription_products_stripe_price_id_key" UNIQUE using index "subscription_products_stripe_price_id_key";

alter table "public"."subscription_products" add constraint "subscription_products_stripe_product_id_key" UNIQUE using index "subscription_products_stripe_product_id_key";

alter table "public"."subscriptions" add constraint "subscription_invoices_subscription_product_id_fkey" FOREIGN KEY (subscribed_product_id) REFERENCES subscription_products(id) ON UPDATE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscription_invoices_subscription_product_id_fkey";

alter table "public"."subscriptions" add constraint "subscription_invoices_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscription_invoices_user_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_subscription_id_key" UNIQUE using index "subscriptions_stripe_subscription_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_subscription_product_id_key" UNIQUE using index "subscriptions_subscription_product_id_key";

grant delete on table "public"."subscription_invoices" to "anon";

grant insert on table "public"."subscription_invoices" to "anon";

grant references on table "public"."subscription_invoices" to "anon";

grant select on table "public"."subscription_invoices" to "anon";

grant trigger on table "public"."subscription_invoices" to "anon";

grant truncate on table "public"."subscription_invoices" to "anon";

grant update on table "public"."subscription_invoices" to "anon";

grant delete on table "public"."subscription_invoices" to "authenticated";

grant insert on table "public"."subscription_invoices" to "authenticated";

grant references on table "public"."subscription_invoices" to "authenticated";

grant select on table "public"."subscription_invoices" to "authenticated";

grant trigger on table "public"."subscription_invoices" to "authenticated";

grant truncate on table "public"."subscription_invoices" to "authenticated";

grant update on table "public"."subscription_invoices" to "authenticated";

grant delete on table "public"."subscription_invoices" to "service_role";

grant insert on table "public"."subscription_invoices" to "service_role";

grant references on table "public"."subscription_invoices" to "service_role";

grant select on table "public"."subscription_invoices" to "service_role";

grant trigger on table "public"."subscription_invoices" to "service_role";

grant truncate on table "public"."subscription_invoices" to "service_role";

grant update on table "public"."subscription_invoices" to "service_role";

grant delete on table "public"."subscription_products" to "anon";

grant insert on table "public"."subscription_products" to "anon";

grant references on table "public"."subscription_products" to "anon";

grant select on table "public"."subscription_products" to "anon";

grant trigger on table "public"."subscription_products" to "anon";

grant truncate on table "public"."subscription_products" to "anon";

grant update on table "public"."subscription_products" to "anon";

grant delete on table "public"."subscription_products" to "authenticated";

grant insert on table "public"."subscription_products" to "authenticated";

grant references on table "public"."subscription_products" to "authenticated";

grant select on table "public"."subscription_products" to "authenticated";

grant trigger on table "public"."subscription_products" to "authenticated";

grant truncate on table "public"."subscription_products" to "authenticated";

grant update on table "public"."subscription_products" to "authenticated";

grant delete on table "public"."subscription_products" to "service_role";

grant insert on table "public"."subscription_products" to "service_role";

grant references on table "public"."subscription_products" to "service_role";

grant select on table "public"."subscription_products" to "service_role";

grant trigger on table "public"."subscription_products" to "service_role";

grant truncate on table "public"."subscription_products" to "service_role";

grant update on table "public"."subscription_products" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";


