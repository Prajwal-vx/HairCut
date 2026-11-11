# Free deployment with Netlify and Supabase

The website and API run on Netlify. Supabase Postgres stores appointments, accounts, gallery data, and the rest of the salon records persistently. The local JSON file is used only for development. Netlify and Supabase accounts are required; deploy from a private Git repository so deployment logs and source remain controlled.

## 1. Create the Supabase database

1. Create a Supabase project on the Free plan and save the database password securely.
2. In Supabase **SQL Editor**, run [`../supabase/migrations/202611090001_salon_state.sql`](../supabase/migrations/202611090001_salon_state.sql).
3. In **Project Settings → Database → Connect**, copy the **Transaction pooler** connection string (port `6543`) for the serverless app. Keep it private. The app uses the server-only `DATABASE_URL`; do not add it as a `NEXT_PUBLIC_` variable.

The database initializes the salon's public starter content the first time an API request reaches it. Existing local customer data is not copied to Supabase. If that data is intended to be migrated, transfer it separately over a secure connection.

## 2. Publish the app on Netlify

1. Import this Git repository into Netlify. The checked-in `netlify.toml` sets the Next.js build command and Node version; Netlify's Next.js runtime handles pages and API routes.
2. Add these variables in **Site configuration → Environment variables**, for production and deploy contexts:

   - `DATABASE_URL`: Supabase Transaction pooler URL, using the real database password.
   - `DATABASE_SSL`: `require`.
   - `SITE_URL`, `APP_ORIGIN`, and `NEXTAUTH_URL`: the full Netlify site URL, such as `https://your-site.netlify.app`.
   - `JWT_SECRET`, `NEXTAUTH_SECRET`, and `CRON_SECRET`: three different random values, each at least 32 characters.
   - `ADMIN_EMAIL_WHITELIST`: owner email in lowercase. Add Google OAuth client credentials only if Google sign-in is enabled.

   The optional email, contact, and analytics variables can be configured later.
3. Trigger a production deploy. Visit `/api/health`; it should return `{"status":"ok"}`.

## 3. Create the owner account

After the first deploy, run this from the project folder in a private terminal. Use the same `DATABASE_URL` connection string configured in Netlify. The script prompts for the owner's details and a password without echoing it, and writes the owner account to Supabase inside a transaction:

```powershell
$env:DATABASE_URL = "<Supabase Session pooler connection string>"
$env:DATABASE_SSL = "require"
npm run setup:admin -- owner@example.com
Remove-Item Env:DATABASE_URL
Remove-Item Env:DATABASE_SSL
```

Sign in at `/auth`, then verify the owner dashboard and a test appointment. Do not include customer records in a public repo or deployment bundle.

## Free-tier limits and operations

Free plans can pause or suspend service when their usage limits are reached or a project is inactive. Netlify Free uses monthly credits and may pause projects at its limit; Supabase Free databases can pause after extended inactivity. This is suitable for a low-traffic trial, not a guaranteed always-on service. Check current plan limits, configure alerts where available, and keep a protected database export. A custom domain is optional; the Netlify subdomain is free.

Every request that accesses salon data uses a Postgres transaction. The current JSON-shaped data adapter locks one row while it processes each request, preventing lost writes during concurrent bookings. This keeps compatibility with the existing API but serializes database-backed API requests; a normalized schema is recommended as traffic grows.
