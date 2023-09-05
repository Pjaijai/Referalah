alter table "public"."user" add column "avatar_url" character varying;

alter table "public"."user" add column "chinese_first_name" character varying;

alter table "public"."user" add column "chinese_last_name" character varying;

alter table "public"."user" add column "city_uuid" uuid;

alter table "public"."user" add column "company_name" character varying;

alter table "public"."user" add column "country_uuid" uuid;

alter table "public"."user" add column "description" character varying;

alter table "public"."user" add column "english_first_name" character varying;

alter table "public"."user" add column "english_last_name" character varying;

alter table "public"."user" add column "is_referree" boolean default false;

alter table "public"."user" add column "is_referrer" boolean default false;

alter table "public"."user" add column "job_title" character varying;

alter table "public"."user" add column "province_uuid" uuid;

alter table "public"."user" add column "resume_url" character varying;

alter table "public"."user" add column "social_media_urlrl" character varying;

alter table "public"."user" add column "year_of_experience" smallint;

alter table "public"."user" disable row level security;


