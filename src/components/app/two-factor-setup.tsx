"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2Icon, CopyIcon, CheckIcon } from "lucide-react";
import QRCode from "react-qr-code";
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
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

// Step 1 — confirm identity with password to get the TOTP URI
const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

// Step 2 — verify the TOTP code from the authenticator app
const codeSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
});
type CodeValues = z.infer<typeof codeSchema>;

type Step = "password" | "scan" | "backup";

export function TwoFactorSetup({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>("password");
  const [totpUri, setTotpUri] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function onPasswordSubmit(values: PasswordValues) {
    const { data, error } = await authClient.twoFactor.getTotpUri({
      password: values.password,
    });

    if (error) {
      passwordForm.setError("password", {
        message: error.message ?? "Incorrect password. Please try again.",
      });
      return;
    }

    if (data?.totpURI) {
      setTotpUri(data.totpURI);
      setPassword(values.password);
      setStep("scan");
    }
  }

  async function onCodeSubmit(values: CodeValues) {
    const { data, error } = await authClient.twoFactor.enable({
      password,
    });

    if (error) {
      codeForm.setError("code", {
        message: error.message ?? "Failed to enable 2FA. Please try again.",
      });
      return;
    }

    // Verify the TOTP code to confirm setup
    const verifyResult = await authClient.twoFactor.verifyTotp({
      code: values.code,
    });

    if (verifyResult?.error) {
      codeForm.setError("code", {
        message: verifyResult.error.message ?? "Invalid code. Please try again.",
      });
      return;
    }

    const codes = (data as { backupCodes?: string[] })?.backupCodes ?? [];
    if (codes.length > 0) {
      setBackupCodes(codes);
      setStep("backup");
    } else {
      toast.success("Two-factor authentication enabled.");
      onDone();
    }
  }

  async function copyBackupCodes() {
    await navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === "backup") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium">Save your backup codes</p>
          <p className="text-xs text-muted-foreground mt-1">
            Store these in a safe place. Each code can only be used once to sign in if you lose
            access to your authenticator app.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/50 p-4 font-mono text-sm">
          {backupCodes.map((code) => (
            <span key={code}>{code}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyBackupCodes} className="self-start">
            {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
            {copied ? "Copied!" : "Copy codes"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast.success("Two-factor authentication enabled.");
              onDone();
            }}
          >
            I&apos;ve saved them
          </Button>
        </div>
      </div>
    );
  }

  if (step === "scan") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium">Scan the QR code</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use an authenticator app (Google Authenticator, Authy, 1Password) to scan this code.
          </p>
        </div>
        <div className="flex items-center justify-center rounded-lg border bg-white p-4 w-fit">
          <QRCode value={totpUri} size={160} />
        </div>
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col gap-4">
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000000"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={codeForm.formState.isSubmitting}>
                {codeForm.formState.isSubmitting && <Loader2Icon className="animate-spin" data-icon />}
                Verify and enable
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onDone}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Step: password
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium">Confirm your password</p>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your current password to set up two-factor authentication.
        </p>
      </div>
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="current-password"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting && <Loader2Icon className="animate-spin" data-icon />}
              Continue
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onDone}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
