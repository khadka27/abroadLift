import Loading from "@/components/ui/Loading";

export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <Loading size="xl" text="Loading..." />
    </div>
  );
}
