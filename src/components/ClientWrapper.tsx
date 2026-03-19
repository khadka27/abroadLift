"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SessionProvider } from "next-auth/react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes where we DON'T want the Navbar and Footer
  const noShellRoutes = ["/matches", "/dashboard", "/profile", "/login", "/register"];
  const hideShell = noShellRoutes.some((r) => pathname?.startsWith(r));

  if (hideShell) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </SessionProvider>
  );
}
