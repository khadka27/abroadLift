import React from "react";

const GraduationCapIcon = () => (
  <svg width="45" height="45" viewBox="0 0 48 48" fill="#3686FF" className="sm:w-[50px] sm:h-[50px]">
    <path d="M24 6 L4 15 L24 24 L44 15 Z" />
    <path d="M10 20 V30 C10 36 16 41 24 41 C32 41 38 36 38 30 V20 C34 23.5 29 25.5 24 25.5 C19 25.5 14 23.5 10 20 Z" />
  </svg>
);

const MoneyBagIcon = () => (
  <svg width="45" height="45" viewBox="0 0 48 48" fill="#3686FF" className="sm:w-[50px] sm:h-[50px]">
    <path d="M12 21 C12 17 18 15 24 15 C30 15 36 17 36 21 C40 24 42 29 42 35 C42 42 34 46 24 46 C14 46 6 42 6 35 C6 29 8 24 12 21 Z" />
    <path d="M16 11 L32 11 L36 3 L24 8 L12 3 Z" />
    <path d="M24 22 V42 M21 26 C21 24 27 24 27 28 C27 32 21 32 21 36 C21 40 27 40 27 38" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PassportIcon = () => (
  <svg width="45" height="45" viewBox="0 0 48 48" fill="#3686FF" className="sm:w-[50px] sm:h-[50px]">
    <path d="M10 4 H38 C40.2 4 42 5.8 42 8 V40 C42 42.2 40.2 44 38 44 H10 C7.8 44 6 42.2 6 40 V8 C6 5.8 7.8 4 10 4 Z" />
    <circle cx="24" cy="20" r="7" stroke="white" strokeWidth="2" fill="none" />
    <path d="M17 20 H31 M24 13 V27" stroke="white" strokeWidth="2" />
    <ellipse cx="24" cy="20" rx="3.5" ry="7" stroke="white" strokeWidth="2" fill="none" />
    <rect x="18" y="32" width="12" height="3" fill="white" rx="1.5" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="45" height="45" viewBox="-4 -4 56 56" fill="none" stroke="#3686FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[50px] sm:h-[50px]">
    <path d="M10 24 L10 42 L24 46 L38 42 L38 24 M24 28 L24 46" />
    <path d="M24 28 C24 28 34 17 34 10 C34 4.5 29.5 0 24 0 C18.5 0 14 4.5 14 10 C14 17 24 28 24 28 Z" />
    <circle cx="24" cy="10" r="3" fill="#3686FF" stroke="none" />
  </svg>
);

const PieChartIcon = () => (
  <svg width="45" height="45" viewBox="-2 -2 52 52" fill="#3686FF" className="sm:w-[50px] sm:h-[50px]">
    <path d="M21 27 L21 3 A 24 24 0 1 0 45 27 Z" />
    <path d="M26 22 L46 22 A 20 20 0 0 0 26 2 Z" />
  </svg>
);

const costItems = [
  { icon: GraduationCapIcon, label: "Tuition estimates" },
  { icon: MoneyBagIcon, label: "Living expenses" },
  { icon: PassportIcon, label: "Visa and\napplication costs" },
  { icon: MapPinIcon, label: "Country-wise\ncomparisons" },
  { icon: PieChartIcon, label: "Budget planning\nsupport" },
];

const EstimateSection = () => (
  <section className="py-20 bg-white">
    <div className="container max-w-[1000px] mx-auto px-6 lg:px-12 text-center">
      <h2 className="text-[28px] sm:text-[32px] md:text-[34px] lg:text-[36px] font-bold text-[#0f172a] mb-4 tracking-tight">
        Estimate You Need to Plan and Self-Apply
      </h2>
      <p className="text-[#475569] text-[15px] sm:text-[16px] font-regular mb-16">
        See a realistic cost breakdown before you apply.
      </p>

      <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-start gap-y-12 gap-x-6 mx-auto">
        {costItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center w-[45%] md:w-auto px-2">
            <div className="mb-6 flex justify-center w-full text-[#3686FF]">
              <item.icon />
            </div>
            <p className="text-[#334155] text-[14px] sm:text-[15px] font-regular leading-[1.4] whitespace-pre-line">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default EstimateSection;
