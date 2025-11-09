alter table "public"."post" add column "location_uuid" uuid;

alter table "public"."user" add column "location_uuid" uuid;

alter table "public"."post" add constraint "public_post_location_uuid_fkey" FOREIGN KEY (location_uuid) REFERENCES location(uuid) not valid;

alter table "public"."post" validate constraint "public_post_location_uuid_fkey";

alter table "public"."user" add constraint "public_user_location_uuid_fkey" FOREIGN KEY (location_uuid) REFERENCES location(uuid) not valid;

alter table "public"."user" validate constraint "public_user_location_uuid_fkey";


GRANT INSERT(location_uuid), UPDATE(location_uuid) 
ON public.post 
TO authenticated;

GRANT INSERT(location_uuid), UPDATE(location_uuid) 
ON public.user 
TO authenticated;