/**
 * SITE CONFIG
 * ─────────────────────────────────────────────
 * Edit this file to rebrand the app.
 * Everything — name, tagline, URLs, social links —
 * flows from here into every component automatically.
 */

export const siteConfig = {
  /** Short name shown in the navbar logo and browser tab */
  name: "SaaSproduct.dev",

  /** Single letter used in the icon badge */
  logoLetter: "S",

  /** Full display name with punctuation (used in footer, page titles, etc.) */
  displayName: "SaaSproduct.dev",

  /** Browser <title> suffix */
  tagline: "Own Your Auth",

  /** Meta description */
  description:
    "A comprehensive, open-source authentication framework built for modern applications. Ship secure auth in minutes — not weeks.",

  /** Canonical URL of the deployed app */
  url: "https://saasproduct.dev",

  /** Social / external links */
  links: {
    github: "https://github.com/your-org/your-repo",
    twitter: "https://twitter.com/yourhandle",
    docs: "/docs",
    changelog: "/changelog",
  },

  /**
   * Footer social icons — order controls render order.
   * platform must match one of the keys in SOCIAL_ICON_MAP in footer.tsx.
   * Add/remove/reorder freely.
   */
  socialLinks: [
    { platform: "github",   href: "https://github.com/your-org/your-repo" },
    { platform: "twitter",  href: "https://twitter.com/yourhandle" },
    { platform: "youtube",  href: "https://youtube.com/@yourhandle" },
    { platform: "facebook", href: "https://facebook.com/yourpage" },
    { platform: "google",   href: "https://g.dev/yourprofile" },
  ] as { platform: string; href: string }[],

  /** Copyright line in the footer */
  copyright: `© ${new Date().getFullYear()} SAASPRODUCT.DEV . All rights reserved.`,
} as const;

export type SiteConfig = typeof siteConfig;
