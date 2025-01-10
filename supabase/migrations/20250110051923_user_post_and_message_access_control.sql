drop trigger if exists "on_message_update" on "public"."message";

drop policy "Enable insert for authenticated users only" on "public"."message";

revoke select on table "public"."config" from "anon";

revoke select on table "public"."config" from "authenticated";

revoke delete on table "public"."conversation" from "anon";

revoke insert on table "public"."conversation" from "anon";

revoke select on table "public"."conversation" from "anon";

revoke update on table "public"."conversation" from "anon";

revoke delete on table "public"."conversation" from "authenticated";

revoke delete on table "public"."message" from "anon";

revoke insert on table "public"."message" from "anon";

revoke select on table "public"."message" from "anon";

revoke update on table "public"."message" from "anon";

revoke delete on table "public"."message" from "authenticated";

revoke update on table "public"."message" from "authenticated";

revoke update (id, uuid, status) on table "public"."user" from "authenticated";

revoke update (created_by) on table "public"."post" from "authenticated";

drop function if exists "public"."handle_message_update"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_post_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the user's status is active
  IF NOT check_user_status('active') THEN
    RAISE EXCEPTION 'User status is not active. Post update not allowed.';
  END IF;

  -- If the user is active, allow the update
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_message_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the user's status is active first using check_user_status function
  IF NOT check_user_status('active') THEN
    RAISE EXCEPTION 'User status is not active.';
  END IF;

  -- Then check if auth.uid() is the sender or receiver in the associated conversation
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

create policy "Enable insert for authenticated users only"
on "public"."message"
as permissive
for insert
to authenticated
with check (true);


CREATE TRIGGER on_post_update BEFORE UPDATE ON public.post FOR EACH ROW EXECUTE FUNCTION handle_post_update();


