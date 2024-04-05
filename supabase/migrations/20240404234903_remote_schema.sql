
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."Application Status" AS ENUM (
    'REJECTED',
    'DRAFT',
    'PENDING',
    'ACCEPTED'
);

ALTER TYPE "public"."Application Status" OWNER TO "postgres";

COMMENT ON TYPE "public"."Application Status" IS 'Gives status of application';

CREATE TYPE "public"."Checkout Ticket Types" AS ENUM (
    'TICKET',
    'TABLE'
);

ALTER TYPE "public"."Checkout Ticket Types" OWNER TO "postgres";

CREATE TYPE "public"."Event Ticket Status" AS ENUM (
    'NO_SALE',
    'TABLES_ONLY',
    'ATTENDEES_ONLY',
    'SELLING_ALL'
);

ALTER TYPE "public"."Event Ticket Status" OWNER TO "postgres";

COMMENT ON TYPE "public"."Event Ticket Status" IS 'Indicates whether this event is currently selling tickets';

CREATE TYPE "public"."Payment Status" AS ENUM (
    'UNPAID',
    'PAID',
    'PREBOOKED'
);

ALTER TYPE "public"."Payment Status" OWNER TO "postgres";

COMMENT ON TYPE "public"."Payment Status" IS 'Indicates whether a payment has been made';

CREATE TYPE "public"."Promo Code Status" AS ENUM (
    'INACTIVE',
    'ACTIVE'
);

ALTER TYPE "public"."Promo Code Status" OWNER TO "postgres";

COMMENT ON TYPE "public"."Promo Code Status" IS 'Promo Code Status';

CREATE TYPE "public"."Promo Code Type" AS ENUM (
    'DOLLAR',
    'PERCENT'
);

ALTER TYPE "public"."Promo Code Type" OWNER TO "postgres";

COMMENT ON TYPE "public"."Promo Code Type" IS 'What kind of promo code is this';

CREATE TYPE "public"."Question Type" AS ENUM (
    'STANDARD',
    'UNIQUE'
);

ALTER TYPE "public"."Question Type" OWNER TO "postgres";

COMMENT ON TYPE "public"."Question Type" IS 'Indicates which table to get the questions from';

CREATE TYPE "public"."Vendor Exclusivity" AS ENUM (
    'PUBLIC',
    'APPLICATIONS',
    'APPLICATIONS_NO_PAYMENT'
);

ALTER TYPE "public"."Vendor Exclusivity" OWNER TO "postgres";

COMMENT ON TYPE "public"."Vendor Exclusivity" IS 'Indicates whether vendors must apply';

CREATE OR REPLACE FUNCTION "public"."delete_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    DELETE FROM auth.users WHERE id = OLD.id;
    RETURN OLD;
END;$$;

ALTER FUNCTION "public"."delete_profile"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_profile_transfer"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin 
  update events 
  set organizer_id = new.new_user_id,
      organizer_type = 'profile'
  where organizer_id = new.temp_profile_id;

  delete from profile_transfers
  where temp_profile_id = new.temp_profile_id;
  
  delete from temporary_profiles
  where id = new.temp_profile_id;

  delete from signup_invite_tokens
  where temp_profile_id = new.temp_profile_id;

  return new;
end;$$;

ALTER FUNCTION "public"."handle_profile_transfer"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."application_answers" (
    "id" "uuid" NOT NULL,
    "question_id" "uuid",
    "answer" "text",
    "question_type" "public"."Question Type" DEFAULT 'UNIQUE'::"public"."Question Type" NOT NULL,
    "vendor_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL
);

ALTER TABLE "public"."application_answers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."application_standard_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_prompt" "text" NOT NULL
);

ALTER TABLE "public"."application_standard_questions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."application_terms_and_conditions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "term" "text" NOT NULL
);

ALTER TABLE "public"."application_terms_and_conditions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."application_vendor_information" (
    "event_id" "uuid" NOT NULL,
    "check_in_time" time without time zone NOT NULL,
    "check_in_location" "text" NOT NULL,
    "wifi_availability" boolean NOT NULL,
    "additional_information" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."application_vendor_information" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."checkout_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ticket_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quantity" smallint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "ticket_type" "public"."Checkout Ticket Types" NOT NULL
);

ALTER TABLE "public"."checkout_sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."event_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" DEFAULT ''::"text" NOT NULL,
    "discount" real DEFAULT '0'::real NOT NULL,
    "num_used" smallint DEFAULT '0'::smallint NOT NULL,
    "usage_limit" smallint,
    "status" "public"."Promo Code Status" DEFAULT 'ACTIVE'::"public"."Promo Code Status" NOT NULL,
    "type" "public"."Promo Code Type" DEFAULT 'DOLLAR'::"public"."Promo Code Type" NOT NULL
);

ALTER TABLE "public"."event_codes" OWNER TO "postgres";

COMMENT ON TABLE "public"."event_codes" IS 'promo codes table';

CREATE TABLE IF NOT EXISTS "public"."event_guests" (
    "event_id" "uuid" NOT NULL,
    "guest_id" "uuid" NOT NULL
);

ALTER TABLE "public"."event_guests" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."event_likes" (
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."event_likes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."event_tags" (
    "event_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tag_id" "uuid" NOT NULL
);

ALTER TABLE "public"."event_tags" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."event_tickets" (
    "attendee_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "ticket_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "valid" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."event_tickets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."event_vendors" (
    "event_id" "uuid" NOT NULL,
    "vendor_id" "uuid" NOT NULL,
    "application_status" "public"."Application Status" DEFAULT 'PENDING'::"public"."Application Status" NOT NULL,
    "payment_status" "public"."Payment Status" DEFAULT 'UNPAID'::"public"."Payment Status" NOT NULL,
    "table_id" "uuid" NOT NULL,
    "table_quantity" smallint NOT NULL,
    "vendors_at_table" smallint NOT NULL,
    "inventory" "text" NOT NULL,
    "comments" "text",
    "application_phone" "text" NOT NULL,
    "application_email" "text" NOT NULL
);

ALTER TABLE "public"."event_vendors" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."events" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "poster_url" "text" NOT NULL,
    "organizer_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" "date" NOT NULL,
    "address" "text" NOT NULL,
    "lng" double precision NOT NULL,
    "lat" double precision NOT NULL,
    "venue_name" "text" NOT NULL,
    "venue_map_url" "text",
    "featured" smallint DEFAULT '0'::smallint NOT NULL,
    "cleaned_name" "text" NOT NULL,
    "organizer_type" "text" DEFAULT 'profile'::"text" NOT NULL,
    "city" "text" DEFAULT ''::"text" NOT NULL,
    "state" "text" DEFAULT ''::"text" NOT NULL,
    "sales_status" "public"."Event Ticket Status" DEFAULT 'NO_SALE'::"public"."Event Ticket Status" NOT NULL,
    "vendor_exclusivity" "public"."Vendor Exclusivity" DEFAULT 'PUBLIC'::"public"."Vendor Exclusivity" NOT NULL
);

ALTER TABLE "public"."events" OWNER TO "postgres";

COMMENT ON COLUMN "public"."events"."cleaned_name" IS 'cleaned event name for urls';

COMMENT ON COLUMN "public"."events"."organizer_type" IS 'either profile or temporary_profile';

COMMENT ON COLUMN "public"."events"."sales_status" IS 'indicates whether event is selling tickets';

COMMENT ON COLUMN "public"."events"."vendor_exclusivity" IS 'indicates how exclusive the event is';

CREATE TABLE IF NOT EXISTS "public"."links" (
    "user_id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "application" "text" NOT NULL,
    "id" bigint NOT NULL,
    "type" "text" DEFAULT 'social'::"text" NOT NULL
);

ALTER TABLE "public"."links" OWNER TO "postgres";

ALTER TABLE "public"."links" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."links_id-pk_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."orders" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."orders" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."portfolio_pictures" (
    "uploaded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "picture_url" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."portfolio_pictures" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profile_transfers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "temp_profile_id" "uuid" DEFAULT "gen_random_uuid"(),
    "new_user_id" "uuid" DEFAULT "gen_random_uuid"()
);

ALTER TABLE "public"."profile_transfers" OWNER TO "postgres";

COMMENT ON TABLE "public"."profile_transfers" IS 'intermediary table that trigger listens to to handle profile transfers';

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text",
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "bio" "text",
    "avatar_url" "text" DEFAULT 'default_avatar'::"text" NOT NULL,
    "username" "text" NOT NULL,
    "discriminator" smallint,
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_name" "text",
    "phone" "text"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

COMMENT ON TABLE "public"."profiles" IS 'Profile data for each user.';

COMMENT ON COLUMN "public"."profiles"."id" IS 'References the internal Supabase Auth user.';

COMMENT ON COLUMN "public"."profiles"."discriminator" IS 'key for username';

CREATE TABLE IF NOT EXISTS "public"."signup_invite_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token" "uuid" NOT NULL,
    "temp_profile_id" "uuid" NOT NULL
);

ALTER TABLE "public"."signup_invite_tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tables" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "price" double precision NOT NULL,
    "quantity" integer NOT NULL,
    "section_name" "text" NOT NULL,
    "table_provided" boolean DEFAULT false NOT NULL,
    "space_allocated" integer DEFAULT 8,
    "number_vendors_allowed" integer DEFAULT 2 NOT NULL,
    "additional_information" "text",
    "stripe_product_id" "text",
    "stripe_price_id" "text"
);

ALTER TABLE "public"."tables" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "name" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."temporary_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "username" "text" NOT NULL,
    "avatar_url" "text" DEFAULT 'default_avatar.jpeg'::"text" NOT NULL,
    "instagram" "text",
    "business_name" "text" NOT NULL
);

ALTER TABLE "public"."temporary_profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "price" double precision NOT NULL,
    "quantity" bigint,
    "name" "text" DEFAULT 'GA'::"text" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "stripe_product_id" "text" NOT NULL,
    "stripe_price_id" "text" NOT NULL
);

ALTER TABLE "public"."tickets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."vendor_applications" (
    "event_id" "uuid" NOT NULL,
    "vendor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" smallint DEFAULT '0'::smallint NOT NULL,
    "collection_type" "text" DEFAULT ''::"text" NOT NULL,
    "contact" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."vendor_applications" OWNER TO "postgres";

COMMENT ON COLUMN "public"."vendor_applications"."status" IS '0 : applied , 1 : rejected, 2: accepted';

CREATE TABLE IF NOT EXISTS "public"."vendor_invite_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "token" "uuid" DEFAULT "gen_random_uuid"(),
    "expires_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."vendor_invite_tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."vendor_transactions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "vendor_id" "uuid",
    "item_name" "text",
    "amount" double precision,
    "method" "text" NOT NULL
);

ALTER TABLE "public"."vendor_transactions" OWNER TO "postgres";

ALTER TABLE "public"."vendor_transactions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."vendor_transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."application_answers"
    ADD CONSTRAINT "application_answers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."application_standard_questions"
    ADD CONSTRAINT "application_standard_questions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."application_terms_and_conditions"
    ADD CONSTRAINT "application_terms_and_conditions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."application_vendor_information"
    ADD CONSTRAINT "application_vendor_information_event_id_key" UNIQUE ("event_id");

ALTER TABLE ONLY "public"."application_vendor_information"
    ADD CONSTRAINT "application_vendor_information_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."checkout_sessions"
    ADD CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event_codes"
    ADD CONSTRAINT "event_codes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event_guests"
    ADD CONSTRAINT "event_guests_pkey" PRIMARY KEY ("event_id", "guest_id");

ALTER TABLE ONLY "public"."event_likes"
    ADD CONSTRAINT "event_likes_pkey" PRIMARY KEY ("event_id", "user_id");

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "event_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event_tickets"
    ADD CONSTRAINT "event_tickets_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event_vendors"
    ADD CONSTRAINT "event_vendors_pkey" PRIMARY KEY ("vendor_id", "event_id");

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_id-pk_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."portfolio_pictures"
    ADD CONSTRAINT "portfolio_pictures_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profile_transfers"
    ADD CONSTRAINT "profile_transfers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_phone_key" UNIQUE ("phone");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."signup_invite_tokens"
    ADD CONSTRAINT "signup_invite_tokens_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tables"
    ADD CONSTRAINT "tables_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."temporary_profiles"
    ADD CONSTRAINT "temporary_profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."vendor_applications"
    ADD CONSTRAINT "vendor_applications_pkey" PRIMARY KEY ("event_id", "vendor_id");

ALTER TABLE ONLY "public"."vendor_invite_tokens"
    ADD CONSTRAINT "vendor_invite_tokens_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."vendor_invite_tokens"
    ADD CONSTRAINT "vendor_invite_tokens_token_key" UNIQUE ("token");

ALTER TABLE ONLY "public"."vendor_transactions"
    ADD CONSTRAINT "vendor_transactions_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "handle_delete_profile" AFTER DELETE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."delete_profile"();

CREATE OR REPLACE TRIGGER "handle_transfer_of_profile" AFTER INSERT ON "public"."profile_transfers" FOR EACH ROW EXECUTE FUNCTION "public"."handle_profile_transfer"();

ALTER TABLE ONLY "public"."application_terms_and_conditions"
    ADD CONSTRAINT "application_terms_and_conditions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."application_vendor_information"
    ADD CONSTRAINT "application_vendor_information_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_guests"
    ADD CONSTRAINT "event_guests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");

ALTER TABLE ONLY "public"."event_likes"
    ADD CONSTRAINT "event_likes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");

ALTER TABLE ONLY "public"."event_likes"
    ADD CONSTRAINT "event_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_tickets"
    ADD CONSTRAINT "event_tickets_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_tickets"
    ADD CONSTRAINT "event_tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_tickets"
    ADD CONSTRAINT "event_tickets_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_vendors"
    ADD CONSTRAINT "event_vendors_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_vendors"
    ADD CONSTRAINT "event_vendors_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."portfolio_pictures"
    ADD CONSTRAINT "portfolio_pictures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."checkout_sessions"
    ADD CONSTRAINT "public_checkout_sessions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."checkout_sessions"
    ADD CONSTRAINT "public_checkout_sessions_user_Id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_codes"
    ADD CONSTRAINT "public_event_codes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_guests"
    ADD CONSTRAINT "public_event_guests_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_vendors"
    ADD CONSTRAINT "public_event_vendors_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."vendor_transactions"
    ADD CONSTRAINT "public_vendor_transactions_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tables"
    ADD CONSTRAINT "tables_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."vendor_applications"
    ADD CONSTRAINT "vendor_applications_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."vendor_applications"
    ADD CONSTRAINT "vendor_applications_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable delete for authenticated users only" ON "public"."event_guests" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON "public"."event_tags" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "Enable delete for users based on organizer_id" ON "public"."events" FOR DELETE USING (("auth"."uid"() = "organizer_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."event_likes" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."portfolio_pictures" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert access to anyone" ON "public"."profiles" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON "public"."profile_transfers" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."checkout_sessions" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."event_guests" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."event_likes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."event_tags" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."event_tickets" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."event_vendors" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."portfolio_pictures" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."signup_invite_tokens" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."temporary_profiles" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."tickets" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."vendor_applications" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."vendor_invite_tokens" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."checkout_sessions" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."event_guests" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."event_likes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."event_tags" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."event_vendors" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."events" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."portfolio_pictures" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."profile_transfers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."signup_invite_tokens" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tags" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."temporary_profiles" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tickets" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."vendor_applications" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."vendor_invite_tokens" FOR SELECT USING (true);

CREATE POLICY "Enable read access for specific users" ON "public"."event_tickets" FOR SELECT USING (true);

CREATE POLICY "Enable update for users" ON "public"."tables" FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for users" ON "public"."tickets" FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for users based on email" ON "public"."event_vendors" FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable update for users based on uid or if user is admin" ON "public"."events" FOR UPDATE USING ((("auth"."uid"() = "organizer_id") OR (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"))) WITH CHECK ((("auth"."uid"() = "organizer_id") OR (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "allow all users read access" ON "public"."links" FOR SELECT USING (true);

CREATE POLICY "allow authenticated to insert" ON "public"."vendor_transactions" FOR INSERT WITH CHECK (true);

ALTER TABLE "public"."application_answers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."application_standard_questions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."application_terms_and_conditions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."application_vendor_information" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."checkout_sessions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delete auth" ON "public"."tables" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "delete auth user" ON "public"."links" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "delete auth users" ON "public"."application_terms_and_conditions" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "delete only auth users" ON "public"."vendor_transactions" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "enable anyone to delete FIXME" ON "public"."vendor_applications" FOR DELETE USING (true);

CREATE POLICY "enable insert for authenticated users" ON "public"."event_codes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable select for authenticated users" ON "public"."event_codes" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable update for authenticated users" ON "public"."event_codes" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "enable update for everyone FIXME" ON "public"."vendor_applications" FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE "public"."event_codes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_guests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_vendors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert access to all users" ON "public"."links" FOR INSERT WITH CHECK (true);

CREATE POLICY "insert auth" ON "public"."application_vendor_information" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "insert auth" ON "public"."tables" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "insert auth users" ON "public"."application_terms_and_conditions" FOR INSERT TO "authenticated" WITH CHECK (true);

ALTER TABLE "public"."links" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."portfolio_pictures" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profile_transfers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read only auth users" ON "public"."vendor_transactions" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "read public" ON "public"."tables" FOR SELECT USING (true);

CREATE POLICY "select" ON "public"."application_terms_and_conditions" FOR SELECT USING (true);

CREATE POLICY "select public" ON "public"."application_vendor_information" FOR SELECT USING (true);

ALTER TABLE "public"."signup_invite_tokens" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tables" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."temporary_profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can update theirs" ON "public"."links" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."vendor_applications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."vendor_invite_tokens" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."vendor_transactions" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_profile"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_profile_transfer"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_profile_transfer"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_profile_transfer"() TO "service_role";

GRANT ALL ON TABLE "public"."application_answers" TO "anon";
GRANT ALL ON TABLE "public"."application_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."application_answers" TO "service_role";

GRANT ALL ON TABLE "public"."application_standard_questions" TO "anon";
GRANT ALL ON TABLE "public"."application_standard_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."application_standard_questions" TO "service_role";

GRANT ALL ON TABLE "public"."application_terms_and_conditions" TO "anon";
GRANT ALL ON TABLE "public"."application_terms_and_conditions" TO "authenticated";
GRANT ALL ON TABLE "public"."application_terms_and_conditions" TO "service_role";

GRANT ALL ON TABLE "public"."application_vendor_information" TO "anon";
GRANT ALL ON TABLE "public"."application_vendor_information" TO "authenticated";
GRANT ALL ON TABLE "public"."application_vendor_information" TO "service_role";

GRANT ALL ON TABLE "public"."checkout_sessions" TO "anon";
GRANT ALL ON TABLE "public"."checkout_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."checkout_sessions" TO "service_role";

GRANT ALL ON TABLE "public"."event_codes" TO "anon";
GRANT ALL ON TABLE "public"."event_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."event_codes" TO "service_role";

GRANT ALL ON TABLE "public"."event_guests" TO "anon";
GRANT ALL ON TABLE "public"."event_guests" TO "authenticated";
GRANT ALL ON TABLE "public"."event_guests" TO "service_role";

GRANT ALL ON TABLE "public"."event_likes" TO "anon";
GRANT ALL ON TABLE "public"."event_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."event_likes" TO "service_role";

GRANT ALL ON TABLE "public"."event_tags" TO "anon";
GRANT ALL ON TABLE "public"."event_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."event_tags" TO "service_role";

GRANT ALL ON TABLE "public"."event_tickets" TO "anon";
GRANT ALL ON TABLE "public"."event_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."event_tickets" TO "service_role";

GRANT ALL ON TABLE "public"."event_vendors" TO "anon";
GRANT ALL ON TABLE "public"."event_vendors" TO "authenticated";
GRANT ALL ON TABLE "public"."event_vendors" TO "service_role";

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";

GRANT ALL ON TABLE "public"."links" TO "anon";
GRANT ALL ON TABLE "public"."links" TO "authenticated";
GRANT ALL ON TABLE "public"."links" TO "service_role";

GRANT ALL ON SEQUENCE "public"."links_id-pk_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."links_id-pk_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."links_id-pk_seq" TO "service_role";

GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";

GRANT ALL ON TABLE "public"."portfolio_pictures" TO "anon";
GRANT ALL ON TABLE "public"."portfolio_pictures" TO "authenticated";
GRANT ALL ON TABLE "public"."portfolio_pictures" TO "service_role";

GRANT ALL ON TABLE "public"."profile_transfers" TO "anon";
GRANT ALL ON TABLE "public"."profile_transfers" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_transfers" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."signup_invite_tokens" TO "anon";
GRANT ALL ON TABLE "public"."signup_invite_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."signup_invite_tokens" TO "service_role";

GRANT ALL ON TABLE "public"."tables" TO "anon";
GRANT ALL ON TABLE "public"."tables" TO "authenticated";
GRANT ALL ON TABLE "public"."tables" TO "service_role";

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON TABLE "public"."temporary_profiles" TO "anon";
GRANT ALL ON TABLE "public"."temporary_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."temporary_profiles" TO "service_role";

GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";

GRANT ALL ON TABLE "public"."vendor_applications" TO "anon";
GRANT ALL ON TABLE "public"."vendor_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_applications" TO "service_role";

GRANT ALL ON TABLE "public"."vendor_invite_tokens" TO "anon";
GRANT ALL ON TABLE "public"."vendor_invite_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_invite_tokens" TO "service_role";

GRANT ALL ON TABLE "public"."vendor_transactions" TO "anon";
GRANT ALL ON TABLE "public"."vendor_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_transactions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."vendor_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."vendor_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."vendor_transactions_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
