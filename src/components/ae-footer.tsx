import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface AEFooterProps {
  config: CountryConfig;
}

export function AEFooter({ config }: AEFooterProps) {
  return (
    <footer className="bg-[#0A1628]">
      <div className="h-[3px] bg-gradient-to-r from-[#1E5A8A] via-[#2D7AB8] to-[#1E5A8A]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Image
              src="/images/logo/carelabs-logo.png"
              alt="Carelabs"
              width={130}
              height={43}
              className="h-8 w-auto mb-6"
            />
            <p className="font-ae-body text-sm text-white/30 leading-relaxed">
              {config.footerDescription}
            </p>
          </div>

          <div>
            <h4 className="font-ae-nav font-semibold text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {config.services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="font-ae-body text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-ae-nav font-semibold text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li><Link href={config.aboutPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">About</Link></li>
              <li><Link href={config.blogIndexPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">Insights</Link></li>
              {config.caseStudyPath && (
                <li><Link href={config.caseStudyPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">Case Studies</Link></li>
              )}
              <li><Link href={config.contactPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-ae-nav font-semibold text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mb-5">
              Contact
            </h4>
            <a
              href="mailto:info@carelabz.com"
              className="font-ae-body text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#2D7AB8]" />
              info@carelabz.com
            </a>
          </div>
        </div>

        <div className="border-t border-[#1E5A8A]/15 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-ae-body text-xs text-white/20">
            &copy; {new Date().getFullYear()} Carelabs. All rights reserved.
          </p>
          <p className="font-ae-display text-4xl lg:text-5xl text-white/[0.03] uppercase tracking-widest select-none">
            CARELABS
          </p>
        </div>
      </div>
    </footer>
  );
}
