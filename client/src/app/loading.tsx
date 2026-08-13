import React from "react";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <Image
        src="/loading (1).svg"
        alt="Loading..."
        width={280}
        height={280}
        className="object-contain w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]"
        unoptimized
        priority
      />
    </div>
  );
}
