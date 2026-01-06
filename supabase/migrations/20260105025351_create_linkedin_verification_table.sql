create table "public"."linkedin_verification" (
    "id" uuid not null default gen_random_uuid(),
    "identity_uuid" uuid not null,
    "user_uuid" uuid not null,
    "name" text,
    "email" text,
    "given_name" text,
    "family_name" text,
    "picture" text,
    "locale" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."linkedin_verification" enable row level security;

CREATE INDEX idx_linkedin_verification_identity_uuid ON public.linkedin_verification USING btree (identity_uuid);

CREATE INDEX idx_linkedin_verification_user_uuid ON public.linkedin_verification USING btree (user_uuid);

CREATE UNIQUE INDEX linkedin_verification_pkey ON public.linkedin_verification USING btree (id);

CREATE UNIQUE INDEX unique_identity_uuid ON public.linkedin_verification USING btree (identity_uuid);

CREATE UNIQUE INDEX unique_user_uuid ON public.linkedin_verification USING btree (user_uuid);

alter table "public"."linkedin_verification" add constraint "linkedin_verification_pkey" PRIMARY KEY using index "linkedin_verification_pkey";

alter table "public"."linkedin_verification" add constraint "linkedin_verification_identity_uuid_fkey" FOREIGN KEY (identity_uuid) REFERENCES auth.identities(id) ON DELETE CASCADE not valid;

alter table "public"."linkedin_verification" validate constraint "linkedin_verification_identity_uuid_fkey";

alter table "public"."linkedin_verification" add constraint "linkedin_verification_user_uuid_fkey" FOREIGN KEY (user_uuid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."linkedin_verification" validate constraint "linkedin_verification_user_uuid_fkey";

alter table "public"."linkedin_verification" add constraint "unique_identity_uuid" UNIQUE using index "unique_identity_uuid";

alter table "public"."linkedin_verification" add constraint "unique_user_uuid" UNIQUE using index "unique_user_uuid";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_linkedin_identity_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only process LinkedIn OIDC identities
  IF OLD.provider = 'linkedin_oidc' THEN
    
    -- Delete from linkedin_verification table
    DELETE FROM public.linkedin_verification
    WHERE identity_uuid = OLD.id;
    
    RAISE NOTICE 'LinkedIn verification deleted for user: % (identity: %)', OLD.user_id, OLD.id;
  END IF;
  
  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_linkedin_identity_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only process LinkedIn OIDC identities
  IF NEW.provider = 'linkedin_oidc' AND NEW.identity_data IS NOT NULL THEN
    
    -- Insert into linkedin_verification table
    INSERT INTO public.linkedin_verification (
      identity_uuid,
      user_uuid,
      name,
      email,
      given_name,
      family_name,
      picture,
      locale
    )
    VALUES (
      NEW.id,
      NEW.user_id,
      NEW.identity_data->>'name',
      NEW.identity_data->>'email',
      NEW.identity_data->>'given_name',
      NEW.identity_data->>'family_name',
      NEW.identity_data->>'picture',
      NEW.identity_data->>'locale'
    )
    ON CONFLICT (user_uuid) DO NOTHING;
    
    RAISE NOTICE 'LinkedIn verification created for user: % (identity: %)', NEW.user_id, NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$
;

grant select on table "public"."linkedin_verification" to "anon";


grant delete on table "public"."linkedin_verification" to "authenticated";

grant insert on table "public"."linkedin_verification" to "authenticated";

grant references on table "public"."linkedin_verification" to "authenticated";

grant select on table "public"."linkedin_verification" to "authenticated";

grant trigger on table "public"."linkedin_verification" to "authenticated";

grant truncate on table "public"."linkedin_verification" to "authenticated";

grant update on table "public"."linkedin_verification" to "authenticated";

grant delete on table "public"."linkedin_verification" to "service_role";

grant insert on table "public"."linkedin_verification" to "service_role";

grant references on table "public"."linkedin_verification" to "service_role";

grant select on table "public"."linkedin_verification" to "service_role";

grant trigger on table "public"."linkedin_verification" to "service_role";

grant truncate on table "public"."linkedin_verification" to "service_role";

grant update on table "public"."linkedin_verification" to "service_role";

create policy "Anyone can view linkedin verifications"
on "public"."linkedin_verification"
as permissive
for select
to public
using (true);


create policy "Service role can delete linkedin verification"
on "public"."linkedin_verification"
as permissive
for delete
to public
using (true);


create policy "Service role can insert linkedin verification"
on "public"."linkedin_verification"
as permissive
for insert
to public
with check (true);

-- ============================================
-- Create Triggers
-- ============================================

-- Trigger: Auto-insert when LinkedIn identity is created
CREATE TRIGGER on_linkedin_identity_insert
  AFTER INSERT ON auth.identities
  FOR EACH ROW
  EXECUTE FUNCTION handle_linkedin_identity_insert();

-- Trigger: Auto-delete when LinkedIn identity is removed
CREATE TRIGGER on_linkedin_identity_delete
  BEFORE DELETE ON auth.identities
  FOR EACH ROW
  EXECUTE FUNCTION handle_linkedin_identity_delete();


