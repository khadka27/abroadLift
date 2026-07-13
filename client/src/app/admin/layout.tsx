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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1d] text-white relative overflow-hidden font-sans">
        {/* Layered brand glowing blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8 border border-white/10">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-lg font-black tracking-widest uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            AbroadLift Admin
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed animate-pulse">
            Establishing administrative secure session...
          </p>
        </div>
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
