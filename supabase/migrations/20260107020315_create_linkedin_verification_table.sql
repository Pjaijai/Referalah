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
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
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

-- ✅ FIX #5: Add CASCADE DELETE
alter table "public"."linkedin_verification" add constraint "public_linkedin_verification_user_uuid_fkey" FOREIGN KEY (user_uuid) REFERENCES "user"(uuid) ON DELETE CASCADE not valid;

alter table "public"."linkedin_verification" validate constraint "public_linkedin_verification_user_uuid_fkey";

alter table "public"."linkedin_verification" add constraint "unique_identity_uuid" UNIQUE using index "unique_identity_uuid";

alter table "public"."linkedin_verification" add constraint "unique_user_uuid" UNIQUE using index "unique_user_uuid";

set check_function_bodies = off;

-- ✅ FIX #4: Add user ownership validation
CREATE OR REPLACE FUNCTION public.handle_linkedin_identity_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only process LinkedIn OIDC identities
  IF OLD.provider = 'linkedin_oidc' THEN
    
    -- ✅ Validate user ownership (only allow users to unlink their own identity)
    IF OLD.user_id != auth.uid() THEN
      RAISE EXCEPTION 'Cannot unlink LinkedIn identity for another user';
    END IF;
    
    -- Delete from linkedin_verification table
    DELETE FROM public.linkedin_verification
    WHERE identity_uuid = OLD.id;
    
    RAISE LOG 'LinkedIn verification deleted for user: % (identity: %)', OLD.user_id, OLD.id;
  END IF;
  
  RETURN OLD;
END;
$function$;

-- ✅ FIX #4 & #6: Add validation and better conflict handling
CREATE OR REPLACE FUNCTION public.handle_linkedin_identity_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only process LinkedIn OIDC identities
  IF NEW.provider = 'linkedin_oidc' AND NEW.identity_data IS NOT NULL THEN
    
    -- ✅ Validate user ownership (only allow users to link to their own account)
    IF NEW.user_id != auth.uid() THEN
      RAISE EXCEPTION 'Cannot link LinkedIn identity for another user';
    END IF;
    
    -- ✅ Validate required fields
    IF NEW.identity_data->>'email' IS NULL OR NEW.identity_data->>'email' = '' THEN
      RAISE EXCEPTION 'LinkedIn email is required';
    END IF;
    
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
    -- ✅ FIX #6: Update on conflict instead of silent failure
    ON CONFLICT (user_uuid) DO UPDATE SET
      identity_uuid = EXCLUDED.identity_uuid,
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      given_name = EXCLUDED.given_name,
      family_name = EXCLUDED.family_name,
      picture = EXCLUDED.picture,
      locale = EXCLUDED.locale,
      updated_at = NOW();
    
    RAISE LOG 'LinkedIn verification created for user: % (identity: %)', NEW.user_id, NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- ✅ FIX #2 & #3: Restrict permissions - ANON can only read
grant select on table "public"."linkedin_verification" to "anon";

-- ✅ FIX #2 & #3: Restrict permissions - AUTHENTICATED can only read
grant select on table "public"."linkedin_verification" to "authenticated";

-- Service role gets full access (for triggers)
grant all on table "public"."linkedin_verification" to "service_role";

-- Anyone can view LinkedIn verifications (for displaying badges)
create policy "Anyone can view linkedin verifications"
on "public"."linkedin_verification"
as permissive
for select
to public
using (true);

-- ✅ FIX #2: Only service role can delete (via triggers)
create policy "Only service role can delete linkedin verification"
on "public"."linkedin_verification"
as restrictive
for delete
to service_role
using (true);

-- ✅ FIX #2: Only service role can insert (via triggers)
create policy "Only service role can insert linkedin verification"
on "public"."linkedin_verification"
as restrictive
for insert
to service_role
with check (true);

-- ✅ NEW: Only service role can update (via triggers)
create policy "Only service role can update linkedin verification"
on "public"."linkedin_verification"
as restrictive
for update
to service_role
using (true);

-- Create triggers
CREATE TRIGGER on_linkedin_identity_created
  AFTER INSERT ON auth.identities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_linkedin_identity_insert();

CREATE TRIGGER on_linkedin_identity_deleted
  BEFORE DELETE ON auth.identities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_linkedin_identity_delete();