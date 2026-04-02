import Navbar from "@/components/Navbar";

export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[80px] min-h-screen bg-white">
        {children}
      </div>
    </>
  );
}
