import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsProfileForm } from "@/components/app/settings-profile-form";
import { SecuritySettings } from "@/components/app/settings-security";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account preferences and security.",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium">Settings</span>
      </header>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account preferences and security.
            </p>
          </div>

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your public profile information.
                  </p>
                </div>
                <Separator />
                <div className="max-w-md">
                  <SettingsProfileForm name={session.user.name ?? ""} />
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Email: </span>
                    {session.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email changes are not currently supported. Contact support to update your email.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold">Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account security, two-factor authentication, and passkeys.
                  </p>
                </div>
                <Separator />
                <SecuritySettings twoFactorEnabled={session.user.twoFactorEnabled ?? false} />
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold">Billing</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your subscription and billing details.
                  </p>
                </div>
                <Separator />
                <BillingSection />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function BillingSection() {
  const stripeEnabled =
    !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeEnabled) {
    return (
      <p className="text-sm text-muted-foreground">
        Billing is not configured. Set <code className="font-mono text-sm">STRIPE_SECRET_KEY</code> and{" "}
        <code className="font-mono text-sm">STRIPE_WEBHOOK_SECRET</code> to enable subscriptions.
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Subscription management coming soon. Configure your Stripe price IDs in{" "}
      <code className="font-mono text-sm">src/lib/auth.ts</code>.
    </p>
  );
}
