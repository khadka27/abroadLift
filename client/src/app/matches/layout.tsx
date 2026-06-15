import Navbar from "@/components/Navbar";

export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-24 lg:pt-28 min-h-screen bg-white">
        {children}
      </div>
    </>
  );
}
