import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { codeShowcaseContent, techStackContent, infrastructureContent } from "@/config";

function CodeBlock() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-zinc-950 shadow-xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-white/30 font-mono">{codeShowcaseContent.filename}</span>
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-6 text-zinc-300 font-mono">
        <code>{codeShowcaseContent.code}</code>
      </pre>
    </div>
  );
}

export function CodeShowcase() {
  return (
    <section className="py-20 sm:py-28" id="code-showcase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {codeShowcaseContent.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {codeShowcaseContent.heading}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {codeShowcaseContent.subheading}
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {codeShowcaseContent.bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="shrink-0 text-green-500" data-icon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <CodeBlock />
        </div>
      </div>
    </section>
  );
}

export function TechStack() {
  return (
    <section className="py-16 sm:py-20 border-y border-border/40 bg-muted/20" id="tech-stack">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {techStackContent.heading}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{techStackContent.subheading}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Databases
            </p>
            <ul className="flex flex-col gap-2">
              {techStackContent.databases.map((db) => (
                <li key={db} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
                  {db}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              ORMs & Drivers
            </p>
            <ul className="flex flex-col gap-2">
              {techStackContent.orms.map((orm) => (
                <li key={orm} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
                  {orm}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              OAuth Providers
            </p>
            <div className="flex flex-wrap gap-2">
              {techStackContent.oauthProviders.map((p) => (
                <Badge key={p} variant="secondary" className="text-xs font-normal">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Infrastructure() {
  const activeCount = infrastructureContent.dashboardMockUsers.filter((u) => u.status === "Active").length;
  const pendingCount = infrastructureContent.dashboardMockUsers.length - activeCount;

  return (
    <section className="py-20 sm:py-28" id="infrastructure">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl">
              <div className="border-b border-border/40 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{infrastructureContent.dashboardTitle}</span>
                  <Badge variant="secondary" className="text-xs">Admin</Badge>
                </div>
              </div>
              <div className="divide-y divide-border/40">
                {infrastructureContent.dashboardMockUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          user.status === "Active"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/40 bg-muted/30 px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {infrastructureContent.dashboardMockUsers.length} members
                  </span>
                  <div className="flex gap-4">
                    <span className="text-xs text-muted-foreground">{activeCount} active</span>
                    <Separator orientation="vertical" className="h-3 my-auto" />
                    <span className="text-xs text-muted-foreground">{pendingCount} pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {infrastructureContent.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {infrastructureContent.heading}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {infrastructureContent.subheading}
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {infrastructureContent.bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="shrink-0 text-green-500" data-icon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
