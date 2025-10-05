"use client";

import React, { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import FiltersDrawer from "@/components/FiltersDrawer";
import { Event } from "@/lib/supabase";
import { events as sampleEvents, Event as SampleEvent } from "@/lib/sampleData";

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'soonest' | 'popular' | 'newest'>('soonest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Remove filter functions
  const removeCampus = (campus: string) => {
    setSelectedCampuses(selectedCampuses.filter(c => c !== campus));
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const removeDate = () => {
    setSelectedDate('');
  };

  // Fetch events from database on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          // Fallback to sample data if API fails
          console.log('Using sample data as fallback');
          // Convert sample events to database format
          const convertedEvents = sampleEvents.map((event): Event => ({
            id: event.id,
            club_id: '11111111-1111-1111-1111-111111111111',
            title: event.title,
            description: event.description,
            category: event.category,
            campus: event.campus,
            location_text: event.location,
            start_at: event.date.toISOString(),
            end_at: new Date(event.date.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            poster_url: event.image,
            created_by: '00000000-0000-0000-0000-000000000000',
            status: 'active',
            max_attendees: event.maxAttendees,
            is_free: event.isFree,
            cost: event.cost || 0,
            tags: event.tags,
            created_at: new Date().toISOString(),
            clubs: {
              name: event.club,
              logo_url: event.clubAvatar,
              description: `${event.club} - SFU Student Club`
            }
          }));
          setEvents(convertedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Fallback to sample data on error
        const convertedEvents = sampleEvents.map((event): Event => ({
          id: event.id,
          club_id: '11111111-1111-1111-1111-111111111111',
          title: event.title,
          description: event.description,
          category: event.category,
          campus: event.campus,
          location_text: event.location,
          start_at: event.date.toISOString(),
          end_at: new Date(event.date.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          poster_url: event.image,
          created_by: '00000000-0000-0000-0000-000000000000',
          status: 'active',
          max_attendees: event.maxAttendees,
          is_free: event.isFree,
          cost: event.cost || 0,
          tags: event.tags,
          created_at: new Date().toISOString(),
          clubs: {
            name: event.club,
            logo_url: event.clubAvatar,
            description: `${event.club} - SFU Student Club`
          }
        }));
        setEvents(convertedEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-16 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10 pt-16">
      <div className="container mx-auto px-4 py-8">
        
        {/* Top Bar */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200/50 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            
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

          {/* Active Filters Row */}
          {(selectedCampuses.length > 0 || selectedCategories.length > 0 || selectedDate) && (
            <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-gray-200/50">
              <span className="text-sm font-medium text-gray-700">Active:</span>
              
              {/* Campus filters */}
              {selectedCampuses.map(campus => (
                <div key={campus} className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span>{campus}</span>
                  <button 
                    onClick={() => removeCampus(campus)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-blue-600">✕</span>
                  </button>
                </div>
              ))}
              
              {/* Category filters */}
              {selectedCategories.map(category => (
                <div key={category} className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <span>{category}</span>
                  <button 
                    onClick={() => removeCategory(category)}
                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-purple-600">✕</span>
                  </button>
                </div>
              ))}
              
              {/* Date filter */}
              {selectedDate && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <span>{selectedDate}</span>
                  <button 
                    onClick={removeDate}
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-green-600">✕</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters Drawer */}
        {showFilters && (
          <FiltersDrawer 
            onClose={() => setShowFilters(false)}
            onApplyFilters={(campuses, categories, date) => {
              setSelectedCampuses(campuses);
              setSelectedCategories(categories);
              setSelectedDate(date);
            }}
          />
        )}

        {/* Events Grid/List */}
        {events.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No events found</p>
          </div>
        )}

        {/* Load More Button */}
        {events.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-chinese-blue to-ceil text-white hover:shadow-lg transition-all duration-200 font-medium">
              Show More Events
            </button>
          </div>
        )}
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