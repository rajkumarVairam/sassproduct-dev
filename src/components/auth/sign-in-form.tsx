"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2Icon, KeyRoundIcon } from "lucide-react";
import { SiGithub, SiGoogle } from "react-icons/si";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    await authClient.signIn.email(
      { email: values.email, password: values.password },
      {
        onSuccess() {
          router.push("/dashboard");
          router.refresh();
        },
        onError(ctx) {
          if (ctx.error.status === 403) {
            toast.error("Please verify your email before signing in.");
            return;
          }
          form.setError("root", {
            message: ctx.error.message ?? "Invalid email or password.",
          });
        },
      }
    );
  }

  async function signInWithProvider(provider: "github" | "google") {
    await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Social providers */}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signInWithProvider("github")}
        >
          {/* Brand color: monochrome — matches foreground in both themes */}
          <SiGithub className="size-4" aria-hidden="true" />
          Continue with GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signInWithProvider("google")}
        >
          {/* Brand color: Google blue — intentional raw color */}
          <SiGoogle className="size-4" style={{ color: "#4285F4" }} aria-hidden="true" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={async () => {
            const { error } = await authClient.signIn.passkey();
            if (error) toast.error(error.message ?? "Passkey sign-in failed.");
            else router.push("/dashboard");
          }}
        >
          <KeyRoundIcon className="size-4" aria-hidden="true" />
          Continue with passkey
        </Button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground shrink-0">or continue with email</span>
        <Separator className="flex-1" />
      </div>

      {/* Email + password form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button type="submit" className="w-full mt-1" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2Icon className="animate-spin" data-icon />}
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
