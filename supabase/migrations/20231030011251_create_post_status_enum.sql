create type "public"."post_status" as enum ('active', 'inactive');

alter table "public"."post" alter column "status" set default 'active'::post_status;

alter table "public"."post" alter column "status" set not null;

alter table "public"."post" alter column "status" set data type post_status using "status"::post_status;

set check_function_bodies = off;


