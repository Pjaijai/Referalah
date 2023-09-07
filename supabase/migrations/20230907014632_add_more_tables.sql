create sequence "public"."city_id_seq";

create sequence "public"."province_id_seq";

create table "public"."city" (
    "id" integer not null default nextval('city_id_seq'::regclass),
    "uuid" uuid not null default gen_random_uuid(),
    "value" character varying not null,
    "province_uuid" character varying,
    "english_name" character varying,
    "cantonese_name" character varying
);


create table "public"."industry" (
    "id" bigint generated by default as identity not null,
    "uuid" uuid default gen_random_uuid(),
    "value" character varying,
    "english_name" character varying,
    "cantonese_name" character varying
);


create table "public"."province" (
    "id" integer not null default nextval('province_id_seq'::regclass),
    "uuid" uuid not null default gen_random_uuid(),
    "value" character varying not null,
    "country_uuid" character varying,
    "english_name" character varying,
    "cantonese_name" character varying
);


alter table "public"."user" add column "industry_uuid" uuid;

alter sequence "public"."city_id_seq" owned by "public"."city"."id";

alter sequence "public"."province_id_seq" owned by "public"."province"."id";

CREATE UNIQUE INDEX city_pkey ON public.city USING btree (id);

CREATE UNIQUE INDEX industry_pkey ON public.industry USING btree (id);

CREATE UNIQUE INDEX province_pkey ON public.province USING btree (id);

alter table "public"."city" add constraint "city_pkey" PRIMARY KEY using index "city_pkey";

alter table "public"."industry" add constraint "industry_pkey" PRIMARY KEY using index "industry_pkey";

alter table "public"."province" add constraint "province_pkey" PRIMARY KEY using index "province_pkey";

