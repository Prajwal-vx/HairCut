# Uptown Hair Unisex Salon

Appointment and salon management website for Uptown Hair in Birtamode, Nepal. Built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the required secrets and service credentials.
3. Start the app with `npm run dev` and open `http://localhost:3000`.

Available scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, and `npm run security:test`.

## Project structure

```text
src/
  app/                 App Router pages, route metadata, error and not-found UI
    api/               HTTP route handlers, grouped by resource
  components/          Reusable UI, layout, booking, motion and provider components
  config/              Validated environment configuration
  constants/           Shared salon and domain constants
  context/             App-wide authentication, toast and notification state
  hooks/               Reusable client workflows and stateful behavior
  lib/                 API helpers, data access, security, metadata and utilities
  modules/             Feature-specific UI and domain logic
  services/            Typed clients for application API resources
  types/               Shared TypeScript declarations
data/                  Local JSON database files
public/                Static assets served from the site root
tests/                 Existing security checks
```

## Application boundaries

- Keep route files focused on composing a page or accepting an HTTP request.
- Put reusable visual building blocks in `src/components`; group feature-specific UI and domain calculations in `src/modules`.
- Put browser-side workflows in `src/hooks`, shared state in `src/context`, and API calls in `src/services`.
- Put validation, response shaping, and reusable server logic in `src/lib`. API routes should validate input and identity, then delegate work to a service or domain helper.
- Keep secrets and server-only settings in `src/config/env.ts`. Only intentionally public settings may use the `NEXT_PUBLIC_` prefix.
- New routes should follow the resource pattern under `src/app/api/<resource>/route.ts`; use `src/lib/api/handler.ts` and `src/lib/api/response.ts` when standard request protection and error responses apply.

## Environment configuration

`.env.example` is the configuration template. Never commit `.env.local` or real credentials. `JWT_SECRET` must be at least 32 characters in production. Google OAuth and cron credentials are optional unless those integrations are enabled. `NEXT_PUBLIC_CONTACT_EMAIL` is optional; set it to the salon's confirmed public email to enable email links and the contact form's email-draft action.

See [ENV_SETUP.md](ENV_SETUP.md) for the complete variable descriptions and deployment guidance.

## Operational notes

The current data adapter stores records as local JSON under `data/`. This works for a single persistent local/server instance; deployments that use ephemeral or horizontally scaled compute should move the adapter to a shared database before relying on writes. Do not put credentials or private customer data in public assets or browser configuration.
