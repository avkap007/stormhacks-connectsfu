"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
// If you’re not using the drawer anymore, you can remove this import:
// import FiltersDrawer from "@/components/FiltersDrawer";
import { Event } from "@/lib/supabase";
import { events as sampleEvents, Event as SampleEvent } from "@/lib/sampleData";
import { parseNaturalLanguageQuery } from "@/lib/geminiSearch";

export default function EventsPage() {
  const searchParams = useSearchParams();

  // REMOVED viewMode state and logic
  const [sortBy, setSortBy] = useState<'soonest' | 'popular' | 'newest'>('soonest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Filter states
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Natural language search with Gemini
  const handleNaturalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const filters = await parseNaturalLanguageQuery(searchQuery);
      if (filters.categories) setSelectedCategories(filters.categories);
      if (filters.campuses) setSelectedCampuses(filters.campuses);
      if (filters.dateRange) setSelectedDate(filters.dateRange);
    } catch (error) {
      console.error('Error with natural language search:', error);
    } finally {
      setSearchLoading(false);
    }
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
              description: `${event.club} - SFU Student Club`,
            },
          }));
          setEvents(convertedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
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
            description: `${event.club} - SFU Student Club`,
          },
        }));
        setEvents(convertedEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply URL parameters - runs when URL changes
  useEffect(() => {
    const categories = searchParams.get('categories');
    if (categories) setSelectedCategories(categories.split(','));

    const campuses = searchParams.get('campuses');
    if (campuses) setSelectedCampuses(campuses.split(','));
    
    const date = searchParams.get('date');
    if (date) setSelectedDate(date);
    
    const query = searchParams.get('q');
    if (query) setSearchQuery(query);
  }, [searchParams]);

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Filter + Sort
  const filteredEvents = events
    .filter(event => {
      if (searchQuery && selectedCategories.length === 0 && selectedCampuses.length === 0 && !selectedDate) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.clubs?.name.toLowerCase().includes(query) ||
          event.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (selectedCampuses.length > 0 && !selectedCampuses.includes(event.campus || '')) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(event.category || '')) return false;

      if (selectedDate && selectedDate !== 'All dates') {
        const eventDate = new Date(event.start_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (selectedDate) {
          case 'Today': {
            const eventDay = new Date(eventDate);
            eventDay.setHours(0, 0, 0, 0);
            if (eventDay.getTime() !== today.getTime()) return false;
            break;
          }
          case 'Tomorrow': {
            const eventTomorrow = new Date(eventDate);
            eventTomorrow.setHours(0, 0, 0, 0);
            if (eventTomorrow.getTime() !== tomorrow.getTime()) return false;
            break;
          }
          case 'This weekend': {
            const dayOfWeek = eventDate.getDay();
            const inNextWeek = eventDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000;
            if ((dayOfWeek !== 0 && dayOfWeek !== 6) || !inNextWeek) return false;
            break;
          }
          case 'Next week': {
            const nextWeekStart = new Date(today);
            nextWeekStart.setDate(nextWeekStart.getDate() + 1);
            const nextWeekEnd = new Date(today);
            nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
            if (eventDate < nextWeekStart || eventDate > nextWeekEnd) return false;
            break;
          }
          case 'This month':
            if (eventDate.getMonth() !== today.getMonth() || eventDate.getFullYear() !== today.getFullYear()) return false;
            break;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "soonest") {
        return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
      }
      if (sortBy === "newest") {
        return new Date(b.created_at || b.start_at).getTime() - new Date(a.created_at || a.start_at).getTime();
      }
      // 'popular' (fallback: attendees or tags length)
      const aScore = (a as any).attendees ?? a.tags?.length ?? 0;
      const bScore = (b as any).attendees ?? b.tags?.length ?? 0;
      return bScore - aScore;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ceil/10 via-pearly-purple/5 to-dessert-sand/10">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-2 lowercase">
            sfu clubs events
          </h1>
          <p className="text-sm text-gray-700 max-w-2xl mx-auto">
            Discover and join exciting events hosted by student clubs across all SFU campuses.
          </p>
        </div>
        
        {/* Top Bar */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            
            {/* Search Box */}
            <div className="flex-1 max-w-md w-full">
              <form onSubmit={handleNaturalSearch} className="w-full">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-5 py-3 focus-within:ring-2 focus-within:ring-blue-mist/30 transition">
                  <span className="mr-2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Try: 'tech events next week' or 'business networking in Burnaby'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 px-2 text-base sm:text-lg"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="ml-3 bg-chinese-blue hover:bg-ceil text-white font-medium px-6 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    {searchLoading ? "..." : "Search"}
                  </button>
                </div>
              </form>
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-4">
              <FilterDropdown
                selectedCampuses={selectedCampuses}
                setSelectedCampuses={setSelectedCampuses}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          {/* Active Filters Row */}
          {(selectedCampuses.length > 0 || selectedCategories.length > 0 || selectedDate) && (
            <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-gray-200/50">
              <span className="text-sm font-medium text-gray-700">Active:</span>
              
              {selectedCampuses.map(campus => (
                <div key={campus} className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span>{campus}</span>
                  <button 
                    onClick={() => setSelectedCampuses(selectedCampuses.filter(c => c !== campus))}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-blue-600">✕</span>
                  </button>
                </div>
              ))}
              
              {selectedCategories.map(category => (
                <div key={category} className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <span>{category}</span>
                  <button 
                    onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-purple-600">✕</span>
                  </button>
                </div>
              ))}
              
              {selectedDate && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <span>{selectedDate}</span>
                  <button 
                    onClick={() => setSelectedDate('')}
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-green-600">✕</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Events Grid (always grid view now) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                viewMode="grid"   // fixed view since list toggle was removed
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No events found</p>
            {(searchQuery || selectedCampuses.length > 0 || selectedCategories.length > 0 || selectedDate) && (
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
            )}
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 rounded-xl bg-chinese-blue text-white hover:shadow-lg transition-all duration-200 font-medium">
              Show More Events
            </button>
          </div>
        )}
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

/* ------------------------- helpers & dropdowns ------------------------- */

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const CAMPUS_OPTIONS = ["Burnaby", "Surrey", "Vancouver", "Online"];
const CATEGORY_OPTIONS = [
  "Technology",
  "Business",
  "Networking",
  "Health & Wellness",
  "Cultural",
  "Career",
  "Environment",
] as const;

const DATE_PRESETS = ["All dates", "Today", "Tomorrow", "This weekend", "Next week", "This month"] as const;
type DatePreset = (typeof DATE_PRESETS)[number];

function FilterDropdown({
  selectedCampuses,
  setSelectedCampuses,
  selectedCategories,
  setSelectedCategories,
  selectedDate,
  setSelectedDate,
}: {
  selectedCampuses: string[];
  setSelectedCampuses: (v: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  // local drafts so user can cancel
  const [campusesDraft, setCampusesDraft] = React.useState<string[]>(selectedCampuses);
  const [categoriesDraft, setCategoriesDraft] = React.useState<string[]>(selectedCategories);
  const [dateDraft, setDateDraft] = React.useState<DatePreset>((selectedDate || "All dates") as DatePreset);

  React.useEffect(() => setCampusesDraft(selectedCampuses), [selectedCampuses]);
  React.useEffect(() => setCategoriesDraft(selectedCategories), [selectedCategories]);
  React.useEffect(() => setDateDraft((selectedDate || "All dates") as DatePreset), [selectedDate]);

  const panelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeCount =
    (selectedCampuses.length > 0 ? 1 : 0) +
    (selectedCategories.length > 0 ? 1 : 0) +
    (selectedDate && selectedDate !== "All dates" ? 1 : 0);

  const toggleDraft = (value: string, draft: string[], setDraft: (v: string[]) => void) => {
    if (draft.includes(value)) setDraft(draft.filter((x) => x !== value));
    else setDraft([...draft, value]);
  };

  const apply = () => {
    setSelectedCampuses(campusesDraft);
    setSelectedCategories(categoriesDraft);
    setSelectedDate(dateDraft);
    setOpen(false);
  };

  const clearAll = () => {
    setCampusesDraft([]);
    setCategoriesDraft([]);
    setDateDraft("All dates");
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={classNames(
          "px-4 py-2 rounded-lg bg-white border border-gray-300 hover:border-gray-400 transition font-medium",
          "flex items-center gap-2"
        )}
      >
        <span>Filters</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {activeCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 py-0.5 bg-blue-mist/30 text-blue-900 border border-blue-mist">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Filters"
          className="absolute right-0 z-20 mt-2 w-[320px] rounded-2xl bg-white border border-gray-200 shadow-sm p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Filter events</h4>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              aria-label="Close filters"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Campus */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">Campus</div>
            <div className="flex flex-wrap gap-2">
              {CAMPUS_OPTIONS.map((c) => {
                const checked = campusesDraft.includes(c);
                return (
                  <label
                    key={c}
                    className={classNames(
                      "cursor-pointer select-none inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
                      checked
                        ? "bg-blue-mist/20 text-gray-900 border-blue-mist"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-mist/10"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleDraft(c, campusesDraft, setCampusesDraft)}
                    />
                    <span>{c}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">Category</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => {
                const checked = categoriesDraft.includes(c);
                return (
                  <label
                    key={c}
                    className={classNames(
                      "cursor-pointer select-none inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
                      checked
                        ? "bg-blue-mist/20 text-gray-900 border-blue-mist"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-mist/10"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleDraft(c, categoriesDraft, setCategoriesDraft)}
                    />
                    <span>{c}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">Date</div>
            <div className="grid grid-cols-2 gap-2">
              {DATE_PRESETS.map((preset) => {
                const active = dateDraft === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDateDraft(preset)}
                    className={classNames(
                      "px-3 py-2 rounded-lg border text-sm text-left",
                      active
                        ? "bg-blue-mist/20 text-gray-900 border-blue-mist"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-mist/10"
                    )}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-neutral-900"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** ----------------------- Sort Dropdown (pretty arrow) ----------------------- */
function SortDropdown({
  sortBy,
  setSortBy,
}: {
  sortBy: 'soonest' | 'popular' | 'newest';
  setSortBy: (v: 'soonest' | 'popular' | 'newest') => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label =
    sortBy === "soonest" ? "Soonest" :
    sortBy === "popular" ? "Most Popular" : "Newest";

  const setAndClose = (v: 'soonest' | 'popular' | 'newest') => {
    setSortBy(v);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:border-gray-400 transition text-gray-900"
      >
        <span>{label}</span>
        {/* Nicer chevron */}
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-44 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
        >
          <li>
            <button
              role="option"
              aria-selected={sortBy === "soonest"}
              onClick={() => setAndClose("soonest")}
              className={classNames(
                "w-full text-left px-4 py-2.5 text-sm hover:bg-blue-mist/10",
                sortBy === "soonest" ? "text-gray-900 bg-blue-mist/20" : "text-gray-700"
              )}
            >
              Soonest
            </button>
          </li>
          <li>
            <button
              role="option"
              aria-selected={sortBy === "popular"}
              onClick={() => setAndClose("popular")}
              className={classNames(
                "w-full text-left px-4 py-2.5 text-sm hover:bg-blue-mist/10",
                sortBy === "popular" ? "text-gray-900 bg-blue-mist/20" : "text-gray-700"
              )}
            >
              Most Popular
            </button>
          </li>
          <li>
            <button
              role="option"
              aria-selected={sortBy === "newest"}
              onClick={() => setAndClose("newest")}
              className={classNames(
                "w-full text-left px-4 py-2.5 text-sm hover:bg-blue-mist/10",
                sortBy === "newest" ? "text-gray-900 bg-blue-mist/20" : "text-gray-700"
              )}
            >
              Newest
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
