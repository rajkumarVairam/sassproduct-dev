import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { featureItems, featuresSection } from "@/config";

export function Features() {
  return (
    <section className="py-20 sm:py-28" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            {featuresSection.eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {featuresSection.heading}
          </h2>
          <p className="mt-4 text-muted-foreground">{featuresSection.subheading}</p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureItems.map((feature, i) => {
            // Resolve icon dynamically from lucide-react by string name
            const Icon =
              (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[
                feature.icon
              ] ?? LucideIcons.Box;

            const index = String(i + 1).padStart(2, "0");

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border/60 bg-card/50 transition-all hover:border-border hover:shadow-md hover:-translate-y-0.5"
              >
                <CardHeader className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background shadow-sm">
                      <Icon className="size-4 text-foreground" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/50 select-none">
                      {index}
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-sm font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
