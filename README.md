# saasproduct.dev

A config-driven SaaS landing page starter built with Next.js 16, Tailwind CSS v4, and shadcn/ui (preset `a48`). Clone it, edit `src/config/`, and ship.

## Stack

| Layer      | Tool                                |
|------------|-------------------------------------|
| Framework  | Next.js 16 App Router + TypeScript  |
| Styling    | Tailwind CSS v4                     |
| Components | shadcn/ui — preset `a48`            |
| Icons      | lucide-react + react-icons/si       |
| Theme      | next-themes (light / dark / system) |
| Auth       | Better Auth (drop-in, see below)    |

## Quick start

```bash
git clone https://github.com/your-org/your-repo
cd your-repo
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Rebrand in minutes

All copy, routes, nav links, feature cards, and social icons live in `src/config/`. Nothing is hardcoded in components.

| File | Controls |
|------|----------|
| `src/config/site.ts` | Company name, logo letter, tagline, URL, social links, copyright |
| `src/config/navigation.ts` | Navbar links (with dropdowns), CTA buttons, mobile nav, footer nav |
| `src/config/features.ts` | Features section heading + all feature cards (title, description, lucide icon name) |
| `src/config/content.ts` | Hero copy, code showcase, tech stack, infrastructure section |

Minimum changes to rebrand:

1. Edit `src/config/site.ts` — name, logoLetter, tagline, description, url, links, socialLinks
2. Edit `src/config/navigation.ts` — update hrefs and labels
3. Edit `src/config/features.ts` — replace feature cards
4. Edit `src/config/content.ts` — hero headline, code block, bullet points

## Project structure

```text
src/
  app/
    layout.tsx            RootLayout, ThemeProvider, metadata
    page.tsx              Composes all landing page sections
  components/
    navbar.tsx            Sticky header, dropdown nav, mobile Sheet
    hero.tsx              Centered hero + side decorations
    features.tsx          3-col feature card grid
    content-sections.tsx  CodeShowcase, TechStack, Infrastructure
    footer.tsx            5-col footer with brand-colored social icons
    theme-provider.tsx    next-themes wrapper
    ui/                   shadcn primitives (do not edit manually)
  config/
    site.ts / navigation.ts / features.ts / content.ts / index.ts
  lib/
    utils.ts              cn() utility
```

## Adding auth (Better Auth)

This project is pre-configured for Better Auth. See `.claude/skills/better-auth/` for drop-in scaffolding, or install manually:

```bash
npm install better-auth
```

Then fill in your `.env.local`:

```bash
DATABASE_URL=your_connection_string
BETTER_AUTH_SECRET=your_secret_here
```

## Commands

```bash
npm run dev          # start dev server — http://localhost:3000
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npx tsc --noEmit     # type check (must pass before any commit)
```

## Design rules for AI agents

See [CLAUDE.md](./CLAUDE.md) — loaded automatically by Claude Code. Contains all shadcn/ui conventions, mobile-first responsive rules, and component patterns enforced across the codebase.
