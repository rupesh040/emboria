"use client";
 
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import siteData from "../data/content.json";
import { EmboriaSiteData, FooterVariant } from "../data/type";
 
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
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.38fr_1fr_0.93fr_1.06fr] gap-x-6 gap-y-10 sm:gap-10 lg:gap-0">
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 relative flex flex-col items-start lg:pr-14">
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
 
          <div className="col-span-1 emb-col relative lg:pl-12 lg:pr-10">
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
 
          <div className="col-span-1 emb-col relative lg:pl-14 lg:pr-10">
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
 
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 emb-col lg:pl-14">
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
 