alter table "public"."user" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.hanlde_user_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.role <> OLD.role THEN
    RAISE EXCEPTION 'Changing "role" is not allowed.';
  END IF;

  -- Check other columns
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Changing "id" is not allowed.';
  END IF;

  IF NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Changing "created_at" is not allowed.';
  END IF;

  IF NEW.uuid <> OLD.uuid THEN
    RAISE EXCEPTION 'Changing "uuid" is not allowed.';
  END IF;

  IF NEW.email <> OLD.email THEN
    RAISE EXCEPTION 'Changing "email" is not allowed.';
  END IF;

  IF NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'Changing "status" is not allowed.';
  END IF;

  RETURN NEW;
END;
$function$
;

create policy "Enable read access for all users"
on "public"."user"
as permissive
for select
to public
using (true);


create policy "Enable user update based on their uuid"
on "public"."user"
as permissive
for update
to public
using ((auth.uid() = uuid))
with check ((auth.uid() = uuid));


CREATE TRIGGER on_user_update BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION hanlde_user_update();


