// components/TrendingCategories.tsx
"use client";

import * as React from "react";

export type Category = {
  id: string;
  label: string;
  href?: string;           // optional link target
  emoji?: string;          // optional icon
};

export default function TrendingCategories({
  categories,
  onSelect,               // optional callback when a card is clicked
  title = "Trending Categories",
  className = "",
}: {
  categories: Category[];
  onSelect?: (cat: Category) => void;
  title?: string;
  className?: string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(true);

  // check scroll edges for arrow enable/disable
  const updateEdges = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  React.useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateEdges]);

  const nudge = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(320, Math.round(el.clientWidth * 0.8)); // smooth step
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        {/* <h2 className="text-xl sm:text-2xl font-bold text-chinese-blue">{title}</h2> */}

        {/* desktop arrows */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => nudge("left")}
            disabled={!canLeft}
            className={`h-9 w-9 rounded-full border text-gray-600 bg-white/80 backdrop-blur 
              disabled:opacity-40 grid place-items-center`}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            onClick={() => nudge("right")}
            disabled={!canRight}
            className={`h-9 w-9 rounded-full border text-gray-600 bg-white/80 backdrop-blur 
              disabled:opacity-40 grid place-items-center`}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative">
        {/* subtle edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-gray-100 to-transparent rounded-l-2xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-gray-100 to-transparent rounded-r-2xl" />

        {/* scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 py-2
                     [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Trending categories"
        >
          {categories.map((cat) => {
            const content = (
              <div
                className="min-w-[9.5rem] sm:min-w-[10.5rem] snap-start
                           rounded-2xl border border-gray-200 bg-white shadow-sm
                           px-4 py-3 flex items-center gap-3
                           hover:shadow-md hover:-translate-y-0.5 transition"
                onClick={() => onSelect?.(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(cat)}
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-chinese-blue/10 text-chinese-blue text-lg">
                  {cat.emoji ?? "🏷️"}
                </div>
                <div className="text-sm font-semibold text-chinese-blue">{cat.label}</div>
              </div>
            );

            return cat.href ? (
              <a key={cat.id} href={cat.href} className="contents">
                {content}
              </a>
            ) : (
              <div key={cat.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
