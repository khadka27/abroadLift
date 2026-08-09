"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SessionProvider } from "next-auth/react";
import SessionExpiryWatcher from "./SessionExpiryWatcher";
import Clarity from "@microsoft/clarity";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "wawn0y0zoh";
  const clarityInitializedRef = useRef(false);

  useEffect(() => {
    if (!projectId || clarityInitializedRef.current) return;
    
    const initClarity = () => {
      if (clarityInitializedRef.current) return;
      Clarity.init(projectId);
      clarityInitializedRef.current = true;
    };

    if ("requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(initClarity, { timeout: 3500 });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(initClarity, 3000);
      return () => clearTimeout(timer);
    }
  }, [projectId]);

  useEffect(() => {
    if (!pathname || !clarityInitializedRef.current) return;
    Clarity.setTag("pagePath", pathname);
  }, [pathname]);

  // Routes where we DON'T want the Navbar and Footer
  const noShellRoutes = ["/matches", "/login", "/register"];
  const hideShell = noShellRoutes.some((r) => pathname?.startsWith(r));

  if (hideShell) {
    return (
      <SessionProvider>
        <SessionExpiryWatcher />
        {children}
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <SessionExpiryWatcher />
      <Navbar />
      <div>{children}</div>
      <Footer />
    </SessionProvider>
  );
}
