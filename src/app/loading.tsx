import { Skeleton } from "@/components/ui/skeleton";

// Global loading fallback — individual route segments should override this
// with a loading.tsx that matches their own content shape (rule 11a).
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-3 items-center justify-center px-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-4 w-56" />
    </div>
  );
}
