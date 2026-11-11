# Contributing

Thanks for helping improve Uptown Hair.

## Before you start

- Use a separate branch for each change. Keep the change focused and describe its purpose.
- Read `AGENTS.md` before editing. For Next.js changes, follow the installed version's guidance in `node_modules/next/dist/docs/`.
- Install dependencies with `npm ci` so the versions in `package-lock.json` are used.
- Never commit `.env` files, credentials, private customer data, local database files, or generated output. Use `.env.example` for configuration names and safe placeholders.

## Pull requests

Open a pull request against `main`. Explain the user-visible change, list any configuration changes, and describe the checks you ran. Include screenshots for visual changes when useful. Keep unrelated formatting and generated files out of the diff.

## Checks

Run the relevant checks before opening a pull request. Available project commands are listed in `README.md`; use `npm run lint` for linting and `npm run build` to check a production build when appropriate.
