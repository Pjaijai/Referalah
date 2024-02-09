set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_conversation_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.id := OLD.id; -- Prevent mutation of 'id'
  NEW.created_at := OLD.created_at; -- Prevent mutation of 'created_at'
  NEW.sender_uuid := OLD.sender_uuid; -- Prevent mutation of 'sender_uuid'
  NEW.receiver_uuid := OLD.receiver_uuid; -- Prevent mutation of 'receiver_uuid'
  NEW.uuid := OLD.uuid; -- Prevent mutation of 'uuid'
  NEW.status := OLD.status; -- Prevent mutation of 'status'

  -- Check if the authenticated user is the receiver and trying to mutate is_receiver_accepted
  IF auth.uid() != OLD.receiver_uuid AND (
    NEW.is_receiver_accepted != OLD.is_receiver_accepted 
  ) THEN
    RAISE EXCEPTION 'Not allowed to update is_receiver_accepted.';
  END IF;

  -- Check if auth.uid() is neither sender_uuid nor receiver_uuid, not allow to update is_receiver_seen and is_sender_seen
  IF auth.uid() NOT IN (OLD.sender_uuid, OLD.receiver_uuid) AND (
    NEW.is_receiver_seen != OLD.is_receiver_seen OR
    NEW.is_sender_seen != OLD.is_sender_seen
  ) THEN
    RAISE EXCEPTION 'Not allowed to update is_receiver_seen or is_sender_seen.';
  END IF;

  RETURN NEW;
END;
$function$
;


