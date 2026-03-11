import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SiGithub, SiX, SiYoutube, SiFacebook, SiGoogle } from "react-icons/si";
import { cn } from "@/lib/utils";
import { siteConfig, footerNav, footerLegal } from "@/config";

// ─── Social icon registry ─────────────────────────────────────────────────────
// color: null  → uses text-foreground (semantic — auto-inverts in dark mode)
// color: string → actual brand color, readable on both light and dark backgrounds
//                 (YouTube red, Facebook blue, Google blue all have sufficient
//                  contrast on both bg-background variants)
// Exception to rule 3d: brand identity colors on decorative icons are not
// semantic UI states — they're fixed brand marks.
const SOCIAL_ICON_MAP: Record<
  string,
  { Icon: React.ComponentType<{ className?: string }>; label: string; color: string | null }
> = {
  github:   { Icon: SiGithub,   label: "GitHub",   color: null },
  twitter:  { Icon: SiX,        label: "X",        color: null },
  youtube:  { Icon: SiYoutube,  label: "YouTube",  color: "#FF0000" },
  facebook: { Icon: SiFacebook, label: "Facebook", color: "#1877F2" },
  google:   { Icon: SiGoogle,   label: "Google",   color: "#4285F4" },
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">

        {/* Top grid
            Mobile (default): 2-col — brand spans full row, link cols in pairs
            lg+: 5-col — brand takes 1 col, 4 link columns each take 1 col

            Removed sm:grid-cols-3 / sm:col-span-3: that pattern caused 4 link
            columns to overflow into 3 columns in an uneven grid on sm screens. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5">

          {/* Brand — full width on mobile, 1 col on lg */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight">
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-black">
                {siteConfig.logoLetter}
              </span>
              <span>{siteConfig.displayName}</span>
            </Link>
            <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>

            {/* Social icons — config-driven, brand-colored */}
            <div className="mt-4 flex items-center gap-3">
              {siteConfig.socialLinks.map(({ platform, href }) => {
                const def = SOCIAL_ICON_MAP[platform];
                if (!def) return null;
                const { Icon, label, color } = def;

                return (
                  <Link
                    key={platform}
                    href={href}
                    aria-label={label}
                    className={cn(
                      "transition-opacity",
                      // Colored brands: always show brand color, fade to 60% at rest
                      color
                        ? "opacity-60 hover:opacity-100"
                        // Monochrome brands (GitHub, X): semantic foreground color
                        : "text-foreground/50 hover:text-foreground"
                    )}
                    style={color ? { color } : undefined}
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link columns — gap-* not space-y-* */}
          {Object.entries(footerNav).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 opacity-40" />

        {/* Bottom bar — stacks on mobile, row on sm+ */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">{siteConfig.copyright}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {footerLegal.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
