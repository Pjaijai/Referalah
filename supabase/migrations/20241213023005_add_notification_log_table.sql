create table "public"."email_notification_log" (
    "id" uuid not null default uuid_generate_v4(),
    "user_uuid" uuid not null,
    "type" character varying(50) not null,
    "title" character varying(255) not null,
    "body" text not null,
    "sent_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "email" text not null
);


alter table "public"."email_notification_log" enable row level security;

alter table "public"."message_notification_queue" enable row level security;

CREATE UNIQUE INDEX email_notification_log_pkey ON public.email_notification_log USING btree (id);

alter table "public"."email_notification_log" add constraint "email_notification_log_pkey" PRIMARY KEY using index "email_notification_log_pkey";

alter table "public"."email_notification_log" add constraint "email_notification_log_user_uuid_fkey" FOREIGN KEY (user_uuid) REFERENCES "user"(uuid) not valid;

alter table "public"."email_notification_log" validate constraint "email_notification_log_user_uuid_fkey";

grant delete on table "public"."email_notification_log" to "anon";

grant insert on table "public"."email_notification_log" to "anon";

grant references on table "public"."email_notification_log" to "anon";

grant select on table "public"."email_notification_log" to "anon";

grant trigger on table "public"."email_notification_log" to "anon";

grant truncate on table "public"."email_notification_log" to "anon";

grant update on table "public"."email_notification_log" to "anon";

grant delete on table "public"."email_notification_log" to "authenticated";

grant insert on table "public"."email_notification_log" to "authenticated";

grant references on table "public"."email_notification_log" to "authenticated";

grant select on table "public"."email_notification_log" to "authenticated";

grant trigger on table "public"."email_notification_log" to "authenticated";

grant truncate on table "public"."email_notification_log" to "authenticated";

grant update on table "public"."email_notification_log" to "authenticated";

grant delete on table "public"."email_notification_log" to "service_role";

grant insert on table "public"."email_notification_log" to "service_role";

grant references on table "public"."email_notification_log" to "service_role";

grant select on table "public"."email_notification_log" to "service_role";

grant trigger on table "public"."email_notification_log" to "service_role";

grant truncate on table "public"."email_notification_log" to "service_role";

grant update on table "public"."email_notification_log" to "service_role";


