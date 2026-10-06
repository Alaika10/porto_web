"use client";

import React, {
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (e) {
    console.warn("GSAP ScrollTrigger registration:", e);
  }
}

/* Inline stand-in for @gsap/react's useGSAP */
function useGSAP(
  callback,
  options
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef(null);
  const cleanupRef = useRef(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : scope;
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

const defaultTopJourneyData = [
  {
    id: "2023-march",
    year: "2023",
    month: "March",
    content: "Started Informatics studies and first public experiments in Python and data analysis",
  },
  {
    id: "2024-july",
    year: "2024",
    month: "July",
    content: "Shipped exploratory analyses and classification notebooks, including air-quality work",
  },
  {
    id: "2025-april",
    year: "2025",
    month: "April",
    content: "Contributed to Strukly AI for UMKM — receipt intelligence and applied analytics",
  },
  {
    id: "2026-may",
    year: "2026",
    month: "May",
    content: "Deepening generative AI, computer vision, and machine learning engineering practice",
  },
];

const defaultBottomJourneyData = [
  {
    id: "2023-november",
    year: "2023",
    month: "November",
    content: "Built foundational SQL, statistics, and Jupyter workflows for coursework",
  },
  {
    id: "2024-october",
    year: "2024",
    month: "October",
    content: "Published healthcare classification experiments with logistic regression",
  },
  {
    id: "2025-september",
    year: "2025",
    month: "September",
    content: "Explored body-language decoding with vision models and DataLabs dashboards",
  },
];

export default function Timeline({
  title = "Career & Experience Journey",
  periodLabel = "2023 — 2026",
  textColor = "#111418",
  mutedTextColor = "#52525b",
  activeColor = "#111418",
  backgroundColor = "#eceeee",
  imageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
  imageAlt = "Developer workspace and coding architecture",
  duration,
  scrollDuration = 1.2,
  topItems = defaultTopJourneyData,
  bottomItems = defaultBottomJourneyData,
}) {
  const sectionRef = useRef(null);
  const wholeSliderRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const allJourneyItems = [
    ...topItems,
    ...bottomItems,
  ].sort((a, b) => {
    const yearDiff = Number(a.year) - Number(b.year);
    if (yearDiff !== 0) return yearDiff;
    return monthOrder[a.month] - monthOrder[b.month];
  });

  const sectionStyle = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle = {
    color: mutedTextColor,
  };

  useGSAP(() => {
    const section = sectionRef.current;
    const slider = wholeSliderRef.current;

    if (!section || !slider) return;

    // Calculate exact horizontal movement distance
    const getTotalScroll = () => {
      if (!slider) return window.innerWidth * 2;
      return slider.scrollWidth - window.innerWidth + 120;
    };

    // Pinned Horizontal Scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getTotalScroll()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      defaults: {
        ease: "none",
      },
    });

    // Horizontal sliding of entire track
    tl.to(slider, {
      x: () => -getTotalScroll(),
      ease: "none",
    }, 0);

    // Center connecting line drawing progress
    tl.to(".journey-line", {
      width: "100%",
      ease: "none",
    }, 0);

    // Early responsive reveal of milestone stems and copy as you scroll
    if (!reducedMotion) {
      allJourneyItems.forEach((item, index) => {
        const isTop = topItems.some((topItem) => topItem.id === item.id);
        const lineSelector = `.jl-${item.id}`;
        const dotSelector = `.jd-${item.id}`;

        if (!isTop) {
          gsap.set(lineSelector, { transformOrigin: "top top" });
        } else {
          gsap.set(lineSelector, { transformOrigin: "bottom bottom" });
        }

        // Complete all item reveals within the first 45% of scroll distance
        // so that all descriptions are 100% open and readable long before reaching the end
        const itemFrac = index / Math.max(1, allJourneyItems.length - 1);
        const startPos = itemFrac * 0.38;
        const dur = 0.08;

        tl.fromTo(
          lineSelector,
          { scaleY: 0 },
          { scaleY: 1, duration: dur, ease: "power1.out" },
          startPos
        );
        tl.fromTo(
          dotSelector,
          { scale: 0 },
          { scale: 1, duration: dur, ease: "back.out(2)" },
          startPos
        );
        tl.fromTo(
          `.title-${item.id}`,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: dur, ease: "power2.out" },
          startPos + 0.01
        );
        tl.fromTo(
          `.description-${item.id}`,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: dur, ease: "power2.out" },
          startPos + 0.02
        );
      });
    }

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [reducedMotion], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full h-screen overflow-hidden relative flex items-center select-none"
      style={sectionStyle}
    >
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Floating Section Title in top-left */}
      <div className="absolute top-8 left-12 z-20 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-600">
          02 / Experience Timeline
        </span>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={wholeSliderRef}
        className="flex h-[75vh] items-center gap-[5vw] px-[6vw] flex-shrink-0 w-max relative z-10"
      >
        {/* Intro Photo Card */}
        <div className="h-[62vh] w-[28vw] min-w-[340px] max-w-[440px] overflow-hidden rounded-[24px] shadow-xl border border-black/10 flex-shrink-0 bg-white p-3 flex flex-col justify-between">
          <div className="h-[75%] w-full overflow-hidden rounded-[18px]">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-3">
            <h3 className="text-xl font-bold text-neutral-900 leading-tight mb-1">Alaika · Data & AI</h3>
            <p className="text-xs text-neutral-500 font-mono">Scroll right to explore career timeline &rarr;</p>
          </div>
        </div>

        {/* Interactive Milestone Matrix */}
        <div className="relative h-full w-[200vw] min-w-[1800px] flex-shrink-0 flex flex-col justify-between py-6">
          {/* Central Horizontal Connecting Axis Line */}
          <div className="w-full absolute left-0 top-[50%] -translate-y-1/2 flex items-center">
            <div className="h-3 w-3 rounded-full bg-black flex-shrink-0 shadow-md" />
            <div className="h-[2px] w-[0%] bg-black/80 rounded-full journey-line flex-grow" />
            <div className="h-3 w-3 rounded-full bg-black flex-shrink-0 shadow-md" />
          </div>

          {/* Top Row Milestones */}
          <div className="flex h-[45%] w-full items-end pb-8">
            <div className="w-[18%] flex-shrink-0 pr-6">
              <h2 className="text-3xl font-extrabold tracking-tight leading-[1.05] text-neutral-900">
                {title}
              </h2>
            </div>

            <div className="flex w-full gap-x-[16vw]">
              {topItems.map((item) => (
                <div
                  key={`top-${item.id}`}
                  className="relative w-[24vw] min-w-[280px] max-w-[380px] flex-shrink-0"
                >
                  {/* Stem & Dot leading down to axis */}
                  <div className="absolute left-4 bottom-[-32px] h-[32px] w-full pointer-events-none">
                    <div
                      className={`h-full w-[2px] origin-bottom bg-black/80 rounded-full jl-${item.id}`}
                    />
                    <div
                      className={`size-3 -translate-x-[5px] translate-y-[-2px] aspect-square rounded-full bg-black jd-${item.id}`}
                    />
                  </div>

                  <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-lg space-y-2">
                    <h4 className={`title-${item.id} text-2xl font-bold text-neutral-900 tracking-tight leading-none`}>
                      {item.year} <span className="text-sm font-semibold text-neutral-400 font-mono ml-1">{item.month}</span>
                    </h4>
                    <p className={`description-${item.id} text-sm leading-relaxed text-neutral-600`} style={mutedTextStyle}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row Milestones */}
          <div className="flex h-[45%] w-full items-start pt-8">
            <div className="w-[18%] flex-shrink-0 pr-6">
              <p className="text-sm font-mono tracking-widest uppercase font-bold text-neutral-500">
                {periodLabel}
              </p>
            </div>

            <div className="flex w-full gap-x-[18vw] ml-[8vw]">
              {bottomItems.map((item) => (
                <div
                  key={`bottom-${item.id}`}
                  className="relative w-[24vw] min-w-[280px] max-w-[380px] flex-shrink-0"
                >
                  {/* Stem & Dot leading up to axis */}
                  <div className="absolute left-4 top-[-32px] h-[32px] w-full pointer-events-none">
                    <div
                      className={`h-full w-[2px] origin-top bg-black/80 rounded-full jl-${item.id}`}
                    />
                    <div
                      className={`size-3 -translate-x-[5px] -translate-y-[10px] aspect-square rounded-full bg-black jd-${item.id}`}
                    />
                  </div>

                  <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-lg space-y-2">
                    <h4 className={`title-${item.id} text-2xl font-bold text-neutral-900 tracking-tight leading-none`}>
                      {item.year} <span className="text-sm font-semibold text-neutral-400 font-mono ml-1">{item.month}</span>
                    </h4>
                    <p className={`description-${item.id} text-sm leading-relaxed text-neutral-600`} style={mutedTextStyle}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
