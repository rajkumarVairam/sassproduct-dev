# saasproduct.dev

A production-ready SaaS starter kit. Clone it, fill in your config, and ship.

**Included out of the box:** landing page, auth (email/password, 2FA, passkeys, OAuth), organizations/teams, password reset, email verification, Stripe billing, and a settings dashboard.

---

## Stack

| Layer      | Tool                                           |
|------------|------------------------------------------------|
| Framework  | Next.js 16 App Router + TypeScript             |
| Styling    | Tailwind CSS v4 + tw-animate-css               |
| Components | shadcn/ui — preset `a48`                       |
| Icons      | lucide-react + react-icons/si                  |
| Theme      | next-themes (light / dark / system)            |
| Auth       | Better Auth                                    |
| Database   | PostgreSQL via Drizzle ORM (postgres.js)       |
| Email      | Resend (console mock in dev — no setup needed) |
| Payments   | Stripe (optional — disabled if not configured) |

---

## Setup guide

### Step 1 — Clone and install

```bash
git clone https://github.com/your-org/your-repo
cd your-repo
npm install
```

---

### Step 2 — Create your environment file

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values below. **Only the first two are required to run locally.**

---

### Step 3 — Required: auth secret + database

#### Auth secret

Generate a random secret and paste it into `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

#### Database

You need a PostgreSQL database. The easiest free options:

| Provider | Free tier | Notes |
|----------|-----------|-------|
| [Neon](https://neon.tech) | 0.5 GB | Serverless, instant setup |
| [Supabase](https://supabase.com) | 500 MB | Includes auth UI (not used here) |
| [Railway](https://railway.app) | $5 credit/month | Simple UI |
| Local Docker | Unlimited | `docker run -e POSTGRES_PASSWORD=pass -p 5432:5432 postgres` |

Paste the connection string into `DATABASE_URL`:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

### Step 4 — Generate and push the database schema

Better Auth manages its own tables. Run this once after cloning (and again whenever you add plugins):

```bash
# Generate the Drizzle schema from your Better Auth config
npx @better-auth/cli@latest generate --output src/db/auth-schema.ts

# Push tables to your database (development)
npx drizzle-kit push

# Production: generate a migration file instead of pushing directly
# npx drizzle-kit generate && npx drizzle-kit migrate
```

> **Note:** `drizzle-kit` runs outside Next.js and does not load `.env.local` automatically. `drizzle.config.ts` handles this with `dotenv` — just make sure `.env.local` exists and contains `DATABASE_URL` before running any `drizzle-kit` command.

---

### Step 5 — Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

Auth flows work immediately with the console email mock — verification links and password reset links are printed to your terminal. No email provider setup needed in development.

---

### Step 6 (optional) — Enable real email sending via Resend

Without this, all emails (verification, password reset, invitations) are logged to the console. That is fine for development.

To send real emails in production:

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain
3. Create an API key
4. Set in `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

---

### Step 7 (optional) — Add OAuth sign-in

You can add any number of OAuth providers. Each requires creating an OAuth app on the provider's developer console.

#### GitHub

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set **Homepage URL** to `http://localhost:3000`
3. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and generate a Client Secret
5. Set in `.env.local`:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

#### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
2. Application type: **Web application**
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Client Secret
5. Set in `.env.local`:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

Then uncomment the relevant provider block in `src/lib/auth.ts` under `socialProviders`.

---

### Step 8 (optional) — Enable Stripe billing

Billing is completely disabled unless both Stripe env vars are set — no errors, no broken UI.

1. Sign up at [stripe.com](https://stripe.com)
2. In the Stripe dashboard, create your products and price plans
3. Copy the **Price IDs** (they look like `price_1Abc...`)
4. Set in `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxxxxxxxxx
```

#### Webhook setup (local dev)

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
# Copy the webhook signing secret printed to the terminal → STRIPE_WEBHOOK_SECRET
```

#### Webhook setup (production)

In your Stripe dashboard → **Developers → Webhooks → Add endpoint**:

- URL: `https://yourdomain.com/api/auth/stripe/webhook`
- Events to listen for: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`

---

### Step 9 (optional) — Enable passkeys in production

Passkeys work out of the box on `localhost`. For a production domain, set:

```env
PASSKEY_RP_ID=yourdomain.com
PASSKEY_RP_NAME=Your App Name
PASSKEY_ORIGIN=https://yourdomain.com
```

`PASSKEY_RP_ID` is the registrable domain only — no `https://`, no path.

---

## Rebrand in 4 files

All copy, routes, nav links, feature cards, and social icons are config-driven. Nothing is hardcoded in components.

| File | Controls |
|------|----------|
| `src/config/site.ts` | Company name, logo letter, tagline, URL, social links, copyright |
| `src/config/navigation.ts` | Navbar links (with dropdowns), CTA buttons, mobile nav, footer nav |
| `src/config/features.ts` | Features section heading + all feature cards (title, description, icon) |
| `src/config/content.ts` | Hero copy, code showcase, tech stack, infrastructure section |

Minimum steps to rebrand:

1. Edit `src/config/site.ts` — name, logoLetter, tagline, URL, links
2. Edit `src/config/navigation.ts` — update links and labels
3. Edit `src/config/features.ts` — replace feature cards
4. Edit `src/config/content.ts` — hero headline, bullet points

---

## Project structure

```text
src/
  app/
    layout.tsx                   RootLayout, ThemeProvider, Toaster, metadata
    page.tsx                     Landing page composition
    (auth)/
      layout.tsx                 Centered auth layout with logo
      sign-in/page.tsx
      sign-up/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx    Reads ?token= from URL
      verify-email/page.tsx
      two-factor/page.tsx        TOTP / email OTP / backup code
      accept-invite/page.tsx     Org invitation accept/decline
    (app)/
      layout.tsx                 Server session check + sidebar shell
      dashboard/page.tsx
      settings/page.tsx          Profile, Security (2FA + passkeys), Billing tabs
      org/page.tsx               Create org, invite members
    api/
      auth/[...all]/route.ts     Better Auth catch-all handler
  components/
    navbar.tsx                   Landing nav (sticky, mobile Sheet)
    hero.tsx                     Centered hero + side decorations
    features.tsx                 3-col feature card grid
    content-sections.tsx         CodeShowcase, TechStack, Infrastructure
    footer.tsx                   5-col footer with social icons
    theme-provider.tsx           next-themes wrapper
    auth/
      sign-in-form.tsx           Email + passkey sign-in
      sign-up-form.tsx
      forgot-password-form.tsx
      reset-password-form.tsx
      two-factor-form.tsx
    app/
      app-sidebar.tsx            Collapsible sidebar + user dropdown
      settings-profile-form.tsx
      settings-security.tsx      2FA toggle + passkey registration
      two-factor-setup.tsx       Password → QR scan → verify flow
      org-manager.tsx            Org create + invite
    ui/                          shadcn primitives (do not edit manually)
  config/
    site.ts / navigation.ts / features.ts / content.ts / index.ts
  db/
    index.ts                     Drizzle instance (postgres.js)
    auth-schema.ts               Generated by Better Auth CLI
  lib/
    auth.ts                      Better Auth server config (all plugins)
    auth-client.ts               Better Auth React client
    email.ts                     Resend sender + console mock
    utils.ts                     cn() utility
  middleware.ts                  Route protection (app routes + auth routes)
```

---

## Auth features

| Feature | Status | Notes |
|---------|--------|-------|
| Email & password | Enabled | Min 8 chars, 1 uppercase, 1 number |
| Email verification | Enabled | Required before sign-in |
| Password reset | Enabled | Token sent to email |
| Two-factor (TOTP) | Available | Set up in Settings → Security |
| Two-factor (email OTP) | Available | Fallback when no TOTP app |
| Backup codes | Available | 10 codes generated on 2FA setup |
| Passkeys (WebAuthn) | Available | Register in Settings → Security |
| Social OAuth | Optional | GitHub, Google (uncomment in auth.ts) |
| Organizations | Enabled | Create teams, invite by email |
| Rate limiting | Enabled | Sign-in 5/min, sign-up 3/min, forgot-password 3/min |
| Session caching | Enabled | 5-min cookie cache, 7-day expiry |
| Stripe billing | Optional | Disabled until env vars are set |

---

## Commands

```bash
npm run dev                    # dev server → http://localhost:3000
npm run build                  # production build
npm run lint                   # ESLint
npx tsc --noEmit               # type check (zero errors required)

# Database
npx @better-auth/cli@latest generate --output src/db/auth-schema.ts
npx drizzle-kit push           # push schema (dev)
npx drizzle-kit generate       # generate migration (prod)
npx drizzle-kit migrate        # apply migration (prod)

# shadcn components
npx shadcn@latest add <component>
```

---

## Integration testing

### Prerequisites (must complete before testing any auth flow)

**1. Environment variables** — copy and fill in at minimum:

```bash
cp .env.example .env.local
# Required: BETTER_AUTH_SECRET, DATABASE_URL, NEXT_PUBLIC_APP_URL
```

**2. Generate schema and push tables** — the `src/db/auth-schema.ts` file ships as a stub. Without real tables in the database, every auth action throws a silent DB error.

```bash
npx @better-auth/cli@latest generate --output src/db/auth-schema.ts
npx drizzle-kit push
```

Verify tables were created (opens a browser UI at `localhost:4983`):

```bash
npx drizzle-kit studio
```

**3. Start the dev server**

```bash
npm run dev
```

**4. Email — no provider needed in dev**

Without `RESEND_API_KEY`, all emails (verification links, password reset links, OTP codes, org invitations) are printed to the terminal. Copy the URL from the terminal output and open it in the browser to complete each flow.

---

### Per-feature requirements

| Feature | Extra requirement |
|---------|------------------|
| Sign up / Sign in | Steps 1–4 above |
| Email verification | Copy link from terminal output |
| Password reset | Copy link from terminal output |
| Two-factor TOTP | Authenticator app (Google Authenticator, 1Password, or similar) |
| Two-factor email OTP | Copy code from terminal output |
| Passkeys | Chrome, Safari, or Firefox with device biometrics or PIN |
| Organizations | At least one verified account |
| OAuth (GitHub / Google) | OAuth app credentials + uncomment provider in `src/lib/auth.ts` |
| Stripe billing | Stripe test keys + `stripe listen` CLI for local webhooks |

---

### Recommended test order

Test in this sequence — each flow depends on the previous one working:

1. Sign up → user created in DB
2. Email verification → copy link from terminal, open in browser
3. Sign in → succeeds after verification
4. Sign out → session cleared
5. Forgot password → copy reset link from terminal, set new password
6. Sign in with new password
7. Enable 2FA → Settings → Security → Enable 2FA → scan QR → verify
8. Sign out → sign in → enter TOTP code
9. Register passkey → Settings → Security → Register a passkey
10. Sign out → sign in with passkey
11. Create organization → invite a second test account → accept invite

---

## AI agent rules

See [CLAUDE.md](./CLAUDE.md) — loaded automatically by Claude Code. Enforces shadcn/ui conventions, mobile-first responsive rules, accessibility requirements, and component composition patterns.
