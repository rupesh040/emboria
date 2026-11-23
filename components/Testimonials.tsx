"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import contentData from "../data/content.json";
import { TestimonialsVariant } from "../data/type";

interface TestimonialsProps {
  data?: TestimonialsVariant;
}

export default function Testimonials({ data }: TestimonialsProps) {
  const testimonialsData: TestimonialsVariant =
    data ||
    (contentData.Emboria.sections.Testimonials.variants.EmboriaTestimonials1 as TestimonialsVariant);

  const [mounted, setMounted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState<number>(3);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = testimonialsData.items.length;
  const maxIndex = Math.max(0, totalItems - slidesToShow);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-28 overflow-hidden font-sans border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            {testimonialsData.taglineDividers && (
              <span className="w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block" />
            )}
            <span className="text-[#8c3340] text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase">
              {testimonialsData.tagline}
            </span>
            {testimonialsData.taglineDividers && (
              <span className="w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block" />
            )}
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] tracking-tight">
            <span className="text-[#6d1322]">{testimonialsData.headingPart1} </span>
            <span className="text-[#7f5944]">{testimonialsData.headingHighlight}</span>
          </h2>

          <p className="mt-4 text-neutral-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl text-center">
            {testimonialsData.description}
          </p>
        </div>

        <div className="mt-12 sm:mt-16 overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-out -mx-3 sm:-mx-3.5"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {testimonialsData.items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 px-3 sm:px-3.5"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden h-full group cursor-default">
                  <div className="absolute top-0 right-0 w-11 h-11 bg-[#700715] rounded-bl-[28px] pointer-events-none transition-transform duration-300 group-hover:scale-105" />

                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#fbf2ec] flex items-center justify-center text-[#700715] mb-5 shrink-0 shadow-2xs">
                      <span className="font-serif text-2xl font-bold leading-none select-none text-[#6d1322]">
                        “
                      </span>
                    </div>

                    <p className="text-neutral-700 text-sm sm:text-[15px] leading-relaxed font-normal">
                      {item.quote}
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-[1px] bg-neutral-100 my-5" />

                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200 shrink-0 shadow-2xs">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="h-8 w-[1px] bg-neutral-200 mx-3.5 shrink-0 hidden sm:block" />

                      <div className="flex flex-col ml-3 sm:ml-0">
                        <span className="font-serif font-bold text-[15px] sm:text-base text-[#6d1322] tracking-tight">
                          {item.name}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium mt-0.5">
                          {item.role}
                        </span>
                      </div>

                      <div className="ml-auto flex items-center space-x-1 text-[#eab308]">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-[#eab308] text-[#eab308]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex items-center justify-between max-w-7xl mx-auto px-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-[#700715] text-[#700715] flex items-center justify-center hover:bg-[#700715] hover:text-white transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? "w-6 bg-[#700715]"
                    : "w-2.5 bg-[#f3d9d5] hover:bg-[#e4b3ab]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-[#700715] text-[#700715] flex items-center justify-center hover:bg-[#700715] hover:text-white transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </section>
  );
}
