"use client";

import React from "react";
import Timeline from "@/components/ui/timeline";

const settings = {
  textColor: "#111418",
  mutedTextColor: "#52525b",
  activeColor: "#111418",
  backgroundColor: "transparent",
  duration: 1.4,
};

export default function TimelineDemo(props) {
  const s = { ...settings, ...props };
  return (
    <div className="w-full">
      <Timeline
        title="Experience & Career Journey"
        periodLabel="2023 — 2026"
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Alaika data science workspace and machine learning experiments"
        duration={s.duration}
      />
    </div>
  );
}
