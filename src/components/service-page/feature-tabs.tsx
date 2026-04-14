"use client";
import { useState } from "react";

interface Feature {
  title: string;
  description: string;
}

export function FeatureTabs({ features }: { features: Feature[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!features || features.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div className="space-y-2">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all ${
              activeIndex === index
                ? "bg-blue-50 border-l-4 border-[#0050B3] text-[#0050B3] font-semibold"
                : "text-[#374151] hover:bg-gray-50"
            }`}
          >
            {feature.title}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-[30px] shadow-md p-12 min-h-[400px]">
        <h3 className="text-2xl font-bold text-[#1A2538] mb-6">
          {features[activeIndex].title}
        </h3>
        <p className="text-[#374151] text-lg leading-relaxed">
          {features[activeIndex].description}
        </p>
      </div>
    </div>
  );
}
