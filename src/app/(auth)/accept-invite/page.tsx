"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2Icon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId") ?? "";

  const [status, setStatus] = useState<"loading" | "ready" | "accepting" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!invitationId) {
      setStatus("error");
      setErrorMessage("Invalid invitation link. Please request a new invitation.");
    } else {
      setStatus("ready");
    }
  }, [invitationId]);

  async function handleAccept() {
    setStatus("accepting");
    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message ?? "Failed to accept invitation. The link may have expired.");
    } else {
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  }

  async function handleDecline() {
    await authClient.organization.rejectInvitation({ invitationId });
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader className="sr-only">
        <CardDescription>Organization invitation</CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
        {status === "loading" && (
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" aria-label="Loading" />
        )}

        {status === "ready" && (
          <>
            <p className="text-sm text-muted-foreground">
              You&apos;ve been invited to join an organization. Accept to get started.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <Button className="w-full" onClick={handleAccept}>
                Accept invitation
              </Button>
              <Button variant="outline" className="w-full" onClick={handleDecline}>
                Decline
              </Button>
            </div>
          </>
        )}

        {status === "accepting" && (
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="size-8 animate-spin text-primary" aria-label="Accepting" />
            <p className="text-sm text-muted-foreground">Joining organization…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2Icon className="size-10 text-green-500" aria-hidden="true" />
            <p className="text-sm font-medium">Invitation accepted!</p>
            <p className="text-xs text-muted-foreground">Redirecting to dashboard…</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <XCircleIcon className="size-10 text-destructive" aria-hidden="true" />
            <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
              Go to dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Organization invitation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ve been invited to join a team
        </p>
      </div>
      <Suspense
        fallback={
          <Card>
            <CardContent className="p-6 flex justify-center">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
            </CardContent>
          </Card>
        }
      >
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
