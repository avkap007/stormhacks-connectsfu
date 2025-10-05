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

const clubsData: Club[] = (clubsDataJson as ClubRaw[]).map((club) => ({
  id: club.name.toLowerCase().replace(/\s+/g, '-'),
  name: club.name,
  description: club.description,
  logo: club.logo,
  categories: categorizeClub(club.description),
  website: club.website,
  email: club.email
}));

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
            {filteredClubs.map(club => (
              <div
                key={club.id}
                className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 flex flex-col h-full"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-chinese-blue to-ceil rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                    <img 
                      src={club.logo} 
                      alt={club.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-chinese-blue text-lg leading-tight">{club.name}</h3>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {club.categories.map(category => (
                    <span 
                      key={category} 
                      className="px-2 py-1 bg-ceil/20 text-ceil text-xs rounded-full font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow text-sm">
                  {club.description}
                </p>
                
                <Link 
                  href={`/clubs/${club.id}`}
                  className="w-full bg-chinese-blue text-white py-3 px-6 rounded-xl hover:bg-ceil transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-center"
                >
                  View Club
                </Link>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}