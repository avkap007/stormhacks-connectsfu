// components/TrendingCategories.tsx
"use client";

import * as React from "react";

export type Category = {
  id: string;
  label: string;
  href?: string;
  /** Public path like "/assets/triangle-heart.gif" or an imported asset { src } */
  gif?: string | { src: string };
  emoji?: string;
};

type Props = {
  categories: Category[];
  className?: string;
  title?: string;
};

export default function TrendingCategories({
  categories,
  className = "",
  title = "Trending Categories",
}: Props) {
  const cats = categories.slice(0, 5);

  const pastel = [
    "bg-sky-100",
    "bg-blue-100",
    "bg-amber-100",
    "bg-pink-100",
    "bg-violet-200",
  ];

  const spanByIndex = [
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-2",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-1",
  ];

  return (
    <section className={className}>
      <h2 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-6">
        {title}
      </h2>

      <div
        className="
          grid grid-flow-col-dense
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-4 sm:gap-6
          auto-rows-[240px] sm:auto-rows-[260px] lg:auto-rows-[280px]
          rounded-3xl border border-gray-200 bg-gray-50 p-3 sm:p-4
        "
      >
        {reorderForDesktop(cats).map((cat) => {
          const i = (cat as any)._originalIndex as number;
          const color = pastel[i] ?? "bg-gray-100";
          const spans = spanByIndex[i] ?? "lg:col-span-1 lg:row-span-1";
          const gifSrc = typeof cat.gif === "string" ? cat.gif : cat.gif?.src;

          return (
            <a
              key={cat.id}
              href={cat.href ?? "#"}
              className={`
                group relative overflow-hidden rounded-[28px]
                ${color} ${spans}
                border border-white/60
                flex flex-col
              `}
            >
              {/* decorative blob */}
              <div
                className={`absolute -right-10 -bottom-10 h-40 w-40 rounded-[32px]
                            ${
                              [
                                "bg-sky-200/40",
                                "bg-blue-200/40",
                                "bg-amber-200/40",
                                "bg-pink-200/40",
                                "bg-violet-300/40",
                              ][i % 5]
                            }
                            blur-xl z-0`}
              />

              {/* text + gif + button */}
              <CardContent
                label={cat.label}
                emoji={cat.emoji}
                gifSrc={gifSrc}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

/** Reorders cards into columns for large screens */
function reorderForDesktop<T extends Category>(arr: T[]) {
  const withIdx = arr.map((c, _originalIndex) => ({ ...c, _originalIndex }));
  const order = [0, 2, 1, 3, 4];
  return order.map((k) => withIdx[k]).filter(Boolean);
}

function CardContent({
  label,
  emoji,
  gifSrc,
}: {
  label: string;
  emoji?: string;
  gifSrc?: string;
}) {
  return (
    <div className="relative z-20 flex flex-col items-start justify-between flex-1 p-5 sm:p-6 lg:p-7 text-left">
      {/* Top: Title */}
      <div className="flex items-center gap-3 mb-4">
        {emoji && (
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/90 text-xl">
            {emoji}
          </span>
        )}
        <h3 className="text-xl sm:text-2xl font-semibold text-chinese-blue">
          {label}
        </h3>
      </div>

      {/* Middle: Centered GIF (animated on hover) */}
      {gifSrc && (
        <div className="flex-1 flex w-full items-center justify-center mb-4">
          <img
            src={gifSrc}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none select-none h-24 sm:h-28 md:h-32 w-auto
              object-contain opacity-90
              transition-transform duration-500
              group-hover:scale-110 group-hover:animate-bounce-slow
            "
          />
        </div>
      )}

      {/* Bottom: Explore button */}
      <div>
        <span
          className="
            inline-flex items-center gap-2 rounded-full
            bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-chinese-blue
            transition
          "
        >
          Explore
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

