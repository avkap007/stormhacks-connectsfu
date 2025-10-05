"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import clubsDataJson from "./club_list.json";

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
  
  if (desc.match(/\b(culture|cultural|heritage|tradition|sikh)\b/i)) {
    categories.push("Cultural");
  }
  if (desc.match(/\b(christian|religion|christ|Christian|CABS|Jewish|jewish|muslim|bible)\b/i)) {
    categories.push("Religion");
  }
  if (desc.match(/\b(tech|programming|software|coding|developer|technology|engineering|satellite|development|cyber|satellite|engineers)\b/i)) {
    categories.push("Technology");
  }
  if (desc.match(/\b(business|career|professional|entrepreneur|accounting)\b/i)) {
    categories.push("Business & Professional");
  }
  if (desc.match(/\b(music|dance|art|performance)\b/i)) {
    categories.push("Arts & Performance");
  }
  if (desc.match(/\b(sport|athletic|hiking|outdoor|ski|golf)\b/i)) {
    categories.push("Sports & Recreation");
  }
  if (desc.match(/\b(gaming|esport|game)\b/i)) {
    categories.push("Gaming");
  }
  
  return categories.length > 0 ? categories : ["Other"];
}

const clubsData: Club[] = (clubsDataJson as ClubRaw[]).map((club) => ({
  id: club.name.toLowerCase().replace(/\s+/g, '-'),
  name: club.name,
  description: club.description,
  logo: club.logo,
  categories: categorizeClub(club.description),
  website: club.website,
  email: club.email
}));

// Category-based color mapping
const categoryColors: Record<string, { gradient: string; hover: string; logo: string; badge: string; text: string }> = {
  'Technology': { 
    gradient: 'from-blue-100/40 via-blue-50/30 to-blue-100/20',
    hover: 'from-blue-500/5 via-blue-400/5 to-blue-500/5',
    logo: 'from-blue-500 via-blue-400 to-blue-600',
    badge: 'from-blue-400/30 to-blue-500/30',
    text: 'text-blue-600'
  },
  'Arts & Performance': { 
    gradient: 'from-purple-100/40 via-purple-50/30 to-purple-100/20',
    hover: 'from-purple-500/5 via-purple-400/5 to-purple-500/5',
    logo: 'from-purple-500 via-purple-400 to-purple-600',
    badge: 'from-purple-400/30 to-purple-500/30',
    text: 'text-purple-600'
  },
  'Business & Professional': { 
    gradient: 'from-green-100/40 via-green-50/30 to-green-100/20',
    hover: 'from-green-500/5 via-green-400/5 to-green-500/5',
    logo: 'from-green-500 via-green-400 to-green-600',
    badge: 'from-green-400/30 to-green-500/30',
    text: 'text-green-600'
  },
  'Gaming': { 
    gradient: 'from-pink-100/40 via-pink-50/30 to-pink-100/20',
    hover: 'from-pink-500/5 via-pink-400/5 to-pink-500/5',
    logo: 'from-pink-500 via-pink-400 to-pink-600',
    badge: 'from-pink-400/30 to-pink-500/30',
    text: 'text-pink-600'
  },
  'Sports & Recreation': { 
    gradient: 'from-orange-100/40 via-orange-50/30 to-orange-100/20',
    hover: 'from-orange-500/5 via-orange-400/5 to-orange-500/5',
    logo: 'from-orange-500 via-orange-400 to-orange-600',
    badge: 'from-orange-400/30 to-orange-500/30',
    text: 'text-orange-600'
  },
  'Cultural': { 
    gradient: 'from-red-100/40 via-red-50/30 to-red-100/20',
    hover: 'from-red-500/5 via-red-400/5 to-red-500/5',
    logo: 'from-red-500 via-red-400 to-red-600',
    badge: 'from-red-400/30 to-red-500/30',
    text: 'text-red-600'
  },
  'Other': { 
    gradient: 'from-gray-100/40 via-gray-50/30 to-gray-100/20',
    hover: 'from-gray-500/5 via-gray-400/5 to-gray-500/5',
    logo: 'from-gray-500 via-gray-400 to-gray-600',
    badge: 'from-gray-400/30 to-gray-500/30',
    text: 'text-gray-600'
  },
};

export default function Clubs() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allCategories = Array.from(
    new Set(clubsData.flatMap(club => club.categories))
  ).sort();

  const filteredClubs = clubsData.filter(club => {
    const matchesCategory = selectedCategory ? club.categories.includes(selectedCategory) : true;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-16">
        <div className="container mx-auto px-4 py-12">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-chinese-blue mb-4">
              SFU Clubs & Organizations
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover and connect with student-led clubs that match your interests and passions.
            </p>
          </div>

          <div className="mb-12">
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-white/20">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search clubs by name or description..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-chinese-blue bg-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory 
                      ? 'bg-chinese-blue text-white shadow-lg' 
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'
                  }`}
                >
                  All ({clubsData.length})
                </button>
                {allCategories.map(category => {
                  const count = clubsData.filter(club => club.categories.includes(category)).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category 
                          ? 'bg-chinese-blue text-white shadow-lg' 
                          : 'bg-white/50 text-gray-700 hover:bg-white/70'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-6 text-center text-gray-600">
            Showing {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club, index) => {
              // Get color based on first category
              const primaryCategory = club.categories[0] || 'Other';
              const color = categoryColors[primaryCategory] || categoryColors['Other'];
              
              return (
                <div
                  key={club.id}
                  className={`group relative bg-gradient-to-br ${color.gradient} backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/40 flex flex-col h-full overflow-hidden hover:-translate-y-2`}
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.hover} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`} />
                  
                  {/* Decorative corner accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color.badge} rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500`} />
                  
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-start mb-6">
                      <div className="relative">
                        <div className={`w-20 h-20 bg-gradient-to-br ${color.logo} rounded-2xl flex items-center justify-center overflow-hidden shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <img 
                            src={club.logo} 
                            alt={club.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Pulsing ring around logo on hover */}
                        <div className={`absolute inset-0 rounded-2xl border-2 ${color.text.replace('text-', 'border-')} opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className={`font-bold ${color.text} text-xl leading-tight group-hover:opacity-80 transition-colors duration-300`}>
                          {club.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {club.categories.map((category, idx) => (
                        <span 
                          key={category} 
                          className={`px-3 py-1 bg-gradient-to-r ${color.badge} ${color.text} text-xs rounded-full font-semibold backdrop-blur-sm border ${color.text.replace('text-', 'border-')}/30 hover:scale-105 transition-transform duration-200 cursor-default`}
                          style={{
                            animation: `slideIn 0.4s ease-out ${index * 0.1 + idx * 0.05}s both`
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed flex-grow text-sm group-hover:text-gray-800 transition-colors duration-300">
                      {club.description}
                    </p>
                    
                    <Link 
                      href={`/clubs/${club.id}`}
                      className={`relative w-full bg-gradient-to-r ${color.logo} text-white py-3 px-6 rounded-xl font-semibold shadow-lg overflow-hidden group/button`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Club
                        <svg className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}