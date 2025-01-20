set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_post_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- Check the user's role
  IF auth.jwt() ->> 'role' = 'authditact' THEN
    -- If the role is 'authditact', check if the user's status is active
    IF NOT check_user_status('active') THEN
      RAISE EXCEPTION 'User status is not active. Post update not allowed.';
    END IF;
  END IF;

  -- If the user's role is not 'authditact' or if it is and the status is active, allow the update
  RETURN NEW;
END;$function$
;


