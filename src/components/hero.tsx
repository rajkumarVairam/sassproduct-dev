import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroContent } from "@/config";

function LeftDecoration() {
  return (
    <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 select-none xl:block">
      <div className="relative h-72 w-40 opacity-60 dark:opacity-40">
        <div className="absolute right-0 top-6 h-24 w-36 rounded-xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground font-mono">auth.ts</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-20 rounded bg-muted-foreground/30" />
            <div className="h-1.5 w-14 rounded bg-primary/40" />
            <div className="h-1.5 w-24 rounded bg-muted-foreground/20" />
          </div>
        </div>
        <div className="absolute right-4 top-36 h-20 w-32 rounded-xl border border-border/40 bg-card/60 shadow-md backdrop-blur-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-3 w-3 text-green-500" />
            <span className="text-xs text-muted-foreground">Secured</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-16 rounded bg-muted-foreground/30" />
            <div className="h-1.5 w-12 rounded bg-muted-foreground/20" />
          </div>
        </div>
        <div className="absolute right-8 bottom-4 h-16 w-28 rounded-xl border border-border/30 bg-card/40 shadow-sm backdrop-blur-sm p-2.5">
          <div className="h-1.5 w-16 rounded bg-muted-foreground/25 mb-1.5" />
          <div className="h-1.5 w-10 rounded bg-primary/30" />
        </div>
      </div>
    </div>
  );
}

function RightDecoration() {
  return (
    <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 select-none xl:block">
      <div className="relative h-72 w-40 opacity-60 dark:opacity-40">
        <div className="absolute left-0 top-4 h-24 w-36 rounded-xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Performance</span>
          </div>
          <div className="text-lg font-bold text-foreground">99.9%</div>
          <div className="text-xs text-muted-foreground">Uptime SLA</div>
        </div>
        <div className="absolute left-4 top-36 h-20 w-32 rounded-xl border border-border/40 bg-card/60 shadow-md backdrop-blur-sm p-3">
          <div className="text-xs text-muted-foreground mb-1">Active users</div>
          <div className="text-sm font-semibold text-foreground">12,540</div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-primary/60" />
          </div>
        </div>
        <div className="absolute left-8 bottom-4 h-16 w-28 rounded-xl border border-border/30 bg-card/40 shadow-sm backdrop-blur-sm p-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">OAuth 2.0</span>
          </div>
          <div className="mt-1 h-1.5 w-14 rounded bg-muted-foreground/25" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="hero">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='currentColor' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      </div>

      <LeftDecoration />
      <RightDecoration />

      {/* Center content */}
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          {heroContent.badge}
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {heroContent.headlinePrefix}{" "}
          <span className="relative inline-block">
            {heroContent.headlineAccent}
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-foreground/20" />
          </span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
          {heroContent.subheading}
        </p>

        {/* w-full on mobile so buttons fill the screen width for easy tapping.
            sm:w-auto reverts to content-width on larger screens. */}
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href={heroContent.cta.primary.href}>
              {heroContent.cta.primary.label}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={heroContent.cta.secondary.href}>
              {heroContent.cta.secondary.label}
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
          {heroContent.socialProof.map((item, i) => (
            <React.Fragment key={item}>
              {i === 0 ? (
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> {item}
                </span>
              ) : (
                <>
                  <span className="h-3 w-px bg-border hidden sm:block" />
                  <span>{item}</span>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
