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
  if (
    desc.match(
      /\b(tech|programming|software|coding|developer|technology|engineering|satellite|development|cyber|satellite|engineers)\b/i
    )
  ) {
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
  id: club.name.toLowerCase().replace(/\s+/g, "-"),
  name: club.name,
  description: club.description,
  logo: club.logo,
  categories: categorizeClub(club.description),
  website: club.website,
  email: club.email,
}));

const categoryColors: Record<string, string> = {
  Technology: "bg-pastel-blue text-blue-800 border-blue-200",
  "Arts & Performance": "bg-pastel-pink text-pink-800 border-pink-200",
  "Business & Professional": "bg-pastel-amber text-amber-800 border-amber-200",
  Gaming: "bg-pastel-violet text-violet-800 border-violet-200",
  "Sports & Recreation": "bg-pastel-green text-green-800 border-green-200",
  Cultural: "bg-pastel-peach text-orange-800 border-orange-200",
  Religion: "bg-pastel-lavender text-purple-800 border-purple-200",
  Other: "bg-blue-mist text-blue-900 border-blue-200",
};

export default function Clubs() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allCategories = Array.from(new Set(clubsData.flatMap((club) => club.categories))).sort();

  const filteredClubs = clubsData.filter((club) => {
    const matchesCategory = selectedCategory ? club.categories.includes(selectedCategory) : true;
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="mx-auto max-w-[1200px] px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-2 lowercase">
              sfu clubs & organizations
            </h1>
            <p className="text-sm text-gray-700 max-w-2xl mx-auto">
              Discover and connect with student-led clubs that match your interests and passions.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="rounded-2xl bg-white border border-gray-100 p-6 mb-10">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search clubs by name or description..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-mist bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  !selectedCategory
                    ? "bg-blue-mist text-white border-blue-300"
                    : "bg-white text-gray-700 hover:bg-blue-mist/20 border-gray-200"
                }`}
              >
                All ({clubsData.length})
              </button>
              {allCategories.map((category) => {
                const count = clubsData.filter((club) => club.categories.includes(category)).length;
                const colorClass = categoryColors[category] || categoryColors.Other;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${colorClass} ${
                      selectedCategory === category
                        ? "ring-2 ring-offset-2 ring-blue-mist"
                        : "hover:opacity-80"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            {selectedCategory && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-mist/20 text-chinese-blue rounded-full border border-blue-mist text-sm font-medium">
                  <span>Filter: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory(null)} className="text-blue-700 hover:text-blue-900">
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mb-6 text-center text-gray-600 text-sm">
            Showing {filteredClubs.length} club{filteredClubs.length !== 1 ? "s" : ""}
          </div>

          {/* White cards without shadow, fixed bottom button */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.id}`}
                className="flex flex-col relative rounded-2xl bg-white border border-gray-200 hover:border-blue-mist transition overflow-hidden p-6"
              >
                {/* Small square logo */}
                <div className="absolute top-4 right-4 w-14 h-14 bg-white rounded-xl overflow-hidden border border-gray-200">
                  <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-lg font-semibold text-chinese-blue mb-2 pr-20">{club.name}</h3>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3 pr-20 flex-grow">{club.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {club.categories.map((category) => {
                    const colorClass = categoryColors[category] || categoryColors.Other;
                    return (
                      <span
                        key={category}
                        className={`inline-block px-3 py-1 text-xs rounded-full border font-semibold ${colorClass}`}
                      >
                        {category}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-auto pt-4">
                  <button className="mt-auto w-full py-2.5 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition">
                    Explore Club
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
