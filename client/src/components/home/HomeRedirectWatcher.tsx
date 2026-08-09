"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PremiumLoader from "@/components/PremiumLoader";

export default function HomeRedirectWatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bypassRedirect =
    searchParams.get("home") === "true" || searchParams.get("public") === "true";

  useEffect(() => {
    if (status === "authenticated" && !bypassRedirect) {
      if (session?.user?.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [status, session, bypassRedirect, router]);

  if (status === "authenticated" && !bypassRedirect) {
    return <PremiumLoader message="Redirecting to your dashboard..." />;
  }

  return null;
}
