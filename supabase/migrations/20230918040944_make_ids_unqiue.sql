CREATE UNIQUE INDEX city_id_key ON public.city USING btree (id);

CREATE UNIQUE INDEX country_id_key ON public.country USING btree (id);

CREATE UNIQUE INDEX industry_id_key ON public.industry USING btree (id);

CREATE UNIQUE INDEX post_id_key ON public.post USING btree (id);

CREATE UNIQUE INDEX province_id_key ON public.province USING btree (id);

CREATE UNIQUE INDEX referral_contact_history_id_key ON public.referral_contact_history USING btree (id);

alter table "public"."city" add constraint "city_id_key" UNIQUE using index "city_id_key";

alter table "public"."country" add constraint "country_id_key" UNIQUE using index "country_id_key";

alter table "public"."industry" add constraint "industry_id_key" UNIQUE using index "industry_id_key";

alter table "public"."post" add constraint "post_id_key" UNIQUE using index "post_id_key";

alter table "public"."province" add constraint "province_id_key" UNIQUE using index "province_id_key";

alter table "public"."referral_contact_history" add constraint "referral_contact_history_id_key" UNIQUE using index "referral_contact_history_id_key";


