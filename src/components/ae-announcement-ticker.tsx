"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AEAnnouncementTickerProps {
  countryName: string;
  standards: string[];
}

export function AEAnnouncementTicker({ countryName, standards }: AEAnnouncementTickerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-[#163560] text-white relative z-[70]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-2">
        <p className="font-ae-body text-xs text-white/60">
          Trusted for <span className="text-[#F97316] font-medium">{standards[0]}</span> compliance across the {countryName}
        </p>
        <button
          onClick={() => setVisible(false)}
          className="text-white/30 hover:text-white transition-colors ml-4 shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
