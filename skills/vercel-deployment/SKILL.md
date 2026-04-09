---
name: vercel-deployment
description: >
  Deploy a Next.js 14 application to Vercel with environment variables, domain configuration, preview
  deployments, and auto-deploy on git push. Use this skill whenever the user mentions Vercel, deployment,
  deploying to production, domain setup, DNS configuration, environment variables in Vercel, preview
  deployments, build settings, deploy hooks, or any task related to hosting the Next.js site. Also trigger
  when the user says "push to production", "go live", "set up hosting", "connect domain", "deploy error",
  or asks about CI/CD with Vercel and GitHub. If the user mentions build failures on Vercel or wants to
  debug a deployment issue, use this skill.
---

# Vercel Deployment & Domain Configuration

This skill covers deploying the Next.js 14 frontend to Vercel, including the GitHub integration for auto-deploys, environment variable management, and domain configuration for carelabz.com.

## Initial Vercel setup

### 1. Connect GitHub repository

1. Go to [vercel.com](https://vercel.com) and sign in (or create account)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js — the default settings are usually correct:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (or `npm run build`)
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Configure environment variables

In the Vercel dashboard (Settings → Environment Variables), add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `STRAPI_API_URL` | `https://your-strapi-production.com` | Production |
| `STRAPI_API_URL` | `https://your-strapi-staging.com` | Preview |
| `STRAPI_API_URL` | `http://localhost:1337` | Development |
| `STRAPI_API_TOKEN` | `<your-read-only-token>` | All |
| `NEXT_PUBLIC_SITE_URL` | `https://carelabz.com` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://preview-carelabz.vercel.app` | Preview |
| `REVALIDATION_SECRET` | `<random-secret-string>` | Production, Preview |

**Important:** `STRAPI_API_URL` and `STRAPI_API_TOKEN` are server-side only (no `NEXT_PUBLIC_` prefix) since they're used in server components. `NEXT_PUBLIC_SITE_URL` needs the prefix because it may be used client-side for absolute URLs.

### 3. Auto-deploy on git push

Once connected, Vercel automatically:
- **Production deploy**: Every push to `main` (or `master`) branch
- **Preview deploy**: Every push to any other branch, and every pull request
- Each preview deploy gets a unique URL like `your-project-abc123.vercel.app`

This is set up by default — no configuration needed.

## Domain configuration

### Adding carelabz.com to Vercel

1. In the Vercel dashboard: Settings → Domains
2. Add `carelabz.com`
3. Vercel provides DNS records to configure

### DNS setup

You have two options:

**Option A: Use Vercel DNS (recommended)**
- Transfer your domain's nameservers to Vercel
- Vercel handles all DNS automatically
- Easiest option, best performance (edge network)

**Option B: External DNS (keep current provider)**
- Add an `A` record pointing to Vercel's IP: `76.76.21.21`
- Add a `CNAME` record for `www` pointing to `cname.vercel-dns.com`
- This works but you lose some edge optimizations

### WWW redirect

Configure whether `www.carelabz.com` redirects to `carelabz.com` (or vice versa). In Vercel:
1. Add both `carelabz.com` and `www.carelabz.com` as domains
2. Set one as primary — the other auto-redirects with a 308

### SSL/TLS

Vercel automatically provisions and renews SSL certificates via Let's Encrypt. No configuration needed — HTTPS works immediately after domain verification.

## vercel.json configuration

For most Next.js projects, you don't need a `vercel.json` file — the defaults work. But here are useful overrides:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    }
  ]
}
```

Note: Redirects should be configured in `next.config.mjs` rather than `vercel.json` for portability. The `redirects()` function in Next.js config works on Vercel automatically.

## Build and deployment troubleshooting

### Common build failures

**"Module not found"**
- Check that all dependencies are in `package.json` (not just installed locally)
- Run `npm ci` locally to test a clean install

**"Type error" in TypeScript**
- Vercel runs `next build` which includes type checking
- Fix all TypeScript errors before pushing
- You can temporarily bypass with `typescript: { ignoreBuildErrors: true }` in `next.config.mjs` but this is NOT recommended

**"Environment variable is undefined"**
- Verify the variable is set in the correct environment (Production vs Preview vs Development)
- Remember: variables without `NEXT_PUBLIC_` prefix are only available server-side
- After adding/changing env vars, you need to redeploy

**Build timeout**
- Default is 45 minutes, which is generous
- If builds are slow, check for unnecessarily large dependencies or unoptimized images

### Checking deployment logs

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View recent deployments
vercel ls

# View build logs for latest deployment
vercel logs <deployment-url>

# Deploy from local (useful for testing)
vercel --prod    # production deploy
vercel           # preview deploy
```

## Strapi hosting considerations

Your Strapi CMS also needs to be hosted somewhere accessible to Vercel's build servers. Options:

1. **Strapi Cloud** — Official hosting, easiest setup
2. **Railway / Render / Fly.io** — Good affordable options for Node.js apps
3. **DigitalOcean App Platform** — Reliable, starts at $5/mo
4. **Self-hosted VPS** — Most control, most maintenance

Whichever you choose, the Strapi instance must be publicly accessible (with API token authentication) so Vercel's build servers can fetch content during `next build`.

## Deployment workflow

The day-to-day workflow after initial setup:

1. Make code changes locally
2. Test locally with `npm run dev`
3. Commit and push to a feature branch
4. Vercel auto-creates a preview deployment
5. Review the preview URL
6. Create a PR and merge to `main`
7. Vercel auto-deploys to production
8. Verify at `carelabz.com`

For content-only changes (updating text in Strapi), no code push is needed — the ISR revalidation or webhook-triggered revalidation handles it automatically.
