"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import siteData from "../data/content.json";
import { EmboriaSiteData, FooterVariant } from "../data/type";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  const typedSiteData = siteData as unknown as EmboriaSiteData;
  const sharedFooterKey = typedSiteData.Emboria.templateComponents["template-1"].shared.Footer || "EmboriaFooter1";
  const footerData: FooterVariant = typedSiteData.Emboria.sections.Footer.variants[sharedFooterKey];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!footerData) return null;

  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-0 transition-all duration-1000 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="lg:col-span-4 lg:pr-10 xl:pr-14 flex flex-col items-start lg:border-r lg:border-neutral-200/80">
            <Link href="/" className="inline-block relative h-12 w-44 sm:h-14 sm:w-48 mb-4">
              <Image
                src={footerData.logo}
                alt={footerData.logoAlt}
                fill
                priority
                sizes="(max-width: 640px) 176px, 192px"
                className="object-contain object-left hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-neutral-600 text-sm sm:text-[15px] leading-relaxed max-w-sm">
              {footerData.description}
            </p>
          </div>

          <div className="lg:col-span-2 lg:px-8 lg:border-r lg:border-neutral-200/80">
            <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#6d1322] tracking-tight">
              {footerData.quickLinksTitle}
            </h3>
            <div className="w-9 sm:w-11 h-[2px] bg-[#6d1322] mt-2 mb-5" />
            <ul className="space-y-3">
              {footerData.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center text-neutral-600 hover:text-[#6d1322] text-sm sm:text-[15px] transition-colors duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#6d1322] mr-2 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 lg:px-8 lg:border-r lg:border-neutral-200/80">
            <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#6d1322] tracking-tight">
              {footerData.supportTitle}
            </h3>
            <div className="w-9 sm:w-11 h-[2px] bg-[#6d1322] mt-2 mb-5" />
            <ul className="space-y-3">
              {footerData.supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center text-neutral-600 hover:text-[#6d1322] text-sm sm:text-[15px] transition-colors duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#6d1322] mr-2 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:pl-10">
            <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#6d1322] tracking-tight">
              {footerData.contactTitle}
            </h3>
            <div className="w-9 sm:w-11 h-[2px] bg-[#6d1322] mt-2 mb-5" />
            <div className="space-y-4">
              {footerData.contactItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 text-neutral-700 text-sm sm:text-[15px]">
                  {item.icon === "phone" && (
                    <Phone className="w-4 h-4 text-[#700715] shrink-0 mt-1" />
                  )}
                  {item.icon === "email" && (
                    <Mail className="w-4 h-4 text-[#700715] shrink-0 mt-1" />
                  )}
                  {item.icon === "location" && (
                    <MapPin className="w-4 h-4 text-[#700715] shrink-0 mt-1" />
                  )}
                  {item.href && item.href !== "#" ? (
                    <a
                      href={item.href}
                      className="hover:text-[#6d1322] whitespace-pre-line leading-relaxed transition-colors font-medium text-neutral-800"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="whitespace-pre-line leading-relaxed font-medium text-neutral-800">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#700715] border-t-[3.5px] border-[#dfb48c] py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white text-xs sm:text-sm font-normal text-left tracking-wide opacity-95">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}