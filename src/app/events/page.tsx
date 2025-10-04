"use client";

import { useState } from "react";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import FiltersDrawer from "@/components/FiltersDrawer";
import { events, Event } from "@/lib/sampleData";

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'soonest' | 'popular' | 'newest'>('soonest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Top Bar */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200/50 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Box */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 text-gray-900 placeholder-gray-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Filters & View Toggle */}
            <div className="flex items-center gap-4">
              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
              >
                <span>🔧</span>
                Filters
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 text-gray-900"
              >
                <option value="soonest">Soonest</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ⚏
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Drawer */}
        {showFilters && (
          <FiltersDrawer onClose={() => setShowFilters(false)} />
        )}

        {/* Events Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              viewMode={viewMode}
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-chinese-blue to-ceil text-white hover:shadow-lg transition-all duration-200 font-medium">
            Show More Events
          </button>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
