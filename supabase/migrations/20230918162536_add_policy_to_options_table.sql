alter table "public"."city" enable row level security;

alter table "public"."country" enable row level security;

alter table "public"."industry" enable row level security;

alter table "public"."province" enable row level security;

create policy "Enable read access for all users"
on "public"."city"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."country"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."industry"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."province"
as permissive
for select
to public
using (true);



