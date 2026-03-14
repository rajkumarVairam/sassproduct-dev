import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose a strong new password for your account
        </p>
      </div>

      {/* Suspense required — ResetPasswordForm uses useSearchParams */}
      <Suspense fallback={<p className="text-sm text-muted-foreground text-center">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
