"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Carousel, { type CarouselItem } from "@/components/FramerAutoCarousel";
import TrendingCategories, { type Category } from "@/components/TrendingCategories";
import NewClubsSpotlight, { type Club } from "@/components/NewClubsSpotlight";
import { parseNaturalLanguageQuery } from "@/lib/geminiSearch";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Debug: Check if API key is loaded
  useEffect(() => {
    console.log('Home page mounted');
    console.log('API Key available:', !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    console.log('API Key preview:', process.env.NEXT_PUBLIC_GEMINI_API_KEY?.substring(0, 10) + '...');
    console.log('Search loading state:', searchLoading);
  }, [searchLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      // Use Gemini to parse the natural language query
      const filters = await parseNaturalLanguageQuery(searchQuery);
      
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
    { id: 1,  title: "Web Development Workshop", subtitle: "Learn React, Next.js, and modern practices. Perfect for beginners!", imageUrl: "/assets/tech_fair.jpg", badge: "GDSC SFU", ctaText: "RSVP", ctaHref: "#" },
    { id: 2,  title: "Hack Night @ Burnaby",      subtitle: "Pair up, ship something fun, meet new friends!", imageUrl: "/assets/enactus.png", badge: "ConnectSFU", ctaText: "RSVP", ctaHref: "#" },
    { id: 3,  title: "Intro to UI/UX",            subtitle: "Design sprint basics and prototyping with Figma.", imageUrl: "/assets/gdsc.png", badge: "Design Club", ctaText: "RSVP", ctaHref: "#" },
    { id: 4,  title: "Mobile Dev Meetup",         subtitle: "Kotlin vs Swift lightning talks and demos.", imageUrl: "/assets/ssss.png", badge: "Mobile Club", ctaText: "RSVP", ctaHref: "#" },
    { id: 5,  title: "Data Science 101",          subtitle: "Pandas, NumPy, and a quick intro to ML.", imageUrl: "/assets/surge.png", badge: "AI Society", ctaText: "RSVP", ctaHref: "#" },
    { id: 6,  title: "Game Jam Weekend",          subtitle: "48 hours, build and pitch your game!", imageUrl: "/assets/wics.png", badge: "Game Dev", ctaText: "RSVP", ctaHref: "#" },
  ];

  const categories: Category[] = [
    { id: "getcracked", label: "Get Cracked", href: "/events?category=Community", gif: "/assets/getcracked.gif" },
    { id: "closeknit", label: "Close Knit", href: "/events?category=Social", gif: "/assets/closeknit.gif" },
    { id: "funsies", label: "Funsies", href: "/events?category=Friends", gif: "/assets/funsies.gif" },
    { id: "getcrafty", label: "Get Crafty", href: "/events?category=Arts", gif: "/assets/getcrafty.gif" },
    { id: "schmooze", label: "Schmooze", href: "/events?category=LevelUp", gif: "/assets/schmooze.gif" },
  ];

  const clubs: Club[] = [
    { id: "gdsc",     name: "GDSC SFU",              tagline: "Empowering students through technologies and community.", emoji: "💡", href: "#" },
    { id: "design",   name: "Design Club",           tagline: "Where creativity meets purpose — learn UI/UX and collaborate.", emoji: "🎨", href: "#" },
    { id: "ai",       name: "AI Society",            tagline: "Workshops, projects, and talks on AI, ML, and data science.", emoji: "🤖", href: "#" },
    { id: "film",     name: "Film & Media Society",  tagline: "Create, shoot, and share your visual stories.", emoji: "🎬", href: "#" },
    { id: "wellness", name: "Wellness Warriors",     tagline: "Mindfulness, meditation, and stress-relief weekly.", emoji: "🧘", href: "#" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="absolute inset-0 pattern-dots pattern-blue-500 pattern-bg-grey pattern-size-6 pattern-opacity-20 z-0" />
        {/* Hero (screen 1) */}
        <section className="snap-start min-h-[90svh] flex items-center bg-white">
          <div className="container mx-auto px-6 sm:px-8 py-12 sm:py-16 w-full">
            <div className="text-center max-w-3xl mx-auto">
              {/* Title */}
              <h1 className="text-5xl sm:text-6xl font-bold text-chinese-blue mb-5">
                Welcome to ConnectSFU
              </h1>

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
            {/* image */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left image */}
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img
                  src="/assets/mascot_blue.gif"   
                  alt="Students collaborating"
                  className="block w-64 h-64 sm:h-72 md:h-80 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Right image */}
              <div className="flex justify-end mt-6">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="/assets/mascot_orange.gif"
                    alt="Campus life"
                    className="block w-64 h-64 sm:h-72 md:h-80 object-cover rounded-2xl"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Featured Events (screen 2) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-6">
              Featured Events
            </h2>
            {/* extra wrapper so cards don't touch sides on huge screens */}
            <div className="mx-auto max-w-[1200px]">
              <Carousel items={demoItems} autoPlayMs={3200} />
            </div>
          </div>
        </section>

        {/* Featured Events (screen 2) */}
        <section className="snap-start min-h-[90svh] flex items-center">
          <div className="container mx-auto px-4 py-8 sm:py-10 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-chinese-blue mb-4 sm:mb-5 text-center">
              Featured Events
            </h2>
            <Carousel items={demoItems} autoPlayMs={3200} />
          </div>
        </section>

        {/* Trending Categories (screen 3) */}
        <section className="snap-start min-h-[90svh] flex items-center">
          <div className="container mx-auto px-4 py-8 sm:py-10 w-full">
            <TrendingCategories categories={categories} className="mt-4" />
          </div>
        </section>

        {/* New Clubs Spotlight (screen 4) */}
        <section className="snap-start min-h-[90svh] flex items-center">
          <div className="container mx-auto px-4 py-8 sm:py-10 w-full">
            <NewClubsSpotlight clubs={clubs} />
          </div>
        </section>


      </main>
    </>
  );
}
