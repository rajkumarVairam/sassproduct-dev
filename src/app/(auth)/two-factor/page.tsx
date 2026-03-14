import type { Metadata } from "next";
import { TwoFactorForm } from "@/components/auth/two-factor-form";

export const metadata: Metadata = {
  title: "Two-factor verification",
  description: "Enter your two-factor authentication code to continue.",
};

export default function TwoFactorPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Verify your identity</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter the code from your authenticator app to continue
        </p>
      </div>

      <TwoFactorForm />
    </div>
  );
}
