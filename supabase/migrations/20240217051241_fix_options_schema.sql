alter table "public"."city" alter column "cantonese_name" set not null;

alter table "public"."city" alter column "english_name" set not null;

alter table "public"."city" alter column "province_uuid" set not null;

alter table "public"."country" alter column "cantonese_name" set not null;

alter table "public"."country" alter column "english_name" set not null;

alter table "public"."country" alter column "value" set not null;

alter table "public"."industry" alter column "cantonese_name" set not null;

alter table "public"."industry" alter column "english_name" set not null;

alter table "public"."industry" alter column "value" set not null;

alter table "public"."province" alter column "cantonese_name" set not null;

alter table "public"."province" alter column "country_uuid" set not null;

alter table "public"."province" alter column "english_name" set not null;


