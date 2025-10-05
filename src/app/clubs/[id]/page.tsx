"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ClubRaw = {
  name: string;
  description: string;
  logo: string;
  website?: string;
  email?: string;
};

type Club = {
  id: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  website?: string;
  email?: string;
};

function categorizeClub(description: string): string[] {
  const categories: string[] = [];
  const desc = description.toLowerCase();
  
  if (desc.match(/culture|cultural|heritage|tradition/i)) {
    categories.push("Cultural");
  }
  if (desc.match(/tech|programming|software|coding|developer/i)) {
    categories.push("Technology");
  }
  if (desc.match(/business|career|professional|entrepreneur/i)) {
    categories.push("Business & Professional");
  }
  if (desc.match(/music|dance|art|performance/i)) {
    categories.push("Arts & Performance");
  }
  if (desc.match(/sport|athletic|hiking|outdoor/i)) {
    categories.push("Sports & Recreation");
  }
  if (desc.match(/gaming|esport|game/i)) {
    categories.push("Gaming");
  }
  
  return categories.length > 0 ? categories : ["Other"];
}

export default function ClubDetailPage() {
  const params = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Import the club data
  const clubsDataJson = require("../club_list.json");
  
  const clubsData: Club[] = (clubsDataJson as ClubRaw[]).map((club: ClubRaw) => ({
    id: club.name.toLowerCase().replace(/\s+/g, '-'),
    name: club.name,
    description: club.description,
    logo: club.logo,
    categories: categorizeClub(club.description),
    website: club.website,
    email: club.email
  }));

  const clubId = params?.id as string;
  const club = clubsData.find((c: Club) => c.id === clubId);

  if (!club) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-chinese-blue mb-4">Club Not Found</h1>
              <Link href="/clubs" className="text-ceil hover:underline">
                Back to Clubs
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-16">
        <div className="container mx-auto px-4 py-12">
          
          {/* Back Button */}
          <Link 
            href="/clubs"
            className="inline-flex items-center gap-2 text-chinese-blue hover:text-ceil transition-colors mb-8 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Clubs
          </Link>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden mb-8">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-8">
                
                {/* Club Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-chinese-blue via-ceil to-pearly-purple rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
                    <img 
                      src={club.logo} 
                      alt={club.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-ceil to-chinese-blue rounded-full blur-xl opacity-50" />
                </div>

                {/* Club Info */}
                <div className="flex-grow">
                  <h1 className="text-4xl md:text-5xl font-bold text-chinese-blue mb-4">
                    {club.name}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {club.categories.map((category: string) => (
                      <span 
                        key={category} 
                        className="px-4 py-2 bg-gradient-to-r from-ceil/30 to-chinese-blue/30 text-chinese-blue text-sm rounded-full font-semibold backdrop-blur-sm border border-ceil/30"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {club.description}
                  </p>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`relative px-8 py-4 rounded-xl font-bold text-lg shadow-xl overflow-hidden transition-all duration-300 ${
                      isSubscribed
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-chinese-blue to-ceil text-white hover:shadow-2xl'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubscribed ? (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Subscribed
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          Subscribe to Club
                        </>
                      )}
                    </span>
                    {!isSubscribed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Contact Details */}
            <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-chinese-blue to-ceil rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-chinese-blue">Contact Information</h2>
              </div>

              <div className="space-y-4">
                {club.email ? (
                  <div className="flex items-start gap-4 p-4 bg-white/30 rounded-xl hover:bg-white/40 transition-colors">
                    <div className="w-10 h-10 bg-ceil/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-ceil" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Email</p>
                      <a href={`mailto:${club.email}`} className="text-chinese-blue hover:text-ceil transition-colors font-semibold">
                        {club.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-4 bg-white/30 rounded-xl">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Email</p>
                      <p className="text-gray-400">Not available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-chinese-blue to-ceil rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-chinese-blue">Website</h2>
              </div>

              {club.website ? (
                <a 
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/30 rounded-xl hover:bg-white/40 transition-colors group"
                >
                  <div className="w-10 h-10 bg-ceil/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-ceil" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Visit Website</p>
                    <p className="text-chinese-blue group-hover:text-ceil transition-colors font-semibold truncate">
                      {club.website}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-white/30 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Website</p>
                    <p className="text-gray-400">Not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events Placeholder */}
          <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-chinese-blue to-ceil rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-chinese-blue">Upcoming Events</h2>
            </div>

            <div className="text-center py-12">
              <div className="w-20 h-20 bg-ceil/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-ceil" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No upcoming events at this time</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for new events!</p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}