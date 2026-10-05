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
        periodLabel="2020 — 2026"
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        imageUrl="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Alaika Developer Workspace and Engineering"
        duration={s.duration}
      />
    </div>
  );
}
