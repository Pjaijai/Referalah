alter table "public"."user" drop column "is_referree";

alter table "public"."user" drop column "is_referrer";

alter table "public"."user" drop column "social_media_urlrl";

alter table "public"."user" add column "is_referee" boolean default false;

alter table "public"."user" add column "is_referer" boolean default false;

alter table "public"."user" add column "social_media_url" character varying;


