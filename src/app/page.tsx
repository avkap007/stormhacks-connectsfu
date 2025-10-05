import Navbar from "@/components/Navbar";
import Carousel, { type CarouselItem } from "@/components/FramerAutoCarousel";
import TrendingCategories, { type Category } from "@/components/TrendingCategories";
import NewClubsSpotlight, { type Club } from "@/components/NewClubsSpotlight";

export default function Home() {
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
    { id: "closeknit",  label: "Close Knit",   href: "/events?category=Social",    gif: "/assets/closeknit.gif" },
    { id: "funsies",    label: "Funsies",      href: "/events?category=Friends",   gif: "/assets/funsies.gif" },
    { id: "getcrafty",  label: "Get Crafty",   href: "/events?category=Arts",      gif: "/assets/getcrafty.gif" },
    { id: "schmooze",   label: "Schmooze",     href: "/events?category=LevelUp",   gif: "/assets/schmooze.gif" },
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
        {/* Hero (screen 1) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold text-chinese-blue mb-6">
                Explore clubs Find new friends Make SFU more then classes
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-12">
                Find events, make friends, and discover your SFU community! Never go to an event alone again.
              </p>
              <div className="w-full max-w-md mx-auto mb-10">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-4 py-2.5 focus-within:ring-2 focus-within:ring-chinese-blue/30 transition">
                  <input
                    type="text"
                    placeholder="Search events, clubs, or people..."
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-2 text-sm sm:text-base"
                  />
                  <button
                    className="ml-2 bg-chinese-blue hover:bg-ceil text-white font-medium px-5 py-1.5 rounded-full transition-all duration-200"
                  >
                    Search
                  </button>
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
            {/* extra wrapper so cards don’t touch sides on huge screens */}
            <div className="mx-auto max-w-[1200px]">
              <Carousel items={demoItems} autoPlayMs={3200} />
            </div>
          </div>
        </section>

        {/* Trending Categories (screen 3) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <TrendingCategories categories={categories} className="mt-2" />
          </div>
        </section>

        {/* New Clubs Spotlight (screen 4) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-16 py-12">
            <NewClubsSpotlight clubs={clubs} />
          </div>
        </section>
      </main>
    </>
  );
}
