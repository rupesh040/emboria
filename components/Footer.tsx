"use client";
 
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import siteData from "../data/content.json";
import { EmboriaSiteData, FooterVariant } from "../data/type";
 
const css = `
.emb-wipe {
  clip-path: inset(-8px 100% -8px 0);
  transition: clip-path 1000ms cubic-bezier(0.77, 0, 0.18, 1) var(--d, 0ms);
}
.emb-in .emb-wipe {
  clip-path: inset(-8px -8px -8px -8px);
}
 
.emb-rule {
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 1200ms cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms);
}
.emb-in .emb-rule {
  transform: scaleY(1);
}
 
.emb-bar {
  width: 2.75rem;
  transform: scaleX(0);
  transform-origin: left;
  transition:
    transform 800ms cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms),
    width 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.emb-in .emb-bar {
  transform: scaleX(1);
}
.emb-col:hover .emb-bar,
.emb-col:focus-within .emb-bar {
  width: 4.5rem;
}
 
.emb-link {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.emb-link .emb-chev {
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), color 250ms ease;
}
.emb-link .emb-label {
  position: relative;
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.emb-link .emb-label::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 500ms cubic-bezier(0.65, 0, 0.35, 1);
}
.emb-link:hover .emb-label,
.emb-link:focus-visible .emb-label {
  transform: translateX(5px);
}
.emb-link:hover .emb-label::after,
.emb-link:focus-visible .emb-label::after {
  transform: scaleX(1);
  transform-origin: left;
}
.emb-link:hover .emb-chev,
.emb-link:focus-visible .emb-chev {
  transform: translateX(4px);
  color: #7b1325;
}
.emb-link:focus-visible {
  outline: 1px solid #7b1325;
  outline-offset: 6px;
}
 
.emb-ic svg {
  transform-origin: 50% 60%;
}
.emb-contact:hover .emb-ic-phone svg {
  animation: emb-ring 800ms ease-in-out;
}
.emb-contact:hover .emb-ic-email svg {
  animation: emb-lift 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.emb-contact:hover .emb-ic-location svg {
  animation: emb-hop 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
 
.emb-gold {
  position: relative;
  height: 4px;
  overflow: hidden;
  background: linear-gradient(90deg, #efd9b8, #dfb48c 50%, #efd9b8);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1400ms cubic-bezier(0.65, 0, 0.35, 1) 200ms;
}
.emb-gold::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 30%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  transform: translateX(-120%);
}
.emb-in .emb-gold {
  transform: scaleX(1);
}
.emb-in .emb-gold::after {
  animation: emb-glint 1800ms cubic-bezier(0.65, 0, 0.35, 1) 1500ms forwards;
}
 
@keyframes emb-glint {
  to {
    transform: translateX(440%);
  }
}
@keyframes emb-ring {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-16deg); }
  40% { transform: rotate(14deg); }
  60% { transform: rotate(-9deg); }
  80% { transform: rotate(5deg); }
}
@keyframes emb-lift {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(-8deg); }
}
@keyframes emb-hop {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  70% { transform: translateY(0); }
  85% { transform: translateY(-2px); }
}
 
@media (prefers-reduced-motion: reduce) {
  .emb-wipe { clip-path: inset(-8px) !important; transition: none !important; }
  .emb-rule, .emb-bar, .emb-gold { transform: none !important; transition: none !important; }
  .emb-gold::after { animation: none !important; display: none; }
  .emb-link .emb-label, .emb-link .emb-chev, .emb-link .emb-label::after { transition: none !important; }
  .emb-contact:hover .emb-ic svg { animation: none !important; }
}
`;
 
const d = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);
 
export default function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
 
  const typedSiteData = siteData as unknown as EmboriaSiteData;
  const sharedFooterKey =
    typedSiteData.Emboria.templateComponents["template-1"].shared.Footer || "EmboriaFooter1";
  const footerData: FooterVariant = typedSiteData.Emboria.sections.Footer.variants[sharedFooterKey];
 
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
 
  if (!footerData) return null;
 
  const headingClass =
    "emb-wipe w-fit font-serif font-bold text-xl sm:text-[22px] text-[#7b1325] tracking-tight";
  const linkClass =
    "emb-link text-neutral-800 hover:text-[#7b1325] text-sm sm:text-[15.5px] transition-colors duration-300";
 
  return (
    <footer ref={ref} className={`bg-white ${inView ? "emb-in" : ""}`}>
      <style>{css}</style>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.38fr_1fr_0.93fr_1.06fr] gap-10 lg:gap-0">
          <div className="relative flex flex-col items-start lg:pr-14">
            <Link
              href="/"
              style={d(100)}
              className="emb-wipe inline-block relative h-12 w-44 sm:h-14 sm:w-52 mb-5"
            >
              <Image
                src={footerData.logo}
                alt={footerData.logoAlt}
                fill
                priority
                sizes="(max-width: 640px) 176px, 208px"
                className="object-contain object-left"
              />
            </Link>
            <p
              style={d(380)}
              className="emb-wipe text-neutral-600 text-sm sm:text-[15px] leading-relaxed max-w-sm"
            >
              {footerData.description}
            </p>
            <span
              style={d(0)}
              className="emb-rule hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-neutral-200"
            />
          </div>
 
          <div className="emb-col relative lg:pl-12 lg:pr-10">
            <h3 style={d(200)} className={headingClass}>
              {footerData.quickLinksTitle}
            </h3>
            <div style={d(480)} className="emb-bar h-[2px] bg-[#b36b57] mt-3 mb-7" />
            <ul className="space-y-4">
              {footerData.quickLinks.map((link, i) => (
                <li key={link.name} style={d(600 + i * 100)} className="emb-wipe">
                  <a href={link.href} className={linkClass}>
                    <ChevronRight
                      strokeWidth={1.75}
                      className="emb-chev w-4 h-4 text-[#8a5c52] mr-3 shrink-0"
                    />
                    <span className="emb-label">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            <span
              style={d(120)}
              className="emb-rule hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-neutral-200"
            />
          </div>
 
          <div className="emb-col relative lg:pl-14 lg:pr-10">
            <h3 style={d(320)} className={headingClass}>
              {footerData.supportTitle}
            </h3>
            <div style={d(600)} className="emb-bar h-[2px] bg-[#b36b57] mt-3 mb-7" />
            <ul className="space-y-4">
              {footerData.supportLinks.map((link, i) => (
                <li key={link.name} style={d(720 + i * 100)} className="emb-wipe">
                  <a href={link.href} className={linkClass}>
                    <ChevronRight
                      strokeWidth={1.75}
                      className="emb-chev w-4 h-4 text-[#8a5c52] mr-3 shrink-0"
                    />
                    <span className="emb-label">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            <span
              style={d(240)}
              className="emb-rule hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-neutral-200"
            />
          </div>
 
          <div className="emb-col lg:pl-14">
            <h3 style={d(440)} className={headingClass}>
              {footerData.contactTitle}
            </h3>
            <div style={d(720)} className="emb-bar h-[2px] bg-[#b36b57] mt-3 mb-7" />
            <div className="space-y-5">
              {footerData.contactItems.map((item, i) => (
                <div
                  key={item.id}
                  style={d(840 + i * 120)}
                  className="emb-wipe emb-contact flex items-start gap-4 text-neutral-800 text-sm sm:text-[15.5px]"
                >
                  <span className={`emb-ic emb-ic-${item.icon} shrink-0 mt-0.5 text-[#7b1325]`}>
                    {item.icon === "phone" && <Phone strokeWidth={1.5} className="w-5 h-5" />}
                    {item.icon === "email" && <Mail strokeWidth={1.5} className="w-5 h-5" />}
                    {item.icon === "location" && <MapPin strokeWidth={1.5} className="w-5 h-5" />}
                  </span>
                  {item.href && item.href !== "#" ? (
                    <a
                      href={item.href}
                      className="whitespace-pre-line leading-relaxed transition-colors duration-300 hover:text-[#7b1325]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="whitespace-pre-line leading-relaxed">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
 
      <div className="bg-[#700715]">
        <div className="emb-gold" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <p
            style={d(1000)}
            className="emb-wipe w-fit text-white text-xs sm:text-sm font-normal text-left tracking-wide opacity-95"
          >
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
 