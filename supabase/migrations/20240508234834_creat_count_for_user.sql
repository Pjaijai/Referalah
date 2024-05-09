revoke update on table "public"."user" from "authenticated";

GRANT UPDATE (username, avatar_url, city_uuid, company_name, country_uuid, description, job_title, province_uuid, year_of_experience, social_media_url, industry_uuid, is_referee, is_referer) ON "public"."user" TO "authenticated";

alter table "public"."user" add column "contact_request_count" smallint not null default '0'::smallint;


