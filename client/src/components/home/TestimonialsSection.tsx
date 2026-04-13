"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "MARIA SMITH",
    title: "Computer Science Student, University of Greenwich",
    text: "I tried [applying to institutions] and it took months, and months, and months for me to get an answer from a school. But then I stumbled upon AbroadLift, and it was like an answer from heaven.",
    image: "https://images.unsplash.com/photo-1522529599102-1b355a7c66dc?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    name: "ALEX JOHNSON",
    title: "Business Management, University of Toronto",
    text: "The process was so confusing until I found this platform. They helped me find the perfect program, tracked my visa progress, and gave me complete confidence in my decisions.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    name: "SARAH WILLIAMS",
    title: "Engineering Student, MIT",
    text: "Getting into my dream university felt impossible. The step-by-step checklist and cost estimation tools completely transformed my approach and saved me so much stress and time.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    name: "JAMES LEE",
    title: "Data Science, University of Melbourne",
    text: "From matching with colleges to budgeting my living expenses, having a digital advisor in my pocket is exactly what I needed to make studying abroad a reality.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    name: "EMMA DAVIS",
    title: "Arts & Humanities, Oxford University",
    text: "I didn't know where to start. They handled my timeline seamlessly. Now I am thriving abroad, and I can't recommend this highly enough to anyone feeling lost.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-17 bg-white overflow-hidden relative border-t border-gray-50">
      <div className="container max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-[32px] sm:text-[34px] lg:text-[36px] font-bold text-[#0f172a] mb-4 tracking-tight">
          What Our Students Have to Say
        </h2>
        <p className="text-[#475569] text-[15px] sm:text-[16px] mb-11 font-regular">
          Hear from real international students about their experience.
        </p>

        {/* Carousel Container */}
        <div className="relative w-full h-[450px] sm:h-[350px] flex items-center justify-center mb-8 perspective-[1000px]">
          {testimonials.map((t, idx) => {
            // Calculate distance from center (with wrapping)
            let offset = idx - currentIndex;
            if (offset < -Math.floor(testimonials.length / 2)) offset += testimonials.length;
            if (offset > Math.floor(testimonials.length / 2)) offset -= testimonials.length;

            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;
            
            // Only render active, right-next, or left-prev
            if (Math.abs(offset) > 1) return null;

            return (
              <div
                key={t.id}
                className="absolute top-1/2 left-1/2 w-[90%] sm:w-[80%] max-w-[700px] transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  transform: `translate(calc(-50% + ${offset * 60}%), -50%) scale(${isActive ? 1 : 0.85})`,
                  opacity: isActive ? 1 : 0.3,
                  zIndex: isActive ? 30 : 10,
                  filter: isActive ? "none" : "blur(2px)",
                  pointerEvents: isActive ? "auto" : "none"
                }}
                onClick={() => {
                  if (isPrev) prevSlide();
                  if (isNext) nextSlide();
                }}
              >
                {/* Review Card */}
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 h-full">
                  {/* Photo */}
                  <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] shrink-0 rounded-[16px] overflow-hidden drop-shadow-md">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center text-left relative">
                    {/* Big Quote Icon */}
                    <div className="absolute top-[-10px] right-2 text-[#3686FF] opacity-90 hidden sm:block">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 11h-4a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h3v8zm11 0h-4a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h3v8z" />
                      </svg>
                    </div>

                    <p className="text-[#334155] text-[15px] sm:text-[16px] leading-relaxed mb-6 font-regular">
                      {t.text}
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-[16px] uppercase tracking-wider text-[#0f172a] mb-1">
                        {t.name}
                      </h4>
                      <p className="text-[14px] text-[#808080] font-regular leading-snug">
                        {t.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-8 mt-5">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 flex items-center justify-center text-[#3686FF] hover:bg-blue-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
          </button>
          
          <div className="flex gap-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "bg-[#3686FF] scale-125" : "bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="w-10 h-10 flex items-center justify-center text-[#3686FF] hover:bg-blue-50 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
