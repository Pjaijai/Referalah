alter table "public"."user" add column "locale" character varying(10);

-- Revoke update, insert, and delete privileges on locale column for anon role
REVOKE UPDATE, INSERT (locale) ON TABLE public.user FROM anon;

-- Grant select and update privileges on locale column for authenticated role
GRANT SELECT, UPDATE (locale) ON TABLE public.user TO authenticated;

-- Grant select privilege on locale column for anon role
GRANT SELECT (locale) ON TABLE public.user TO anon;
