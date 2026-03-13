import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account to continue.",
};

export default function SignInPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>
      <Card>
        <CardHeader className="sr-only">
          <CardDescription>Sign in form</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SignInForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-foreground underline-offset-4 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
