interface NEAnnouncementTickerProps {
  countryName: string;
  standards: string[];
}

export function NEAnnouncementTicker({
  countryName,
  standards,
}: NEAnnouncementTickerProps) {
  const chunks =
    standards.length > 0
      ? standards
      : ["Global Power System Engineering", "50+ Countries"];

  return (
    <div className="bg-[#0B1A2F] overflow-hidden py-1.5 border-b border-white/5">
      <div className="animate-marquee whitespace-nowrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="inline-block mx-6">
            <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/60">
              Carelabs
            </span>
            <span className="text-orange-500 mx-3">·</span>
            <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40">
              {countryName} Power System Engineering
            </span>
            {chunks.map((item, idx) => (
              <span key={idx} className="inline-block">
                <span className="text-orange-500 mx-3">·</span>
                <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40">
                  {item}
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
