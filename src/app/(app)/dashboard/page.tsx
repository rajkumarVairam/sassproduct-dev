import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your application dashboard.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium">Dashboard</span>
      </header>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Account</CardTitle>
              <CardDescription>Your account status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-xs text-muted-foreground mt-1">{session?.user.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <CardDescription>Current subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Free</p>
              <p className="text-xs text-muted-foreground mt-1">Upgrade to unlock all features</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Security</CardTitle>
              <CardDescription>Account security status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Basic</p>
              <p className="text-xs text-muted-foreground mt-1">Enable 2FA for stronger security</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
