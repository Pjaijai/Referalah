alter table "public"."post_contact_history" add column "message_uuid" uuid;

alter table "public"."referral_contact_history" add column "message_uuid" uuid;

alter table "public"."post_contact_history" add constraint "post_contact_history_message_uuid_fkey" FOREIGN KEY (message_uuid) REFERENCES message(uuid) not valid;

alter table "public"."post_contact_history" validate constraint "post_contact_history_message_uuid_fkey";

alter table "public"."referral_contact_history" add constraint "referral_contact_history_message_uuid_fkey" FOREIGN KEY (message_uuid) REFERENCES message(uuid) not valid;

alter table "public"."referral_contact_history" validate constraint "referral_contact_history_message_uuid_fkey";


