alter table "public"."event_likes" drop constraint "event_likes_event_id_fkey";

alter table "public"."temporary_vendors" drop constraint "temporary_vendors_event_id_fkey";

alter table "public"."event_likes" add constraint "event_likes_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_likes" validate constraint "event_likes_event_id_fkey";

alter table "public"."temporary_vendors" add constraint "temporary_vendors_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."temporary_vendors" validate constraint "temporary_vendors_event_id_fkey";


