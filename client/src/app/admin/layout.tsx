"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";
import router from "next/router";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    if (status === "unauthenticated") {
      router.push("/admin/login?callbackUrl=/admin");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router, isLoginPage]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">
          Initializing Administrative Secure Environment...
        </p>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0f172a]">{children}</div>;
  }

  // Only render children if authenticated and admin
  if (status !== "authenticated" || session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
