revoke update on table "public"."post" from "authenticated";
GRANT UPDATE (status, url, country_uuid, province_uuid,city_uuid, industry_uuid,year_of_experience,created_by ,type,company_name,job_title,description) ON public.post TO authenticated;

alter table "public"."post" add column "contact_request_count" smallint not null default '0'::smallint;


