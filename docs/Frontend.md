# Frontend
The frontend is built on [Next.js](https://nextjs.org/), a React framework for production.
## Web hosting 
The fronted is hosted on [Vercel](https://vercel.com/) and made available at [Referalah](https://www.referalah.com/).

## Start a local dev server
### Pre-requisites
- supabase started locally (see [Backend](Backend.md))
- Node.js 18.0.0 - 20.5.1
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
 
### Steps
1.  Navigate to the 'client' directory
    ```sh
    $ cd client
    ```
1.  Prepare API Keys  
    a. Clone `.env.template` and rename it to `.env`.
    ```sh
    $ cp .env.template .env
    ```

    b. Extract `API_URL` & `anon_key`
    ```sh
    # get api keys
    $ supabase status 
    
    # expected output as below
    supabase local development setup is running.

            API URL: <API_URL> # copy this
        GraphQL URL: <GraphQL_URL>
              DB URL: <DB_URL>
          Studio URL: <Studio_URL>
        Inbucket URL: <Inbucket_URL>
          JWT secret: <JWT_secret>
            anon key: <anon_key> # copy this
    service_role key: <service_role_key>
    ```

    c. Set `API_URL` & `anon_key` in `.env`
    ```sh
    # .env
    NEXT_PUBLIC_SUPABASE_URL=<API_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
    ```
    

1.  Build and run development server  
    a. Install dependencies
    ```sh
    $ yarn install
    ```
    b. Build and run development server
    ```sh
    $ yarn build
    ```
    then
    ```sh
    $ yarn dev
    ```

1. Visit local website in http://localhost:3000

## Access user portal locally
1. Register a new user in http://localhost:3000/auth
1. Navigate to the local [Inbucket](http://localhost:54324/monitor) to get the verification email
1. Click the verification link in the email
