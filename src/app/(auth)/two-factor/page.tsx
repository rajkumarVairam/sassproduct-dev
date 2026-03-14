import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { TwoFactorForm } from "@/components/auth/two-factor-form";

export const metadata: Metadata = {
  title: "Two-factor verification",
  description: "Enter your two-factor authentication code to continue.",
};

export default function TwoFactorPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Two-factor verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your verification code to complete sign-in
        </p>
      </div>
      <Card>
        <CardHeader className="sr-only">
          <CardDescription>Two-factor verification form</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <TwoFactorForm />
        </CardContent>
      </Card>
    </div>
  );
}
