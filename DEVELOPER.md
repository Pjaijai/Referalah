## Introduction

Hello and welcome! We are delighted to have you join our community! 🎉🌟

## Tech Stack

Frontend : Next.js 13, Zustand, React-Hook-Form, Tanstack Query, Shadcn(Radix + Tailwind.css)  
Backend: Supabase , SQL  
Infra : Vercel, Supabase  
Email service: Resend  
Analytic : GA, Vercel Analytic  

## Current Table Structure

Check [here](https://dbdiagram.io/d/Referalah-651b7b71ffbf5169f0e71a7a)

## To solve user data cannot be inserted after registration

I'm uncertain about the reason why, but there should be a trigger that inserts user data into the user table after registration. I did execute the migration, but unfortunately, it did not generate the trigger as expected. To address this issue, please run the following SQL command in your local SQL editor:

```line_numbers,js
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
DECLARE
  username_text TEXT;
BEGIN
  -- Extract the username from the email (word before @), limited to 4 characters
  username_text := SUBSTRING(NEW.email FROM 1 FOR POSITION('@' IN NEW.email) - 1);
  IF LENGTH(username_text) > 4 THEN
    username_text := LEFT(username_text, 4);
  END IF;

  -- Append the first 4 characters of the uuid (id) to the username
  username_text := username_text || LEFT(NEW.id::TEXT, 4);

  -- Insert the new user with the generated username
  INSERT INTO public.user (uuid, email, username)
  VALUES (NEW.id, NEW.email, username_text);

  RETURN NEW;
END;
$$
;

-- trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Frontend

1.  Open your terminal.
2.  Navigate to the 'client' directory using the `cd client` command.
3.  Run the development server using `yarn dev`.
4.  Clone .env.template and rename it to `.env`
5.  Find Supabase URL and anon key from Project Setting > API and configure `.env`

### Backend

1. Install [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli)
2. Run `supabase start`
3. Create a [new Supabase project](https://supabase.com/dashboard/projects)
4. Navigate to the project, go to `Project Setting`. Go to `General`. Copy `Reference ID`
5. Run `supabase link --project-ref [your-supabase-project-id]`
6. Run `supabase db push` to run migrations on your supabase project
7. Import [csv files](https://drive.google.com/drive/folders/14Q5xqmHU9w1v7Zv9HlxL3qr--Cw_4z7b?usp=drive_link) into your Supabase project for `city`, `country`, `industry` and `province` tables
8. Connect Supabase database to your favourite database IDE. Run [SQL Script](#to-solve-user-data-cannot-be-inserted-after-registration) to insert user data upon registration

### Creating branch

Naming your branch with category. For example `feature/i-go-to-school-by-bus`. Please create new branch based on `development` branch and created PR point to `development`.

| Category Word |                               Meaning                                |
| ------------- | :------------------------------------------------------------------: |
| hotfix        | for quickly fixing critical issues,usually with a temporary solution |
| bugfix        |                           for fixing a bug                           |
| feature       |             for adding, removing or modifying a feature              |
| doc           |                               document                               |

### Creating Pull Request

Naming your PR with category. For example `Feature/I Go To School By Bus`

| Category Word |                               Meaning                                |
| ------------- | :------------------------------------------------------------------: |
| HotFix        | for quickly fixing critical issues,usually with a temporary solution |
| BugFix        |                           for fixing a bug                           |
| Feature       |             for adding, removing or modifying a feature              |
| Doc           |                               document                               |

Now you have both the frontend and backend of Referalah up and running locally, allowing you to work on and test your changes effectively. Happy coding!
