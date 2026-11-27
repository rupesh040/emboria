"use client";
 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import contentData from "../data/content.json";
import { TestimonialsVariant } from "../data/type";
 
interface TestimonialsProps {
  data?: TestimonialsVariant;
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
const slideDuration = 6500;
 
export default function Testimonials({ data }: TestimonialsProps) {
  const testimonialsData: TestimonialsVariant =
    data ||
    (contentData.Emboria.sections.Testimonials.variants.EmboriaTestimonials1 as TestimonialsVariant);
 
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.15);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0 });
 
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState<number>(3);
  const [dragX, setDragX] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
 
  useEffect(() => {
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
 
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);
 
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);
 
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);
 
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { active: true, startX: event.clientX };
    setDragging(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      dragRef.current.active = true;
    }
  };
 
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    const atStart = currentIndex <= 0 && dx > 0;
    const atEnd = currentIndex >= maxIndex && dx < 0;
    setDragX(atStart || atEnd ? dx * 0.25 : dx);
  };
 
  const finishDrag = (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
 
    const width = viewportRef.current?.offsetWidth ?? 1;
    const threshold = (width / slidesToShow) * 0.2;
    const dx = event.clientX - dragRef.current.startX;
 
    if (!cancelled) {
      if (dx < -threshold && currentIndex < maxIndex) {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      } else if (dx > threshold && currentIndex > 0) {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
 
    setDragX(0);
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      setDragging(false);
    }
  };
 
  const reveal = (visible: string, hidden: string) => (inView ? visible : hidden);
  const paused = hovering || dragging;
  const canAutoplay = inView && maxIndex > 0;
 
  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="tt-root scroll-mt-24 w-full bg-white py-10 sm:py-14 lg:py-16 overflow-hidden font-sans border-t border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            {testimonialsData.taglineDividers && (
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
                "opacity-100 translate-y-0",
                "opacity-0 translate-y-3"
              )}`}
              style={{ transitionTimingFunction: smoothEase }}
            >
              {testimonialsData.tagline}
            </span>
            {testimonialsData.taglineDividers && (
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
            className={`font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] tracking-tight transition-all duration-[1200ms] ${reveal(
              "opacity-100 translate-y-0",
              "opacity-0 translate-y-5"
            )}`}
            style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
          >
            <span className="text-[#6d1322]">{testimonialsData.headingPart1} </span>
            <span className="text-[#7f5944]">{testimonialsData.headingHighlight}</span>
          </h2>
 
          <p
            className={`mt-4 text-neutral-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl text-center transition-all duration-1000 ${reveal(
              "opacity-100 translate-y-0",
              "opacity-0 translate-y-5"
            )}`}
            style={{ transitionDelay: "300ms", transitionTimingFunction: smoothEase }}
          >
            {testimonialsData.description}
          </p>
        </div>
 
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => finishDrag(event, false)}
            onPointerCancel={(event) => finishDrag(event, true)}
            onDragStart={(event) => event.preventDefault()}
            className={`tt-track mt-8 sm:mt-12 lg:mt-16 overflow-hidden w-full select-none touch-pan-y ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            } transition-all duration-[1200ms] ${reveal(
              "opacity-100 translate-y-0",
              "opacity-0 translate-y-10"
            )}`}
            style={{ transitionDelay: "400ms", transitionTimingFunction: smoothEase }}
          >
            <div className={canAutoplay && maxIndex > 0 ? "tt-hint" : ""}>
              <div
                className="flex -mx-3 sm:-mx-3.5"
                style={{
                  transform: `translateX(calc(-${currentIndex * (100 / slidesToShow)}% + ${dragX}px))`,
                  transition: dragging ? "none" : `transform 800ms ${smoothEase}`,
                  willChange: "transform",
                }}
              >
                {testimonialsData.items.map((item, idx) => {
                  const inWindow = idx >= currentIndex && idx < currentIndex + slidesToShow;
                  const shown = inView && (inWindow || dragging);
                  const order = Math.max(0, idx - currentIndex);
                  const base = shown ? order * 110 : 0;
 
                  return (
                    <div
                      key={item.id}
                      className="shrink-0 px-3 sm:px-3.5"
                      style={{ width: `${100 / slidesToShow}%` }}
                    >
                      <div
                        className={`h-full transition-all duration-[900ms] ${
                          shown
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-40 translate-y-5 scale-[0.96]"
                        }`}
                        style={{
                          transitionDelay: `${base}ms`,
                          transitionTimingFunction: smoothEase,
                        }}
                      >
                        <div className="tt-card relative bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden h-full group">
                          <div className="absolute top-0 right-0 w-11 h-11 bg-[#700715] rounded-bl-[28px] pointer-events-none origin-top-right transition-transform duration-500 group-hover:scale-125" />
 
                          <div>
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fbf2ec] flex items-center justify-center text-[#710D19] mb-5 shrink-0 shadow-2xs transition-all duration-700 group-hover:-rotate-12 group-hover:scale-110 ${
                                shown ? "scale-100 opacity-100" : "scale-50 opacity-0"
                              }`}
                              style={{
                                transitionDelay: shown ? `${base + 150}ms` : "0ms",
                                transitionTimingFunction: springEase,
                              }}
                            >
                              <span className="font-serif text-3xl sm:text-4xl font-black leading-none select-none text-[#710D19] pt-1.5">
                                “
                              </span>
                            </div>
 
                            <p
                              className={`text-neutral-700 text-sm sm:text-[15px] leading-relaxed font-normal transition-all duration-[900ms] ${
                                shown
                                  ? "opacity-100 translate-y-0 blur-0"
                                  : "opacity-0 translate-y-3 blur-[2px]"
                              }`}
                              style={{
                                transitionDelay: shown ? `${base + 250}ms` : "0ms",
                                transitionTimingFunction: smoothEase,
                              }}
                            >
                              {item.quote}
                            </p>
                          </div>
 
                          <div>
                            <div
                              className={`w-full h-[1px] bg-neutral-200 my-5 origin-left transition-transform duration-[1100ms] ${
                                shown ? "scale-x-100" : "scale-x-0"
                              }`}
                              style={{
                                transitionDelay: shown ? `${base + 400}ms` : "0ms",
                                transitionTimingFunction: smoothEase,
                              }}
                            />
 
                            <div className="flex items-center">
                              <div
                                className={`relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200 shrink-0 shadow-2xs transition-all duration-[900ms] ${
                                  shown ? "opacity-100 scale-100" : "opacity-0 scale-75"
                                }`}
                                style={{
                                  transitionDelay: shown ? `${base + 450}ms` : "0ms",
                                  transitionTimingFunction: springEase,
                                }}
                              >
                                <Image
                                  src={item.image}
                                  alt={item.imageAlt}
                                  fill
                                  sizes="48px"
                                  draggable={false}
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              </div>
 
                              <div className="h-8 w-[1px] bg-neutral-200 mx-3.5 shrink-0 hidden sm:block" />
 
                              <div
                                className={`flex flex-col ml-3 sm:ml-0 transition-all duration-[900ms] ${
                                  shown ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                                }`}
                                style={{
                                  transitionDelay: shown ? `${base + 520}ms` : "0ms",
                                  transitionTimingFunction: smoothEase,
                                }}
                              >
                                <span className="font-serif font-bold text-[15px] sm:text-base text-[#6d1322] tracking-tight">
                                  {item.name}
                                </span>
                                <span className="text-xs text-neutral-500 font-medium mt-0.5">
                                  {item.role}
                                </span>
                              </div>
 
                              <div className="ml-auto flex items-center space-x-1 text-[#eab308]">
                                {Array.from({ length: item.rating }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`block transition-all duration-700 ${
                                      shown
                                        ? "scale-100 rotate-0 opacity-100"
                                        : "scale-0 -rotate-90 opacity-0"
                                    }`}
                                    style={{
                                      transitionDelay: shown ? `${base + 600 + i * 90}ms` : "0ms",
                                      transitionTimingFunction: springEase,
                                    }}
                                  >
                                    <Star className="w-3.5 h-3.5 fill-[#eab308] text-[#eab308] transition-transform duration-300 group-hover:scale-125" />
                                  </span>
                                ))}
                              </div>
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
 
          <div className="mt-10 sm:mt-12 flex items-center justify-between max-w-7xl mx-auto px-2">
            <button
              type="button"
              onClick={handlePrev}
              className={`group relative w-10 h-10 rounded-full border border-[#700715] text-[#700715] overflow-hidden flex items-center justify-center hover:text-white transition-all duration-700 shadow-2xs active:scale-90 cursor-pointer ${reveal(
                "opacity-100 translate-x-0",
                "opacity-0 -translate-x-8"
              )}`}
              style={{ transitionDelay: inView ? "700ms" : "0ms", transitionTimingFunction: smoothEase }}
              aria-label="Previous testimonials"
            >
              <span
                className="absolute inset-0 rounded-full bg-[#700715] scale-0 transition-transform duration-500 group-hover:scale-100"
                style={{ transitionTimingFunction: smoothEase }}
              />
              <ChevronLeft className="relative w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
 
            <div className="flex items-center space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`relative h-2.5 rounded-full overflow-hidden bg-[#f3d9d5] hover:bg-[#e4b3ab] transition-all duration-700 cursor-pointer ${
                      isActive ? "w-10" : "w-2.5"
                    } ${reveal("opacity-100 scale-100", "opacity-0 scale-0")}`}
                    style={{
                      transitionDelay: inView ? `${800 + i * 90}ms` : "0ms",
                      transitionTimingFunction: springEase,
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    {isActive && (
                      <span
                        key={currentIndex}
                        onAnimationEnd={canAutoplay ? handleNext : undefined}
                        className={`tt-fill absolute inset-0 rounded-full bg-[#700715] origin-left ${
                          paused ? "tt-paused" : ""
                        } ${canAutoplay ? "" : "tt-static"}`}
                        style={{ animationDuration: `${slideDuration}ms` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
 
            <button
              type="button"
              onClick={handleNext}
              className={`group relative w-10 h-10 rounded-full border border-[#700715] text-[#700715] overflow-hidden flex items-center justify-center hover:text-white transition-all duration-700 shadow-2xs active:scale-90 cursor-pointer ${reveal(
                "opacity-100 translate-x-0",
                "opacity-0 translate-x-8"
              )}`}
              style={{ transitionDelay: inView ? "700ms" : "0ms", transitionTimingFunction: smoothEase }}
              aria-label="Next testimonials"
            >
              <span
                className="absolute inset-0 rounded-full bg-[#700715] scale-0 transition-transform duration-500 group-hover:scale-100"
                style={{ transitionTimingFunction: smoothEase }}
              />
              <ChevronRight className="relative w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
 
      <style jsx global>{`
        .tt-fill {
          transform: scaleX(0);
          animation-name: tt-fill;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
 
        .tt-fill.tt-static {
          animation: none;
          transform: scaleX(1);
        }
 
        .tt-paused {
          animation-play-state: paused;
        }
 
        .tt-hint {
          animation: tt-hint 1.4s cubic-bezier(0.45, 0, 0.2, 1) 1.8s 1 both;
        }
 
        @media (hover: hover) {
          .tt-track:hover .tt-card {
            opacity: 0.6;
            transform: scale(0.985);
          }
 
          .tt-track .tt-card:hover {
            opacity: 1;
            transform: none;
          }
        }
 
        @keyframes tt-fill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
 
        @keyframes tt-hint {
          0%,
          100% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(-22px);
          }
          70% {
            transform: translateX(4px);
          }
        }
 
        @media (prefers-reduced-motion: reduce) {
          .tt-root *,
          .tt-root *::before,
          .tt-root *::after {
            animation: none !important;
            transition: none !important;
          }
 
          .tt-fill {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
 