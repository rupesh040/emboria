"use client";
 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import contentData from "../data/content.json";
import { AboutVariant } from "../data/type";
 
interface AboutProps {
  data?: AboutVariant;
}
 
function useInView<T extends HTMLElement>(threshold = 0.2) {
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
 
function useCountUp(end: number, active: boolean, duration = 2200) {
  const [value, setValue] = useState(0);
 
  useEffect(() => {
    if (!active) return;
 
    let frame = 0;
    let start: number | null = null;
 
    const tick = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(end * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
 
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, active, duration]);
 
  return value;
}
 
const springEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)";
 
export default function About({ data }: AboutProps) {
  const aboutData: AboutVariant =
    data ||
    (contentData.Emboria.sections.About.variants.EmboriaAbout1 as AboutVariant);
 
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.18);
  const stageRef = useRef<HTMLDivElement | null>(null);
 
  const badgeText = String(aboutData.socialProof.badge ?? "");
  const badgeMatch = badgeText.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const badgeNumber = badgeMatch ? parseFloat(badgeMatch[1]) : 0;
  const badgeSuffix = badgeMatch ? badgeMatch[2] : "";
  const badgeDecimals = badgeMatch && badgeMatch[1].includes(".") ? badgeMatch[1].split(".")[1].length : 0;
  const counted = useCountUp(badgeNumber, inView && !!badgeMatch);
  const badgeDisplay = badgeMatch
    ? `${badgeDecimals ? counted.toFixed(badgeDecimals) : Math.round(counted)}${badgeSuffix}`
    : badgeText;
 
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
 
  const reveal = (visible: string, hidden: string) => (inView ? visible : hidden);
 
  const parallax = (x: number, y: number): React.CSSProperties => ({
    transform: `translate3d(calc(var(--px, 0) * ${x}px), calc(var(--py, 0) * ${y}px), 0)`,
    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  });
 
  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="emb-root scroll-mt-24 relative w-full overflow-hidden bg-white py-10 sm:py-14 lg:py-16 font-sans"
    >
      <div className="emb-drift-a absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#700715]/[0.03] blur-3xl pointer-events-none" />
      <div className="emb-drift-b absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-[#B58B78]/[0.10] blur-3xl pointer-events-none" />
    
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 xl:gap-12 items-center">
          <div className="lg:col-span-7 relative z-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <span
                className={`text-[#8C2026] text-xs sm:text-sm font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase whitespace-nowrap transition-all duration-1000 ${reveal(
                  "opacity-100 translate-x-0 blur-0",
                  "opacity-0 -translate-x-6 blur-sm"
                )}`}
                style={{ transitionTimingFunction: smoothEase }}
              >
                {aboutData.tagline}
              </span>
 
              {aboutData.taglineDivider && (
                <span
                  className={`h-[1.5px] w-20 sm:w-28 bg-gradient-to-r from-[#9E6259] to-[#D8C0B5] origin-left transition-all duration-[1200ms] hover:w-36 ${reveal(
                    "scale-x-100 opacity-100",
                    "scale-x-0 opacity-0"
                  )}`}
                  style={{ transitionDelay: "350ms", transitionTimingFunction: smoothEase }}
                />
              )}
            </div>
 
            <h2 className="font-serif font-bold text-[24px] xs:text-[27px] sm:text-[44px] md:text-[52px] lg:text-[48px] xl:text-[62px] leading-tight sm:leading-[1.12] tracking-tight sm:tracking-[-0.035em]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  className={`block text-[#78151F] transition-all duration-[1200ms] hover:text-[#9A2530] ${reveal(
                    "translate-y-0 opacity-100",
                    "translate-y-[110%] opacity-0"
                  )}`}
                  style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
                >
                  {aboutData.headingPart1}
                </span>
              </span>
 
              <span className="block overflow-hidden pb-[0.1em]">
                <span
                  className={`emb-shimmer block transition-all duration-[1200ms] ${reveal(
                    "translate-y-0 opacity-100",
                    "translate-y-[110%] opacity-0"
                  )}`}
                  style={{ transitionDelay: "300ms", transitionTimingFunction: smoothEase }}
                >
                  {aboutData.headingPart2}
                </span>
              </span>
            </h2>
 
            <p
              className={`mt-6 max-w-[700px] text-[#292929] text-sm sm:text-base md:text-[17px] leading-[1.75] font-normal transition-all duration-1000 ${reveal(
                "opacity-100 translate-y-0 blur-0",
                "opacity-0 translate-y-6 blur-[3px]"
              )}`}
              style={{ transitionDelay: "450ms", transitionTimingFunction: smoothEase }}
            >
              {aboutData.description}
            </p>
 
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center -space-x-3.5">
                {aboutData.socialProof.avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`transition-all duration-700 ${reveal(
                      "opacity-100 scale-100 translate-y-0",
                      "opacity-0 scale-50 translate-y-5"
                    )}`}
                    style={{
                      transitionDelay: `${600 + idx * 110}ms`,
                      transitionTimingFunction: springEase,
                    }}
                  >
                    <div className="relative w-12 h-12 sm:w-[62px] sm:h-[62px] rounded-full overflow-hidden border-[2.5px] border-white shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:scale-110 hover:z-20 cursor-pointer">
                      <Image
                        src={avatar.image}
                        alt={avatar.alt}
                        fill
                        sizes="62px"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                ))}
 
                <div
                  className={`relative z-10 transition-all duration-700 ${reveal(
                    "opacity-100 scale-100 rotate-0",
                    "opacity-0 scale-0 -rotate-90"
                  )}`}
                  style={{
                    transitionDelay: `${600 + aboutData.socialProof.avatars.length * 110}ms`,
                    transitionTimingFunction: springEase,
                  }}
                >
                  <span className="emb-ring absolute inset-0 rounded-full bg-[#850E19]/40" />
                  <div className="relative w-12 h-12 sm:w-[62px] sm:h-[62px] rounded-full bg-[#850E19] text-white flex items-center justify-center font-bold text-sm sm:text-base border-[2.5px] border-white shadow-md tabular-nums transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:bg-[#A21B27] cursor-default">
                    {badgeDisplay}
                  </div>
                </div>
              </div>
 
              <div
                className={`hidden sm:block w-[1.5px] h-14 bg-[#A65D59]/60 origin-center transition-all duration-1000 ${reveal(
                  "scale-y-100 opacity-100",
                  "scale-y-0 opacity-0"
                )}`}
                style={{ transitionDelay: "1100ms", transitionTimingFunction: smoothEase }}
              />
 
              <div className="flex flex-col">
                <span
                  className={`font-serif font-bold text-[#252525] text-base sm:text-lg leading-snug transition-all duration-1000 ${reveal(
                    "opacity-100 translate-x-0",
                    "opacity-0 -translate-x-6"
                  )}`}
                  style={{ transitionDelay: "1200ms", transitionTimingFunction: smoothEase }}
                >
                  {aboutData.socialProof.labelPart1}
                </span>
 
                <span
                  className={`font-serif font-bold text-[#252525] text-base sm:text-lg leading-snug transition-all duration-1000 ${reveal(
                    "opacity-100 translate-x-0",
                    "opacity-0 -translate-x-6"
                  )}`}
                  style={{ transitionDelay: "1300ms", transitionTimingFunction: smoothEase }}
                >
                  {aboutData.socialProof.labelPart2}
                </span>
              </div>
            </div>
 
            <div
              className={`mt-7 mb-6 h-px w-full max-w-[680px] bg-gradient-to-r from-[#D9C6BC] via-[#E9DDD6] to-transparent origin-left transition-all duration-[1400ms] ${reveal(
                "scale-x-100 opacity-100",
                "scale-x-0 opacity-0"
              )}`}
              style={{ transitionDelay: "1000ms", transitionTimingFunction: smoothEase }}
            />
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 lg:gap-x-7 gap-y-4 max-w-[720px]">
              {aboutData.features.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    transitionDelay: `${1100 + idx * 130}ms`,
                    transitionTimingFunction: smoothEase,
                  }}
                  className={`flex items-center gap-3 group cursor-default transition-all duration-1000 ${reveal(
                    "opacity-100 translate-x-0",
                    "opacity-0 -translate-x-8"
                  )}`}
                >
                  <div
                    className={`w-[19px] h-[19px] rounded-[3px] bg-[#850E19] text-white flex items-center justify-center shrink-0 shadow-sm transition-all duration-700 group-hover:bg-[#A3222B] group-hover:scale-125 group-hover:rotate-6 ${reveal(
                      "scale-100 rotate-0",
                      "scale-0 -rotate-90"
                    )}`}
                    style={{
                      transitionDelay: `${1150 + idx * 130}ms`,
                      transitionTimingFunction: springEase,
                    }}
                  >
                    <Check
                      className="emb-check w-[14px] h-[14px] stroke-[3.5]"
                      style={{ ["--d" as string]: `${1500 + idx * 130}ms` }}
                    />
                  </div>
 
                  <span className="relative text-[13px] sm:text-sm md:text-[15px] font-medium font-serif text-[#252525] leading-snug transition-all duration-500 group-hover:text-[#850E19] group-hover:translate-x-1">
                    {feature.title}
                    <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#850E19]/60 transition-transform duration-500 group-hover:scale-x-100" />
                  </span>
                </div>
              ))}
            </div>
          </div>
 
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div
              ref={stageRef}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="relative w-full max-w-[620px] lg:max-w-none aspect-[1.08/1] sm:aspect-[1.12/1] lg:aspect-[1.03/1]"
            >
              <div className="emb-spin absolute left-[-6%] bottom-[-4%] w-[42%] aspect-square rounded-full border border-dashed border-[#780F1C]/25 pointer-events-none">
                <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-[#8A1824]/70" />
              </div>
 
              <div
                className="absolute right-[3%] top-[13%] w-[88%] h-[78%]"
                style={parallax(-8, -6)}
              >
                <div
                  className={`w-full h-full bg-[#F5EDE5] rounded-tl-[85px] rounded-br-[85px] transition-all duration-[1400ms] hover:rounded-tl-[110px] hover:rounded-br-[110px] ${reveal(
                    "opacity-100 scale-100",
                    "opacity-0 scale-90"
                  )}`}
                  style={{ transformOrigin: "bottom right", transitionTimingFunction: smoothEase }}
                />
              </div>
 
              <div
                className="absolute right-[12%] top-[10%] w-[73%] h-[78%] pointer-events-none"
                style={parallax(-14, -10)}
              >
                <div
                  className={`w-full h-full border-[2px] border-[#780F1C] rounded-tl-[85px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] transition-all duration-[1600ms] ${reveal(
                    "opacity-100 -translate-y-2",
                    "opacity-0 translate-y-6"
                  )}`}
                  style={{
                    transitionDelay: "400ms",
                    transitionTimingFunction: smoothEase,
                    clipPath: inView ? "inset(0 0 0 0)" : "inset(100% 0 0 100%)",
                  }}
                />
              </div>
 
              <div
                className="absolute left-[1%] bottom-[5%] w-[48%] h-[67%] z-20"
                style={parallax(20, 14)}
              >
                <div
                  className={`w-full h-full transition-all duration-[1300ms] ${reveal(
                    "opacity-100 translate-x-0 translate-y-0 rotate-0",
                    "opacity-0 -translate-x-12 translate-y-12 -rotate-6"
                  )}`}
                  style={{ transitionDelay: "500ms", transitionTimingFunction: smoothEase }}
                >
                  <div className="emb-float-a group/front relative w-full h-full rounded-[27px] sm:rounded-[32px] overflow-hidden border-[5px] sm:border-[6px] border-white shadow-[0_15px_35px_rgba(48,24,16,0.15)] hover:shadow-[0_28px_50px_rgba(48,24,16,0.25)] bg-[#F3ECE5] transition-shadow duration-700">
                    <Image
                      src={aboutData.images.front.src}
                      alt={aboutData.images.front.alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 48vw, 25vw"
                      className={`object-cover object-center transition-transform ease-out group-hover/front:scale-110 ${reveal(
                        "scale-100 duration-[2200ms]",
                        "scale-[1.35] duration-[2200ms]"
                      )}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 opacity-0 group-hover/front:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <span className="emb-sweep absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
 
              <div
                className="absolute right-[1%] top-[0%] w-[52%] h-[79%] z-10"
                style={parallax(-18, -12)}
              >
                <div
                  className={`w-full h-full transition-all duration-[1300ms] ${reveal(
                    "opacity-100 translate-x-0 translate-y-0 rotate-0",
                    "opacity-0 translate-x-12 -translate-y-12 rotate-6"
                  )}`}
                  style={{ transitionDelay: "700ms", transitionTimingFunction: smoothEase }}
                >
                  <div className="emb-float-b group/back relative w-full h-full rounded-[27px] sm:rounded-[32px] overflow-hidden border-[5px] sm:border-[6px] border-white shadow-[0_15px_35px_rgba(48,24,16,0.13)] hover:shadow-[0_28px_50px_rgba(48,24,16,0.25)] bg-[#F3ECE5] transition-shadow duration-700">
                    <Image
                      src={aboutData.images.back.src}
                      alt={aboutData.images.back.alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 52vw, 28vw"
                      className={`object-cover object-center transition-transform ease-out group-hover/back:scale-110 ${reveal(
                        "scale-100 duration-[2400ms]",
                        "scale-[1.35] duration-[2400ms]"
                      )}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 opacity-0 group-hover/back:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <span
                      className="emb-sweep absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none"
                      style={{ animationDelay: "3s" }}
                    />
                  </div>
                </div>
              </div>
 
              <div
                className="absolute top-[5%] left-[44%] z-30"
                style={parallax(26, 18)}
              >
                <div
                  className={`relative w-3 h-3 transition-all duration-700 ${reveal("scale-100 opacity-100", "scale-0 opacity-0")}`}
                  style={{ transitionDelay: "1500ms", transitionTimingFunction: springEase }}
                >
                  <span className="emb-ring absolute inset-0 rounded-full bg-[#8A1824]/50" />
                  <span className="absolute inset-0 rounded-full bg-[#8A1824] shadow-[0_0_15px_rgba(138,24,36,0.35)]" />
                </div>
              </div>
 
              <div className="emb-twinkle absolute top-[44%] left-[47%] w-1.5 h-1.5 rounded-full bg-[#B58B78] z-30 pointer-events-none" />
              <div
                className="emb-twinkle absolute bottom-[12%] right-[22%] w-2 h-2 rounded-full bg-[#780F1C]/50 z-30 pointer-events-none"
                style={{ animationDelay: "1.2s" }}
              />
 
              <div className="emb-drift-b absolute bottom-[2%] right-[5%] w-24 h-24 bg-[#9A6A51]/15 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
 
      <div className="absolute top-[18%] right-[5%] w-2 h-2 bg-[#8C2026]/20 rounded-full animate-ping pointer-events-none" />
 
      <style jsx global>{`
        #about {
          scroll-margin-top: 80px;
        }
 
        .emb-shimmer {
          color: #896c5e;
          background-image: linear-gradient(
            100deg,
            #896c5e 0%,
            #896c5e 35%,
            #c9a08c 50%,
            #896c5e 65%,
            #896c5e 100%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: emb-shimmer 6s ease-in-out 2s infinite;
        }
 
        .emb-float-a {
          animation: emb-float-a 7s ease-in-out 1.8s infinite;
        }
 
        .emb-float-b {
          animation: emb-float-b 8s ease-in-out 2s infinite;
        }
 
        .emb-drift-a {
          animation: emb-drift 14s ease-in-out infinite alternate;
        }
 
        .emb-drift-b {
          animation: emb-drift 11s ease-in-out infinite alternate-reverse;
        }
 
        .emb-spin {
          animation: emb-spin 40s linear infinite;
        }
 
        .emb-ring {
          animation: emb-ring 2.6s ease-out infinite;
        }
 
        .emb-sweep {
          transform: translateX(-160%) skewX(-12deg);
          animation: emb-sweep 7s ease-in-out 2.5s infinite;
        }
 
        .emb-twinkle {
          animation: emb-twinkle 3.4s ease-in-out infinite;
        }
 
        .emb-check path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
        }
 
        .emb-root:not(.emb-paused) .emb-check path {
          animation: emb-dash 0.6s ease-out var(--d, 1500ms) forwards;
        }
 
        @keyframes emb-shimmer {
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
 
        @keyframes emb-float-a {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(-0.8deg);
          }
        }
 
        @keyframes emb-float-b {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(14px) rotate(0.8deg);
          }
        }
 
        @keyframes emb-drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(40px, 28px, 0) scale(1.15);
          }
        }
 
        @keyframes emb-spin {
          to {
            transform: rotate(360deg);
          }
        }
 
        @keyframes emb-ring {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
 
        @keyframes emb-sweep {
          0%,
          60% {
            transform: translateX(-160%) skewX(-12deg);
          }
          100% {
            transform: translateX(420%) skewX(-12deg);
          }
        }
 
        @keyframes emb-twinkle {
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
 
        @keyframes emb-dash {
          to {
            stroke-dashoffset: 0;
          }
        }
 
        @media (prefers-reduced-motion: reduce) {
          .emb-root *,
          .emb-root *::before,
          .emb-root *::after {
            animation: none !important;
            transition: none !important;
          }
 
          .emb-check path {
            stroke-dashoffset: 0 !important;
          }
 
          .emb-shimmer {
            background-position: 0% 0;
          }
        }
 
        @media (max-width: 639px) {
          #about {
            padding-top: 64px;
            padding-bottom: 64px;
          }
        }
      `}</style>
    </section>
  );
}
 