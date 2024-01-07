set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_message_create()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Check if auth.uid() is the sender or receiver in the associated conversation
  IF (
    auth.uid() NOT IN (
      SELECT sender_uuid FROM public.conversation WHERE uuid = NEW.conversation_uuid
    ) AND
    auth.uid() NOT IN (
      SELECT receiver_uuid FROM public.conversation WHERE uuid = NEW.conversation_uuid
    )
  ) OR NEW.sender_uuid <> auth.uid() THEN
    RAISE EXCEPTION 'Not allowed to insert message for this conversation.';
  END IF;

  RETURN NEW;
END;
$function$
;


