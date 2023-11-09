## 1. Introduction

Hello and welcome! We are delighted to have you join our community! 🎉🌟

## 2.Tech Stack

Frontend : Next.js 13, Zustand, React-Hook-Form, Tanstack Query, Shadcn(Radix + Tailwind.css)  
Backend: Supabase , SQL  
Infra : Vercel, Supabase  
Email service: Resend  
Analytic : GA, Vercel Analytic

## 3.Current Table Structure

Check [here](https://dbdiagram.io/d/Referalah-651b7b71ffbf5169f0e71a7a)

## 4.To solve user data cannot be inserted after registration

Supabase do not allow to include auth.user in migration script. To successfully create user please run following cod ein SQL editor. [reference](https://github.com/supabase/cli/issues/120)

-- trigger the function every time a user is created
create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

````
You Can find magic link emails in [http://localhost:54324/](http://localhost:54324/)

## 5.Frontend

1.  Open your terminal.
2.  Navigate to the 'client' directory using the `cd client` command.
3.  Run the development server using `yarn dev`.
4.  Clone `.env.template` and rename it to `.env`.
5.  For non localhost developemnt, find Supabase URL and anon key from Project Setting > API and configure `.env`.
6.  For local development, Run `supabase status` to get the anon key and API URL.
7.  Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in `.env`.


## 6.Backend (local)

1. Install [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli)
2. Navigate to the 'supabase' directory using the `cd supabase` command.
3. Run `supabase start`
4. Connect Supabase database to your favourite database IDE/or using supabase local[http://localhost:54323/project/default]. Run [SQL Script](#to-solve-user-data-cannot-be-inserted-after-registration) to insert user data upon registration.
5. Create a [Resend](https://resend.com) account for email sending. Link it to your Supabase project and get an API key.
6. Configure your `.env.local`, add your `RESEND_API_KEY` from Resend and use your Resend email account as `RESEND_TO_EMAIL`.
7. To start local edge function, create a `.env.local` at the root of supabase folder. Run command `supabase functions serve --env-file ./supabase/.env.local`.

### 7.Backend Migration

For accurate information, please check supabase local dev doc here[https://supabase.com/docs/guides/cli/local-development]

# Method A (Github Actions)

1. Create two[new Supabase project](https://supabase.com/dashboard/projects). One for staging and one for production.
2. Go Github > repo > setting > secrets and variables > Actions > adding required variables (Check `production.yml` and `staging.yml`).
3. When you push and changes, github actions should run to migrate files and deploy edge function automatically.
4. Create a bucket called `user_assets` in `Storage`. It seems like cannot be done through migration ? Need to do manually.

# Method B (Commands)

1. Create a [new Supabase project](https://supabase.com/dashboard/projects).
2. Run `supabase login` with your `personal access token` from supabase.
3. Run `supabase link --project-ref [your-supabase-project-id]`.
4. Run `supabase db push` to run migrations on your supabase project.
5. Clone `.env.template` from `supabase/` and rename it to `.env.local`.
6. Every time you make changes to Supabase functions, run `supabase functions deploy --project-ref [your-supabase-project-id]`.

## Frontend Development

- Environment
  - NodeJS 18.0.0 - 20.5.1
  - NPM 9.0.0 - 10.0.0

### To start a local development server

1. Navigate to the 'client' directory
   ```bash
   cd client
````

1. Install dependencies
   ```bash
   yarn
   ```
1. Start the development server
   ```bash
   yarn dev
   ```
1. View the website at [http://localhost:3000](http://localhost:3000)

### Creating branch

Naming your branch with category. For example `feature/i-go-to-school-by-bus`. Please create new branch based on `development` branch and created PR point to `development`.

| Category Word |                               Meaning                                |
| ------------- | :------------------------------------------------------------------: |
| hotfix        | for quickly fixing critical issues,usually with a temporary solution |
| bugfix        |                           for fixing a bug                           |
| feature       |             for adding, removing or modifying a feature              |
| doc           |                               document                               |
| refactor      |                             refactoring                              |

### Creating Pull Request

Naming your PR with category. For example `Feature/I Go To School By Bus`

| Category Word |                               Meaning                                |
| ------------- | :------------------------------------------------------------------: |
| HotFix        | for quickly fixing critical issues,usually with a temporary solution |
| BugFix        |                           for fixing a bug                           |
| Feature       |             for adding, removing or modifying a feature              |
| Doc           |                               document                               |
| refactor      |                             refactoring                              |

Now you have both the frontend and backend of Referalah up and running locally, allowing you to work on and test your changes effectively. Happy coding!
