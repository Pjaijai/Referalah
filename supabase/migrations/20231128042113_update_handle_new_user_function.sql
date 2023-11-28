alter table "public"."user" alter column "username" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$BEGIN
  -- Insert the new user with the generated username
  INSERT INTO public.user (uuid, email, username)
  VALUES (NEW.id, NEW.email, new.raw_user_meta_data->>'username');

  RETURN NEW;
END;

$function$
;


