set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  username_text TEXT;
BEGIN
  -- Extract the username from the email (word before @), limited to 4 characters
  username_text := SUBSTRING(NEW.email FROM 1 FOR POSITION('@' IN NEW.email) - 1);
  IF LENGTH(username_text) > 4 THEN
    username_text := LEFT(username_text, 4);
  END IF;

  -- Ensure the username doesn't exceed 10 characters in total
  IF LENGTH(username_text) + 4 > 10 THEN
    username_text := LEFT(username_text, 10 - 4);
  END IF;

  -- Append the first 4 characters of the uuid (id) to the username
  username_text := username_text || LEFT(NEW.id::TEXT, 4);

  -- Insert the new user with the generated username
  INSERT INTO public.user (uuid, email, username)
  VALUES (NEW.id, NEW.email, username_text);

  RETURN NEW;
END;

$function$
;


