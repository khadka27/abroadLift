"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdditionalInfoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?tab=profile");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-505">Redirecting to Dashboard Profile...</p>
      </div>
    </div>
  );
}
