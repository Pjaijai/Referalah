alter table "public"."message" drop constraint "message_conversation_uuid_fkey";

alter table "public"."conversation" add column "last_updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

alter table "public"."message" alter column "sender_uuid" set default auth.uid();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_message_create()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if auth.uid() is the sender or receiver in the associated conversation
  IF (
    auth.uid() NOT IN (
      SELECT sender_uuid FROM public.conversation WHERE uuid = NEW.conversation_uuid
    ) AND
    auth.uid() NOT IN (
      SELECT receiver_uuid FROM public.conversation WHERE uuid = NEW.conversation_uuid
    )
  ) THEN
    RAISE EXCEPTION 'Not allowed to insert message for this conversation.';
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_message_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Disallow updating values for id, uuid, sender_uuid, created_at, status during UPDATE
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.uuid IS DISTINCT FROM OLD.uuid OR
     NEW.sender_uuid IS DISTINCT FROM OLD.sender_uuid OR
     NEW.created_at IS DISTINCT FROM OLD.created_at OR
     NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Cannot update values for id, uuid, sender_uuid, created_at, or status during UPDATE.';
  END IF;

  RETURN NEW;
END;
$function$
;

create policy "Allow user to insert message if they are in the conversation"
on "public"."message"
as permissive
for insert
to anon, authenticated
with check (((auth.uid() IN ( SELECT conversation.sender_uuid
   FROM conversation
  WHERE (conversation.uuid = message.conversation_uuid))) OR (auth.uid() IN ( SELECT conversation.receiver_uuid
   FROM conversation
  WHERE (conversation.uuid = message.conversation_uuid)))));


create policy "Enable insert for authenticated users only"
on "public"."message"
as permissive
for insert
to authenticated, anon
with check (true);


CREATE TRIGGER on_message_create BEFORE INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION handle_message_create();


