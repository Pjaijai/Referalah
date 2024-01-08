set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_has_conversation_unseen()
 RETURNS TABLE(has_unseen boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if auth.uid() is NULL, throw an error if true
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'auth.uid() cannot be NULL';
  END IF;

  RETURN QUERY SELECT
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM conversation
        WHERE
          (sender_uuid = auth.uid() AND is_sender_seen = false)
          OR
          (receiver_uuid = auth.uid() AND is_receiver_seen = false)
      )
      THEN true
      ELSE false
    END;
END;
$function$
;


