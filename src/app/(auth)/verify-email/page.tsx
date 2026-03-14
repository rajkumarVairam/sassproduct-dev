import type { Metadata } from "next";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Check your inbox to verify your email address.",
};

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent you a verification link
        </p>
      </div>
      <Card>
        <CardHeader className="sr-only">
          <CardDescription>Email verification instructions</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <MailIcon className="size-7 text-primary" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Verification email sent</p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to verify your account. If you don&apos;t see
              it, check your spam folder.
            </p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link
          href="/sign-up"
          className="text-foreground underline-offset-4 hover:underline font-medium"
        >
          Sign up again
        </Link>
      </p>
    </div>
  );
}
