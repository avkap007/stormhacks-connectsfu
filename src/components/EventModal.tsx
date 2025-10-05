"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Event } from "@/lib/supabase";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createRSVP, sendConfirmationEmail } from "@/lib/supabase";
import { supabase } from "@/lib/supabaseClient";
import BuddyMatchModal from "./BuddyMatchModal";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const { user, setShowAuthModal } = useAuth();
  const [rsvpData, setRsvpData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [findBuddy, setFindBuddy] = useState(false);
  const [reminder24h, setReminder24h] = useState(false);
  const [reminder2h, setReminder2h] = useState(false);
  const [calendarFeedback, setCalendarFeedback] = useState('');
  const [showBuddyModal, setShowBuddyModal] = useState(false);

  if (!event) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date TBD';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

      const handleRsvp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!event) return;

        try {
          // Get the current session token
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setCalendarFeedback('❌ Please log in to RSVP for events.');
            setTimeout(() => setCalendarFeedback(''), 3000);
            return;
          }

          // Create RSVP in database with all the form data
          const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              eventId: event.id,
              name: rsvpData.name || user?.user_metadata?.name || 'User',
              email: rsvpData.email || user?.email || 'user@sfu.ca',
              phone: rsvpData.phone,
              dietaryRestrictions: rsvpData.dietaryRestrictions,
              emergencyContact: rsvpData.emergencyContact,
              emergencyPhone: rsvpData.emergencyPhone,
              findBuddy: findBuddy,
              reminder24h: reminder24h,
              reminder2h: reminder2h,
              status: 'going'
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create RSVP');
          }

          const result = await response.json();

          setIsRsvpSubmitted(true);
          setCalendarFeedback('✅ RSVP submitted successfully!');

          // Close modal after 3 seconds
          setTimeout(() => {
            onClose();
            setIsRsvpSubmitted(false);
            setCalendarFeedback('');
          }, 3000);

        } catch (error) {
          console.error('RSVP Error:', error);
          setCalendarFeedback('❌ Error submitting RSVP. Please try again.');
          setTimeout(() => setCalendarFeedback(''), 3000);
        }
      };

  const generateICS = () => {
    // Format dates for ICS (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatICSDate(event.start_at);
    const endDate = formatICSDate(event.end_at);
    const now = formatICSDate(new Date().toISOString());
    
    // Clean up text for ICS format
    const cleanText = (text: string) => {
      return text
        .replace(/\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;')
        .replace(/\\/g, '\\\\');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ConnectSFU//Event//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@connectsfu.ca`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${cleanText(event.title)}`,
      `DESCRIPTION:${cleanText(event.description + '\\n\\nLocation: ' + event.location_text + ', ' + event.campus + ' Campus')}`,
      `LOCATION:${cleanText(event.location_text + ', ' + event.campus + ' Campus')}`,
      `ORGANIZER:CN=${event.clubs?.name || 'SFU Club'}:MAILTO:${(event.clubs?.name || 'sfuclub').toLowerCase().replace(/\s+/g, '')}@connectsfu.ca`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success feedback
    setCalendarFeedback('📥 ICS file downloaded successfully!');
    setTimeout(() => setCalendarFeedback(''), 3000);
    console.log('ICS file generated successfully:', event.title);
  };

  const getGoogleCalendarUrl = () => {
    const formatGoogleDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatGoogleDate(event.start_at);
    const endDate = formatGoogleDate(event.end_at);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: `${event.description}\n\nOrganized by: ${event.clubs?.name || 'SFU Club'}\nCampus: ${event.campus}`,
      location: `${event.location_text}, ${event.campus} Campus`,
      trp: 'false'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="flex flex-1 min-h-0">
              {/* Left rail - Vertical poster */}
              <div className="w-44 p-6 border-r hidden md:block">
                {event.poster_vertical_url ? (
                  <img
                    src={event.poster_vertical_url}
                    alt="Event poster"
                    className="w-full rounded-lg border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 rounded-lg border bg-gray-100 grid place-items-center text-gray-400 text-xs">
                    poster
                  </div>
                )}
              </div>

              {/* Right - Event Info */}
              <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h1>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-sm font-medium">{event.clubs?.name || 'SFU Club'}</span>
                      <span className="text-sm">•</span>
                      <span className="text-sm">{formatDate(event.start_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Event Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📅</span>
                      <span>{formatDate(event.start_at)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📍</span>
                      <span>{event.location_text}, {event.campus}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">👥</span>
                      <span>{event.attendees || 0}/{event.max_attendees || '∞'} attending</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">🏷️</span>
                      <span>{event.category}</span>
                    </div>
                  </div>
                  
                  {/* Poster + Tags */}
                  <div className="mt-4">
                    {event.poster_vertical_url ? (
                      <img
                        src={event.poster_vertical_url}
                        alt="Event poster"
                        className="w-40 rounded-lg border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-40 h-56 rounded-lg border bg-gray-100 grid place-items-center text-gray-400 text-xs">
                        poster
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* About the Event */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Event</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>

                {/* About the Club */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About {event.clubs?.name || 'SFU Club'}</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={event.clubs?.logo_url || '/assets/blueprint.png'}
                      alt="Club logo"
                      className="w-10 h-10 rounded-lg object-cover border"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{event.clubs?.name || 'Student Club'}</p>
                      <button className="text-sm text-chinese-blue hover:underline">
                        Follow Club
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - RSVP Panel */}
              <div className="w-96 bg-gray-50 p-8 border-l overflow-y-auto">
                {!user ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔐</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to RSVP</h3>
                    <p className="text-gray-600 mb-6">You need to be logged in to RSVP for events.</p>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full px-6 py-3 bg-chinese-blue text-white rounded-lg hover:bg-ceil transition-colors font-medium"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                ) : isRsvpSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">RSVP Confirmed!</h3>
                    <p className="text-gray-600">Your RSVP has been saved and you'll receive a confirmation email shortly.</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">RSVP for Event</h3>
                    
                    <form onSubmit={handleRsvp} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={user?.user_metadata?.name || rsvpData.name}
                          onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 focus:border-chinese-blue/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SFU Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={user?.email || rsvpData.email}
                          onChange={(e) => setRsvpData({...rsvpData, email: e.target.value})}
                          placeholder="yourname@sfu.ca"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 focus:border-chinese-blue/50"
                          readOnly={!!user}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={rsvpData.phone}
                          onChange={(e) => setRsvpData({...rsvpData, phone: e.target.value})}
                          placeholder="(555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 focus:border-chinese-blue/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dietary Restrictions
                        </label>
                        <textarea
                          value={rsvpData.dietaryRestrictions}
                          onChange={(e) => setRsvpData({...rsvpData, dietaryRestrictions: e.target.value})}
                          rows={2}
                          placeholder="Vegetarian, allergies, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 focus:border-chinese-blue/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          value={rsvpData.emergencyContact}
                          onChange={(e) => setRsvpData({...rsvpData, emergencyContact: e.target.value})}
                          placeholder="Parent, friend, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 focus:border-chinese-blue/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={rsvpData.emergencyPhone}
                          onChange={(e) => setRsvpData({...rsvpData, emergencyPhone: e.target.value})}
                          placeholder="(555) 987-6543"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 focus:border-chinese-blue/50"
                        />
                      </div>

                      {/* Additional Options */}
                      <div className="space-y-3 pt-4 border-t">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={findBuddy}
                            onChange={(e) => setFindBuddy(e.target.checked)}
                            className="w-4 h-4 text-chinese-blue rounded focus:ring-chinese-blue/50"
                          />
                          <span className="text-sm text-gray-700">Find me a buddy for this event</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={reminder24h}
                            onChange={(e) => setReminder24h(e.target.checked)}
                            className="w-4 h-4 text-chinese-blue rounded focus:ring-chinese-blue/50"
                          />
                          <span className="text-sm text-gray-700">Remind me 24 hours before</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={reminder2h}
                            onChange={(e) => setReminder2h(e.target.checked)}
                            className="w-4 h-4 text-chinese-blue rounded focus:ring-chinese-blue/50"
                          />
                          <span className="text-sm text-gray-700">Remind me 2 hours before</span>
                        </label>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t space-y-3">
                        {/* Calendar feedback */}
                        {calendarFeedback && (
                          <div className="p-2 bg-dessert-sand/20 text-dessert-sand border border-dessert-sand/30 rounded-lg text-xs text-center">
                            {calendarFeedback}
                          </div>
                        )}

                        {/* RSVP and Calendar buttons side by side */}
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-chinese-blue text-white rounded-lg hover:bg-ceil transition-colors font-medium text-sm"
                          >
                            RSVP
                          </button>
                          <a
                            href={getGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm text-center"
                          >
                            GCal Link
                          </a>
                        </div>

                        {/* Find Buddy Button - Full width below */}
                        <button
                          type="button"
                          onClick={() => setShowBuddyModal(true)}
                          className="w-full px-4 py-2 bg-pearly-purple text-white rounded-lg hover:bg-pearly-purple/80 transition-colors font-medium text-sm"
                        >
                          🤝 Find a Buddy
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Buddy Match Modal */}
      {showBuddyModal && (
        <BuddyMatchModal
          key="buddy-modal"
          isOpen={showBuddyModal}
          onClose={() => setShowBuddyModal(false)}
          eventId={event.id}
          eventTitle={event.title}
        />
      )}
    </AnimatePresence>
  );
}
