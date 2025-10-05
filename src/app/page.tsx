import Navbar from "@/components/Navbar";
import Carousel, { type CarouselItem } from "@/components/FramerAutoCarousel";
import TrendingCategories, { type Category } from "@/components/TrendingCategories";
import NewClubsSpotlight, { type Club } from "@/components/NewClubsSpotlight";

export default function Home() {
  const demoItems: CarouselItem[] = [
    { id: 1,  title: "Web Development Workshop", subtitle: "Learn React, Next.js, and modern practices. Perfect for beginners!", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop", badge: "GDSC SFU", ctaText: "RSVP", ctaHref: "#" },
    { id: 2,  title: "Hack Night @ Burnaby",      subtitle: "Pair up, ship something fun, meet new friends!", imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop", badge: "ConnectSFU", ctaText: "RSVP", ctaHref: "#" },
    { id: 3,  title: "Intro to UI/UX",            subtitle: "Design sprint basics and prototyping with Figma.", imageUrl: "https://images.unsplash.com/photo-1559027615-5b6b9c7e8f77?q=80&w=1400&auto=format&fit=crop", badge: "Design Club", ctaText: "RSVP", ctaHref: "#" },
    { id: 4,  title: "Mobile Dev Meetup",         subtitle: "Kotlin vs Swift lightning talks and demos.", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop", badge: "Mobile Club", ctaText: "RSVP", ctaHref: "#" },
    { id: 5,  title: "Data Science 101",          subtitle: "Pandas, NumPy, and a quick intro to ML.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop", badge: "AI Society", ctaText: "RSVP", ctaHref: "#" },
    { id: 6,  title: "Game Jam Weekend",          subtitle: "48 hours, build and pitch your game!", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop", badge: "Game Dev", ctaText: "RSVP", ctaHref: "#" },
    { id: 7,  title: "Cloud Bootcamp",            subtitle: "Hands-on with Docker and Kubernetes.", imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop", badge: "DevOps Club", ctaText: "RSVP", ctaHref: "#" },
    { id: 8,  title: "Cybersecurity Night",       subtitle: "CTF mini-challenges and blue team tips.", imageUrl: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1400&auto=format&fit=crop", badge: "Security Club", ctaText: "RSVP", ctaHref: "#" },
    { id: 9,  title: "AR/VR Playground",          subtitle: "Try headsets and build with WebXR.", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop", badge: "XR Lab", ctaText: "RSVP", ctaHref: "#" },
    { id: 10, title: "Startup Pitch Night",       subtitle: "5-minute pitches, live feedback from mentors.", imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1400&auto=format&fit=crop", badge: "Entrepreneurship", ctaText: "RSVP", ctaHref: "#" },
  ];

const categories: Category[] = [
  { id: "getcracked", label: "Get Cracked", href: "/events?category=Community", gif: "/assets/getcracked.gif" },
  { id: "closeknit", label: "Close Knit", href: "/events?category=Social", gif: "/assets/closeknit.gif" },
  { id: "funsies", label: "Funsies", href: "/events?category=Friends", gif: "/assets/funsies.gif" },
  { id: "getcrafty", label: "Get Crafty", href: "/events?category=Arts", gif: "/assets/getcrafty.gif" },
  { id: "schmooze", label: "Schmooze", href: "/events?category=LevelUp", gif: "/assets/schmooze.gif" },
];


  const clubs: Club[] = [
    { id: "gdsc",     name: "GDSC SFU",            tagline: "Empowering students through technologies and community.", emoji: "💡", href: "#" },
    { id: "design",   name: "Design Club",         tagline: "Where creativity meets purpose — learn UI/UX and collaborate.", emoji: "🎨", href: "#" },
    { id: "ai",       name: "AI Society",          tagline: "Workshops, projects, and talks on AI, ML, and data science.", emoji: "🤖", href: "#" },
    { id: "film",     name: "Film & Media Society",tagline: "Create, shoot, and share your visual stories.", emoji: "🎬", href: "#" },
    { id: "wellness", name: "Wellness Warriors",   tagline: "Mindfulness, meditation, and stress-relief weekly.", emoji: "🧘", href: "#" },
  ];

  return (
    <>
      <Navbar />
      {/* main is just the backdrop; snapping is on body in layout */}
      <main className="bg-white from-ceil/10 via-pearly-purple/5">
        
        {/* Hero (screen 1) */}
        <section className="snap-start min-h-[100svh] flex items-center bg-white">
          <div className="container mx-auto px-6 sm:px-10 py-20 w-full">
            <div className="text-center max-w-3xl mx-auto">
              {/* Title */}
              <h1 className="text-5xl sm:text-6xl font-bold text-chinese-blue mb-6">
                Welcome to ConnectSFU
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 mb-12">
                Find events, make friends, and discover your SFU community! Never go to an event alone again.
              </p>

              {/* Search Input */}
              <div className="w-full max-w-2xl mx-auto mb-12">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-5 py-3 focus-within:ring-2 focus-within:ring-chinese-blue/30 transition">
                  <input
                    type="text"
                    placeholder="Search events, clubs, or people..."
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-2 text-base sm:text-lg"
                  />
                  <button
                    className="ml-3 bg-chinese-blue hover:bg-ceil text-white font-medium px-6 py-2 rounded-full transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Categories (screen 3) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="container mx-auto px-4 py-12 w-full">
            <TrendingCategories categories={categories} className="mt-6" />
          </div>
        </section>


        {/* Featured Events (screen 2) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="container mx-auto px-4 py-12 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-chinese-blue mb-4 sm:mb-6 text-center">
              Featured Events
            </h2>
            <Carousel items={demoItems} autoPlayMs={3200} />
          </div>
        </section>

        

        {/* New Clubs Spotlight (screen 4) */}
        <section className="snap-start min-h-[100svh] flex items-center">
          <div className="container mx-auto px-4 py-12 w-full">
            <NewClubsSpotlight clubs={clubs} />
          </div>
        </section>

      </main>
    </>
  );
}