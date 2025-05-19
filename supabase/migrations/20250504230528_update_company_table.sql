alter table "public"."company" drop column "created_at";

alter table "public"."company" drop column "logo_url";

alter table "public"."company" add column "meta_data" jsonb default '{"domain": null, "logo_url": null}'::jsonb;
