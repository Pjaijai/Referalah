alter table "public"."message" add column "document" jsonb;

alter table "public"."message" alter column "body" drop not null;


