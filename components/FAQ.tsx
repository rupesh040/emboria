"use client";
 
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import contentData from "../data/content.json";
import { FAQVariant } from "../data/type";
 
interface FAQProps {
  data?: FAQVariant;
}
 
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
 
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
 
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
 
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
 
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
 
  return { ref, inView };
}
 
const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)";
const springEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";
 
export default function FAQ({ data }: FAQProps) {
  const faqData: FAQVariant =
    data ||
    (contentData.Emboria.sections.FAQ.variants.EmboriaFAQ1 as FAQVariant);
 
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.15);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstRun = useRef<boolean>(true);
 
  const [openId, setOpenId] = useState<string>(faqData.items[0]?.id || "1");
  const [pulse, setPulse] = useState<boolean>(false);
 
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPulse(true);
    const id = window.setTimeout(() => setPulse(false), 900);
    return () => window.clearTimeout(id);
  }, [openId]);
 
  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };
 
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = faqData.items.length;
    let next = -1;
 
    if (event.key === "ArrowDown") next = (idx + 1) % total;
    else if (event.key === "ArrowUp") next = (idx - 1 + total) % total;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = total - 1;
 
    if (next >= 0) {
      event.preventDefault();
      buttonRefs.current[next]?.focus();
    }
  };
 
  const reveal = (visible: string, hidden: string) => (inView ? visible : hidden);
 
  return (
    <section
      ref={sectionRef}
      id="faqs"
      className="fq-root scroll-mt-24 w-full bg-white py-16 sm:py-20 lg:py-28 overflow-hidden font-sans border-t border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            {faqData.taglineDividers && (
              <span
                className={`w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block origin-right transition-transform duration-[1200ms] ${reveal(
                  "scale-x-100",
                  "scale-x-0"
                )}`}
                style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
              />
            )}
            <span
              className={`text-[#8c3340] text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase transition-all duration-1000 ${reveal(
                "opacity-100",
                "opacity-0"
              )}`}
              style={{ transitionTimingFunction: smoothEase }}
            >
              {faqData.tagline}
            </span>
            {faqData.taglineDividers && (
              <span
                className={`w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block origin-left transition-transform duration-[1200ms] ${reveal(
                  "scale-x-100",
                  "scale-x-0"
                )}`}
                style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
              />
            )}
          </div>
 
          <h2
            className={`font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] transition-all duration-[1600ms] ${reveal(
              "tracking-tight opacity-100",
              "tracking-[0.06em] opacity-0"
            )}`}
            style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
          >
            <span className="text-[#6d1322]">{faqData.headingPart1} </span>
            <span className="text-[#7f5944]">{faqData.headingHighlight}</span>
          </h2>
 
          <p
            className={`mt-4 text-neutral-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl text-center transition-all duration-1000 ${reveal(
              "opacity-100 translate-y-0",
              "opacity-0 translate-y-4"
            )}`}
            style={{ transitionDelay: "350ms", transitionTimingFunction: smoothEase }}
          >
            {faqData.description}
          </p>
        </div>
 
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 min-w-0 self-start relative flex items-center justify-center">
            <div className="relative isolate w-full aspect-square max-w-[440px] sm:max-w-[480px] shrink-0">
              <div
                className={`absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-24 h-24 sm:w-32 sm:h-32 -z-10 transition-all duration-[1400ms] ${reveal(
                  "opacity-100 translate-x-0 translate-y-0",
                  "opacity-0 translate-x-6 translate-y-6"
                )}`}
                style={{ transitionDelay: "900ms", transitionTimingFunction: smoothEase }}
              >
                <div
                  className={`w-full h-full bg-[#700715] rounded-tl-[36px] origin-top-left ${
                    pulse ? "fq-pop" : ""
                  }`}
                />
              </div>
 
              <div
                className={`absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 w-24 h-24 sm:w-32 sm:h-32 -z-10 transition-all duration-[1400ms] ${reveal(
                  "opacity-100 translate-x-0 translate-y-0",
                  "opacity-0 -translate-x-6 -translate-y-6"
                )}`}
                style={{ transitionDelay: "1000ms", transitionTimingFunction: smoothEase }}
              >
                <div
                  className={`w-full h-full bg-[#f7efe7] rounded-br-[36px] origin-bottom-right ${
                    pulse ? "fq-pop" : ""
                  }`}
                />
              </div>
 
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-neutral-100 group transition-all duration-[1800ms]"
                style={{
                  transitionDelay: "300ms",
                  transitionTimingFunction: smoothEase,
                  clipPath: inView
                    ? "circle(150% at 50% 50%)"
                    : "circle(0% at 50% 50%)",
                }}
              >
                <Image
                  src={faqData.image.src}
                  alt={faqData.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={`object-cover transition-transform ease-out group-hover:scale-105 ${reveal(
                    "scale-100 duration-[2400ms]",
                    "scale-[1.3] duration-[2400ms]"
                  )}`}
                />
              </div>
            </div>
          </div>
 
          <div className="lg:col-span-7 min-w-0 flex flex-col space-y-3.5 sm:space-y-4">
            {faqData.items.map((item, idx) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;
 
              return (
                <div
                  key={item.id}
                  className={`transition-all duration-[1000ms] ${reveal(
                    "opacity-100 translate-x-0",
                    "opacity-0 translate-x-10"
                  )}`}
                  style={{
                    transitionDelay: `${400 + idx * 100}ms`,
                    transitionTimingFunction: smoothEase,
                  }}
                >
                  <div
                    className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                      isOpen
                        ? "shadow-lg border border-[#700715]"
                        : "border border-neutral-200/90 shadow-2xs hover:border-[#700715]/40 hover:shadow-md hover:translate-x-1"
                    }`}
                    style={{ transitionTimingFunction: smoothEase }}
                  >
                    <button
                      ref={(el) => {
                        buttonRefs.current[idx] = el;
                      }}
                      id={buttonId}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      onKeyDown={(event) => handleKeyDown(event, idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group relative w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#700715]/50"
                    >
                      <span
                        className={`absolute inset-0 bg-[#700715] origin-left transition-transform duration-[700ms] ${
                          isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-[0.018]"
                        }`}
                        style={{ transitionTimingFunction: smoothEase }}
                      />
 
                      <span
                        className={`relative font-semibold text-sm sm:text-base md:text-[17px] pr-4 leading-snug transition-colors duration-500 ${
                          isOpen
                            ? "text-white delay-100"
                            : "text-neutral-900 group-hover:text-[#700715]"
                        }`}
                      >
                        {item.question}
                      </span>
 
                      <ChevronDown
                        className={`relative w-5 h-5 shrink-0 stroke-[2.2] transition-all duration-[700ms] ${
                          isOpen ? "rotate-180 text-white" : "rotate-0 text-neutral-600"
                        }`}
                        style={{ transitionTimingFunction: springEase }}
                      />
                    </button>
 
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-all duration-[600ms] ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                      style={{ transitionTimingFunction: smoothEase }}
                    >
                      <div className="overflow-hidden">
                        <div className="bg-[#fdf8f4] p-4 sm:p-5 pt-3 sm:pt-4 border-t border-[#700715]/10">
                          <p
                            className={`text-neutral-700 text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal transition-all duration-[800ms] ${
                              isOpen
                                ? "opacity-100 translate-y-0 blur-0"
                                : "opacity-0 translate-y-2 blur-[2px]"
                            }`}
                            style={{
                              transitionDelay: isOpen ? "180ms" : "0ms",
                              transitionTimingFunction: smoothEase,
                            }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
 
      <style jsx global>{`
        .fq-pop {
          animation: fq-pop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
 
        @keyframes fq-pop {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.22);
          }
          100% {
            transform: scale(1);
          }
        }
 
        @media (prefers-reduced-motion: reduce) {
          .fq-root *,
          .fq-root *::before,
          .fq-root *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
 