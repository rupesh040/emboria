"use client";
 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import contentData from "../data/content.json";
import { ServicesVariant } from "../data/type";
 
interface ServicesProps {
  data?: ServicesVariant;
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
 
export default function Services({ data }: ServicesProps) {
  const servicesData: ServicesVariant =
    data ||
    (contentData.Emboria.sections.Services.variants.EmboriaServices1 as ServicesVariant);
 
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.15);
 
  const reveal = (visible: string, hidden: string) => (inView ? visible : hidden);
 
  const handleMove = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--rx", String(x - 0.5));
    node.style.setProperty("--ry", String(y - 0.5));
    node.style.setProperty("--mx", `${x * 100}%`);
    node.style.setProperty("--my", `${y * 100}%`);
    node.style.setProperty("--lift", "-10px");
  }, []);
 
  const handleLeave = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = event.currentTarget;
    node.style.setProperty("--rx", "0");
    node.style.setProperty("--ry", "0");
    node.style.setProperty("--lift", "0px");
  }, []);
 
  return (
    <section
      ref={sectionRef}
      id="services"
      className="svc-root scroll-mt-24 relative w-full bg-white py-16 sm:py-20 lg:py-28 overflow-hidden font-sans border-t border-neutral-100"
    >
      <div className="svc-drift-a absolute -top-32 left-[8%] w-96 h-96 rounded-full bg-[#700715]/[0.03] blur-3xl pointer-events-none" />
      <div className="svc-drift-b absolute -bottom-40 right-[6%] w-[28rem] h-[28rem] rounded-full bg-[#B58B78]/[0.10] blur-3xl pointer-events-none" />
      <div className="svc-twinkle absolute top-[14%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#8C2026]/40 pointer-events-none" />
      <div
        className="svc-twinkle absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-[#B58B78]/60 pointer-events-none"
        style={{ animationDelay: "1.4s" }}
      />
 
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            {servicesData.taglineDividers && (
              <span
                className={`w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block origin-right transition-all duration-[1200ms] ${reveal(
                  "scale-x-100 opacity-100",
                  "scale-x-0 opacity-0"
                )}`}
                style={{ transitionDelay: "200ms", transitionTimingFunction: smoothEase }}
              />
            )}
 
            <span
              className={`text-[#8c3340] text-[11px] sm:text-xs md:text-sm font-semibold uppercase transition-all duration-[1400ms] ${reveal(
                "tracking-[0.25em] opacity-100 blur-0",
                "tracking-[0.6em] opacity-0 blur-sm"
              )}`}
              style={{ transitionTimingFunction: smoothEase }}
            >
              {servicesData.tagline}
            </span>
 
            {servicesData.taglineDividers && (
              <span
                className={`w-10 sm:w-14 h-[1.5px] bg-[#9e766e] inline-block origin-left transition-all duration-[1200ms] ${reveal(
                  "scale-x-100 opacity-100",
                  "scale-x-0 opacity-0"
                )}`}
                style={{ transitionDelay: "200ms", transitionTimingFunction: smoothEase }}
              />
            )}
          </div>
 
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] tracking-tight">
            <span className="block overflow-hidden pb-[0.08em]">
              <span
                className={`block text-[#6d1322] transition-all duration-[1200ms] ${reveal(
                  "translate-y-0 opacity-100",
                  "translate-y-[110%] opacity-0"
                )}`}
                style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
              >
                {servicesData.headingPart1}
              </span>
            </span>
 
            <span className="block overflow-hidden pb-[0.1em] mt-1 sm:mt-2">
              <span
                className={`svc-shimmer block transition-all duration-[1200ms] ${reveal(
                  "translate-y-0 opacity-100",
                  "translate-y-[110%] opacity-0"
                )}`}
                style={{ transitionDelay: "320ms", transitionTimingFunction: smoothEase }}
              >
                {servicesData.headingPart2}
              </span>
            </span>
          </h2>
        </div>
 
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {servicesData.items.map((item, idx) => (
            <div
              key={item.id}
              className={`transition-all duration-[1100ms] ${reveal(
                "opacity-100 translate-y-0 scale-100",
                "opacity-0 translate-y-16 scale-95"
              )}`}
              style={{
                transitionDelay: `${500 + idx * 140}ms`,
                transitionTimingFunction: smoothEase,
              }}
            >
              <a
                href={item.href}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                className="svc-card group relative bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-[0_2px_10px_rgba(48,24,16,0.04)] hover:shadow-[0_28px_55px_rgba(48,24,16,0.14)] hover:border-[#8c2026]/25 flex flex-col h-full cursor-pointer overflow-hidden"
              >
                <span className="svc-glare pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
 
                <div
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-5 transition-all duration-[1400ms]"
                  style={{
                    transitionDelay: `${700 + idx * 140}ms`,
                    transitionTimingFunction: smoothEase,
                    clipPath: inView ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover transition-transform ease-out group-hover:scale-110 ${reveal(
                      "scale-100 duration-[2200ms]",
                      "scale-[1.4] duration-[2200ms]"
                    )}`}
                  />
 
                  <span className="absolute inset-0 bg-gradient-to-t from-[#3a0a12]/35 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
 
                  <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[420%]" />
 
                  <span
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#6d1322] shadow-lg translate-x-3 -translate-y-3 scale-50 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                    style={{ transitionTimingFunction: springEase }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
 
                <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#6d1322] tracking-tight transition-all duration-500 group-hover:text-[#580510] group-hover:translate-x-1">
                  {item.title}
                </h3>
 
                <span
                  className={`mt-3 block h-[2px] rounded-full bg-[#8c2026] transition-all duration-[900ms] group-hover:w-20 ${reveal(
                    "w-10",
                    "w-0"
                  )}`}
                  style={{
                    transitionDelay: inView ? `${1100 + idx * 140}ms` : "0ms",
                    transitionTimingFunction: smoothEase,
                  }}
                />
 
                <p
                  className={`mt-4 text-neutral-600 text-sm leading-relaxed flex-1 font-normal transition-all duration-1000 ${reveal(
                    "opacity-100 translate-y-0 blur-0",
                    "opacity-0 translate-y-4 blur-[2px]"
                  )}`}
                  style={{
                    transitionDelay: `${1150 + idx * 140}ms`,
                    transitionTimingFunction: smoothEase,
                  }}
                >
                  {item.description}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
 
      <style jsx global>{`
        .svc-card {
          transform: perspective(900px) rotateX(calc(var(--ry, 0) * -7deg))
            rotateY(calc(var(--rx, 0) * 7deg)) translateY(var(--lift, 0px));
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 500ms ease, border-color 500ms ease;
          will-change: transform;
        }
 
        .svc-glare {
          background: radial-gradient(
            circle at var(--mx, 50%) var(--my, 50%),
            rgba(140, 32, 38, 0.08),
            transparent 55%
          );
        }
 
        .svc-shimmer {
          color: #7f5944;
          background-image: linear-gradient(
            100deg,
            #7f5944 0%,
            #7f5944 35%,
            #c9a08c 50%,
            #7f5944 65%,
            #7f5944 100%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: svc-shimmer 6s ease-in-out 2.5s infinite;
        }
 
        .svc-drift-a {
          animation: svc-drift 14s ease-in-out infinite alternate;
        }
 
        .svc-drift-b {
          animation: svc-drift 12s ease-in-out infinite alternate-reverse;
        }
 
        .svc-twinkle {
          animation: svc-twinkle 3.6s ease-in-out infinite;
        }
 
        @keyframes svc-shimmer {
          0% {
            background-position: 100% 0;
          }
          50% {
            background-position: 0% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
 
        @keyframes svc-drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(40px, 26px, 0) scale(1.15);
          }
        }
 
        @keyframes svc-twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.6);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
 
        @media (prefers-reduced-motion: reduce) {
          .svc-root *,
          .svc-root *::before,
          .svc-root *::after {
            animation: none !important;
            transition: none !important;
          }
 
          .svc-card {
            transform: none !important;
          }
 
          .svc-shimmer {
            background-position: 0% 0;
          }
        }
      `}</style>
    </section>
  );
}
 