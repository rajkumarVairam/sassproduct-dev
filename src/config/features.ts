/**
 * FEATURES CONFIG
 * ─────────────────────────────────────────────
 * Controls the feature cards grid on the landing page.
 * Each item maps to one card. Add, remove, or reorder freely.
 *
 * `icon` must be a valid lucide-react icon name string.
 * The component resolves it dynamically — no code changes needed.
 */

export type FeatureItem = {
  /** Display index (e.g. "01") — auto-generated, you don't need to set this */
  title: string;
  description: string;
  /** lucide-react icon name, e.g. "Globe", "ShieldCheck", "Key" */
  icon: string;
};

export const featuresSection = {
  eyebrow: "Everything you need",
  heading: "Authentication, fully covered",
  subheading:
    "From basic email auth to enterprise SSO — every auth pattern you'll ever need, ready to use.",
} as const;

export const featureItems: FeatureItem[] = [
  {
    title: "Framework Agnostic",
    description:
      "Works with Next.js, Nuxt, SvelteKit, Astro, Express, and any Node.js framework.",
    icon: "Globe",
  },
  {
    title: "Email & Password",
    description:
      "Secure sign-up and login with email verification and password reset built in.",
    icon: "Mail",
  },
  {
    title: "Social Sign-on",
    description:
      "One-click OAuth with Google, GitHub, Apple, Microsoft, Discord, and more.",
    icon: "Users",
  },
  {
    title: "Organizations",
    description:
      "Multi-tenant teams with custom roles, permissions, and member management.",
    icon: "Building2",
  },
  {
    title: "Passkeys",
    description:
      "Passwordless WebAuthn authentication with biometric support across devices.",
    icon: "Key",
  },
  {
    title: "Two-Factor Auth",
    description:
      "TOTP-based 2FA with authenticator app support and backup codes.",
    icon: "Smartphone",
  },
  {
    title: "Session Management",
    description:
      "Secure, revocable sessions with device tracking and anomaly detection.",
    icon: "ShieldCheck",
  },
  {
    title: "Any Database",
    description:
      "Supports PostgreSQL, MySQL, SQLite, MongoDB via Prisma, Drizzle, or native drivers.",
    icon: "Database",
  },
  {
    title: "Plugin System",
    description:
      "Extend with community plugins or build your own to fit any use case.",
    icon: "Plug",
  },
];
