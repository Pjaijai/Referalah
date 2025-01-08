drop trigger if exists "on_user_update" on "public"."user";

revoke delete on table "public"."city" from "anon";

revoke insert on table "public"."city" from "anon";

revoke update on table "public"."city" from "anon";

revoke delete on table "public"."city" from "authenticated";

revoke insert on table "public"."city" from "authenticated";

revoke update on table "public"."city" from "authenticated";

revoke delete on table "public"."config" from "anon";

revoke insert on table "public"."config" from "anon";

revoke update on table "public"."config" from "anon";

revoke delete on table "public"."config" from "authenticated";

revoke insert on table "public"."config" from "authenticated";

revoke update on table "public"."config" from "authenticated";

revoke delete on table "public"."country" from "anon";

revoke insert on table "public"."country" from "anon";

revoke update on table "public"."country" from "anon";

revoke delete on table "public"."country" from "authenticated";

revoke insert on table "public"."country" from "authenticated";

revoke update on table "public"."country" from "authenticated";

revoke delete on table "public"."email_notification_log" from "anon";

revoke insert on table "public"."email_notification_log" from "anon";

revoke update on table "public"."email_notification_log" from "anon";

revoke delete on table "public"."email_notification_log" from "authenticated";

revoke insert on table "public"."email_notification_log" from "authenticated";

revoke update on table "public"."email_notification_log" from "authenticated";

revoke delete on table "public"."industry" from "anon";

revoke insert on table "public"."industry" from "anon";

revoke update on table "public"."industry" from "anon";

revoke delete on table "public"."industry" from "authenticated";

revoke insert on table "public"."industry" from "authenticated";

revoke update on table "public"."industry" from "authenticated";

revoke delete on table "public"."post" from "anon";

revoke insert on table "public"."post" from "anon";

revoke update on table "public"."post" from "anon";

revoke delete on table "public"."post" from "authenticated";

revoke references on table "public"."post" from "authenticated";

revoke trigger on table "public"."post" from "authenticated";

revoke truncate on table "public"."post" from "authenticated";

revoke delete on table "public"."province" from "anon";

revoke insert on table "public"."province" from "anon";

revoke update on table "public"."province" from "anon";

revoke delete on table "public"."province" from "authenticated";

revoke insert on table "public"."province" from "authenticated";

revoke update on table "public"."province" from "authenticated";

revoke delete on table "public"."user" from "anon";

revoke insert on table "public"."user" from "anon";

revoke delete on table "public"."user" from "authenticated";

drop function if exists "public"."hanlde_user_update"();

alter table "public"."post" alter column "created_by" set default auth.uid();

alter table "public"."post" alter column "created_by" set not null;

alter table "public"."user" drop column "resume_url";

alter table "public"."user" drop column "social_media_url";

grant select on table "public"."user" to "anon";

grant select on table "public"."user" to "authenticated";


