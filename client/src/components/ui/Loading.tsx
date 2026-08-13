import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({
  size = "md",
  text,
  fullScreen = false,
  className = "",
}: LoadingProps) {
  let pixelSize = 48;
  if (typeof size === "number") {
    pixelSize = size;
  } else {
    switch (size) {
      case "sm":
        pixelSize = 28;
        break;
      case "md":
        pixelSize = 48;
        break;
      case "lg":
        pixelSize = 72;
        break;
      case "xl":
        pixelSize = 96;
        break;
    }
  }

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <img
        src="/loading (1).svg"
        alt="Loading..."
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        className="object-contain"
      />
      {text && (
        <p className="text-slate-500 font-medium text-sm md:text-base animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/80 backdrop-blur-sm fixed inset-0 z-50">
        {content}
      </div>
    );
  }

  return content;
}
