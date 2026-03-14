import type { Metadata } from "next";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Check your inbox to verify your email address.",
};

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <MailIcon className="size-7 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We sent a verification link to your email address. Click it to activate your account.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Can&apos;t find it? Check your spam folder.
        </p>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up again
          </Link>
        </p>
      </div>
    </div>
  );
}
