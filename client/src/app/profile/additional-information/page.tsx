"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";

export default function AdditionalInfoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?tab=profile");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Loading size="lg" text="Redirecting to Dashboard Profile..." />
    </div>
  );
}
