"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center"
    >
      <p className="text-sm font-medium text-destructive">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">An error occurred</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-sm">
        We encountered an unexpected error. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          {/* Use <a> not <Link> in error boundaries — routing may be impaired */}
          <a href="/">Go home</a>
        </Button>
      </div>
    </main>
  );
}
