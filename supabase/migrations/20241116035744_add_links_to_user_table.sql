-- First, add the new 'links' column
ALTER TABLE "public"."user" ADD COLUMN "links" jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Then, update the 'links' column based on 'social_media_url'
UPDATE "public"."user"
SET "links" = CASE
    WHEN "social_media_url" IS NOT NULL AND "social_media_url" != ''
    THEN jsonb_build_array(
        jsonb_build_object(
            'type', 'custom',
            'url', "social_media_url"
        )
    )
    ELSE '[]'::jsonb
END;


REVOKE SELECT ON TABLE public.user FROM authenticated;

GRANT SELECT (id, uuid, username, avatar_url, description, company_name, job_title, year_of_experience, social_media_url, country_uuid, province_uuid, city_uuid, industry_uuid, is_referee, is_referer,contact_request_count, status, links)
   ON TABLE public.user TO authenticated;

REVOKE SELECT ON TABLE public.user FROM anon;

GRANT SELECT (id, uuid, username, avatar_url, description, company_name, job_title, year_of_experience, social_media_url, country_uuid, province_uuid, city_uuid, industry_uuid, is_referee, is_referer,contact_request_count, status, links)
   ON TABLE public.user TO anon;


REVOKE UPDATE ON TABLE public.user FROM authenticated;

GRANT UPDATE (id, uuid, username, avatar_url, description, company_name, job_title, year_of_experience, social_media_url, country_uuid, province_uuid, city_uuid, industry_uuid, is_referee, is_referer,contact_request_count, status, links)
   ON TABLE public.user TO authenticated;