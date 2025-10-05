// app/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Carousel, { type CarouselItem } from "@/components/FramerAutoCarousel";
import TrendingCategories, { type Category } from "@/components/TrendingCategories";
import NewClubsSpotlight, { type Club } from "@/components/NewClubsSpotlight";

type EventAPI = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  campus: string | null;
  start_at: string;
  end_at: string | null;
  poster_url: string | null;
  poster_vertical_url?: string | null;
  tags: string[] | null;
  created_at: string;
  clubs?: {
    name: string | null;
    logo_url: string | null;
    description?: string | null;
  } | null;
};

// fun label → filter categories mapping for Trending
const TREND_TO_FILTER: Record<string, string[]> = {
  getcracked: ["Technology"],
  funsies: ["Cultural"],
  closeknit: ["Networking"],
  getcrafty: ["Health & Wellness"],
  schmooze: ["Business", "Career", "Networking"],
};

export default function Home() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Featured/upcoming events pulled from DB
  const [featured, setFeatured] = useState<EventAPI[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/events?upcoming=1&sort=popular&limit=8", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load events");
        const data = (await res.json()) as EventAPI[];
        setFeatured(data);
      } catch (err) {
        console.error("Failed to load featured events:", err);
      } finally {
        setLoadingFeatured(false);
      }
    };
    load();
  }, []);

  // Featured → Carousel items (card + CTA both link to /events with filters)
  const carouselItems: CarouselItem[] = useMemo(() => {
    return (featured || []).map((e) => {
      const img = e.poster_url || e.poster_vertical_url || "/assets/fallback_event.jpg";
      const badge = e.clubs?.name || e.campus || "SFU";
      const subtitle =
        (e.description ? e.description.slice(0, 120) : "") +
          (e.description && e.description.length > 120 ? "…" : "") ||
        "Click to see details, time & location.";

      const params = new URLSearchParams();
      params.set("q", e.title);
      if (e.campus) params.set("campuses", e.campus);
      if (e.category) params.set("categories", e.category);
      const ctaHref = `/events?${params.toString()}`;

      return {
        id: e.id,
        title: e.title,
        subtitle,
        imageUrl: img,
        badge,
        ctaText: "View in Events",
        ctaHref,
      };
    });
  }, [featured]);

  // Hero search → /events with filters
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const resp = await fetch("/api/gemini-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const filters = await resp.json();

      const params = new URLSearchParams();
      if (filters.categories?.length) params.set("categories", filters.categories.join(","));
      if (filters.campuses?.length) params.set("campuses", filters.campuses.join(","));
      if (filters.dateRange) params.set("date", filters.dateRange);
      if (filters.keywords?.length) params.set("q", filters.keywords.join(" "));

      router.push(`/events?${params.toString()}`);
    } catch (error) {
      console.error("Error with search:", error);
      router.push(`/events?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setSearchLoading(false);
    }
  };

  // Build href for Trending chip → /events with mapped categories
  const trendHref = (trendId: string) => {
    const mapped = TREND_TO_FILTER[trendId] || [];
    const params = new URLSearchParams();
    if (mapped.length) params.set("categories", mapped.join(","));
    return `/events?${params.toString()}`;
  };

  // 🔗 Build href for Clubs Spotlight → /clubs?q=<club-name>
  const clubHref = (name: string, categoryHint?: string) => {
    const params = new URLSearchParams();
    params.set("q", name);
    // Optional: also pre-select a category tab on the clubs page
    if (categoryHint) params.set("category", categoryHint);
    return `/clubs?${params.toString()}`;
  };

  // Trending chips
  const categories: Category[] = [
    { id: "getcracked", label: "Get Cracked", href: trendHref("getcracked"), gif: "/assets/getcracked.gif" },
    { id: "funsies", label: "Funsies", href: trendHref("funsies"), gif: "/assets/funsies.gif" },
    { id: "closeknit", label: "Close Knit", href: trendHref("closeknit"), gif: "/assets/closeknit.gif" },
    { id: "getcrafty", label: "Get Crafty", href: trendHref("getcrafty"), gif: "/assets/getcrafty.gif" },
    { id: "schmooze", label: "Schmooze", href: trendHref("schmooze"), gif: "/assets/schmooze.gif" },
  ];

  // Spotlight clubs (note: each href built with clubHref)
  const clubs: Club[] = [
    {
      id: "treehouse",
      name: "treehouse",
      tagline: "A welcoming creative space where makers and dreamers bring side quests to life.",
      imageUrl: "/assets/treehouse.png",
      href: clubHref("treehouse", "Arts & Performance"),
    },
    {
      id: "blueprint",
      name: "SFU Blueprint",
      tagline: "Building innovative tech solutions that create social impact for nonprofits.",
      imageUrl: "/assets/blueprint.png",
      href: clubHref("SFU Blueprint", "Technology"),
    },
    {
      id: "wlf",
      name: "Work, Life, Food Garden",
      tagline: "Engineering real-world solutions for food security and sustainable development.",
      imageUrl: "assets/wlf.png",
      href: clubHref("Work, Life, Food Garden", "Environment"),
    },
    {
      id: "film",
      name: "Film & Media Society",
      tagline: "Create, shoot, and share your visual stories.",
      emoji: "🎬",
      href: clubHref("Film & Media Society", "Arts & Performance"),
    },
    {
      id: "wellness",
      name: "Wellness Warriors",
      tagline: "Mindfulness, meditation, and stress-relief weekly.",
      emoji: "🧘",
      href: clubHref("Wellness Warriors", "Health & Wellness"),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Top marquee under navbar */}
        <div className="w-full bg-black text-white overflow-hidden mt-16 relative z-40">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div className="marquee py-2 text-[13px] sm:text-sm font-medium tracking-wide lowercase">
              <span className="opacity-90">8 new events added this week • </span>
              <span className="opacity-90">this week at surge: performative male context • </span>
              <span className="opacity-90">wics event: network so you aren't jobless • </span>
              <span className="opacity-90">new gardening club added • </span>
              <span className="opacity-90">sfu blueprint hiring • </span>
              <span className="opacity-90">8 new events added this week • </span>
              <span className="opacity-90">this week at surge: performative male context • </span>
              <span className="opacity-90">wics event: network so you aren't jobless • </span>
              <span className="opacity-90">new gardening club added • </span>
              <span className="opacity-90">sfu blueprint hiring • </span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="snap-start min-h-[100svh] flex items-center bg-white pt-20 sm:pt-24">
          <div className="container mx-auto px-6 sm:px-8 py-8 sm:py-12 w-full">
            <div className="relative w-full">
              {/* mascots etc if you like */}

              {/* Title / Subtitle */}
              <div className="flex flex-col items-center text-center z-10 relative max-w-4xl mx-auto px-4 sm:px-6 -mt-20">
                <h1 className="text-4xl sm:text-6xl font-bold text-chinese-blue lowercase leading-tight">
                  welcome to connectsfu
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto mb-20">
                  Find events, make friends, and discover your SFU community!
                </p>
              </div>

              {/* Search Input with Gemini */}
              <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-12 relative z-10">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-5 py-3 focus-within:ring-2 focus-within:ring-chinese-blue/30 transition relative z-10">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Try: 'tech events next week' or 'business networking in Burnaby'"
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-2 text-base sm:text-lg"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="ml-3 bg-chinese-blue hover:bg-ceil text-white font-medium px-6 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    {searchLoading ? "Searching..." : "Search"}
                  </button>
                </div>
                <div className="text-center w-full mt-1">
                  <p className="text-sm text-gray-500">
                    Powered by AI - search naturally like you're talking to a friend
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Events (live from DB) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-2 lowercase">
              featured events
            </h2>
            <p className="text-sm text-gray-600 mb-6">events that are popular this week — click to learn more</p>

            <div className="mx-auto max-w-[1200px]">
              {loadingFeatured ? (
                <div className="text-gray-500">loading featured events…</div>
              ) : carouselItems.length === 0 ? (
                <div className="text-gray-500">no upcoming events found</div>
              ) : (
                <Carousel items={carouselItems} autoPlayMs={3200} />
              )}
            </div>
          </div>
        </section>

        {/* Trending Categories */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <TrendingCategories
              categories={categories}
              title="trending categories"
              subtitle="your peers seem to love events in these categories"
            />
          </div>
        </section>

        {/* New Clubs Spotlight — each card/button goes to /clubs?q=<name> */}
        <section className="snap-start min-h-[90svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <NewClubsSpotlight
              clubs={clubs}
              title="new clubs spotlight"
              subtitle="new orgs on campus this month — show up to their events to show some love"
            />
          </div>
        </section>
      </main>
    </>
  );
}
