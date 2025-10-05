"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Carousel, { type CarouselItem } from "@/components/FramerAutoCarousel";
import TrendingCategories, { type Category } from "@/components/TrendingCategories";
import NewClubsSpotlight, { type Club } from "@/components/NewClubsSpotlight";
// Use server API for Gemini to keep key private

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Debug: basic mount log (no secrets)
  useEffect(() => {
    console.log('Home page mounted');
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      // Call server route to parse with Gemini (server-side key)
      const resp = await fetch('/api/gemini-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const filters = await resp.json();

      console.log('Filters from Gemini:', filters);

      // Build URL params from filters
      const params = new URLSearchParams();

      if (filters.categories && filters.categories.length > 0) {
        params.append('categories', filters.categories.join(','));
      }
      if (filters.campuses && filters.campuses.length > 0) {
        params.append('campuses', filters.campuses.join(','));
      }
      if (filters.dateRange) {
        params.append('date', filters.dateRange);
      }
      if (filters.keywords && filters.keywords.length > 0) {
        params.append('q', filters.keywords.join(' '));
      }

      const targetUrl = `/events?${params.toString()}`;
      console.log('Redirecting to:', targetUrl);

      // Navigate to events page with filters
      router.push(targetUrl);

    } catch (error) {
      console.error('Error with search:', error);
      // Fallback to simple search
      router.push(`/events?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const demoItems: CarouselItem[] = [
    { id: 1, title: "Tech Fair", subtitle: "Meet tech companies, explore career paths, and find your next opportunity.", imageUrl: "/assets/tech_fair.jpg", badge: "CSSS", ctaText: "RSVP", ctaHref: "#" },
    { id: 2, title: "Explore a Career with Microsoft", subtitle: "Tour Microsoft’s Vancouver office and learn new skills from the pros.", imageUrl: "/assets/enactus.png", badge: "Enactus", ctaText: "RSVP", ctaHref: "#" },
    { id: 3, title: "Meet the Mentors", subtitle: "Chat with mentors, get advice, and learn from their journeys.", imageUrl: "/assets/gdsc.png", badge: "GDSC", ctaText: "RSVP", ctaHref: "#" },
    { id: 4, title: "Surrey Study Hall", subtitle: "Study together, stay focused, and make friends along the way.", imageUrl: "/assets/ssss.png", badge: "SSSS", ctaText: "RSVP", ctaHref: "#" },
    { id: 5, title: "sparkjam", subtitle: "Team up to design creative solutions in a fun, fast-paced challenge.", imageUrl: "/assets/surge.png", badge: "SFU Surge", ctaText: "RSVP", ctaHref: "#" },
    { id: 6, title: "Git and Personal Website Workshop", subtitle: "No experience needed! Learn Git basics and build your own personal website.", imageUrl: "/assets/wics.png", badge: "WICS", ctaText: "RSVP", ctaHref: "#" },
  ];

  const categories: Category[] = [
    { id: "getcracked", label: "Get Cracked", href: "/events?category=Community", gif: "/assets/getcracked.gif" },
    { id: "closeknit", label: "Close Knit", href: "/events?category=Social", gif: "/assets/closeknit.gif" },
    { id: "funsies", label: "Funsies", href: "/events?category=Friends", gif: "/assets/funsies.gif" },
    { id: "getcrafty", label: "Get Crafty", href: "/events?category=Arts", gif: "/assets/getcrafty.gif" },
    { id: "schmooze", label: "Schmooze", href: "/events?category=LevelUp", gif: "/assets/schmooze.gif" },
  ];

  const clubs: Club[] = [
    { id: "treehouse", name: "treehouse", tagline: "A welcoming creative space where makers and dreamers bring side quests to life.", imageUrl: "/assets/treehouse.png", href: "#" },
    { id: "blueprint", name: "SFU Blueprint", tagline: "Building innovative tech solutions that create social impact for nonprofits.", imageUrl: "/assets/blueprint.png", href: "#" },
    { id: "wlf", name: "Work, Life, Food Garden", tagline: "Engineering real-world solutions for food security and sustainable development.", imageUrl: "assets/wlf.png", href: "#" },
    { id: "film", name: "Film & Media Society", tagline: "Create, shoot, and share your visual stories.", emoji: "🎬", href: "#" },
    { id: "wellness", name: "Wellness Warriors", tagline: "Mindfulness, meditation, and stress-relief weekly.", emoji: "🧘", href: "#" },
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
        <div className="absolute inset-0 pattern-dots pattern-blue-500 pattern-bg-grey pattern-size-6 pattern-opacity-20 z-0" />
        {/* Hero (screen 1) */}
        <section className="snap-start min-h-[100svh] flex items-center bg-white pt-20 sm:pt-24">
          <div className="container mx-auto px-6 sm:px-8 py-8 sm:py-12 w-full">
            <div className="relative w-full">
              {/* Mascots */}
              <img
                src="/assets/blue_animated.gif"
                alt="Blue mascot"
                className="absolute left-0 bottom-0 w-64 h-64 sm:w-72 sm:h-80 object-contain translate-y-40"
              />
              <img
                src="/assets/orange_animated.gif"
                alt="Orange mascot"
                className="absolute right-0 bottom-0 w-64 h-64 sm:w-72 sm:h-80 object-contain translate-y-40"
              />

              {/* Text content */}
              <div className="flex flex-col items-center text-center z-10 relative max-w-4xl mx-auto px-4 sm:px-6">
    <h1 className="text-5xl sm:text-6xl font-bold text-chinese-blue lowercase leading-tight">
                  welcome to connectsfu
                </h1>

              </div>
            </div>
            <div className="text-center max-w-2xl mx-auto">
              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 mb-10">
                Find events, make friends, and discover your SFU community! Never go to an event alone again.
              </p>

              {/* Search Input with Gemini */}
              <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-12 relative z-10">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-5 py-3 focus-within:ring-2 focus-within:ring-chinese-blue/30 transition relative z-10">
                  <input
                    type="text"
                    value={searchQuery}
                    onClick={() => console.log('Landing page input clicked')}
                    onFocus={() => console.log('Landing page input focused')}
                    onChange={(e) => {
                      console.log('Landing page input changed:', e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    placeholder="Try: 'tech events next week' or 'business networking in Burnaby'"
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-2 text-base sm:text-lg cursor-text"
                    style={{ pointerEvents: 'auto', zIndex: 999 }}
                    disabled={false}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="ml-3 bg-chinese-blue hover:bg-ceil text-white font-medium px-6 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Powered by AI - search naturally like you're talking to a friend
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Events (screen 2) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-2 lowercase">
              featured events
            </h2>
            <p className="text-sm text-gray-600 mb-6">events that are popular this week — click to learn more</p>
            {/* extra wrapper so cards don't touch sides on huge screens */}
            <div className="mx-auto max-w-[1200px]">
              <Carousel items={demoItems} autoPlayMs={3200} />
            </div>
          </div>
        </section>

        {/* Removed duplicate Featured Events section */}

        {/* Trending Categories (screen 3) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <TrendingCategories
              categories={categories}
              title="trending categories"
              subtitle="your peers seem to love events in these categories"
            />
          </div>
        </section>

        {/* New Clubs Spotlight (screen 4) */}
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
