"use client";

interface CountryCardProps {
  flag: string;
  name: string;
  universities: string;
  color: string;
}

export default function CountryCard({
  flag,
  name,
  universities,
  color,
}: CountryCardProps) {
  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-[20px] p-6 text-center cursor-default transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-sm"
      style={{
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}40`; // 40 Hex is 25% opacity
        el.style.boxShadow = `0 16px 40px -8px ${color}15, 0 0 0 1px ${color}15 inset`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#e5e7eb"; // gray-200
        el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.02)";
      }}
    >
      {/* Decorative Top Line Glow on Hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        style={{ background: color }} 
      />

      {/* Floating subtle radial gradient behind the flag */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[20px]"
        style={{
          background: `radial-gradient(circle at top center, ${color}10 0%, transparent 70%)`,
        }}
      />

      <span className="relative block text-5xl mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
        {flag}
      </span>
      <div className="relative text-[15px] font-black tracking-tight text-gray-900 mb-1 z-10 transition-colors group-hover:text-black">
        {name}
      </div>
      <div className="relative text-xs text-gray-500 font-bold tracking-wide uppercase z-10">
        {universities} unis
      </div>
    </div>
  );
}
