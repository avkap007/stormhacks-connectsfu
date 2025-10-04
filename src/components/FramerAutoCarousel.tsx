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
}

export default function Carousel({
  items,
  autoPlayMs = 3200,
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
      <div ref={clipRef} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 px-3 py-3 sm:px-4 sm:py-4">
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
        w-72
        sm:w-80
        md:w-96
      "
    >
      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden h-[380px] flex flex-col">
        <div className="w-full h-44 sm:h-48 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title ?? "Slide image"} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full grid place-items-center bg-gradient-to-br from-ceil/30 via-pearly-purple/20 to-dessert-sand/30 text-chinese-blue font-semibold">
              No image
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          {item.badge && (
            <span className="inline-block w-fit px-2.5 py-1 mb-2 text-[11px] sm:text-xs font-medium rounded-full bg-ceil/20 text-chinese-blue border border-ceil/30">
              {item.badge}
            </span>
          )}
          {item.title && <h3 className="text-lg sm:text-xl font-bold text-chinese-blue mb-1.5 line-clamp-2">{item.title}</h3>}
          {item.subtitle && <p className="text-[14px] text-gray-700 leading-relaxed mb-3 line-clamp-3">{item.subtitle}</p>}
          {item.ctaText && item.ctaHref && (
            <a href={item.ctaHref} className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-xl bg-chinese-blue text-white text-sm font-medium hover:bg-ceil transition">
              {item.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/***********************
 * Demo (10 items, seamless wrap)
 **********************/
export function DemoCarousel() {
  const demoItems: CarouselItem[] = [
    { id: 1,  title: "Web Development Workshop", subtitle: "Learn React, Next.js, and modern practices. Perfect for beginners!", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop", badge: "GDSC SFU", ctaText: "RSVP", ctaHref: "#" },
    { id: 2,  title: "Hack Night @ Burnaby",      subtitle: "Pair up, ship something fun, meet new friends!", imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop", badge: "ConnectSFU", ctaText: "See Details", ctaHref: "#" },
    { id: 3,  title: "Intro to UI/UX",            subtitle: "Design sprint basics and prototyping with Figma.", imageUrl: "https://images.unsplash.com/photo-1559027615-5b6b9c7e8f77?q=80&w=1400&auto=format&fit=crop", badge: "Design Club", ctaText: "Register", ctaHref: "#" },
    { id: 4,  title: "Mobile Dev Meetup",         subtitle: "Kotlin vs Swift lightning talks and demos.", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop", badge: "Mobile Club", ctaText: "Join", ctaHref: "#" },
    { id: 5,  title: "Data Science 101",          subtitle: "Pandas, NumPy, and a quick intro to ML.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop", badge: "AI Society", ctaText: "Register", ctaHref: "#" },
    { id: 6,  title: "Game Jam Weekend",          subtitle: "48 hours, build and pitch your game!", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop", badge: "Game Dev", ctaText: "Sign Up", ctaHref: "#" },
    { id: 7,  title: "Cloud Bootcamp",            subtitle: "Hands-on with Docker and Kubernetes.", imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop", badge: "DevOps Club", ctaText: "Reserve", ctaHref: "#" },
    { id: 8,  title: "Cybersecurity Night",       subtitle: "CTF mini-challenges and blue team tips.", imageUrl: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1400&auto=format&fit=crop", badge: "Security Club", ctaText: "Learn More", ctaHref: "#" },
    { id: 9,  title: "AR/VR Playground",          subtitle: "Try headsets and build with WebXR.", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop", badge: "XR Lab", ctaText: "Get Tickets", ctaHref: "#" },
    { id: 10, title: "Startup Pitch Night",       subtitle: "5-minute pitches, live feedback from mentors.", imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1400&auto=format&fit=crop", badge: "Entrepreneurship", ctaText: "Attend", ctaHref: "#" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-chinese-blue mb-4 sm:mb-6 text-center">
        Featured Events
      </h2>
      <Carousel items={demoItems} autoPlayMs={3200} />
    </div>
  );
}
