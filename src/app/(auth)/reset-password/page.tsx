import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a strong new password for your account
        </p>
      </div>
      <Card>
        <CardHeader className="sr-only">
          <CardDescription>Reset password form</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Suspense required — ResetPasswordForm uses useSearchParams */}
          <Suspense fallback={<p className="text-sm text-muted-foreground text-center">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link
          href="/sign-in"
          className="text-foreground underline-offset-4 hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
