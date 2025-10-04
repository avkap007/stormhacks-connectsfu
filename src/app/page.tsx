import Navbar from "@/components/Navbar";
import { DemoCarousel } from "@/components/FramerAutoCarousel"; 

export default function Home() {
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
          <DemoCarousel />

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