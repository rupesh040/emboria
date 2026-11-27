"use client";
 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Clock, Mail, Phone } from "lucide-react";
import contentData from "../data/content.json";
import { HeaderVariant } from "../data/type";
 
interface NavbarProps {
  data?: HeaderVariant;
}
 
const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)";
 
export default function Navbar({ data }: NavbarProps) {
  const headerData: HeaderVariant =
    data ||
    (contentData.Emboria.sections.Header.variants.EmboriaHeader1 as HeaderVariant);
 
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>(
    headerData.links.find((l) => l.active)?.name || headerData.links[0]?.name || ""
  );
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [indicatorReady, setIndicatorReady] = useState<boolean>(false);
 
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const linksWrapRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
 
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
 
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
 
      const sectionMappings = [
        { name: "Home", id: "home" },
        { name: "About Us", id: "about-us" },
        { name: "Services", id: "services" },
        { name: "Why us", id: "why-us" },
        { name: "Testimonials", id: "testimonials" },
        { name: "Faqs", id: "faqs" },
        { name: "Contact Us", id: "contact" },
      ];
 
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
 
      if (scrollBottom >= docHeight - 80) {
        setActiveLink("Contact Us");
        return;
      }
 
      if (window.scrollY < 120) {
        setActiveLink("Home");
        return;
      }
 
      for (let i = sectionMappings.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionMappings[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveLink(sectionMappings[i].name);
            break;
          }
        }
      }
    };
 
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  const measure = useCallback(() => {
    const wrap = linksWrapRef.current;
    const target = linkRefs.current[hovered ?? activeLink];
    if (!wrap || !target) return;
    const wrapRect = wrap.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    if (rect.width === 0) return;
    setIndicator({ left: rect.left - wrapRect.left, width: rect.width });
  }, [hovered, activeLink]);
 
  useEffect(() => {
    measure();
    const frame = requestAnimationFrame(() => setIndicatorReady(true));
    return () => cancelAnimationFrame(frame);
  }, [measure]);
 
  useEffect(() => {
    const wrap = linksWrapRef.current;
    window.addEventListener("resize", measure);
    let observer: ResizeObserver | null = null;
    if (wrap && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => measure());
      observer.observe(wrap);
    }
    return () => {
      window.removeEventListener("resize", measure);
      if (observer) observer.disconnect();
    };
  }, [measure]);
 
  const handleNavigation = (name: string, href: string, e?: React.MouseEvent) => {
    setActiveLink(name);
    setMenuOpen(false);
 
    if (href === "/" || href === "#home") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        if (e) e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        if (e) e.preventDefault();
        targetElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
 
  const enter = (visible: string, hidden: string) => (mounted ? visible : hidden);
 
  const renderSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.5-4 4.2v2.3H7.7V13h2.7v8h3.1Z" />
          </svg>
        );
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        );
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M5.2 8.5H2V21h3.2V8.5ZM3.6 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM22 13.8c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.8 2V8.5h-3.2V21h3.2v-6.2c0-1.6.3-3.2 2.3-3.2s2 1.9 2 3.3V21H21v-7.2Z" />
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23 7.1a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.5 15.5v-7l6 3.5-6 3.5Z" />
          </svg>
        );
      default:
        return null;
    }
  };
 
  return (
    <header className="nv-root sticky top-0 z-50 w-full font-sans">
      <div
        className={`bg-[#710D19] text-white transition-all duration-500 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
        style={{ transitionTimingFunction: smoothEase }}
      >
        <div
          className={`max-w-[1450px] mx-auto px-5 lg:px-8 min-h-[46px] flex items-center justify-between gap-4 transition-all duration-[900ms] ${enter(
            "opacity-100 translate-y-0",
            "opacity-0 -translate-y-3"
          )}`}
          style={{ transitionTimingFunction: smoothEase }}
        >
          <div className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="w-4 h-4 text-white stroke-[2]" />
              <span>
                <strong>{headerData.topBar.workingHours.prefix}</strong>{" "}
                {headerData.topBar.workingHours.time}
              </span>
            </div>
 
            <span
              className={`hidden sm:block w-[1px] h-4 bg-white/40 origin-center transition-transform duration-[900ms] ${enter(
                "scale-y-100",
                "scale-y-0"
              )}`}
              style={{ transitionDelay: "300ms", transitionTimingFunction: smoothEase }}
            />
 
            <a
              href={headerData.topBar.email.href}
              className="group hidden sm:flex items-center gap-2 transition-colors duration-200"
            >
              <Mail className="w-4 h-4 text-white stroke-[2] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
              <span className="relative">
                <strong>{headerData.topBar.email.prefix}</strong>{" "}
                {headerData.topBar.email.address}
                <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-500 group-hover:scale-x-100" />
              </span>
            </a>
          </div>
 
          <div className="hidden md:flex items-center gap-5 border-l border-white/30 pl-6">
            {headerData.topBar.socialLinks.map((social, idx) => (
              <span
                key={social.name}
                className={`block transition-all duration-700 ${enter(
                  "opacity-100 translate-y-0 scale-100",
                  "opacity-0 translate-y-2 scale-75"
                )}`}
                style={{
                  transitionDelay: `${400 + idx * 90}ms`,
                  transitionTimingFunction: smoothEase,
                }}
              >
                <a
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:-translate-y-1 hover:scale-125 transition-all duration-300"
                >
                  {renderSocialIcon(social.icon)}
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
 
      <nav
        className={`relative bg-white/95 backdrop-blur-md border-b transition-all duration-500 ${
          scrolled
            ? "shadow-md py-2.5 sm:py-3 border-neutral-200/70"
            : "shadow-xs py-4 sm:py-5 border-transparent"
        }`}
        style={{ transitionTimingFunction: smoothEase }}
      >
        <div className="max-w-[1450px] mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between gap-5">
            <a
              href="/"
              onClick={(e) => handleNavigation("Home", "/", e)}
              className={`group inline-block shrink-0 transition-all duration-[1000ms] ${enter(
                "opacity-100 translate-x-0",
                "opacity-0 -translate-x-6"
              )}`}
              style={{ transitionTimingFunction: smoothEase }}
            >
              <Image
                src={headerData.logo}
                alt={headerData.logoAlt}
                width={280}
                height={84}
                priority
                className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1 ${
                  scrolled
                    ? "h-10 sm:h-11 md:h-12 lg:h-[52px]"
                    : "h-12 sm:h-14 md:h-16 lg:h-[70px]"
                }`}
              />
            </a>
 
            <div
              ref={linksWrapRef}
              onMouseLeave={() => setHovered(null)}
              className="relative hidden lg:flex items-center justify-center flex-1 gap-6 xl:gap-8"
            >
              {headerData.links.map((link, idx) => {
                const isActive = activeLink === link.name;
                const isHovered = hovered === link.name;
                return (
                  <div
                    key={link.name}
                    className={`transition-all duration-[900ms] ${enter(
                      "opacity-100 translate-y-0 blur-0",
                      "opacity-0 -translate-y-3 blur-[3px]"
                    )}`}
                    style={{
                      transitionDelay: `${250 + idx * 70}ms`,
                      transitionTimingFunction: smoothEase,
                    }}
                  >
                    <a
                      ref={(el) => {
                        linkRefs.current[link.name] = el;
                      }}
                      href={link.href}
                      onClick={(e) => handleNavigation(link.name, link.href, e)}
                      onMouseEnter={() => setHovered(link.name)}
                      onFocus={() => setHovered(link.name)}
                      onBlur={() => setHovered(null)}
                      className={`group relative block py-2 text-[15px] xl:text-[16px] font-semibold whitespace-nowrap transition-colors duration-300 ${
                        isActive || isHovered ? "text-[#710D19]" : "text-neutral-800"
                      }`}
                    >
                      <span className="relative block overflow-hidden h-[1.4em] leading-[1.4em]">
                        <span className="block transition-transform duration-500 group-hover:-translate-y-full" style={{ transitionTimingFunction: smoothEase }}>
                          {link.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-full block text-[#710D19] transition-transform duration-500 group-hover:-translate-y-full"
                          style={{ transitionTimingFunction: smoothEase }}
                        >
                          {link.name}
                        </span>
                      </span>
                    </a>
                  </div>
                );
              })}
 
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-[2.5px] rounded-full bg-[#710D19]"
                style={{
                  width: indicator.width,
                  transform: `translateX(${indicator.left}px)`,
                  opacity: indicatorReady && indicator.width > 0 ? 1 : 0,
                  transition: indicatorReady
                    ? "transform 650ms cubic-bezier(0.34, 1.35, 0.5, 1), width 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease"
                    : "none",
                }}
              />
            </div>
 
            <a
              href={headerData.callAction.href}
              className={`hidden lg:flex items-center gap-3 border-l-2 border-neutral-200 pl-5 xl:pl-6 group shrink-0 transition-all duration-[1000ms] ${enter(
                "opacity-100 translate-x-0",
                "opacity-0 translate-x-6"
              )}`}
              style={{ transitionDelay: "500ms", transitionTimingFunction: smoothEase }}
            >
              <div className="relative">
                <span className="nv-ring absolute inset-0 rounded-full bg-[#710D19]/35" />
                <div className="relative w-11 h-11 rounded-full bg-[#710D19] flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:bg-[#580510] group-hover:scale-105">
                  <Phone className="nv-phone w-5 h-5 text-white fill-white stroke-0" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-neutral-500 font-medium leading-tight">
                  {headerData.callAction.title}
                </span>
                <span className="text-[16px] font-bold text-[#710D19] whitespace-nowrap group-hover:text-[#580510] transition-colors leading-tight">
                  {headerData.callAction.phone}
                </span>
              </div>
            </a>
 
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={headerData.links[0]?.name}
              aria-expanded={menuOpen}
              className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 active:scale-90 transition-all duration-500 ${enter(
                "opacity-100 scale-100",
                "opacity-0 scale-75"
              )}`}
              style={{ transitionTimingFunction: smoothEase }}
            >
              <span
                className={`w-5 h-[2px] bg-[#710D19] rounded-full transition-all duration-500 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-[#710D19] rounded-full transition-all duration-500 ${
                  menuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-[#710D19] rounded-full transition-all duration-500 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
 
        <div
          className={`lg:hidden grid transition-all duration-500 ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100 border-t border-neutral-100 mt-3"
              : "grid-rows-[0fr] opacity-0"
          }`}
          style={{ transitionTimingFunction: smoothEase }}
        >
          <div className="overflow-hidden">
            <div className="px-5 py-4 space-y-2 bg-neutral-50">
              {headerData.links.map((link, idx) => {
                const isActive = activeLink === link.name;
                return (
                  <div
                    key={link.name}
                    className={`transition-all duration-500 ${
                      menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                    }`}
                    style={{
                      transitionDelay: menuOpen ? `${100 + idx * 55}ms` : "0ms",
                      transitionTimingFunction: smoothEase,
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavigation(link.name, link.href, e)}
                      className={`block py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-[#710D19] bg-[#710D19]/10 pl-4 border-l-4 border-[#710D19]"
                          : "text-neutral-700 hover:text-[#710D19] hover:bg-neutral-100 hover:pl-4"
                      }`}
                    >
                      {link.name}
                    </a>
                  </div>
                );
              })}
 
              <div
                className={`pt-3 border-t border-neutral-200 transition-all duration-500 ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${150 + headerData.links.length * 55}ms` : "0ms",
                  transitionTimingFunction: smoothEase,
                }}
              >
                <a
                  href={headerData.callAction.href}
                  className="flex items-center justify-center gap-3 py-3 rounded-lg bg-[#710D19] text-white font-bold text-sm shadow-sm hover:bg-[#580510] active:scale-[0.98] transition-all duration-300"
                >
                  <Phone className="w-4 h-4 text-white fill-white stroke-0" />
                  <span>{headerData.callAction.phone}</span>
                </a>

                {headerData.topBar.socialLinks && (
                  <div
                    className={`mt-4 pt-4 border-t border-neutral-200/70 flex items-center justify-center gap-3 transition-all duration-500 ${
                      menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: menuOpen ? `${200 + headerData.links.length * 55}ms` : "0ms",
                      transitionTimingFunction: smoothEase,
                    }}
                  >
                    {headerData.topBar.socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="w-10 h-10 rounded-full bg-white text-[#710D19] border border-neutral-200 flex items-center justify-center shadow-xs hover:bg-[#710D19] hover:text-white hover:border-[#710D19] active:scale-95 transition-all duration-300"
                      >
                        {renderSocialIcon(social.icon)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
 
        <span
          ref={progressRef}
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#710D19] to-[#c9a08c]"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </nav>
 
      <style jsx global>{`
        .nv-ring {
          animation: nv-ring 3.6s ease-out 2s infinite;
        }
 
        .group:hover .nv-phone {
          animation: nv-phone 0.7s ease-in-out;
        }
 
        @keyframes nv-ring {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          60%,
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
 
        @keyframes nv-phone {
          0%,
          100% {
            transform: rotate(0deg);
          }
          20% {
            transform: rotate(-16deg);
          }
          40% {
            transform: rotate(14deg);
          }
          60% {
            transform: rotate(-10deg);
          }
          80% {
            transform: rotate(6deg);
          }
        }
 
        @media (prefers-reduced-motion: reduce) {
          .nv-root *,
          .nv-root *::before,
          .nv-root *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </header>
  );
}
 