"use client";
 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import siteData from "../data/content.json";
import { EmboriaSiteData, ContactVariant } from "../data/type";
 
function useInView<T extends HTMLElement>(threshold = 0.12) {
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
 
interface FieldProps {
  id: string;
  type?: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  visible: boolean;
  delay: number;
}
 
function Field({
  id,
  type = "text",
  label,
  required = false,
  value,
  onChange,
  multiline = false,
  visible,
  delay,
}: FieldProps) {
  const cleanLabel = label.replace(/\s*\*\s*$/, "");
  const inputClass =
    "peer block w-full bg-transparent px-4 pt-6 pb-2 text-neutral-800 text-sm sm:text-[15px] outline-none placeholder-transparent";
 
  return (
    <div
      className={`transition-all duration-[1100ms] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: smoothEase }}
    >
      <div className="relative rounded-xl border border-neutral-200/90 bg-[#f9f8f7] overflow-hidden shadow-[0_1px_2px_rgba(48,24,16,0.04)] transition-all duration-500 hover:border-[#d9bfb3] focus-within:border-[#700715]/70 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(112,7,21,0.07)]">
        {multiline ? (
          <textarea
            id={id}
            rows={4}
            required={required}
            value={value}
            placeholder=" "
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} resize-y min-h-[110px] sm:min-h-[125px] pt-8`}
          />
        ) : (
          <input
            id={id}
            type={type}
            required={required}
            value={value}
            placeholder=" "
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        )}
 
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 origin-left text-neutral-500 text-sm sm:text-[15px] transition-all duration-300 ${
            multiline ? "top-[17px]" : "top-1/2 -translate-y-1/2"
          } peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[#700715] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]`}
        >
          {cleanLabel}
          {required && <span className="ml-1 text-[#c0152f]">*</span>}
        </label>
 
        <span className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-[#700715] to-[#c9a08c] transition-all duration-500 peer-focus:w-full" />
      </div>
    </div>
  );
}
 
export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const timers = useRef<number[]>([]);
 
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0.12);
 
  const typedSiteData = siteData as unknown as EmboriaSiteData;
  const pageComponents = typedSiteData.Emboria.templateComponents["template-1"].pages.home.components;
  const contactComponentRef = pageComponents.find((c) => c.key === "Contact");
  const variantKey = contactComponentRef ? contactComponentRef.component : "EmboriaContact1";
  const contactData: ContactVariant = typedSiteData.Emboria.sections.Contact.variants[variantKey];
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
 
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);
 
  const reveal = (visible: string, hidden: string) => (inView ? visible : hidden);
 
  const handleSectionMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--px", String((event.clientX - rect.left) / rect.width - 0.5));
      node.style.setProperty("--py", String((event.clientY - rect.top) / rect.height - 0.5));
    },
    [sectionRef]
  );
 
  const handleSectionLeave = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;
    node.style.setProperty("--px", "0");
    node.style.setProperty("--py", "0");
  }, [sectionRef]);
 
  const handleCardMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);
 
  const parallax = (x: number, y: number): React.CSSProperties => ({
    transform: `translate3d(calc(var(--px, 0) * ${x}px), calc(var(--py, 0) * ${y}px), 0)`,
    transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  });
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
 
    const finish = window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
 
      const reset = window.setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      timers.current.push(reset);
    }, 1000);
 
    timers.current.push(finish);
  };
 
  if (!contactData) return null;
 
  const lastInfo = contactData.contactInfo.length - 1;
 
  return (
    <section
      ref={sectionRef}
      id="contact"
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
      className="ct-root py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden font-sans"
    >
      <div className="ct-drift-a absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#700715]/[0.03] blur-3xl pointer-events-none" />
      <div className="ct-drift-b absolute -bottom-40 right-[6%] w-[28rem] h-[28rem] rounded-full bg-[#B58B78]/[0.10] blur-3xl pointer-events-none" />
      <div className="ct-twinkle absolute top-[10%] left-[48%] w-1.5 h-1.5 rounded-full bg-[#8C2026]/40 pointer-events-none" />
      <div
        className="ct-twinkle absolute bottom-[16%] left-[47%] w-2 h-2 rounded-full bg-[#B58B78]/60 pointer-events-none"
        style={{ animationDelay: "1.4s" }}
      />
 
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 relative flex flex-col lg:min-h-[690px]">
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <span
                  className={`text-xs sm:text-sm font-semibold text-[#6d1322] uppercase transition-all duration-[1300ms] ${reveal(
                    "tracking-[0.12em] opacity-100 translate-x-0 blur-0",
                    "tracking-[0.4em] opacity-0 -translate-x-6 blur-sm"
                  )}`}
                  style={{ transitionTimingFunction: smoothEase }}
                >
                  {contactData.tagline}
                </span>
                {contactData.taglineDivider && (
                  <span
                    className={`w-10 sm:w-14 h-[1.5px] bg-[#6d1322] inline-block origin-left transition-all duration-[1300ms] ${reveal(
                      "scale-x-100 opacity-100",
                      "scale-x-0 opacity-0"
                    )}`}
                    style={{ transitionDelay: "350ms", transitionTimingFunction: smoothEase }}
                  />
                )}
              </div>
 
              <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-[46px] lg:text-[50px] leading-[1.15] tracking-tight">
                <span className="block overflow-hidden pb-[0.08em]">
                  <span
                    className={`block text-[#6d1322] transition-all duration-[1200ms] ${reveal(
                      "translate-y-0 opacity-100",
                      "translate-y-[110%] opacity-0"
                    )}`}
                    style={{ transitionDelay: "150ms", transitionTimingFunction: smoothEase }}
                  >
                    {contactData.headingPart1}
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.1em]">
                  <span
                    className={`ct-shimmer block transition-all duration-[1200ms] ${reveal(
                      "translate-y-0 opacity-100",
                      "translate-y-[110%] opacity-0"
                    )}`}
                    style={{ transitionDelay: "300ms", transitionTimingFunction: smoothEase }}
                  >
                    {contactData.headingHighlight}
                  </span>
                </span>
              </h2>
 
              <p
                className={`mt-3.5 sm:mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed max-w-lg transition-all duration-1000 ${reveal(
                  "opacity-100 translate-y-0 blur-0",
                  "opacity-0 translate-y-6 blur-[3px]"
                )}`}
                style={{ transitionDelay: "450ms", transitionTimingFunction: smoothEase }}
              >
                {contactData.description}
              </p>
 
              <div className="mt-7 sm:mt-9 w-full max-w-[360px]">
                {contactData.contactInfo.map((item, idx) => {
                  const base = 650 + idx * 200;
                  return (
                    <div key={item.id}>
                      <div
                        className={`group flex items-stretch gap-4 cursor-default ${
                          idx === 0 ? "pt-0" : "pt-5"
                        } ${idx === lastInfo ? "pb-0" : "pb-5"}`}
                      >
                        <div
                          className={`w-[3px] rounded-full bg-[#700715] shrink-0 origin-top transition-all duration-[1000ms] group-hover:w-1 group-hover:bg-[#a3222b] ${reveal(
                            "scale-y-100 opacity-100",
                            "scale-y-0 opacity-0"
                          )}`}
                          style={{
                            transitionDelay: `${base}ms`,
                            transitionTimingFunction: smoothEase,
                          }}
                        />
 
                        <div
                          className={`transition-all duration-1000 ${reveal(
                            "opacity-100 translate-x-0",
                            "opacity-0 -translate-x-8"
                          )}`}
                          style={{
                            transitionDelay: `${base + 100}ms`,
                            transitionTimingFunction: smoothEase,
                          }}
                        >
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#6d1322] tracking-tight transition-transform duration-500 group-hover:translate-x-1">
                            {item.title}
                          </h3>
                          {item.href && item.href !== "#" ? (
                            <a
                              href={item.href}
                              className="relative inline-block text-neutral-800 font-semibold text-sm sm:text-base whitespace-pre-line leading-snug hover:text-[#700715] transition-all duration-500 group-hover:translate-x-1"
                            >
                              {item.value}
                              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#700715]/60 transition-transform duration-500 group-hover:scale-x-100" />
                            </a>
                          ) : (
                            <p className="text-neutral-800 font-semibold text-sm sm:text-base whitespace-pre-line leading-snug transition-transform duration-500 group-hover:translate-x-1">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
 
                      {idx < lastInfo && (
                        <div
                          className={`h-px w-full bg-gradient-to-r from-[#ecdfd8] via-[#f2e9e4] to-transparent origin-left transition-all duration-[1400ms] ${reveal(
                            "scale-x-100 opacity-100",
                            "scale-x-0 opacity-0"
                          )}`}
                          style={{
                            transitionDelay: `${base + 300}ms`,
                            transitionTimingFunction: smoothEase,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
 
            <div className="ct-spin hidden lg:block absolute bottom-[6%] left-[34%] w-72 h-72 rounded-full border border-dashed border-[#780F1C]/15 pointer-events-none">
              <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-[#8A1824]/60" />
            </div>
 
            <div className="relative lg:absolute lg:bottom-0 lg:-left-8 w-full lg:w-[calc(100%+2rem)] h-[260px] sm:h-[340px] lg:h-[470px] mt-6 lg:mt-0 pointer-events-none">
              <div className="absolute inset-0">
                <Image
                  src={contactData.image.src}
                  alt={contactData.image.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-bottom-left"
                />
              </div>
            </div>
          </div>
 
          <div
            className={`lg:col-span-6 flex items-start justify-center lg:justify-end lg:mt-10 transition-all duration-[1400ms] ${reveal(
              "opacity-100 translate-x-0 translate-y-0 scale-100",
              "opacity-0 translate-x-16 translate-y-6 scale-95"
            )}`}
            style={{ transitionDelay: "400ms", transitionTimingFunction: smoothEase }}
          >
            <div
              onMouseMove={handleCardMove}
              className="group/card relative w-full max-w-xl bg-white rounded-3xl border border-[#eddcd4] p-7 sm:p-9 md:p-10 shadow-[0_2px_12px_rgba(48,24,16,0.04)] hover:shadow-[0_30px_60px_rgba(112,7,21,0.12)] hover:border-[#d9b8ad] transition-all duration-500 overflow-hidden"
            >
              <span className="ct-glare pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
 
              <span
                className={`ct-corner absolute top-0 right-0 pointer-events-none origin-top-right transition-all duration-[1300ms] group-hover/card:scale-110 ${reveal(
                  "scale-100 opacity-100",
                  "scale-0 opacity-0"
                )}`}
                style={{ transitionDelay: "900ms", transitionTimingFunction: springEase }}
              />
 
              <div className="relative">
                <h3 className="font-serif font-bold text-2xl sm:text-3xl md:text-[34px] text-[#6d1322] tracking-tight overflow-hidden pb-1">
                  <span
                    className={`block transition-all duration-[1200ms] ${reveal(
                      "translate-y-0 opacity-100",
                      "translate-y-[110%] opacity-0"
                    )}`}
                    style={{ transitionDelay: "800ms", transitionTimingFunction: smoothEase }}
                  >
                    {contactData.form.title}
                  </span>
                </h3>
                <p
                  className={`text-neutral-600 text-xs sm:text-sm mt-1.5 leading-relaxed transition-all duration-1000 ${reveal(
                    "opacity-100 translate-y-0",
                    "opacity-0 translate-y-4"
                  )}`}
                  style={{ transitionDelay: "950ms", transitionTimingFunction: smoothEase }}
                >
                  {contactData.form.description}
                </p>
 
                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      id="contact-name"
                      label={contactData.form.namePlaceholder}
                      required
                      value={formData.name}
                      onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
                      visible={inView}
                      delay={1050}
                    />
 
                    <Field
                      id="contact-email"
                      type="email"
                      label={contactData.form.emailPlaceholder}
                      required
                      value={formData.email}
                      onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                      visible={inView}
                      delay={1150}
                    />
 
                    <Field
                      id="contact-phone"
                      type="tel"
                      label={contactData.form.phonePlaceholder}
                      required
                      value={formData.phone}
                      onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                      visible={inView}
                      delay={1250}
                    />
 
                    <div
                      className={`transition-all duration-[1100ms] ${reveal(
                        "opacity-100 translate-y-0",
                        "opacity-0 translate-y-8"
                      )}`}
                      style={{ transitionDelay: "1350ms", transitionTimingFunction: smoothEase }}
                    >
                      <div className="group/sel relative h-full rounded-xl border border-neutral-200/90 bg-[#f9f8f7] overflow-hidden shadow-[0_1px_2px_rgba(48,24,16,0.04)] transition-all duration-500 hover:border-[#d9bfb3] focus-within:border-[#700715]/70 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(112,7,21,0.07)]">
                        <select
                          value={formData.service}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, service: e.target.value }))
                          }
                          className="peer block w-full h-full min-h-[52px] px-4 py-3 bg-transparent text-neutral-700 text-sm sm:text-[15px] outline-none appearance-none cursor-pointer pr-10"
                        >
                          <option value="" disabled className="text-neutral-400">
                            {contactData.form.servicePlaceholder}
                          </option>
                          {contactData.form.servicesOptions.map((opt) => (
                            <option key={opt} value={opt} className="text-neutral-800">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none transition-transform duration-500 group-focus-within/sel:rotate-180 group-focus-within/sel:text-[#700715]" />
                        <span className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-[#700715] to-[#c9a08c] transition-all duration-500 peer-focus:w-full" />
                      </div>
                    </div>
                  </div>
 
                  <Field
                    id="contact-message"
                    label={contactData.form.messagePlaceholder}
                    required
                    multiline
                    value={formData.message}
                    onChange={(value) => setFormData((prev) => ({ ...prev, message: value }))}
                    visible={inView}
                    delay={1450}
                  />
 
                  {contactData.form.buttonText && (
                    <div
                      className={`pt-1 flex items-center justify-between flex-wrap gap-3 transition-all duration-1000 ${reveal(
                        "opacity-100 translate-y-0",
                        "opacity-0 translate-y-6"
                      )}`}
                      style={{ transitionDelay: "1600ms", transitionTimingFunction: smoothEase }}
                    >
                      <button
                        type="submit"
                        disabled={sending}
                        className="group/btn relative overflow-hidden w-full sm:w-auto px-7 py-3 bg-[#700715] hover:bg-[#590611] text-white text-sm sm:text-[15px] font-semibold rounded-xl shadow-[0_8px_20px_rgba(112,7,21,0.25)] hover:shadow-[0_14px_30px_rgba(112,7,21,0.38)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:cursor-wait disabled:opacity-90 inline-flex items-center justify-center gap-2"
                      >
                        <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] ease-out group-hover/btn:translate-x-[420%]" />
                        <span className="relative">{contactData.form.buttonText}</span>
                        {sending ? (
                          <Loader2 className="relative w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="relative w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 group-hover/btn:rotate-12" />
                        )}
                      </button>
 
                      {submitted && contactData.form.successMessage && (
                        <span className="ct-pop inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-700">
                          <span className="relative flex h-5 w-5 items-center justify-center">
                            <span className="ct-ring absolute inset-0 rounded-full bg-emerald-500/40" />
                            <CheckCircle2 className="relative h-5 w-5" />
                          </span>
                          {contactData.form.successMessage}
                        </span>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <style jsx global>{`
        #contact {
          scroll-margin-top: 80px;
        }
 
        .ct-corner {
          width: 76px;
          height: 76px;
          background: radial-gradient(circle 76px at 0% 100%, transparent 75px, #700715 76px);
        }
 
        @media (min-width: 640px) {
          .ct-corner {
            width: 112px;
            height: 112px;
            background: radial-gradient(circle 112px at 0% 100%, transparent 111px, #700715 112px);
          }
        }
 
        .ct-glare {
          background: radial-gradient(
            circle at var(--mx, 50%) var(--my, 50%),
            rgba(140, 32, 38, 0.06),
            transparent 55%
          );
        }
 
        .ct-shimmer {
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
          animation: ct-shimmer 6s ease-in-out 2.5s infinite;
        }
 
        .ct-spin {
          animation: ct-spin 45s linear infinite;
        }
 
        .ct-drift-a {
          animation: ct-drift 14s ease-in-out infinite alternate;
        }
 
        .ct-drift-b {
          animation: ct-drift 12s ease-in-out infinite alternate-reverse;
        }
 
        .ct-twinkle {
          animation: ct-twinkle 3.6s ease-in-out infinite;
        }
 
        .ct-pop {
          animation: ct-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
 
        .ct-ring {
          animation: ct-ring 1.8s ease-out 2;
        }
 
        @keyframes ct-shimmer {
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
 
        @keyframes ct-spin {
          to {
            transform: rotate(360deg);
          }
        }
 
        @keyframes ct-drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(40px, 26px, 0) scale(1.15);
          }
        }
 
        @keyframes ct-twinkle {
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
 
        @keyframes ct-pop {
          0% {
            opacity: 0;
            transform: translateX(-14px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
 
        @keyframes ct-ring {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-root *,
          .ct-root *::before,
          .ct-root *::after {
            animation: none !important;
            transition: none !important;
          }
 
          .ct-shimmer {
            background-position: 0% 0;
          }
        }
      `}</style>
    </section>
  );
}
 