alter table "public"."country" alter column "uuid" set not null;

alter table "public"."country" alter column "uuid" set data type uuid using "uuid"::uuid;

alter table "public"."industry" alter column "uuid" set not null;

alter table "public"."post" add column "description" character varying;

alter table "public"."user" alter column "uuid" set default gen_random_uuid();

alter table "public"."user" alter column "uuid" set not null;

CREATE UNIQUE INDEX city_uuid_key ON public.city USING btree (uuid);

CREATE UNIQUE INDEX country_uuid_key ON public.country USING btree (uuid);

CREATE UNIQUE INDEX industry_uuid_key ON public.industry USING btree (uuid);

CREATE UNIQUE INDEX province_uuid_key ON public.province USING btree (uuid);

CREATE UNIQUE INDEX user_uuid_key ON public."user" USING btree (uuid);

alter table "public"."city" add constraint "city_uuid_key" UNIQUE using index "city_uuid_key";

alter table "public"."country" add constraint "country_uuid_key" UNIQUE using index "country_uuid_key";

alter table "public"."industry" add constraint "industry_uuid_key" UNIQUE using index "industry_uuid_key";

alter table "public"."post" add constraint "post_city_uuid_fkey" FOREIGN KEY (city_uuid) REFERENCES city(uuid) not valid;

alter table "public"."post" validate constraint "post_city_uuid_fkey";

alter table "public"."post" add constraint "post_country_uuid_fkey" FOREIGN KEY (country_uuid) REFERENCES country(uuid) not valid;

alter table "public"."post" validate constraint "post_country_uuid_fkey";

alter table "public"."post" add constraint "post_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "user"(uuid) not valid;

alter table "public"."post" validate constraint "post_created_by_fkey";

alter table "public"."post" add constraint "post_industry_uuid_fkey" FOREIGN KEY (industry_uuid) REFERENCES industry(uuid) not valid;

alter table "public"."post" validate constraint "post_industry_uuid_fkey";

alter table "public"."post" add constraint "post_province_uuid_fkey" FOREIGN KEY (province_uuid) REFERENCES province(uuid) not valid;

alter table "public"."post" validate constraint "post_province_uuid_fkey";

alter table "public"."province" add constraint "province_uuid_key" UNIQUE using index "province_uuid_key";

alter table "public"."user" add constraint "user_city_uuid_fkey" FOREIGN KEY (city_uuid) REFERENCES city(uuid) not valid;

alter table "public"."user" validate constraint "user_city_uuid_fkey";

alter table "public"."user" add constraint "user_country_uuid_fkey" FOREIGN KEY (country_uuid) REFERENCES country(uuid) not valid;

alter table "public"."user" validate constraint "user_country_uuid_fkey";

alter table "public"."user" add constraint "user_industry_uuid_fkey" FOREIGN KEY (industry_uuid) REFERENCES industry(uuid) not valid;

alter table "public"."user" validate constraint "user_industry_uuid_fkey";

alter table "public"."user" add constraint "user_province_uuid_fkey" FOREIGN KEY (province_uuid) REFERENCES province(uuid) not valid;

alter table "public"."user" validate constraint "user_province_uuid_fkey";

alter table "public"."user" add constraint "user_uuid_key" UNIQUE using index "user_uuid_key";


