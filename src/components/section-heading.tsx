import { ScrollReveal } from "@/components/scroll-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : ""}>
      <ScrollReveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
          {eyebrow}
        </p>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h2
          className={`font-display mt-3 text-display-lg uppercase tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={200}>
          <p
            className={`mt-5 text-lg leading-relaxed ${
              dark ? "text-white/70" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
