"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const codeSchema = z.object({
  code: z.string().min(6, "Code must be 6 digits").max(8),
});
type CodeValues = z.infer<typeof codeSchema>;

export function TwoFactorForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"totp" | "otp" | "backup">("totp");

  const form = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: CodeValues) {
    let result;

    if (mode === "totp") {
      result = await authClient.twoFactor.verifyTotp({
        code: values.code,
        trustDevice: true,
      });
    } else if (mode === "otp") {
      result = await authClient.twoFactor.verifyOtp({
        code: values.code,
      });
    } else {
      result = await authClient.twoFactor.verifyBackupCode({
        code: values.code,
      });
    }

    if (result?.error) {
      form.setError("code", {
        message: result.error.message ?? "Invalid code. Please try again.",
      });
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/dashboard");
    router.refresh();
  }

  async function sendOtp() {
    const { error } = await authClient.twoFactor.sendOtp();
    if (error) {
      toast.error(error.message ?? "Failed to send OTP. Please try again.");
    } else {
      toast.success("OTP sent to your email.");
      setMode("otp");
      form.reset();
    }
  }

  const labels: Record<typeof mode, { label: string; placeholder: string; hint: string }> = {
    totp: {
      label: "Authenticator code",
      placeholder: "000000",
      hint: "Enter the 6-digit code from your authenticator app.",
    },
    otp: {
      label: "Email OTP",
      placeholder: "000000",
      hint: "Enter the 6-digit code sent to your email.",
    },
    backup: {
      label: "Backup code",
      placeholder: "xxxxxxxx",
      hint: "Enter one of your saved backup codes.",
    },
  };

  const current = labels[mode];

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{current.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={current.placeholder}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">{current.hint}</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2Icon className="animate-spin" data-icon />}
            Verify
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-2">
        {mode !== "otp" && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={sendOtp}
          >
            Send code to email instead
          </Button>
        )}
        {mode !== "totp" && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => { setMode("totp"); form.reset(); }}
          >
            Use authenticator app
          </Button>
        )}
        {mode !== "backup" && (
          <Button
            type="button"
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => { setMode("backup"); form.reset(); }}
          >
            Use a backup code
          </Button>
        )}
      </div>
    </div>
  );
}
