set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "objects_delete_policy"
on "storage"."objects"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "objects_insert_policy"
on "storage"."objects"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "objects_select_policy"
on "storage"."objects"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "objects_update_policy"
on "storage"."objects"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));



