alter table "public"."user" add column "notification_permissions" jsonb not null default '["official_broadcast_message", "unseen_message", "coffee_chat_request_follow_up", "post_contact_follow_up"]'::jsonb;



REVOKE SELECT ON TABLE public.user FROM authenticated;

GRANT SELECT (id, uuid, username, avatar_url, description, company_name, job_title, year_of_experience, social_media_url, country_uuid, province_uuid, city_uuid, industry_uuid, is_referee, is_referer,contact_request_count, status, links,notification_permissions)
   ON TABLE public.user TO authenticated;

REVOKE SELECT ON TABLE public.user FROM anon;

GRANT SELECT (id, uuid, username, avatar_url, description, company_name, job_title, year_of_experience, social_media_url, country_uuid, province_uuid, city_uuid, industry_uuid, is_referee, is_referer,contact_request_count, status, links, notification_permissions)
   ON TABLE public.user TO anon;


REVOKE UPDATE ON TABLE public.user FROM authenticated;

GRANT UPDATE (id, uuid, username, avatar_url, description, company_name, job_title, year_of_experience, social_media_url, country_uuid, province_uuid, city_uuid, industry_uuid, is_referee, is_referer,contact_request_count, status, links, notification_permissions)
   ON TABLE public.user TO authenticated;