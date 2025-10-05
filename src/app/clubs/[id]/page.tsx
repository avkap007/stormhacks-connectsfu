"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download } from 'lucide-react';
import { clubEventsData } from "../data";

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

  // Get club-specific events from the data file
const clubEvents = clubEventsData[clubId] || { upcoming: [], past: [] };
const [upcomingEvents] = useState(clubEvents.upcoming);
const [pastEvents] = useState(clubEvents.past);

  // downloadAttendees function inside component
 const downloadAttendees = (event: any) => {
  const csvContent = [
    ['Name', 'Email', 'Attended'],
    ...event.attendees.map((a: any) => [a.name, a.email, a.attended ? 'Yes' : 'No'])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, '_')}_attendees.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

  if (!club) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#EADCF8] pt-16">
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
          <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl border border-white/40 overflow-hidden mb-8 shadow-sm">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-8">
                
                {/* Club Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-chinese-blue via-ceil to-pearly-purple rounded-3xl flex items-center justify-center overflow-hidden">
                    <img 
                      src={club.logo} 
                      alt={club.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                        className="px-4 py-2 bg-pastel-lavender text-chinese-blue text-sm rounded-full font-semibold border border-gray-200"
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
                    className={`relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 ${
                      isSubscribed
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-pearly-purple text-white hover:bg-opacity-90'
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
            <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl border border-white/40 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#EADCF8] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl border border-white/40 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#EADCF8] rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Upcoming Events Section */}
        <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl border border-white/40 p-8 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EADCF8] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            </div>
            <h2 className="text-2xl font-bold text-chinese-blue">Upcoming Events</h2>
        </div>

        {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
            <div className="w-20 h-20 bg-ceil/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-ceil" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No upcoming events at this time</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new events!</p>
            </div>
        ) : (
            <div className="max-w-4xl mx-auto space-y-6">
            {upcomingEvents.map((event, index) => (
                <div
                key={event.id}
                className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 p-8 hover:shadow-md transition-shadow"
                >
                <div className="flex gap-8 items-start">
                    {/* Event Details - Left Side */}
                    <div className="flex-1">
                    <h3 className="text-2xl font-bold text-chinese-blue mb-4">{event.title}</h3>
                    
                    <div className="space-y-2 text-base text-gray-600 mb-5">
                        <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{event.location}</span>
                        </div>
                    </div>
                    
                    <p className="text-gray-700 text-base mb-5 leading-relaxed">{event.description}</p>
                    
                    <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-2 font-medium">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {event.rsvps}/{event.capacity} RSVPs
                        </span>
                        <span className="font-semibold">{Math.round((event.rsvps / event.capacity) * 100)}% filled</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-[#C084FC] to-[#E879F9] h-3 rounded-full transition-all"
                            style={{ width: `${Math.min((event.rsvps / event.capacity) * 100, 100)}%` }}
                        />
                        </div>
                    </div>
                    </div>

                    {/* Event Poster - Right Side */}
                    <div className="w-56 h-72 flex-shrink-0">
                    <a 
                        href={pastEvents[index % pastEvents.length]?.poster || "/assets/gdsc_clubs_day.png"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full cursor-pointer"
                    >
                        <img 
                        src={pastEvents[index % pastEvents.length]?.poster || "/assets/gdsc_clubs_day.png"}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-xl shadow-md hover:opacity-90 transition-opacity"
                        />
                    </a>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        
        {/* Past Events Section */}
        <div className="bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg rounded-3xl border border-white/40 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EADCF8] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-[#C084FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            </div>
            <h2 className="text-2xl font-bold text-chinese-blue">Past Events</h2>
        </div>

        {pastEvents.length === 0 ? (
            <div className="text-center py-12">
            <p className="text-gray-500">No past events</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map(event => (
                <div
                key={event.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    <a 
                    href={event.poster}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                    >
                    <img 
                        src={event.poster} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    </a>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
                    <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                    <p className="text-sm text-white/90">{event.date}</p>
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium">
                        {event.attendees.length} sign ups, {event.attendees.filter((a: any) => a.attended).length} attended
                    </span>
                    </div>
                    
                    <button
                    onClick={() => downloadAttendees(event)}
                    className="w-full flex items-center justify-center gap-2 bg-chinese-blue hover:bg-ceil text-white px-4 py-2 rounded-full transition-all font-medium text-sm"
                    >
                    <Download size={16} />
                    Download Attendees
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
    </main>
    </>
);
}