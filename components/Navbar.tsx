"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Mail, Phone } from "lucide-react";
import contentData from "../data/content.json";
import { HeaderVariant } from "../data/type";

interface NavbarProps {
  data?: HeaderVariant;
}

export default function Navbar({ data }: NavbarProps) {
  const headerData: HeaderVariant =
    data ||
    (contentData.Emboria.sections.Header.variants.EmboriaHeader1 as HeaderVariant);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>(
    headerData.links.find((l) => l.active)?.name || headerData.links[0]?.name || ""
  );
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (name: string) => {
    setActiveLink(name);
    setMenuOpen(false);
  };

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
    <header className="relative z-50 w-full font-sans">
      <div className="bg-[#710D19] text-white relative overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-5 lg:px-8 min-h-[46px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="w-4 h-4 text-white stroke-[2]" />
              <span>
                <strong>{headerData.topBar.workingHours.prefix}</strong>{" "}
                {headerData.topBar.workingHours.time}
              </span>
            </div>

            <span className="hidden sm:block w-[1px] h-4 bg-white/40" />

            <a
              href={headerData.topBar.email.href}
              className="hidden sm:flex items-center gap-2 hover:text-white/80 transition-colors duration-200"
            >
              <Mail className="w-4 h-4 text-white stroke-[2]" />
              <span>
                <strong>{headerData.topBar.email.prefix}</strong>{" "}
                {headerData.topBar.email.address}
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-5 border-l border-white/30 pl-6">
            {headerData.topBar.socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 hover:-translate-y-0.5 transition-all duration-200"
              >
                {renderSocialIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <nav
        className={`bg-white transition-all duration-300 ${
          scrolled
            ? "shadow-md py-2.5"
            : "shadow-xs py-4 sm:py-5"
        }`}
      >
        <div className="max-w-[1450px] mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between gap-5">
            <a href="/" className="inline-block shrink-0 transition-opacity duration-200 hover:opacity-90">
              <Image
                src={headerData.logo}
                alt={headerData.logoAlt}
                width={200}
                height={60}
                priority
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>

            <div className="hidden lg:flex items-center justify-center flex-1 gap-6 xl:gap-8">
              {headerData.links.map((link) => {
                const isActive = activeLink === link.name;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => handleNavigation(link.name)}
                    className={`relative py-2 text-[15px] xl:text-[16px] font-semibold whitespace-nowrap transition-colors duration-200 group ${
                      isActive
                        ? "text-[#710D19]"
                        : "text-neutral-800 hover:text-[#710D19]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`absolute left-0 bottom-0 h-[2.5px] bg-[#710D19] rounded-full transition-all duration-300 ease-out ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                );
              })}
            </div>

            <a
              href={headerData.callAction.href}
              className="hidden lg:flex items-center gap-3 border-l-2 border-neutral-200 pl-5 xl:pl-6 group shrink-0"
            >
              <div className="w-11 h-11 rounded-full bg-[#710D19] flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:bg-[#580510] group-hover:scale-105">
                <Phone className="w-5 h-5 text-white fill-white stroke-0" />
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
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <span
                className={`w-5 h-[2px] bg-[#710D19] rounded-full transition-all duration-300 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-[#710D19] rounded-full transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-[#710D19] rounded-full transition-all duration-300 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-[500px] opacity-100 border-t border-neutral-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 py-4 space-y-2 bg-neutral-50">
            {headerData.links.map((link) => {
              const isActive = activeLink === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavigation(link.name)}
                  className={`block py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-[#710D19] bg-[#710D19]/10 pl-4 border-l-4 border-[#710D19]"
                      : "text-neutral-700 hover:text-[#710D19] hover:bg-neutral-100 hover:pl-4"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

            <div className="pt-3 border-t border-neutral-200">
              <a
                href={headerData.callAction.href}
                className="flex items-center justify-center gap-3 py-3 rounded-lg bg-[#710D19] text-white font-bold text-sm shadow-sm hover:bg-[#580510] transition-colors"
              >
                <Phone className="w-4 h-4 text-white fill-white stroke-0" />
                <span>{headerData.callAction.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
