"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    if (status === "unauthenticated") {
      router.push("/admin/login?callbackUrl=/admin");
      return;
    }

    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        router.push("/");
        return;
      }

      // Only block standard admin from accessing the manage-admins page
      if (role === "ADMIN" && pathname.startsWith("/admin/manage-admins")) {
        router.push("/admin");
      }
    }
  }, [status, session, router, isLoginPage, pathname]);

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
    return <>{children}</>;
  }

  // Only render children if authenticated and admin/superadmin
  const userRole = session?.user?.role;
  if (status !== "authenticated" || (userRole !== "ADMIN" && userRole !== "SUPERADMIN")) {
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
