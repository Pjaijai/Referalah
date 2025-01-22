set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_post_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- Check if the user is authenticated
  IF auth.jwt() ->> 'role' = 'authenticated' THEN
    -- Check if the user's status is active
    IF NOT check_user_status('active') THEN
      RAISE EXCEPTION 'User status is not active. Post update not allowed.';
    END IF;
    
    -- Check the post's current status
    IF OLD.status = 'inactive' THEN
      RAISE EXCEPTION 'Post status is inactive. Update not allowed.';
    END IF;
  END IF;

  -- If all checks pass, allow the update
  RETURN NEW;
END;$function$
;


