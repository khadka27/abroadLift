import React from "react";
import Image from "next/image";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  text?: string;
  className?: string;
}

export default function Loading({
  size = "lg",
  text,
  className = "",
}: LoadingProps) {
  let pixelSize = 220;
  if (typeof size === "number") {
    pixelSize = size;
  } else {
    switch (size) {
      case "sm":
        pixelSize = 80;
        break;
      case "md":
        pixelSize = 140;
        break;
      case "lg":
        pixelSize = 220;
        break;
      case "xl":
        pixelSize = 320;
        break;
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <Image
        src="/loading (1).svg"
        alt="Loading..."
        width={pixelSize}
        height={pixelSize}
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        className="object-contain"
        unoptimized
        priority
      />
      {text && (
        <p className="mt-3 text-slate-500 font-medium text-sm md:text-base animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
