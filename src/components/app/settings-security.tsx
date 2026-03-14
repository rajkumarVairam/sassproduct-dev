"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, ShieldCheckIcon, KeyIcon, SmartphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { TwoFactorSetup } from "./two-factor-setup";

interface SecuritySettingsProps {
  twoFactorEnabled: boolean;
}

export function SecuritySettings({ twoFactorEnabled }: SecuritySettingsProps) {
  const router = useRouter();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  async function handleRegisterPasskey() {
    setIsRegisteringPasskey(true);
    try {
      const { error } = await authClient.passkey.addPasskey();
      if (error) {
        toast.error(error.message ?? "Failed to register passkey.");
      } else {
        toast.success("Passkey registered successfully.");
        router.refresh();
      }
    } finally {
      setIsRegisteringPasskey(false);
    }
  }

  async function handleDisable2FA(password: string) {
    setIsDisabling2FA(true);
    try {
      const { error } = await authClient.twoFactor.disable({ password });
      if (error) {
        toast.error(error.message ?? "Failed to disable 2FA.");
      } else {
        toast.success("Two-factor authentication disabled.");
        router.refresh();
      }
    } finally {
      setIsDisabling2FA(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Two-factor authentication</CardTitle>
            {twoFactorEnabled && (
              // Status badge — raw colors intentional, dark: variants required
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                Enabled
              </Badge>
            )}
          </div>
          <CardDescription>
            Add an extra layer of security to your account with TOTP or email codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {showTwoFactorSetup && !twoFactorEnabled ? (
            <TwoFactorSetup onDone={() => { setShowTwoFactorSetup(false); router.refresh(); }} />
          ) : twoFactorEnabled ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground flex-1">
                2FA is active. You&apos;ll be asked for a code on each sign-in.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isDisabling2FA}>
                    {isDisabling2FA && <Loader2Icon className="animate-spin" data-icon />}
                    Disable 2FA
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disable two-factor authentication?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the extra security layer from your account.
                      Enter your current password to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        const password = prompt("Enter your password to confirm:");
                        if (password) handleDisable2FA(password);
                      }}
                    >
                      Disable
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button
              variant="outline"
              className="self-start"
              onClick={() => setShowTwoFactorSetup(true)}
            >
              <SmartphoneIcon data-icon="inline-start" />
              Enable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Passkeys */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyIcon className="size-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Passkeys</CardTitle>
          </div>
          <CardDescription>
            Sign in without a password using biometrics or a hardware security key.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="self-start"
            onClick={handleRegisterPasskey}
            disabled={isRegisteringPasskey}
          >
            {isRegisteringPasskey ? (
              <Loader2Icon className="animate-spin" data-icon />
            ) : (
              <KeyIcon data-icon="inline-start" />
            )}
            Register a passkey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
