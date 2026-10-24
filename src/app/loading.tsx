import { PageLoader } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <main role="status" aria-live="polite" className="min-h-[55vh] bg-[#0d0c0b] px-4 pt-28">
      <PageLoader message="Loading Uptown Hair..." />
    </main>
  );
}
