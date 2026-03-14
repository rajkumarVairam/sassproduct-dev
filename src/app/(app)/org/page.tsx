import type { Metadata } from "next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { OrgManager } from "@/components/app/org-manager";

export const metadata: Metadata = {
  title: "Organization",
  description: "Manage your organization and team members.",
};

export default function OrgPage() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium">Organization</span>
      </header>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Organization</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your organization and invite team members.
            </p>
          </div>
          <OrgManager />
        </div>
      </div>
    </>
  );
}
