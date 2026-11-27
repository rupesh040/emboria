"use client";
 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import contentData from "../data/content.json";
import { WhyChooseUsVariant } from "../data/type";
 
interface WhyChooseUsProps {
  data?: WhyChooseUsVariant;
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
 
function useCountUp(end: number, active: boolean, delay = 0, duration = 2200) {
  const [value, setValue] = useState(0);
 
  useEffect(() => {
    if (!active) return;
 
    let frame = 0;
    let start: number | null = null;
 
    const tick = (time: number) => {
      if (start === null) start = time;
      const elapsed = time - start - delay;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(end * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
 
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, active, delay, duration]);
 
  return value;
}
 
const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)";
const springEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";
 
export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  const whyChooseData: WhyChooseUsVariant =
    data ||
    (contentData.Emboria.sections.WhyChooseUs.variants.EmboriaWhyChooseUs1 as WhyChooseUsVariant);
 
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.15);
  const stageRef = useRef<HTMLDivElement | null>(null);
 
  const countText = String(whyChooseData.badgeCard.count ?? "");
  const countMatch = countText.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const countNumber = countMatch ? parseFloat(countMatch[1]) : 0;
  const countSuffix = countMatch ? countMatch[2] : "";
  const countDecimals =
    countMatch && countMatch[1].includes(".") ? countMatch[1].split(".")[1].length : 0;
  const counted = useCountUp(countNumber, inView && !!countMatch, 1300);
  const countDisplay = countMatch
    ? `${countDecimals ? counted.toFixed(countDecimals) : Math.round(counted)}${countSuffix}`
    : countText;
 
  const reveal = (visible: string, hidden: string) => (inView ? visible : hidden);
 
  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--px", String((event.clientX - rect.left) / rect.width - 0.5));
    node.style.setProperty("--py", String((event.clientY - rect.top) / rect.height - 0.5));
  }, []);
 
  const handleLeave = useCallback(() => {
    const node = stageRef.current;
    if (!node) return;
    node.style.setProperty("--px", "0");
    node.style.setProperty("--py", "0");
  }, []);
 
  const parallax = (x: number, y: number): React.CSSProperties => ({
    transform: `translate3d(calc(var(--px, 0) * ${x}px), calc(var(--py, 0) * ${y}px), 0)`,
    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  });
 
  const renderFeatureIcon = (iconName: string, delay: number) => {
    const common = {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      className: "wcu-icon w-6 h-6 sm:w-7 sm:h-7",
      style: { ["--d" as string]: `${delay}ms` } as React.CSSProperties,
    };
 
    switch (iconName.toLowerCase()) {
      case "users":
        return (
          <svg {...common}>
            <path pathLength={1} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle pathLength={1} cx="9" cy="7" r="4" />
            <path pathLength={1} d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path pathLength={1} d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "file-check":
        return (
          <svg {...common}>
            <path pathLength={1} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline pathLength={1} points="14 2 14 8 20 8" />
            <path pathLength={1} d="m9 15 2 2 4-4" />
          </svg>
        );
      case "shield-check":
        return (
          <svg {...common}>
            <path
              pathLength={1}
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            />
            <path pathLength={1} d="m9 12 2 2 4-4" />
          </svg>
        );
      default:
        return null;
    }
  };
 
  const lastFeature = whyChooseData.features.length - 1;
 
  return (
    <section
      ref={sectionRef}
      id="why-us"
      className={`wcu-root scroll-mt-24 relative w-full bg-white py-10 sm:py-14 lg:py-16 overflow-hidden font-sans border-t border-neutral-100 ${
        inView ? "wcu-in" : ""
      }`}
    >
      <div className="wcu-drift-a absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#700715]/[0.03] blur-3xl pointer-events-none" />
      <div className="wcu-drift-b absolute -bottom-40 right-[4%] w-[28rem] h-[28rem] rounded-full bg-[#B58B78]/[0.10] blur-3xl pointer-events-none" />
      <div className="wcu-twinkle absolute top-[12%] left-[46%] w-1.5 h-1.5 rounded-full bg-[#8C2026]/40 pointer-events-none" />
      <div
        className="wcu-twinkle absolute bottom-[14%] left-[44%] w-2 h-2 rounded-full bg-[#B58B78]/60 pointer-events-none"
        style={{ animationDelay: "1.5s" }}
      />
 
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-5">
              <span
                className={`text-[#8c3340] text-[11px] sm:text-xs md:text-sm font-semibold uppercase transition-all duration-[1300ms] ${reveal(
                  "tracking-[0.25em] opacity-100 translate-x-0 blur-0",
                  "tracking-[0.5em] opacity-0 -translate-x-6 blur-sm"
                )}`}
                style={{ transitionTimingFunction: smoothEase }}
              >
                {whyChooseData.tagline}
              </span>
 
              {whyChooseData.taglineDivider && (
                <span
                  className={`w-12 sm:w-16 h-[1.5px] bg-[#9e766e] inline-block origin-left transition-all duration-[1300ms] ${reveal(
                    "scale-x-100 opacity-100",
                    "scale-x-0 opacity-0"
                  )}`}
                  style={{ transitionDelay: "350ms", transitionTimingFunction: smoothEase }}
                />
              )}
            </div>
 
            <h2 className="font-serif font-bold text-2xl xs:text-[28px] sm:text-4xl md:text-5xl lg:text-[50px] leading-tight sm:leading-[1.14] tracking-tight">
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  className={`block text-[#6d1322] transition-all duration-[1200ms] ${reveal(
                    "translate-y-0 opacity-100",
                    "translate-y-[110%] opacity-0"
                  )}`}
                  style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
                >
                  {whyChooseData.headingPart1}
                </span>
              </span>
 
              <span className="block overflow-hidden pb-[0.1em] mt-1 sm:mt-2">
                <span
                  className={`block transition-all duration-[1200ms] ${reveal(
                    "translate-y-0 opacity-100",
                    "translate-y-[110%] opacity-0"
                  )}`}
                  style={{ transitionDelay: "300ms", transitionTimingFunction: smoothEase }}
                >
                  <span className="text-[#6d1322]">{whyChooseData.headingPart2} </span>
                  <span className="wcu-shimmer inline-block">{whyChooseData.headingHighlight}</span>
                </span>
              </span>
            </h2>
 
            <p
              className={`mt-5 sm:mt-6 text-neutral-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl transition-all duration-1000 ${reveal(
                "opacity-100 translate-y-0 blur-0",
                "opacity-0 translate-y-6 blur-[3px]"
              )}`}
              style={{ transitionDelay: "450ms", transitionTimingFunction: smoothEase }}
            >
              {whyChooseData.description}
            </p>
 
            <div className="mt-8 sm:mt-10 w-full max-w-[600px]">
              {whyChooseData.features.map((feature, idx) => {
                const base = 700 + idx * 220;
                return (
                  <div key={idx}>
                    <div
                      className={`flex items-start space-x-4 sm:space-x-5 group cursor-default transition-all duration-1000 ${
                        idx === 0 ? "pt-0" : "pt-5 sm:pt-6"
                      } ${idx === lastFeature ? "pb-0" : "pb-5 sm:pb-6"} ${reveal(
                        "opacity-100 translate-x-0",
                        "opacity-0 -translate-x-10"
                      )}`}
                      style={{ transitionDelay: `${base}ms`, transitionTimingFunction: smoothEase }}
                    >
                      <div
                        className={`transition-all duration-[900ms] shrink-0 ${reveal(
                          "scale-100 rotate-0 opacity-100",
                          "scale-0 -rotate-45 opacity-0"
                        )}`}
                        style={{
                          transitionDelay: `${base + 100}ms`,
                          transitionTimingFunction: springEase,
                        }}
                      >
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fbf2ec] flex items-center justify-center text-[#6d1322] shadow-[0_2px_8px_rgba(109,19,34,0.06)] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#f6e6dc] group-hover:shadow-[0_12px_26px_rgba(109,19,34,0.18)]">
                          <span className="absolute inset-0 rounded-2xl ring-2 ring-[#8c2026]/25 opacity-0 scale-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125" />
                          {renderFeatureIcon(feature.icon, base + 500)}
                        </div>
                      </div>
 
                      <div className="flex flex-col">
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#6d1322] tracking-tight transition-all duration-500 group-hover:text-[#580510] group-hover:translate-x-1.5">
                          {feature.title}
                        </h3>
                        <p
                          className={`mt-1 sm:mt-1.5 text-neutral-600 text-xs sm:text-sm leading-relaxed max-w-md transition-all duration-1000 ${reveal(
                            "opacity-100 translate-y-0",
                            "opacity-0 translate-y-3"
                          )}`}
                          style={{
                            transitionDelay: `${base + 250}ms`,
                            transitionTimingFunction: smoothEase,
                          }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
 
                    {idx < lastFeature && (
                      <div
                        className={`h-px w-full bg-gradient-to-r from-[#e6d9d1] via-[#eee4de] to-[#f5eeea] origin-left transition-all duration-[1400ms] ${reveal(
                          "scale-x-100 opacity-100",
                          "scale-x-0 opacity-0"
                        )}`}
                        style={{
                          transitionDelay: `${base + 350}ms`,
                          transitionTimingFunction: smoothEase,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
 
          <div className="lg:col-span-6 relative">
            <div
              ref={stageRef}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-5"
            >
              <div
                className="sm:col-span-6 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]"
                style={parallax(-10, -8)}
              >
                <div className="absolute inset-0">
                  <div
                    className={`group absolute inset-0 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(48,24,16,0.10)] hover:shadow-[0_28px_55px_rgba(48,24,16,0.2)] bg-neutral-100 transition-all duration-[1500ms] ${reveal(
                      "opacity-100 translate-y-0",
                      "opacity-0 translate-y-16"
                    )}`}
                    style={{
                      transitionDelay: "400ms",
                      transitionTimingFunction: smoothEase,
                      clipPath: inView ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                    }}
                  >
                    <Image
                      src={whyChooseData.images.main.src}
                      alt={whyChooseData.images.main.alt}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                      className={`object-cover transition-transform ease-out group-hover:scale-105 ${reveal(
                        "scale-100 duration-[2400ms]",
                        "scale-[1.35] duration-[2400ms]"
                      )}`}
                    />
                  </div>
                </div>
 
                <div
                  className={`absolute bottom-5 left-4 sm:bottom-8 sm:-left-5 lg:bottom-10 lg:-left-6 z-20 transition-all duration-[1200ms] ${reveal(
                    "opacity-100 translate-x-0 translate-y-0 scale-100",
                    "opacity-0 -translate-x-10 translate-y-10 scale-90"
                  )}`}
                  style={{ transitionDelay: "1000ms", transitionTimingFunction: springEase }}
                >
                  <div className="wcu-bob">
                    <div className="relative overflow-hidden bg-[#710D19] text-white p-4 sm:p-6 rounded-2xl shadow-[0_22px_45px_rgba(80,8,20,0.38)] flex items-stretch gap-3.5 sm:gap-4 border border-white/10 transition-transform duration-500 hover:scale-105 min-w-[190px] xs:min-w-[200px] sm:min-w-[250px]">
                      <span className="wcu-sweep-badge absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
 
                      <div
                        className={`wcu-glow w-[3px] self-stretch bg-[#d9a93a] rounded-full shrink-0 origin-top transition-all duration-[1200ms] ${reveal(
                          "scale-y-100",
                          "scale-y-0"
                        )}`}
                        style={{ transitionDelay: "1400ms", transitionTimingFunction: smoothEase }}
                      />
 
                      <div className="flex flex-col">
                        <span className="font-bold text-2xl sm:text-[32px] text-white leading-none tracking-tight tabular-nums">
                          {countDisplay}
                        </span>
                        <span
                          className={`text-xs sm:text-[15px] text-white/90 font-medium mt-2 leading-snug transition-all duration-1000 ${reveal(
                            "opacity-100 translate-y-0",
                            "opacity-0 translate-y-3"
                          )}`}
                          style={{ transitionDelay: "1500ms", transitionTimingFunction: smoothEase }}
                        >
                          {whyChooseData.badgeCard.label}
                        </span>
 
                        <div className="flex items-center -space-x-2 mt-3 sm:mt-4">
                          {whyChooseData.badgeCard.avatars.map((av, idx) => (
                            <div
                              key={idx}
                              className={`transition-all duration-700 ${reveal(
                                "opacity-100 scale-100 translate-y-0",
                                "opacity-0 scale-50 translate-y-3"
                              )}`}
                              style={{
                                transitionDelay: `${1600 + idx * 110}ms`,
                                transitionTimingFunction: springEase,
                              }}
                            >
                              <div className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 cursor-pointer">
                                <Image
                                  src={av.image}
                                  alt={av.alt}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="sm:col-span-6 flex flex-col gap-4 lg:gap-5 mt-4 sm:mt-0">
                <div
                  className="relative w-full aspect-[4/3] sm:aspect-auto sm:flex-1 sm:min-h-[200px]"
                  style={parallax(14, -10)}
                >
                  <div className="absolute inset-0">
                    <div
                      className={`group absolute inset-0 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(48,24,16,0.10)] hover:shadow-[0_28px_55px_rgba(48,24,16,0.2)] bg-neutral-100 transition-all duration-[1500ms] ${reveal(
                        "opacity-100 translate-x-0",
                        "opacity-0 translate-x-16"
                      )}`}
                      style={{
                        transitionDelay: "650ms",
                        transitionTimingFunction: smoothEase,
                        clipPath: inView ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                      }}
                    >
                      <Image
                        src={whyChooseData.images.topRight.src}
                        alt={whyChooseData.images.topRight.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover transition-transform ease-out group-hover:scale-105 ${reveal(
                          "scale-100 duration-[2400ms]",
                          "scale-[1.35] duration-[2400ms]"
                        )}`}
                      />
                    </div>
                  </div>
                </div>
 
                <div
                  className="relative w-full aspect-[4/3] sm:aspect-auto sm:flex-1 sm:min-h-[200px]"
                  style={parallax(16, 12)}
                >
                  <div className="absolute inset-0">
                    <div
                      className={`group absolute inset-0 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(48,24,16,0.10)] hover:shadow-[0_28px_55px_rgba(48,24,16,0.2)] bg-neutral-100 transition-all duration-[1500ms] ${reveal(
                        "opacity-100 translate-x-0",
                        "opacity-0 translate-x-16"
                      )}`}
                      style={{
                        transitionDelay: "850ms",
                        transitionTimingFunction: smoothEase,
                        clipPath: inView ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                      }}
                    >
                      <Image
                        src={whyChooseData.images.bottomRight.src}
                        alt={whyChooseData.images.bottomRight.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover transition-transform ease-out group-hover:scale-105 ${reveal(
                          "scale-100 duration-[2400ms]",
                          "scale-[1.35] duration-[2400ms]"
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <style jsx global>{`
        .wcu-shimmer {
          color: #a98468;
          background-image: linear-gradient(
            100deg,
            #a98468 0%,
            #a98468 35%,
            #dcbfa8 50%,
            #a98468 65%,
            #a98468 100%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wcu-shimmer 6s ease-in-out 2.5s infinite;
        }
 
        .wcu-icon path,
        .wcu-icon circle,
        .wcu-icon polyline {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
        }
 
        .wcu-in .wcu-icon path,
        .wcu-in .wcu-icon circle,
        .wcu-in .wcu-icon polyline {
          animation: wcu-dash 1.3s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 900ms) forwards;
        }
 
        .group:hover .wcu-icon {
          animation: wcu-wiggle 0.8s ease-in-out;
        }
 
        .wcu-bob {
          animation: wcu-bob 5s ease-in-out 2.6s infinite;
        }
 
        .wcu-glow {
          animation: wcu-glow 2.8s ease-in-out 2.6s infinite;
        }
 
        .wcu-sweep-badge {
          transform: translateX(-160%) skewX(-12deg);
          animation: wcu-sweep 6s ease-in-out 3.5s infinite;
        }
 
        .wcu-drift-a {
          animation: wcu-drift 14s ease-in-out infinite alternate;
        }
 
        .wcu-drift-b {
          animation: wcu-drift 12s ease-in-out infinite alternate-reverse;
        }
 
        .wcu-twinkle {
          animation: wcu-twinkle 3.6s ease-in-out infinite;
        }
 
        @keyframes wcu-shimmer {
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
 
        @keyframes wcu-dash {
          0% {
            stroke-dashoffset: 1;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
 
        @keyframes wcu-wiggle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-10deg) scale(1.12);
          }
          55% {
            transform: rotate(8deg) scale(1.12);
          }
          80% {
            transform: rotate(-4deg) scale(1.05);
          }
        }
          50% {
            transform: translateY(-10px);
          }
        }
          50% {
            transform: translateY(12px);
          }
        }
 
        @keyframes wcu-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
 
        @keyframes wcu-glow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(217, 169, 58, 0);
          }
          50% {
            box-shadow: 0 0 14px rgba(217, 169, 58, 0.75);
          }
        }
          100% {
            transform: translateX(420%) skewX(-12deg);
          }
        }
 
        @keyframes wcu-drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(40px, 26px, 0) scale(1.15);
          }
        }
 
        @keyframes wcu-twinkle {
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
          .wcu-root *,
          .wcu-root *::before,
          .wcu-root *::after {
            animation: none !important;
            transition: none !important;
          }
 
          .wcu-icon path,
          .wcu-icon circle,
          .wcu-icon polyline {
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
 
          .wcu-shimmer {
            background-position: 0% 0;
          }
        }
      `}</style>
    </section>
  );
}
 