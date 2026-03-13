"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { siteConfig, mainNav, navCta, mobileNav } from "@/config";

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
// CORRECT pattern: no mounted state, no useEffect re-render, no flash.
// Both icons are always in the DOM — CSS dark: variants control visibility.
// next-themes injects an inline script that sets the class on <html> before
// React hydrates, so the CSS works immediately with zero client-side lag.
// We only use setTheme (never render theme value), so there is no hydration mismatch.
function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {/* CSS handles which icon is visible — no JS state required */}
      <Sun data-icon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon data-icon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
  // Controlled Sheet state so we can close it programmatically.
  const [sheetOpen, setSheetOpen] = React.useState(false);
  // Ref so we can restore focus to the hamburger button when the sheet closes.
  const hamburgerRef = React.useRef<HTMLButtonElement>(null);

  // Close the mobile Sheet when the viewport reaches the desktop breakpoint.
  // Without this, resizing from mobile to desktop leaves the Sheet open as a
  // floating overlay on top of the desktop layout.
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setSheetOpen(false);
    };
    mq.addEventListener("change", handleBreakpoint);
    return () => mq.removeEventListener("change", handleBreakpoint);
  }, []);

  return (
    // pt-safe: pushes navbar content below iPhone notch (viewport-fit=cover required).
    // px-safe: prevents content hiding behind side cutouts in landscape mode.
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 pt-safe px-safe">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-black">
            {siteConfig.logoLetter}
          </span>
          <span className="hidden sm:inline-block">{siteConfig.displayName}</span>
        </Link>

        {/* Desktop NavigationMenu — must be a direct flex child, not wrapped.
            NavigationMenu uses an absolutely-positioned viewport for dropdowns;
            wrapping it breaks that positioning. */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {mainNav.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {/* grid-cols-2 not md:grid-cols-2 — breakpoints are viewport-width,
                        not container-width. The popup is a fixed width regardless. */}
                    <ul className="grid w-[440px] grid-cols-2 gap-1.5 p-3">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="flex flex-col gap-1 select-none rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <span className="text-sm font-medium leading-none">{child.title}</span>
                              {child.description && (
                                <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href ?? "#"} className={navigationMenuTriggerStyle()}>
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href={navCta.signIn.href}
            className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors md:block"
          >
            {navCta.signIn.label}
          </Link>
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href={navCta.primary.href}>{navCta.primary.label}</Link>
          </Button>

          {/* Mobile Sheet — controlled open state so it closes on viewport resize */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                ref={hamburgerRef}
                variant="ghost"
                size="icon"
                className="size-8 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu data-icon />
              </Button>
            </SheetTrigger>
            {/* w-[min(18rem,90vw)] caps at 18rem but never exceeds 90% of viewport —
                prevents overflow on 320px phones while staying full on normal devices */}
            <SheetContent
              side="right"
              className="w-[min(18rem,90vw)]"
              onCloseAutoFocus={(e) => {
                // Return focus to the hamburger button so keyboard users aren't lost
                e.preventDefault();
                hamburgerRef.current?.focus();
              }}
            >
              <SheetHeader>
                <SheetTitle className="text-left font-bold">{siteConfig.displayName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {mobileNav.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => setSheetOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                <Separator className="my-3" />
                {/* Stacked full-width CTAs — px-3 aligns with nav link indent.
                    outline = secondary (Sign in), solid = primary (Get Started). */}
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={navCta.signIn.href} onClick={() => setSheetOpen(false)}>
                      {navCta.signIn.label}
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={navCta.primary.href} onClick={() => setSheetOpen(false)}>
                      {navCta.primary.label}
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
