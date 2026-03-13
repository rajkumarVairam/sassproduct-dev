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
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12"
    >
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
          {siteConfig.logoLetter}
        </span>
        {siteConfig.name}
      </Link>
      {children}
    </main>
  );
}
