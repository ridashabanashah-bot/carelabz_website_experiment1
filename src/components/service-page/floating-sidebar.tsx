"use client";
import { Mail, MessageCircle, Send } from "lucide-react";
import Link from "next/link";

export function FloatingSidebar() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
      <Link
        href="mailto:info@carelabz.com"
        className="bg-white rounded-[32px] shadow-lg px-5 py-2.5 text-sm font-medium text-[#0050B3] hover:bg-[#0050B3] hover:text-white transition-all border border-blue-100 flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Email Us
      </Link>
      <Link
        href="https://api.whatsapp.com/send?phone=+15558021083"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-[32px] shadow-lg px-5 py-2.5 text-sm font-medium text-[#0050B3] hover:bg-[#0050B3] hover:text-white transition-all border border-blue-100 flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Chat with Us
      </Link>
      <Link
        href="/us/contact/"
        className="bg-white rounded-[32px] shadow-lg px-5 py-2.5 text-sm font-medium text-[#0050B3] hover:bg-[#0050B3] hover:text-white transition-all border border-blue-100 flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
        Enquire Now
      </Link>
    </div>
  );
}
