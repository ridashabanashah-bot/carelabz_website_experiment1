"use client";

import { useEffect, useState } from "react";

interface RotatingWordProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export function RotatingWord({ words, intervalMs = 2500, className = "" }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (words.length <= 1) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const id = window.setInterval(() => {
        setIndex((i) => (i + 1) % words.length);
      }, intervalMs);
      return () => window.clearInterval(id);
    }

    const id = window.setInterval(() => {
      setAnimating(true);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setAnimating(false);
      }, 350);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [words, intervalMs]);

  if (words.length === 0) return null;

  return (
    <span className={`relative inline-block overflow-hidden align-baseline ${className}`}>
      <span
        className={`inline-block transition-all duration-300 ease-[cubic-bezier(0,0.55,0.45,1)] ${
          animating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}
