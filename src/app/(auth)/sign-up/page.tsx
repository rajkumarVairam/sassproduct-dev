import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free account to get started.",
};

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your details to get started for free
        </p>
      </div>
      <Card>
        <CardHeader className="sr-only">
          <CardDescription>Sign up form</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SignUpForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
