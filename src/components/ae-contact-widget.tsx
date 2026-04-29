"use client";

import { useEffect, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

interface AEContactWidgetProps {
  email?: string;
  emailSubject?: string;
  whatsappNumber?: string; // E.164 digits only, e.g. "971500000000"
  whatsappMessage?: string;
}

export function AEContactWidget({
  email = "info@carelabz.com",
  emailSubject = "CL Inquiry",
  whatsappNumber = "971500000000",
  whatsappMessage = "Hi Carelabs, I'd like to know more about your services.",
}: AEContactWidgetProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const mailHref = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const buttonClass =
    "group relative flex h-12 w-12 items-center justify-center bg-[#094D76] text-[#F15C30] shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#F15C30] hover:text-white";

  return (
    <aside
      aria-label="Quick contact"
      className={`fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 transition-all duration-500 sm:right-4 ${
        shown ? "opacity-100 translate-x-0" : "translate-x-12 opacity-0"
      }`}
    >
      <a
        href={mailHref}
        aria-label="Email Carelabs"
        title="Email us"
        className={buttonClass}
      >
        <Mail className="h-5 w-5" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap bg-[#094D76] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Email us
        </span>
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Carelabs"
        title="WhatsApp us"
        className={buttonClass}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap bg-[#094D76] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          WhatsApp us
        </span>
      </a>
    </aside>
  );
}
