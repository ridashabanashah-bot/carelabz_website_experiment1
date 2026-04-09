# Intern Setup Guide — CareLAbz Website Migration

Welcome! This guide gets you from zero to running the full stack locally. Follow each section in order.

## Prerequisites

Make sure you have these installed before starting:

- **Node.js** v20 or higher — download from https://nodejs.org (use the LTS version)
- **npm** v9+ — comes with Node.js
- **Git** — download from https://git-scm.com
- **VS Code** — download from https://code.visualstudio.com (recommended editor)
- **Claude Code** — install via `npm install -g @anthropic-ai/claude-code` (ask your lead for the API key)

Verify your setup:
```bash
node --version    # should be v20.x or higher
npm --version     # should be v9.x or higher
git --version     # any recent version
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/ridashabanashah-bot/carelabz_website_experiment1.git
cd carelabz_website_experiment1
```

## Step 2: Set Up the Next.js Frontend

```bash
# Install dependencies (from the project root)
npm install

# Create your local environment file
cp .env.example .env.local
```

Now edit `.env.local` and fill in the values (ask your team lead for the actual URLs and tokens):
```
NEXT_PUBLIC_STRAPI_URL=<you'll get this from your lead — it's the Railway Strapi URL>
STRAPI_API_TOKEN=<you'll get this from your lead — it's a read-only API token>
```

Start the dev server:
```bash
npm run dev
```

Open http://localhost:3000/ae/services/study-analysis/arc-flash-study — you should see the Arc Flash Study page.

## Step 3: Set Up Strapi CMS (Local Development)

You only need to run Strapi locally if you're working on content model changes. For frontend-only work, just point `.env.local` at the shared Railway instance.

```bash
# From the project root
cd carelabz-cms
npm install

# Start Strapi in development mode (uses local SQLite database)
npm run develop
```

Strapi admin panel opens at http://localhost:1337/admin. On first run, you'll create a local admin account — this is just for your machine, separate from the production admin.

After Strapi is running locally, update your `.env.local` to point at it:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

You'll need to create a local API token: Strapi Admin → Settings → API Tokens → Create new token (type: Read-only).

## Step 4: Verify Everything Works

Run these checks:

```bash
# From project root — build the Next.js app (catches TypeScript errors)
npm run build

# Run the linter
npm run lint
```

Both should pass with no errors before you push any code.

## Step 5: Open Claude Code

From the project root folder:
```bash
claude
```

Claude Code automatically reads `CLAUDE.md` and understands the entire project — the tech stack, URL structure, Strapi schema, environment variables, and coding rules. You don't need to explain the project to it.

Try asking Claude Code things like:
- "What's the current Strapi content model?"
- "How does the arc-flash page fetch data from Strapi?"
- "Add Open Graph meta tags to the arc-flash study page"
- "Create a new service page for short-circuit-study"

## Project Architecture (Quick Reference)

```
website_rebuild_project/         ← You are here
├── src/app/                     ← Next.js pages (App Router)
├── src/lib/strapi.ts            ← API client for Strapi
├── next.config.mjs              ← Redirects + Next.js config
├── carelabz-cms/                ← Strapi 5 CMS
│   └── src/api/service-page/    ← ServicePage content type
├── skills/                      ← Claude skills for this project
└── .env.local                   ← Your local secrets (never commit this)
```

## Git Workflow

1. **Never push directly to `main`** — always create a feature branch
2. **Branch naming:** `feature/your-name/what-you-are-doing` (e.g., `feature/rida/add-short-circuit-page`)
3. **Before pushing:** always run `npm run build` and `npm run lint`
4. **Create a Pull Request** on GitHub for code review
5. **Merging to `main`** triggers an automatic deploy to Vercel

```bash
# Example workflow
git checkout -b feature/your-name/add-new-page
# ... make your changes ...
npm run build           # make sure it compiles
npm run lint            # make sure it's clean
git add .
git commit -m "feat: add short-circuit-study page with Strapi integration"
git push -u origin feature/your-name/add-new-page
# Then create a PR on GitHub
```

## Important Rules

- **Never commit `.env.local`** — it contains API tokens. It's already in `.gitignore`.
- **Always use TypeScript** — no `.js` files in `src/`.
- **Tailwind CSS only** — no inline styles, no CSS modules.
- **Server components by default** — only add `'use client'` when you need interactivity.
- **Use `src/lib/strapi.ts`** for all Strapi API calls — don't write raw `fetch()` calls.
- **Strapi schema files are version-controlled** — if you change a content type, commit the updated `schema.json`.

## Getting Help

- **Project context:** Read `CLAUDE.md` (or just ask Claude Code — it's already read it)
- **Stuck on something?** Ask Claude Code first, then ask your team lead
- **Found a bug?** Create a GitHub Issue with steps to reproduce

## Environment Variables You'll Need

Ask your team lead for the actual values. Never share these in Slack/chat — use a password manager or direct message.

| Variable | Where it goes | What it is |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | `.env.local` | URL of the Strapi instance |
| `STRAPI_API_TOKEN` | `.env.local` | Read-only API token for Strapi |
