import Navbar from "@/components/Navbar";
import Carousel, { type CarouselItem } from "@/components/FramerAutoCarousel"; 

export default function Home() {
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
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-chinese-blue mb-4">
              Welcome to ConnectSFU
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find events, make friends, and discover your SFU community! Never go to an event alone again.
            </p>
          </div>

          {/* Carousel */}
          <div className="container mx-auto px-4 py-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-chinese-blue mb-4 sm:mb-6 text-center">
              Feature Events
            </h2>
            <Carousel items={demoItems} autoPlayMs={3200} />
          </div>

          {/* Sample event card with glass effect */}
          <div className="max-w-lg mx-auto">
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-chinese-blue to-ceil rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  🎨
                </div>
                <div className="ml-6">
                  <h3 className="font-bold text-chinese-blue text-lg">GDSC SFU</h3>
                  <p className="text-sm text-gray-600">Google Developer Student Club</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-chinese-blue mb-3">
                Web Development Workshop
              </h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Learn React, Next.js, and modern web development practices. Perfect for beginners! 
                We'll build a real project together.
              </p>
              
              <div className="flex items-center text-sm text-gray-600 mb-6 space-x-6">
                <span className="flex items-center">
                  <span className="mr-2">📅</span>
                  Today, 6:00 PM
                </span>
                <span className="flex items-center">
                  <span className="mr-2">📍</span>
                  Burnaby Campus
                </span>
              </div>
              
              <div className="flex space-x-4">
                <button className="flex-1 bg-chinese-blue text-white py-3 px-6 rounded-xl hover:bg-ceil transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                  RSVP
                </button>
                <button className="flex-1 bg-pearly-purple/20 text-pearly-purple py-3 px-6 rounded-xl hover:bg-pearly-purple/30 transition-all duration-200 font-medium border border-pearly-purple/30">
                  Find Buddy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}