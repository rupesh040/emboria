
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import contentData from "../data/content.json";
import { HeroVariant } from "../data/type";

interface HeroProps {
  data?: HeroVariant;
}

export default function Hero({ data }: HeroProps) {
  const heroData: HeroVariant =
    data ||
    (contentData.Emboria.sections.Hero.variants.EmboriaHero1 as HeroVariant);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="scroll-mt-24 relative isolate w-full min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] xl:min-h-[680px] overflow-hidden bg-[#faf3ed] group"
    >
      <div className="absolute inset-0 z-[-2] overflow-hidden">
        <Image
          src={heroData.backgroundImage}
          alt={heroData.imageAlt}
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover object-[68%_center] sm:object-[72%_center] lg:object-center animate-hero-image"
        />
      </div>

      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fbf4ee_0%,#fbf4ee_34%,rgba(251,244,238,0.97)_39%,rgba(251,244,238,0.83)_45%,rgba(251,244,238,0.38)_54%,transparent_70%)] hidden lg:block" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fbf4ee_0%,rgba(251,244,238,0.96)_42%,rgba(251,244,238,0.65)_65%,rgba(251,244,238,0.1)_100%)] hidden sm:block lg:hidden" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,244,238,0.96),rgba(251,244,238,0.82))] sm:hidden" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#f9eee5]/30 via-transparent to-white/10" />
      </div>

      <div className="absolute top-[-150px] left-[10%] w-[350px] h-[350px] rounded-full bg-white/30 blur-[100px] pointer-events-none animate-light-float" />

      <div className="relative z-10 max-w-[1450px] mx-auto min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] xl:min-h-[680px] px-6 sm:px-10 lg:px-[60px] flex items-center">
        <div
          className={`w-full max-w-[680px] transition-all duration-[1200ms] ease-out ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
            <span className="text-[#792936] text-[10px] sm:text-[12px] md:text-[14px] font-semibold tracking-[0.28em] uppercase whitespace-nowrap animate-tagline">
              {heroData.tagline}
            </span>

            {heroData.taglineDivider && (
              <span className="relative w-16 sm:w-24 md:w-[135px] h-[1.5px] bg-[#393939]/70 overflow-hidden">
                <span className="absolute inset-0 bg-[#791724] origin-left animate-divider" />
              </span>
            )}
          </div>

          <h1 className="font-serif font-bold text-[45px] sm:text-[58px] md:text-[72px] lg:text-[88px] xl:text-[94px] leading-[0.99] tracking-[-0.045em]">
            <span
              className={`block text-[#681522] transition-all duration-1000 delay-200 ${
                mounted
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              {heroData.headingPart1}
            </span>

            <span
              className={`block text-[#795944] mt-1 transition-all duration-1000 delay-500 ${
                mounted
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              {heroData.headingPart2}
            </span>
          </h1>

          <p
            className={`mt-7 sm:mt-8 max-w-[640px] text-[#282828] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[21px] font-normal leading-[1.5] tracking-[-0.01em] transition-all duration-1000 delay-700 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {heroData.description}
          </p>

          {heroData.ctaButton && (
            <div
              className={`mt-8 sm:mt-10 transition-all duration-1000 delay-[900ms] ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <a
                href={heroData.ctaButton.href}
                className="group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-3.5 bg-[#701522] text-white rounded-sm text-sm sm:text-base font-semibold shadow-[0_8px_25px_rgba(104,21,34,0.16)] hover:shadow-[0_12px_35px_rgba(104,21,34,0.28)] hover:-translate-y-1 transition-all duration-500"
              >
                <span className="absolute inset-0 bg-[#963442] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />

                <span className="relative z-10">
                  {heroData.ctaButton.text}
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#701522]/20 via-[#701522]/40 to-transparent pointer-events-none" />

      <style jsx global>{`
        @keyframes heroImageZoom {
          0% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-hero-image {
          animation: heroImageZoom 2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes lightFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(35px, 25px);
          }
        }

        .animate-light-float {
          animation: lightFloat 9s ease-in-out infinite;
        }

        @keyframes taglineReveal {
          from {
            opacity: 0;
            letter-spacing: 0.5em;
          }
          to {
            opacity: 1;
            letter-spacing: 0.28em;
          }
        }

        .animate-tagline {
          animation: taglineReveal 1.2s ease-out both;
        }

        @keyframes dividerReveal {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .animate-divider {
          animation: dividerReveal 1.2s ease-out 0.6s both;
        }

        @media (max-width: 640px) {
          .animate-hero-image {
            animation-duration: 1.5s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-hero-image,
          .animate-light-float,
          .animate-tagline,
          .animate-divider {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
