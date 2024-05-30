set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_user_status(status_value text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM "public"."user" 
        WHERE "uuid" = auth.uid() 
        AND "status" = status_value
    ) THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_post_create()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if the user's status is active
    IF check_user_status('active') THEN
        -- If user status is active, allow insert
        RETURN NEW;
    ELSE
        -- If user status is not active, raise an exception
        RAISE EXCEPTION 'User status is not active';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_post_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  
  IF TG_OP = 'UPDATE' THEN

    IF NOT check_user_status('active') THEN
    RAISE EXCEPTION 'User status is not active';
    END IF;

    IF OLD.id IS DISTINCT FROM NEW.id THEN
      RAISE EXCEPTION 'Updating id is not allowed.';
    END IF;

    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
      RAISE EXCEPTION 'Updating created_at is not allowed.';
    END IF;

    IF OLD.created_by IS DISTINCT FROM NEW.created_by THEN
      RAISE EXCEPTION 'Updating created_by is not allowed.';
    END IF;

    IF OLD.uuid IS DISTINCT FROM NEW.uuid THEN
      RAISE EXCEPTION 'Updating uuid is not allowed.';
    END IF;

    IF OLD.type IS DISTINCT FROM NEW.type THEN
      RAISE EXCEPTION 'Updating type is not allowed.';
    END IF;
  END IF;
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.hanlde_user_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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


  RETURN NEW;
END;$function$
;

create policy "Allow active user to insert post"
on "public"."post"
as permissive
for insert
to authenticated
with check ((( SELECT "user".status
   FROM "user"
  WHERE ("user".uuid = auth.uid())) = 'active'::text));


CREATE TRIGGER on_post_create BEFORE INSERT ON public.post FOR EACH ROW EXECUTE FUNCTION handle_post_create();


