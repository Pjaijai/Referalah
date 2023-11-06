create policy "Allow user update their post"
on "public"."post"
as permissive
for update
to authenticated
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));



