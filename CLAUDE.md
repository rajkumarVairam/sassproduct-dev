# CLAUDE.md — Agent Instructions for saasproduct.dev

This file is read automatically by Claude Code at the start of every session.
All agents working on this project **must follow every rule below** before writing any UI code.

---

## 1. Stack

| Layer      | Tool                                                            |
|------------|-----------------------------------------------------------------|
| Framework  | Next.js 16 App Router + TypeScript                              |
| Styling    | Tailwind CSS v4 + `tw-animate-css`                              |
| Components | shadcn/ui — preset `a48`                                        |
| Icons      | `lucide-react` (UI icons) + `react-icons/si` (brand/social)     |
| Forms      | `react-hook-form` + `zod` + `@hookform/resolvers`               |
| Toasts     | `sonner` (via shadcn Toaster)                                   |
| Auth       | Better Auth (see `.claude/skills/better-auth/`)                 |
| Theme      | `next-themes` — `attribute="class"`, system default             |

---

## 2. Config-driven content — never hardcode copy

All brand names, routes, nav links, section copy, and feature lists live in `src/config/`.
**Import from `@/config`, never inline strings in components.**

| File              | What it controls                                                                    |
|-------------------|-------------------------------------------------------------------------------------|
| `site.ts`         | Company name, logo letter, tagline, URL, social links, copyright                    |
| `navigation.ts`   | `mainNav`, `navCta`, `mobileNav`, `footerNav`, `footerLegal`                        |
| `features.ts`     | `featuresSection`, `featureItems[]`                                                 |
| `content.ts`      | `heroContent`, `codeShowcaseContent`, `techStackContent`, `infrastructureContent`   |
| `index.ts`        | Barrel — `import { ... } from "@/config"`                                           |

---

## 3. Next.js App Router rules

### 3a. `"use client"` — only when the component uses hooks or browser APIs

Server Components are the default. Only add `"use client"` when the component:

- Uses React hooks (`useState`, `useEffect`, `useRef`, `useContext`)
- Uses third-party hooks (`useTheme`, `usePathname`, etc.)
- Attaches browser event handlers directly (rare — usually extract a small Client wrapper instead)

```tsx
// WRONG — unnecessary directive adds client bundle weight
"use client";
export function Features() {
  return <section>...</section>;  // no hooks, no events — should be Server
}

// CORRECT — directive only where truly needed
"use client";
import { useState } from "react";
export function Navbar() {
  const [open, setOpen] = useState(false);  // ← needs client
  ...
}
```

Server Components that are currently in this project (NO `"use client"`):
`hero.tsx`, `features.tsx`, `content-sections.tsx`, `footer.tsx`, `theme-provider.tsx` (wraps client internally),
`(auth)/sign-in/page.tsx`, `(auth)/sign-up/page.tsx` (pages export metadata — form logic is in `components/auth/`)

Client Components (have `"use client"`): `navbar.tsx`, `components/auth/sign-in-form.tsx`, `components/auth/sign-up-form.tsx`

**Rule:** Never put `"use client"` on a page that needs to export `metadata` or `generateMetadata`.
Extract the interactive parts into a separate Client Component (e.g. `<SignInForm>`) and keep the page as a Server Component.

### 3b. Internal links — always `next/link`, never `<a>`

```tsx
// WRONG — bypasses client-side routing, causes full page reload
<a href="/features">Features</a>

// CORRECT
import Link from "next/link";
<Link href="/features">Features</Link>
```

External URLs (opening new tab) may use `<a href="..." target="_blank" rel="noopener noreferrer">`.

### 3c. Metadata — export from every page (Server Components only)

Every page must export either static `metadata` or a `generateMetadata` function.
The `metadata.title.template` in the root layout auto-appends the site name.

```tsx
// Root layout — sets template and site-wide defaults
export const metadata: Metadata = {
  title: { default: "SaaSproduct.dev", template: "%s — SaaSproduct.dev" },
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
  openGraph: { type: "website", ... },
  twitter: { card: "summary_large_image", ... },
  robots: { index: true, follow: true },
};

// Viewport is exported separately (Next.js 14+ requirement)
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// Individual page — title becomes "Sign in — SaaSproduct.dev"
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account to continue.",
};

// Dynamic route — use generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}
```

**Never** export `metadata` from a `"use client"` file — Next.js silently ignores it.

### 3d. Special App Router files — required for every route segment

Missing these files leaves users with blank pages or Next.js defaults on errors.

```text
src/app/
  error.tsx       — "use client" error boundary, receives { error, reset }
  loading.tsx     — Suspense fallback, matched to the content shape (use Skeleton)
  not-found.tsx   — Custom 404, called by notFound() or unmatched routes
```

```tsx
// error.tsx — must be "use client"
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild><a href="/">Go home</a></Button>
      </div>
    </main>
  );
}

// loading.tsx — Server Component, match shape of page content
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return <div className="flex flex-col gap-3">...</div>; // Skeleton shapes
}

// not-found.tsx — Server Component
export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold tracking-tight mt-2">Page not found</h1>
      <Button className="mt-8" asChild><Link href="/">Go back home</Link></Button>
    </main>
  );
}
```

Use `<a href="/">` instead of `<Link href="/">` inside `error.tsx` — routing may be impaired during error recovery.

### 3e. Images — always `next/image`, never `<img>`

```tsx
// WRONG — no optimization, layout shift
<img src="/hero.png" alt="Hero" />

// CORRECT
import Image from "next/image";
<Image src="/hero.png" alt="Hero" width={800} height={600} />
// or for fill layout:
<div className="relative h-64 w-full">
  <Image src="/hero.png" alt="Hero" fill className="object-cover" />
</div>
```

---

## 4. shadcn/ui rules — enforced on every component

### 4a. Spacing — NEVER use `space-x-*` or `space-y-*`

```tsx
// WRONG
<div className="space-y-4">
<div className="space-x-2">

// CORRECT
<div className="flex flex-col gap-4">
<div className="flex gap-2">
```

### 4b. Equal dimensions — always `size-*`

Use `size-*` only when width === height. Use `h-* w-*` for non-square elements.

```tsx
// WRONG — when width equals height
<span className="h-8 w-8" />
<Avatar className="w-10 h-10" />

// CORRECT — equal dimensions
<span className="size-8" />
<Avatar className="size-10" />

// CORRECT — non-square requires explicit h-* w-*
<div className="h-72 w-40">   {/* 72 ≠ 40, size-* impossible */}
<div className="h-2 w-full">  {/* full-width bar */}
```

### 4c. `className` on shadcn components — layout and semantic tokens only

Never override a component's built-in color or typography with raw values.
Semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`) are layout-level
and ARE appropriate in `className`.

```tsx
// WRONG — overriding component's designed color/font
<NavigationMenuTrigger className="bg-transparent text-sm h-8">
<Card className="bg-blue-100 text-blue-900 font-bold">
<Button className="text-white bg-red-600">  {/* use variant="destructive" instead */}

// CORRECT — layout positioning and semantic tokens
<NavigationMenuTrigger>               {/* no overrides — let the preset style it */}
<Card className="max-w-md mx-auto">   {/* layout only */}
<div className="bg-background/80 backdrop-blur-md">  {/* semantic token is fine */}
```

### 4d. Colors — semantic tokens for UI states, raw for decorative/brand

```tsx
// WRONG — raw color for a semantic UI state (primary action, status, feedback)
<div className="bg-blue-500 text-white">     {/* use bg-primary text-primary-foreground */}
<Badge className="bg-green-200">Active</Badge>  {/* use variant="secondary" */}

// CORRECT — semantic tokens for interactive/state-bearing elements
<div className="bg-primary text-primary-foreground">
<Badge variant="secondary">Active</Badge>
```

**Exceptions — raw colors ARE correct for:**

1. **Status indicators** (Active/Pending badges, pulse dots) — these are inherently color-coded
   and require `dark:` variants so they remain legible in both themes:

   ```tsx
   // Status badge — raw colors intentional, dark: variants required
   className={`... ${
     status === "Active"
       ? "bg-green-500/10 text-green-600 dark:text-green-400"
       : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
   }`}
   ```

2. **Decorative UI accents** (pulse dots, shimmer lines, code-block chrome dots):

   ```tsx
   <span className="h-2 w-2 rounded-full bg-green-500" />  {/* decorative pulse */}
   <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />  {/* macOS window dot */}
   ```

3. **Brand identity colors** on social/external icons — fixed contracts, not UI state:

   ```tsx
   // Use inline style so the color is an immutable brand contract, not a theme token
   style={{ color: "#FF0000" }}  {/* YouTube red */}
   style={{ color: "#1877F2" }}  {/* Facebook blue */}
   // Monochrome brands (GitHub, X) use text-foreground — auto dark/light
   ```

4. **Code block backgrounds** — intentionally dark regardless of theme:

   ```tsx
   <div className="bg-zinc-950">  {/* always dark for code readability */}
   ```

### 4e. Icons — three contexts, three rules

**In `Button` — use `data-icon`, no manual sizing:**
```tsx
// WRONG
<Button><ArrowRight className="h-4 w-4" /> Get Started</Button>

// CORRECT
<Button><ArrowRight data-icon="inline-end" /> Get Started</Button>
<Button size="icon"><Menu data-icon /></Button>
```

**In list items / flex rows alongside text — use `data-icon` for auto-sizing:**
```tsx
<li className="flex items-center gap-3 text-sm">
  <CheckCircle2 className="shrink-0 text-green-500" data-icon />
  {item}
</li>
```

**Standalone (outside any component) — use `size-*` or explicit `h-* w-*`:**
```tsx
<Github className="size-4" />          {/* square icon */}
<ShieldCheck className="h-3 w-3" />   {/* also acceptable for small decorative icons */}
```

`react-icons/si` brand icons follow the same rule — use `size-*` when standalone.

### 4f. No manual `dark:` color overrides — use semantic tokens

```tsx
// WRONG
<div className="bg-white dark:bg-gray-950">
<p className="text-gray-900 dark:text-gray-100">

// CORRECT — semantic tokens handle both modes automatically
<div className="bg-background">
<p className="text-foreground">
```

Exception: `dark:` IS allowed on status indicators and brand color adjustments (see rule 4d).

### 4g. Theme toggle — CSS-only, no `mounted` state, no `useEffect` re-render

The `mounted` pattern causes a visible flash: server renders a placeholder, then swaps in
after hydration. `next-themes` injects an inline script that sets the class on `<html>` before
React hydrates — CSS `dark:` visibility works immediately.

```tsx
// WRONG — causes layout shift on load
function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <Button size="icon" className="size-8" />;
  ...
}

// CORRECT — CSS controls visibility, zero flash
function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" className="size-8"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme">
      <Sun data-icon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon data-icon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

- Never read `theme` for rendering — only call `setTheme`. Use `resolvedTheme` for toggle logic.
- `suppressHydrationWarning` on `<html>` in `layout.tsx` is required for this to work.

### 4h. Mobile `Sheet` — controlled open state + `MediaQueryList` auto-close

An uncontrolled `<Sheet>` stays open when the user resizes from mobile to desktop.

```tsx
// WRONG — stays open on viewport resize
<Sheet>...</Sheet>

// CORRECT
export function Navbar() {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setSheetOpen(false);
    };
    mq.addEventListener("change", handleBreakpoint);
    return () => mq.removeEventListener("change", handleBreakpoint);
  }, []);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 md:hidden">
          <Menu data-icon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <Link href="/features" onClick={() => setSheetOpen(false)}>Features</Link>
      </SheetContent>
    </Sheet>
  );
}
```

- The `MediaQueryList` breakpoint must match the CSS trigger (`md:hidden` → `min-width: 768px`).
- Every `<Link>` and `<Button>` inside `SheetContent` must call `onClick={() => setSheetOpen(false)}`.

### 4i. `cn()` for conditional classes — no template literal ternaries

```tsx
// WRONG
<div className={`flex ${isActive ? "bg-primary" : "bg-muted"}`}>

// CORRECT
<div className={cn("flex", isActive ? "bg-primary" : "bg-muted")}>
```

Exception: status badge patterns where both branches contain multiple classes and the
conditional is part of a larger expression can use template literals (see rule 4d exception 1).

### 4j. No manual `z-index` on overlay components

`Dialog`, `Sheet`, `Drawer`, `DropdownMenu`, `Popover`, `Tooltip` manage their own stacking.
Never add `z-50`, `z-[999]`, etc. to these.

### 4k. `NavigationMenu` positioning — never wrap in a div

```tsx
// WRONG — breaks absolutely-positioned dropdown viewport
<div className="flex-1">
  <NavigationMenu>...</NavigationMenu>
</div>

// CORRECT — NavigationMenu sits directly in the flex row
<header className="flex ...">
  <Logo />
  <NavigationMenu>...</NavigationMenu>
  <div className="flex-1" />   {/* spacer, NOT a wrapper */}
  <Actions />
</header>
```

### 4l. Dropdown breakpoints — no `md:` inside fixed-width popups

Tailwind breakpoints respond to **viewport width**, not container width.

```tsx
// WRONG — md: never fires inside a 440px popup
<ul className="grid w-[440px] gap-2 md:grid-cols-2">

// CORRECT
<ul className="grid w-[440px] grid-cols-2 gap-2">
```

### 4m. Composition rules

- Items always inside their group: `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`
- `Dialog`, `Sheet`, `Drawer` always need a `Title` (use `className="sr-only"` if visually hidden)
- Full `Card` composition: `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`
- `TabsTrigger` must be inside `TabsList`
- `Avatar` always needs `AvatarFallback`
- Use `Separator` instead of `<hr>` or `<div className="border-t">`
- Use `Badge` instead of custom styled `<span>` for status indicators (except inline status badges with color logic — see 4d)

---

## 5. Mobile-first responsive rules

### 5a. Mobile drawer / sheet CTA buttons — stacked full-width pattern

```tsx
// WRONG — side-by-side, cramped, misaligned
<div className="flex items-center gap-2">
  <Button variant="ghost" size="sm">Sign in</Button>
  <Button size="sm">Get Started</Button>
</div>

// CORRECT — stacked, full-width, clear hierarchy, px-3 aligns with nav links
<Separator className="my-3" />
<div className="flex flex-col gap-2 px-3">
  <Button variant="outline" size="sm" className="w-full" asChild>
    <Link href="/sign-in">Sign in</Link>
  </Button>
  <Button size="sm" className="w-full" asChild>
    <Link href="/sign-up">Get Started</Link>
  </Button>
</div>
```

### 5b. CTA / action buttons — full width on mobile, auto on desktop

```tsx
<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
  <Button className="w-full sm:w-auto">Primary</Button>
  <Button variant="outline" className="w-full sm:w-auto">Secondary</Button>
</div>
```

### 5c. Footer grid — don't introduce broken middle breakpoints

```tsx
// WRONG — sm:grid-cols-3 with 4 link columns + brand overflows unevenly
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">

// CORRECT — skip sm layer when the math doesn't work
<div className="grid grid-cols-2 lg:grid-cols-5">
  <div className="col-span-2 lg:col-span-1">  {/* brand spans full row on mobile */}
```

### 5d. Breakpoint layers — only add when layout genuinely changes

Don't add `sm:`, `md:`, `lg:` just for incremental steps. Broken grids are worse than simpler ones.

### 5e. Tap target sizes

Interactive elements on mobile must be at minimum `44×44px`. `size-8` (32px) icon buttons meet
this via the Button component's internal padding — do not reduce further.

### 5f. Section layout — consistent padding and container across all sections

Every landing page section uses the same outer/inner pattern:

```tsx
// Outer section — consistent vertical rhythm
<section className="py-20 sm:py-28" id="section-name">

  {/* Inner container — consistent max-width and horizontal padding */}
  <div className="mx-auto max-w-7xl px-4 sm:px-6">
    ...
  </div>

</section>
```

- Always add `id` to `<section>` for anchor navigation
- Vertical padding by section type:
  - **Hero** — `py-24 sm:py-32` (largest, visually dominant)
  - **Primary content sections** — `py-20 sm:py-28` (standard)
  - **Secondary / utility sections** (e.g. TechStack band) — `py-16 sm:py-20`
- `mx-auto max-w-7xl px-4 sm:px-6` on every direct inner container
- Do not deviate from `max-w-7xl` — all sections must align horizontally

---

## 6. Accessibility minimums

Every interactive element must meet these requirements. These are not optional.

### 6a. Icon-only buttons must have `aria-label`

```tsx
// WRONG — screen reader announces nothing
<Button size="icon"><Menu data-icon /></Button>

// CORRECT
<Button size="icon" aria-label="Open navigation menu"><Menu data-icon /></Button>
<Button size="icon" aria-label="Toggle theme">...</Button>
```

### 6b. Decorative icons must be hidden from assistive tech

Icons that convey no information independently (in a labeled button, beside visible text)
should be aria-hidden or use `data-icon` which handles it:

```tsx
// CORRECT — data-icon marks the icon as decorative
<Button>
  <ArrowRight data-icon="inline-end" /> Get Started
</Button>

// For standalone decorative icons, add aria-hidden
<CheckCircle2 className="size-4" aria-hidden="true" />
```

### 6c. Visually hidden text — use `sr-only`, never `display:none` or `hidden`

```tsx
// WRONG — completely removes from accessibility tree
<span className="hidden">Sort ascending</span>

// CORRECT — visible to screen readers
<span className="sr-only">Sort ascending</span>
```

### 6d. Semantic HTML structure

- Page header: `<header>`
- Main navigation: `<nav>`
- Page main content: `<main>`
- Content sections: `<section id="...">` with meaningful `id`
- Footer: `<footer>`
- Never use `<div>` for structural landmarks

### 6e. `<main id="main-content">` — required on every layout

Every layout that renders page content must wrap it in `<main id="main-content">`.
This is the skip-to-main target and the primary landmark for screen readers.

```tsx
// WRONG — content not in a landmark
<div className="min-h-screen ...">
  {children}
</div>

// CORRECT — landmark with skip target id
<main id="main-content" className="min-h-screen ...">
  {children}
</main>
```

The root `layout.tsx` renders the skip link that targets `#main-content`:

```tsx
// In <body>, before ThemeProvider
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring focus:outline-none"
>
  Skip to main content
</a>
```

### 6f. Focus restoration — required after Sheet / Dialog close

When a Sheet, Dialog, or Drawer closes, keyboard focus must return to the element that opened it.
Radix-based components provide `onCloseAutoFocus` on their content for this purpose.

```tsx
// WRONG — focus is lost after close (lands on body)
<SheetContent side="right">...</SheetContent>

// CORRECT — ref on trigger, explicit restoration via onCloseAutoFocus
const triggerRef = React.useRef<HTMLButtonElement>(null);

<Sheet>
  <SheetTrigger asChild>
    <Button ref={triggerRef}>Open</Button>
  </SheetTrigger>
  <SheetContent
    onCloseAutoFocus={(e) => {
      e.preventDefault(); // prevent Radix default (focuses trigger automatically but inconsistently)
      triggerRef.current?.focus();
    }}
  >
    ...
  </SheetContent>
</Sheet>
```

---

## 7. New page / component checklist

Before submitting any new UI file, verify every item:

### TypeScript

- [ ] `npx tsc --noEmit` passes with zero errors

### Next.js

- [ ] `"use client"` only present if component uses hooks or browser APIs
- [ ] Internal links use `<Link>` from `next/link`, not `<a>`
- [ ] Images use `<Image>` from `next/image`, not `<img>`

### Config

- [ ] Marketing copy/routes sourced from `src/config/` — no inline hardcoded strings

### shadcn/ui conventions

- [ ] No `space-x-*` or `space-y-*` — all spacing via `flex gap-*`
- [ ] Equal-dimension elements use `size-*`; non-square elements use `h-* w-*`
- [ ] No color/typography overrides in `className` on shadcn components (layout + semantic tokens only)
- [ ] No raw Tailwind colors for semantic UI states — use tokens, `Badge`, or CSS vars
- [ ] Status indicators and brand icons are the documented exceptions (add inline comment)
- [ ] Icons in `Button` use `data-icon`, no size classes
- [ ] No `dark:` overrides except on status indicators and brand color adjustments
- [ ] No `z-index` on overlay components (`Dialog`, `Sheet`, `Drawer`, etc.)
- [ ] `NavigationMenu` is a direct flex child — never wrapped in a div
- [ ] No breakpoint prefixes on classes inside fixed-width popups/dropdowns
- [ ] `cn()` used for conditional classes, not template literal ternaries

### Layout — marketing pages

- [ ] Section uses correct padding tier (`py-24 sm:py-32` hero / `py-20 sm:py-28` primary / `py-16 sm:py-20` utility)
- [ ] `<section>` has an `id` attribute
- [ ] Inner container uses `mx-auto max-w-7xl px-4 sm:px-6`
- [ ] Footer/complex grids: verify column math works at every used breakpoint
- [ ] No intermediate breakpoints added unless layout genuinely changes

### Layout — app pages

- [ ] Uses `px-4 py-6 sm:px-6 lg:px-8` container (NOT landing section padding)
- [ ] Correct max-width: `max-w-2xl` (forms/auth) / `max-w-4xl` (settings) / none (tables)
- [ ] Page starts with `<h1>` + optional muted description
- [ ] Nested pages have `<Breadcrumb>` above the `<h1>`
- [ ] One `<h1>` per page; subsections use `<h2>`, sub-subsections use `<h3>`

### Forms

- [ ] Auth pages are Server Components (no `"use client"`) — form logic extracted to `components/auth/*.tsx`
- [ ] All forms use `Form` + `FormField` + `FormItem` + `FormLabel` + `FormControl` + `FormMessage`
- [ ] Schema defined with `zod`, resolver passed to `useForm`
- [ ] Email inputs have `type="email"` + `inputMode="email"` + `autoComplete="email"`
- [ ] Password inputs use `<PasswordInput>` (not raw `<Input type="password">`)
- [ ] New password uses `autoComplete="new-password"`, login uses `autoComplete="current-password"`
- [ ] First visible field in standalone forms has `autoFocus`
- [ ] Submit button shows loading state (`disabled` + spinner) while submitting
- [ ] Server errors use `form.setError("root")` + `<p role="alert">` to display
- [ ] Auth forms: `w-full` submit button; Settings forms: `self-start` submit button

### Feedback

- [ ] Async action results (save, delete, copy) use `toast.success` / `toast.error` / `toast.promise`
- [ ] Persistent notices use `Alert` (not toast)
- [ ] Destructive confirmations use `AlertDialog` (not `Dialog` or `window.confirm`)

### Data display

- [ ] Tables use shadcn `Table` component — never raw `<table>`
- [ ] Tables include empty-row fallback inside `TableBody`
- [ ] Status columns use `Badge` — not raw colored spans
- [ ] Lists with no data show a proper empty state (icon + message + action)
- [ ] Loading states use `Skeleton` components matching the content shape

### Animation

- [ ] Animations gated with `motion-safe:` prefix
- [ ] Hover changes use `transition-colors duration-150` only (no animate-in/out)

### Mobile / responsive

- [ ] Action buttons use `w-full sm:w-auto` pattern on marketing pages
- [ ] Mobile Sheet uses controlled open state + `MediaQueryList` auto-close

### SEO & Metadata

- [ ] Root `layout.tsx` exports `metadata` (OG, Twitter, robots, canonical) and `viewport`
- [ ] Every page exports `metadata` or `generateMetadata` with `title` and `description`
- [ ] `public/robots.txt` exists and allows/disallows correct routes
- [ ] `src/app/sitemap.ts` exists and lists all public routes
- [ ] `metadataBase` set to `process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url`

### Special Next.js files

- [ ] `src/app/error.tsx` exists (`"use client"`, exposes Try again + Go home)
- [ ] `src/app/loading.tsx` exists (Skeleton shapes matching page content)
- [ ] `src/app/not-found.tsx` exists (404 with Go back home button)

### Accessibility

- [ ] Root layout `<body>` starts with a skip-to-main `<a href="#main-content">` link
- [ ] Every layout wraps content in `<main id="main-content">`
- [ ] Sheet / Dialog trigger uses a `ref` + `onCloseAutoFocus` restores focus to it on close
- [ ] Icon-only buttons have `aria-label`
- [ ] Decorative icons use `data-icon` or `aria-hidden="true"`
- [ ] Visually hidden text uses `sr-only`, not `hidden`
- [ ] Structural landmarks use correct semantic elements (`header`, `nav`, `main`, `section`, `footer`)

---

## 8. App page layouts — different from landing sections

Landing page rules (`py-20 sm:py-28`, `max-w-7xl`, `<section id="...">`) apply to the **public marketing site only**.
Post-login app pages use tighter, purpose-specific containers.

### 8a. App page container

```tsx
// WRONG — landing section padding applied to an app page
<section className="py-20 sm:py-28">
  <div className="mx-auto max-w-7xl px-4 sm:px-6">

// CORRECT — app pages use py-6, narrower max-width by content type
<div className="px-4 py-6 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-4xl">    {/* settings/forms */}
  <div className="mx-auto max-w-2xl">    {/* narrow: auth, single-form pages */}
  {/* full-width tables: no max-w constraint */}
```

### 8b. App page header — consistent pattern

Every app page has a title block before the content:

```tsx
// CORRECT — standardised app page header
<div className="mb-8">
  <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
  <p className="mt-1 text-sm text-muted-foreground">
    Manage your account preferences and security.
  </p>
</div>
```

- `h1` + optional `p` (muted) — always the first element of the page content area
- One `<h1>` per page — sections within the page use `<h2>`
- Never use landing-page eyebrow/heading/subheading patterns inside app pages

### 8c. Auth page layout — centered card

Sign-in, sign-up, forgot-password, and verify-email pages share this shell:

```tsx
// CORRECT — centered card auth layout
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo or brand mark */}
          <h1 className="text-2xl font-bold tracking-tight mt-4">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            {/* form here */}
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4 hover:text-foreground">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### 8d. Sidebar app shell

For dashboard/app layouts with sidebar navigation, use the shadcn `Sidebar` component.
Do not build custom sidebar layouts from scratch.

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>{/* nav items */}</Sidebar>
      <SidebarInset>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## 9. Forms

All forms use **shadcn Form + react-hook-form + zod**. No exceptions.

### 9a. Form + page structure for auth/settings pages

Auth pages must be **Server Components** so they can export `metadata`. Extract form logic into a `"use client"` component:

```text
src/app/(auth)/sign-in/
  page.tsx                  ← Server Component, exports metadata, renders Card + <SignInForm>
src/components/auth/
  sign-in-form.tsx          ← "use client", owns useForm / onSubmit / JSX form
```

### 9b. Always use the full Form composition

```tsx
// WRONG — raw inputs, no validation, no accessible labels
<div>
  <Input placeholder="Email" onChange={...} />
  <Button onClick={handleSubmit}>Submit</Button>
</div>

// CORRECT — full shadcn Form composition
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Must be at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // call server action or API
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Must be at least 8 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
```

### 9c. Input attributes — mobile keyboard + autofill

Every form input must include these attributes for mobile UX and browser autofill:

| Input type     | `type`     | `inputMode`     | `autoComplete`       |
|----------------|------------|-----------------|----------------------|
| Email          | `email`    | `email`         | `email`              |
| Current password | `password` | —             | `current-password`   |
| New password   | `password` | —               | `new-password`       |
| Name           | `text`     | `text`          | `name`               |
| Phone          | `tel`      | `tel`           | `tel`                |
| Number / OTP   | `text`     | `numeric`       | `one-time-code`      |

- `autoFocus` on the **first visible field** in standalone forms (sign-in, sign-up, search)
- Never use `autoFocus` on fields below the fold or inside drawers

### 9d. Password fields — always use `<PasswordInput>`

Use the `PasswordInput` component (`src/components/ui/password-input.tsx`) for all password fields.
It wraps `<Input type="password">` with a show/hide eye-icon toggle.

```tsx
// WRONG — raw Input, user cannot verify what they typed
<Input type="password" autoComplete="current-password" {...field} />

// CORRECT — PasswordInput adds show/hide toggle automatically
import { PasswordInput } from "@/components/ui/password-input";
<PasswordInput autoComplete="current-password" {...field} />
```

### 9e. Root (non-field) errors — use `role="alert"`

```tsx
// WRONG — silent error, screen readers don't announce it
{form.formState.errors.root && (
  <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
)}

// CORRECT — announced immediately when it appears
{form.formState.errors.root && (
  <p role="alert" className="text-sm font-medium text-destructive">
    {form.formState.errors.root.message}
  </p>
)}
```

### 9f. Form layout rules

```tsx
// Field spacing — always flex flex-col gap-4, never gap-6 or space-y-*
<form className="flex flex-col gap-4">

// Auth / narrow forms — max-w-md container
<div className="max-w-md">

// Settings sections — group related fields with a heading
<div className="flex flex-col gap-6">
  <div>
    <h2 className="text-lg font-semibold">Profile</h2>
    <p className="text-sm text-muted-foreground">Update your public profile.</p>
  </div>
  <div className="flex flex-col gap-4">
    {/* fields */}
  </div>
  <div className="flex gap-3">
    <Button type="submit">Save changes</Button>
    <Button type="button" variant="outline">Cancel</Button>
  </div>
</div>

// Submit button placement:
// — Auth forms: w-full (spans the form width)
// — Settings forms: self-start (natural width, left-aligned)
```

### 9g. Submit / loading state — always reflect pending state

```tsx
// WRONG — no feedback during submission
<Button type="submit">Save</Button>

// CORRECT — disabled + label change while submitting
<Button type="submit" disabled={form.formState.isSubmitting}>
  {form.formState.isSubmitting
    ? <><Loader2 data-icon className="animate-spin" /> Saving…</>
    : "Save changes"}
</Button>
```

### 9h. Server-side errors — map to field errors

```tsx
// After a failed server action, set field-level errors
try {
  await serverAction(values);
} catch (err) {
  form.setError("email", { message: "This email is already registered." });
  // or for non-field errors:
  form.setError("root", { message: "Something went wrong. Try again." });
}

// Display root error above the submit button
{form.formState.errors.root && (
  <p className="text-sm font-medium text-destructive">
    {form.formState.errors.root.message}
  </p>
)}
```

---

## 10. Feedback patterns

### 10a. Toast — use Sonner for transient feedback

Add the `<Toaster />` to `app/layout.tsx` once, then call `toast` anywhere.

```tsx
// layout.tsx — add Toaster once
import { Toaster } from "@/components/ui/sonner";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider ...>{children}</ThemeProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
```

```tsx
// Any client component — call toast after actions
import { toast } from "sonner";

toast.success("Profile updated");
toast.error("Failed to save — please try again");
toast.promise(saveAction(), {
  loading: "Saving…",
  success: "Saved successfully",
  error: "Failed to save",
});
```

Rules:

- Use `toast` for **transient results** of user actions (save, delete, copy, send)
- Never use `Alert` for transient results — it stays on screen and clutters the layout
- `richColors` prop makes success green and error red automatically

### 10b. Alert — persistent inline notices

Use `Alert` for notices the user must see and act on (not for action results):

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

// Warning that requires attention (billing, unverified email, etc.)
<Alert variant="destructive">
  <AlertCircle data-icon />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>
    Update your billing details to continue using the service.
  </AlertDescription>
</Alert>

// Informational
<Alert>
  <Info data-icon />
  <AlertTitle>New features available</AlertTitle>
  <AlertDescription>Check out what&apos;s new in this release.</AlertDescription>
</Alert>
```

### 10c. AlertDialog — destructive confirmation only

Never use a `Dialog` for destructive confirmations — always `AlertDialog`:

```tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete account?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. All your data will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Decision guide: **toast** (action result) → **Alert** (persistent inline notice) → **AlertDialog** (destructive confirmation).

---

## 11. Data display

### 11a. Loading skeletons — match the content shape

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// WRONG — generic spinner with no shape context
{loading && <Spinner />}

// CORRECT — skeletons that mirror the loaded content
{loading ? (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
) : (
  <UserCard user={user} />
)}
```

### 11b. Empty states — always provide context and an action

```tsx
// WRONG — blank space, user has no idea what to do
{items.length === 0 && <div className="py-8" />}

// CORRECT — icon + message + action
{items.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Inbox className="size-10 text-muted-foreground/40 mb-4" aria-hidden="true" />
    <p className="text-sm font-medium">No items yet</p>
    <p className="mt-1 text-xs text-muted-foreground">
      Create your first item to get started.
    </p>
    <Button size="sm" className="mt-4">
      <Plus data-icon="inline-start" /> Add item
    </Button>
  </div>
)}
```

### 11c. Tables — always use shadcn Table

Never build raw `<table>` elements. Use the shadcn Table component:

```tsx
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.length === 0 ? (
      <TableRow>
        <TableCell colSpan={3} className="text-center text-muted-foreground py-12">
          No results.
        </TableCell>
      </TableRow>
    ) : rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell className="font-medium">{row.name}</TableCell>
        <TableCell>
          <Badge variant="secondary">{row.status}</Badge>
        </TableCell>
        <TableCell className="text-right">{row.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

- Numeric columns: `text-right` on both `TableHead` and `TableCell`
- Status columns: use `Badge` (never raw colored spans)
- Always include the empty-row fallback inside `TableBody`

### 11d. Breadcrumbs — required on all nested app pages

```tsx
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Place above the page h1
<Breadcrumb className="mb-4">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## 12. Animation

`tw-animate-css` is installed. Use its utilities — do not write custom CSS animations.

### 12a. Enter / exit animations

```tsx
// Content entering the DOM
<div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

// Content leaving (wrap in a conditional with exit tracking)
<div className="animate-out fade-out slide-out-to-top-4 duration-200">

// Modal / overlay entering
<div className="animate-in fade-in zoom-in-95 duration-200">
```

### 12b. Always respect `prefers-reduced-motion`

```tsx
// WRONG — animation plays even when user has requested reduced motion
<div className="animate-in fade-in slide-in-from-bottom-4">

// CORRECT — gated with motion-safe:
<div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-300">
```

### 12c. When to animate vs not

**Animate:**

- Content entering the viewport for the first time
- Modal / dialog / sheet open
- Toast notifications
- Skeleton → content transitions
- Accordion open/close

**Do NOT animate:**

- Hover color changes — use `transition-colors duration-150` only
- Page navigation — Next.js handles this
- Layout reflows from data changes
- Anything that shifts content a user is reading

---

## 13. Typography hierarchy

### 13a. One `<h1>` per page

```tsx
// WRONG — multiple h1s, or h3 used where h2 belongs
<h1>Dashboard</h1>
<h3>Recent activity</h3>  {/* skipped h2 */}
<h1>Settings</h1>         {/* second h1 */}

// CORRECT — strict descending levels
<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
<h2 className="text-lg font-semibold">Recent activity</h2>
<h3 className="text-sm font-semibold">This week</h3>
```

### 13b. Type scale by context

App pages are denser than landing pages — use tighter type:

| Context                    | Classes                                        |
|----------------------------|------------------------------------------------|
| App page title (`h1`)      | `text-2xl font-bold tracking-tight`            |
| Section heading (`h2`)     | `text-lg font-semibold`                        |
| Card / sub-section (`h3`)  | `text-sm font-semibold`                        |
| Body text                  | `text-sm` (app pages) / `text-base` (landing)  |
| Supporting / muted         | `text-sm text-muted-foreground`                |
| Caption / metadata         | `text-xs text-muted-foreground`                |
| Code inline                | `font-mono text-sm`                            |

### 13c. Landing vs app page body text

```tsx
// Landing page — larger, more breathing room
<p className="text-base text-muted-foreground leading-relaxed">

// App page — denser, information-focused
<p className="text-sm text-muted-foreground">
```

---

```text
src/
  app/
    layout.tsx              — RootLayout: skip-nav, ThemeProvider, Toaster, metadata + viewport exports
    page.tsx                — marketing home — <main id="main-content">, no logic
    error.tsx               — "use client" global error boundary
    loading.tsx             — global Suspense fallback (Skeleton shapes)
    not-found.tsx           — custom 404 page
    sitemap.ts              — dynamic sitemap for search engines
    (auth)/
      layout.tsx            — <main id="main-content"> centered shell + logo link
      sign-in/page.tsx      — Server Component, exports metadata, renders SignInForm
      sign-up/page.tsx      — Server Component, exports metadata, renders SignUpForm
    (app)/
      layout.tsx            — app shell (sidebar + SidebarInset)
      dashboard/page.tsx    — post-login pages, use app page container (see rule 8a)
  components/
    auth/
      sign-in-form.tsx      — "use client" — form logic for sign-in
      sign-up-form.tsx      — "use client" — form logic for sign-up
    navbar.tsx              — "use client" — sticky header, NavigationMenu, Sheet mobile menu
    hero.tsx                — Server Component — centered hero + side decorations
    features.tsx            — Server Component — 3-col feature card grid
    content-sections.tsx    — Server Component — CodeShowcase, TechStack, Infrastructure
    footer.tsx              — Server Component — 5-col footer, brand-colored social icons
    theme-provider.tsx      — next-themes wrapper (Client internally, Server-compatible)
    ui/                     — shadcn primitives (do not edit manually)
      form.tsx              — Form + FormField + FormItem + FormLabel + FormControl + FormMessage
      password-input.tsx    — Input + show/hide toggle (use for all password fields)
      input.tsx / textarea.tsx / select.tsx / label.tsx
      sonner.tsx            — Toaster wrapper
      alert.tsx / alert-dialog.tsx
      skeleton.tsx
      table.tsx
      breadcrumb.tsx
  config/
    site.ts / navigation.ts / features.ts / content.ts / index.ts
  lib/
    utils.ts                — cn() utility
public/
  robots.txt               — crawler rules + sitemap pointer
```

---

## 9. Commands

```bash
npm run dev          # start dev server — http://localhost:3000
npm run build        # production build (must pass before any PR)
npm run lint         # ESLint
npx tsc --noEmit     # type check (must be zero errors)
npx shadcn@latest add <component>   # add new shadcn components
```
