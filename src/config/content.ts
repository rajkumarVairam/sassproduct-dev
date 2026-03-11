/**
 * CONTENT CONFIG
 * ─────────────────────────────────────────────
 * All marketing copy, code snippets, and data lists
 * used in the landing page sections.
 *
 * Change text here — no need to touch component files.
 */

// ─── Hero ────────────────────────────────────────────────────────────────────

export const heroContent = {
  badge: "Now in General Availability",
  /** The first word(s) of the headline, rendered plain */
  headlinePrefix: "Own Your",
  /** The accented word at the end of the headline */
  headlineAccent: "Auth",
  subheading:
    "A comprehensive, open-source authentication framework built for modern applications. Ship secure auth in minutes — not weeks.",
  cta: {
    primary: { label: "Get Started", href: "/sign-up" },
    secondary: { label: "Sign In", href: "/sign-in" },
  },
  socialProof: [
    "SOC 2 compliant",
    "No vendor lock-in",
    "Open source",
    "Self-hostable",
  ],
} as const;

// ─── Code Showcase ───────────────────────────────────────────────────────────

export const codeShowcaseContent = {
  eyebrow: "Simple by design",
  heading: "From zero to auth in minutes",
  subheading:
    "One config file. Full-stack type safety. No boilerplate. Drop in your database, pick your providers, and you're done.",
  bullets: [
    "Auto-generated type-safe client",
    "Schema migrations handled automatically",
    "Works in serverless and edge environments",
    "Full TypeScript support end-to-end",
  ],
  /** The code snippet shown in the code block */
  filename: "lib/auth.ts",
  code: `import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { twoFactor, organization } from "better-auth/plugins"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [twoFactor(), organization()],
})`,
} as const;

// ─── Tech Stack ───────────────────────────────────────────────────────────────

export const techStackContent = {
  heading: "Works with your stack",
  subheading:
    "Connect to any database, ORM, or OAuth provider you already use.",
  databases: ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
  orms: ["Prisma", "Drizzle ORM", "Mongoose", "Native drivers"],
  oauthProviders: [
    "Google",
    "GitHub",
    "Apple",
    "Microsoft",
    "Discord",
    "Twitter / X",
    "Spotify",
    "Twitch",
  ],
} as const;

// ─── Infrastructure / Security section ────────────────────────────────────────

export const infrastructureContent = {
  eyebrow: "Security first",
  heading: "Enterprise-grade security, out of the box",
  subheading:
    "Built for production from day one. Every auth event is logged, every session is trackable, and every vulnerability vector is covered.",
  bullets: [
    "Automatic session rotation & expiry",
    "Device-aware session tracking",
    "Rate limiting & brute-force protection",
    "Audit logs for every auth event",
    "GDPR-ready user data export",
    "Webhook support for auth lifecycle events",
  ],
  /** Rows shown in the dashboard mock inside this section */
  dashboardMockUsers: [
    { name: "Alex Johnson", email: "alex@example.com", status: "Active", role: "Owner" },
    { name: "Sam Rivera", email: "sam@example.com", status: "Active", role: "Member" },
    { name: "Taylor Kim", email: "taylor@example.com", status: "Invited", role: "Member" },
    { name: "Jordan Lee", email: "jordan@example.com", status: "Active", role: "Admin" },
  ],
  dashboardTitle: "User Management",
} as const;
