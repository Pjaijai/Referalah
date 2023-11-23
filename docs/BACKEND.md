# Backend
The backend is built on [Supabase](https://supabase.io/), an open source Firebase alternative. It provides a database, authentication, and serverless functions.
## Start a local dev server (API + Database)
### Pre-requisites
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli)
- [Docker](https://docs.docker.com/get-docker/)

### Steps
1. Navigate to the 'supabase' directory
    ```sh
    $ cd supabase
    ```
1. Start supabase service
    ```sh
    $ supabase start
    ```
1. Get supabase service endpoints
    ```sh
    $ supabase status
    ```

### Access to supabase
- API:
  - [Web portal](http://localhost:54323/project/default)
- Database
  - [Web portal](http://localhost:54323/project/default)
  - other Database IDEs

Run the following script to insert user data upon registration.
```sql
  create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Configure Email service
#### Use [Inbucket](http://localhost:54324) in local environment


### Start Local Edge Function
```sh
$ supabase functions serve --env-file ./supabase/.env.local
```

## Configure Resend
1. Create a [Resend](https://resend.com) account for email sending. Link it to your Supabase project and get an API key.
1. Create or edit `.env.local`
  - set `RESEND_API_KEY` by Resend API key
  - set `RESEND_TO_EMAIL` by Resend email account

## Table Structure

Check [here](https://dbdiagram.io/d/Referalah-651b7b71ffbf5169f0e71a7a).


## Backend Migration

For accurate information, please check supabase local dev doc [here](https://supabase.com/docs/guides/cli/local-development).

## Deployment


### Method A (Github Actions)

1. Create two[new Supabase project](https://supabase.com/dashboard/projects). One for staging and one for production.
2. Go Github > repo > setting > secrets and variables > Actions > adding required variables (Check `production.yml` and `staging.yml`).
3. When you push and changes, github actions should run to migrate files and deploy edge function automatically.
4. Create a bucket called `user_assets` in `Storage`. It seems like cannot be done through migration ? Need to do manually.

### Method B (Commands)

1. Create a [new Supabase project](https://supabase.com/dashboard/projects).
2. Run `supabase login` with your `personal access token` from supabase.
3. Run `supabase link --project-ref [your-supabase-project-id]`.
4. Run `supabase db push` to run migrations on your supabase project.
5. Clone `.env.template` from `supabase/` and rename it to `.env.local`.
6. Every time you make changes to Supabase functions, run `supabase functions deploy --project-ref [your-supabase-project-id]`.

