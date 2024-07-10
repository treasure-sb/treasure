SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

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

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('posters', 'posters', NULL, '2023-11-18 21:49:53.352148+00', '2023-11-18 21:49:53.352148+00', true, false, NULL, NULL, NULL),
	('avatars', 'avatars', NULL, '2023-11-21 20:36:07.935236+00', '2023-11-21 20:36:07.935236+00', true, false, NULL, NULL, NULL),
	('venue_maps', 'venue_maps', NULL, '2023-11-25 02:14:40.495308+00', '2023-11-25 02:14:40.495308+00', true, false, NULL, NULL, NULL),
	('portfolios', 'portfolios', NULL, '2023-12-19 23:04:50.624353+00', '2023-12-19 23:04:50.624353+00', true, false, NULL, NULL, NULL),
	('event_highlights', 'event_highlights', NULL, '2024-05-05 04:42:15.390642+00', '2024-05-05 04:42:15.390642+00', true, false, NULL, NULL, NULL),
	('guest_images', 'guest_images', NULL, '2024-05-06 04:10:35.812723+00', '2024-05-06 04:10:35.812723+00', true, false, NULL, NULL, NULL);




--
-- PostgreSQL database dump complete
--

RESET ALL;
