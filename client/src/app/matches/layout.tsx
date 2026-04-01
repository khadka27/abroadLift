import Navbar from "@/components/Navbar";

export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gray-50/30">
        {children}
      </div>
    </>
  );
}
