"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes where we DON'T want the Navbar and Footer
  const isMatchPage = pathname?.startsWith("/matches");
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isMatchPage || isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
