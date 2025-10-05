"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export type CarouselItem = {
  id: string | number;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  badge?: string;
  ctaText?: string;
  ctaHref?: string;
};

interface CarouselProps {
  items: CarouselItem[];
  /** Autoplay interval in ms (set 0/undefined to disable). */
  autoPlayMs?: number;
  className?: string;
  initialIndex?: number; // 0..items.length-1
  perView?: number;
}

export default function Carousel({
  items,
  autoPlayMs = 3000,
  className,
  initialIndex = 0,
}: CarouselProps) {
  const hasMany = items.length > 1;

  // viewport (the clipping shell), track, and state we measure/move with
  const clipRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  /** Exact movement per slide (card width + gap) */
  const [step, setStep] = useState(0);

  /** How many cards fit in the viewport at once (controls clone count) */
  const [visibleCount, setVisibleCount] = useState(1);

  /** Position on extended track (see below) */
  const [pos, setPos] = useState(0);

  const controls = useAnimationControls();
  const canAutoplay = !!autoPlayMs && autoPlayMs > 0 && hasMany;

  // Reduced motion
  const reduceMotion = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  /** Measure: step (distance between consecutive cards) and visibleCount */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const clip = clipRef.current;
    if (!track || !clip) return;

    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    // We need at least 2 to compute delta; fall back to width of first
    let s = 0;
    if (slides.length >= 2) {
      s = slides[1].offsetLeft - slides[0].offsetLeft; // width + gap
    } else if (slides.length === 1) {
      s = slides[0].getBoundingClientRect().width;
    }
    if (s <= 0) return;

    const clipW = clip.clientWidth;
    const vis = Math.max(1, Math.floor(clipW / s));
    setStep(s);
    setVisibleCount(Math.min(vis, items.length)); // never exceed item count
  }, [items.length]);

  // Observe size changes + font load shifts
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (clipRef.current) ro.observe(clipRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    const onFonts = () => measure();
    (document as any).fonts?.addEventListener?.("loadingdone", onFonts);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      (document as any).fonts?.removeEventListener?.("loadingdone", onFonts);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /** Build extended track: [tail clones..., ...items, ...head clones] */
  const clones = hasMany ? visibleCount : 0;
  const trackItems = useMemo(() => {
    if (!hasMany) return [...items];
    const head = items.slice(0, clones);
    const tail = items.slice(-clones);
    return [...tail, ...items, ...head];
  }, [items, hasMany, clones]);

  // Helper to convert a "real" index (0..N-1) to extended-track position
  const toPos = useCallback(
    (realIdx: number) => (hasMany ? clones + realIdx : 0),
    [hasMany, clones]
  );

  // Real index from pos (for dots)
  const realIndex = hasMany ? (pos - clones + items.length) % items.length : 0;

  // Initialize/realign whenever step or clones change
  useEffect(() => {
    if (!step) return;
    const startPos = toPos(Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)));
    setPos(startPos);
    controls.set({ x: -startPos * step });
  }, [step, clones, toPos, initialIndex, items.length, controls]);

  // Movement
  const tweenSmooth = { type: "tween" as const, ease: "easeInOut" as const, duration: 0.6 };

  const jumpTo = useCallback(
    async (newPos: number) => {
      if (!step) return;
      await controls.start({
        x: -newPos * step,
        transition: reduceMotion.current ? { duration: 0 } : tweenSmooth,
      });
      setPos(newPos);
    },
    [controls, step]
  );

  const TRAIL_START = clones + items.length;          // first trailing clone index
  const LEAD_END = clones - 1;                        // last leading clone index
  const LAST_REAL = clones + items.length - 1;        // last real item's pos
  const FIRST_REAL = clones;                          // first real item's pos

  const slideNext = useCallback(async () => {
    if (!hasMany || !step) return;
    const nextPos = pos + 1;
    await jumpTo(nextPos);
    // Wrap from any trailing clone back to the mirrored real
    if (nextPos >= TRAIL_START) {
      controls.set({ x: -FIRST_REAL * step });
      setPos(FIRST_REAL);
    }
  }, [hasMany, step, pos, jumpTo, TRAIL_START, FIRST_REAL, controls]);

  const slidePrev = useCallback(async () => {
    if (!hasMany || !step) return;
    const prevPos = pos - 1;
    await jumpTo(prevPos);
    // Wrap from any leading clone back to the mirrored real
    if (prevPos <= LEAD_END) {
      controls.set({ x: -LAST_REAL * step });
      setPos(LAST_REAL);
    }
  }, [hasMany, step, pos, jumpTo, LEAD_END, LAST_REAL, controls]);

  // Autoplay
  const hoverRef = useRef(false);
  useEffect(() => {
    if (!canAutoplay) return;
    const id = setInterval(() => {
      if (!hoverRef.current) slideNext();
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, canAutoplay, slideNext]);

  // Keyboard (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") slideNext();
      if (e.key === "ArrowLeft") slidePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slideNext, slidePrev]);

  // Drag snap
  const onDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (!step) return;
    const delta = info.offset.x + info.velocity.x * 0.2;
    const threshold = step * 0.33;
    if (delta < -threshold) slideNext();
    else if (delta > threshold) slidePrev();
    else controls.start({ x: -pos * step, transition: reduceMotion.current ? { duration: 0 } : tweenSmooth });
  };

  return (
    <div
      className={"relative w-full select-none " + (className ?? "")}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      onFocus={() => (hoverRef.current = true)}
      onBlur={() => (hoverRef.current = false)}
      aria-roledescription="carousel"
    >
      {/* Clipping shell */}
      <div ref={clipRef} className="overflow-hidden rounded-2xl px-3 py-3 sm:px-4 sm:py-4">
        <motion.div
          ref={trackRef}
          className="flex justify-start gap-4 sm:gap-5 items-stretch will-change-transform"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -(pos + 1) * step, right: -(pos - 1) * step }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {trackItems.map((item, i) => (
            <Slide key={`${item.id}-${i}`} item={item} />
          ))}
        </motion.div>
      </div>

      {/* Arrows (hidden on very small screens; swipe there) */}
      {hasMany && (
        <>
          <button
            aria-label="Previous slide"
            onClick={slidePrev}
            className="hidden xs:grid sm:grid absolute left-2 inset-y-0 my-auto place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white border border-white/50 backdrop-blur transition text-xl font-bold"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={slideNext}
            className="hidden xs:grid sm:grid absolute right-2 inset-y-0 my-auto place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white border border-white/50 backdrop-blur transition text-xl font-bold"
          >
            ›
          </button>
        </>
      )}

      {/* Dots reflect real items */}
      {hasMany && (
        <div className="mt-3 flex items-center justify-center gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(toPos(i))}
              aria-label={`Go to slide ${i + 1}`}
              className={
                "h-3 w-3 rounded-full transition " +
                (realIndex === i ? "bg-chinese-blue scale-110" : "bg-gray-300 hover:bg-gray-400")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Fixed-size card */
function Slide({ item }: { item: CarouselItem }) {
  return (
     <div
      data-slide
      className="
        shrink-0
        w-[250px]
        sm:w-[280px]
        md:w-[280px]
      "
    >
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
        

        <div className="p-4 flex-1 flex flex-col">
          {item.badge && (
            <span className="inline-block w-fit px-2.5 py-1 mb-2 text-[11px] sm:text-xs font-medium rounded-full bg-ceil/20 text-chinese-blue border border-ceil/30">
              {item.badge}
            </span>
          )}
          {item.title && <h3 className="text-lg sm:text-xl font-bold text-chinese-blue mb-1.5 line-clamp-2">{item.title}</h3>}
          {item.subtitle && <p className="text-[14px] text-gray-700 leading-relaxed mb-3 line-clamp-3">{item.subtitle}</p>}
          {item.ctaText && item.ctaHref && (
            <a href={item.ctaHref} className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-mist text-chinese-blue text-sm font-medium hover:bg-pastel-sky transition">
              {item.ctaText}
            </a>
          )}
        </div>

        <div className="w-full h-[485px] sm:h-[385px] overflow-hidden rounded-2xl">
            {item.imageUrl ? (
                <img
                src={item.imageUrl}
                alt={item.title ?? "Slide image"}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
                />
            ) : (
                <div className="w-full h-full grid place-items-center rounded-2xl bg-gradient-to-br from-ceil/30 via-pearly-purple/20 to-dessert-sand/30 text-chinese-blue font-semibold">
                No image
                </div>
            )}
            </div>
      </div>
    </div>
  );
}

