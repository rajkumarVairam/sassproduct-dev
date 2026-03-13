import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center"
    >
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-sm">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </main>
  );
}
