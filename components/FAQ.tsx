"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import contentData from "../data/content.json";
import { FAQVariant } from "../data/type";

interface FAQProps {
  data?: FAQVariant;
}

export default function FAQ({ data }: FAQProps) {
  const faqData: FAQVariant =
    data ||
    (contentData.Emboria.sections.FAQ.variants.EmboriaFAQ1 as FAQVariant);

  const [mounted, setMounted] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string>(
    faqData.items[0]?.id || "1"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-28 overflow-hidden font-sans border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            {faqData.taglineDividers && (
              <span className="w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block" />
            )}
            <span className="text-[#8c3340] text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase">
              {faqData.tagline}
            </span>
            {faqData.taglineDividers && (
              <span className="w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block" />
            )}
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] tracking-tight">
            <span className="text-[#6d1322]">{faqData.headingPart1} </span>
            <span className="text-[#7f5944]">{faqData.headingHighlight}</span>
          </h2>

          <p className="mt-4 text-neutral-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl text-center">
            {faqData.description}
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div
            className={`lg:col-span-5 min-w-0 self-start relative flex items-center justify-center transition-all duration-1000 ease-out ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="relative w-full aspect-square max-w-[440px] sm:max-w-[480px] shrink-0">
              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-24 h-24 sm:w-32 sm:h-32 bg-[#700715] rounded-tl-[36px] -z-10" />
              <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 w-24 h-24 sm:w-32 sm:h-32 bg-[#f7efe7] rounded-br-[36px] -z-10" />

              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-neutral-100 group">
                <Image
                  src={faqData.image.src}
                  alt={faqData.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-7 min-w-0 flex flex-col space-y-3.5 sm:space-y-4 transition-all duration-1000 ease-out delay-200 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {faqData.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "shadow-md border border-[#700715]"
                      : "border border-neutral-200/90 shadow-2xs hover:border-[#700715]/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className={`w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors duration-200 cursor-pointer ${
                      isOpen
                        ? "bg-[#700715] text-white"
                        : "bg-white text-neutral-900 hover:text-[#700715]"
                    }`}
                  >
                    <span className="font-semibold text-sm sm:text-base md:text-[17px] pr-4 leading-snug">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-white shrink-0 stroke-[2.2]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600 shrink-0 stroke-[2.2]" />
                    )}
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-96 opacity-100 bg-[#fdf8f4]" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 sm:p-5 pt-3 sm:pt-4 text-neutral-700 text-xs sm:text-sm md:text-[15px] leading-relaxed border-t border-[#700715]/10 font-normal">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
