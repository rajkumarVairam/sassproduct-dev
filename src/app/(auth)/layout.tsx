import Link from "next/link";
import { siteConfig } from "@/config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 pb-safe"
    >
      {/* Logo */}
      <Link
        href="/"
        className="mb-10 flex flex-col items-center gap-3 group"
        aria-label={`${siteConfig.name} home`}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-base font-bold shadow-sm group-hover:opacity-90 transition-opacity">
          {siteConfig.logoLetter}
        </span>
        <span className="text-sm font-semibold text-foreground">{siteConfig.name}</span>
      </Link>

      {children}

      {/* Footer links */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground underline-offset-4 hover:underline transition-colors">
          Terms of Service
        </Link>
        {" · "}
        <Link href="/privacy" className="hover:text-foreground underline-offset-4 hover:underline transition-colors">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/security" className="hover:text-foreground underline-offset-4 hover:underline transition-colors">
          Security
        </Link>
      </p>
    </main>
  );
}
