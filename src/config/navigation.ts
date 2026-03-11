/**
 * NAVIGATION CONFIG
 * ─────────────────────────────────────────────
 * Controls every link in the navbar and footer.
 * Add, remove, or rename items here — the UI updates automatically.
 */

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  href?: string;
  /** If children are provided, renders as a dropdown instead of a plain link */
  children?: NavItem[];
};

/** Main navbar links (left-center area) */
export const mainNav: NavGroup[] = [
  {
    title: "Features",
    children: [
      {
        title: "Authentication",
        href: "#features",
        description: "Email, social, passkeys, and 2FA out of the box.",
      },
      {
        title: "Organizations",
        href: "#features",
        description: "Multi-tenant teams with roles and permissions.",
      },
      {
        title: "Session Management",
        href: "#infrastructure",
        description: "Secure, scalable session handling.",
      },
      {
        title: "API Access",
        href: "#infrastructure",
        description: "Bearer tokens and machine-to-machine auth.",
      },
    ],
  },
  {
    title: "Docs",
    href: "/docs",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "Resources",
    children: [
      { title: "Blog", href: "/blog" },
      { title: "Changelog", href: "/changelog" },
      { title: "Community", href: "/community" },
      { title: "GitHub", href: "https://github.com/your-org/your-repo" },
    ],
  },
];

/** CTA buttons in the navbar (right side) */
export const navCta = {
  signIn: { label: "Sign in", href: "/sign-in" },
  primary: { label: "Get Started", href: "/sign-up" },
};

/** Mobile drawer — flat list of all pages */
export const mobileNav: NavItem[] = [
  { title: "Features", href: "#features" },
  { title: "Docs", href: "/docs" },
  { title: "Pricing", href: "#pricing" },
  { title: "Blog", href: "/blog" },
  { title: "Changelog", href: "/changelog" },
  { title: "Community", href: "/community" },
];

/** ─────────────────────────────────────────────
 *  FOOTER LINKS
 *  Each key becomes a column header.
 */
export const footerNav: Record<string, NavItem[]> = {
  Product: [
    { title: "Features", href: "#features" },
    { title: "Pricing", href: "#pricing" },
    { title: "Changelog", href: "/changelog" },
    { title: "Roadmap", href: "/roadmap" },
  ],
  Developers: [
    { title: "Documentation", href: "/docs" },
    { title: "API Reference", href: "/docs/api" },
    { title: "GitHub", href: "https://github.com/your-org/your-repo" },
    { title: "Status", href: "/status" },
  ],
  Company: [
    { title: "About", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Careers", href: "/careers" },
    { title: "Contact", href: "/contact" },
  ],
  Legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Security", href: "/security" },
    { title: "Cookie Policy", href: "/cookies" },
  ],
};

/** Footer bottom bar quick links */
export const footerLegal: NavItem[] = [
  { title: "Privacy", href: "/privacy" },
  { title: "Terms", href: "/terms" },
  { title: "Cookies", href: "/cookies" },
];
