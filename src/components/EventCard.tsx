"use client";

import { motion } from "framer-motion";
import { Event } from "@/lib/supabase";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  viewMode: "grid" | "list";
  onLearnMore: (event: Event) => void;
}

// Reusable blue-mist chip class
const chipClass =
  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium bg-blue-mist/20 text-gray-900 border-blue-mist";

export default function EventCard({ event, viewMode, onLearnMore }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getTimeUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `In ${days} days`;
    return formatDate(dateString);
  };

  const DateChip = (
    <span className={chipClass}>
      <span>📅</span>
      {getTimeUntil(event.start_at)}
    </span>
  );

  const ClubChip = (
    <span className={chipClass}>
      <span>🏫</span>
      {event.clubs?.name || "SFU Club"}
    </span>
  );

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-transform"
      >
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {DateChip}
                  {ClubChip}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                  }`}
                  aria-label="Like"
                >
                  {isLiked ? "♥" : "♡"}
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-400"
                  }`}
                  aria-label="Save"
                >
                  {isSaved ? "🔖" : "📑"}
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">
              {event.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                📍 {event.campus} • {event.location_text}
              </span>
              <span className="flex items-center gap-1">
                👥 {event.attendees || 0}/{event.max_attendees || "∞"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag) => (
                <span key={tag} className={`${chipClass} text-[12px]`}>
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onLearnMore(event)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-900 transition-colors text-sm font-medium"
            >
              Learn More
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-gray-300/50 hover:shadow-lg transition-all duration-200 h-full flex"
    >
      {/* Vertical poster */}
      <div className="w-24 sm:w-28 md:w-32 shrink-0">
        {event.poster_vertical_url || event.poster_url ? (
          <img
            src={event.poster_vertical_url || event.poster_url!}
            alt="Poster"
            className="h-full w-full object-cover rounded-l-xl"
            loading="lazy"
          />
        ) : (
          <div className="h-full min-h-40 w-full rounded-l-xl bg-gray-100 grid place-items-center text-gray-400 text-xs">
            poster
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {DateChip}
            {ClubChip}
          </div>
        </div>

        <div className="flex gap-1 ml-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-1.5 rounded-md transition-colors ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
            aria-label="Like"
          >
            {isLiked ? "♥" : "♡"}
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-1.5 rounded-md transition-colors ${
              isSaved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-400"
            }`}
            aria-label="Save"
          >
            {isSaved ? "🔖" : "📑"}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>⏱️</span>
          <span>{getTimeUntil(event.start_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{event.campus}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>{event.attendees || 0} attending</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 text-sm line-clamp-3 flex-1 leading-relaxed">
        {event.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {event.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={`${chipClass} text-[12px]`}>
            #{tag}
          </span>
        ))}
        {event.tags.length > 3 && (
          <span className="px-2 py-1 rounded-md text-xs border bg-gray-50 text-gray-500 border-gray-200">
            +{event.tags.length - 3}
          </span>
        )}
      </div>

      <button
        onClick={() => onLearnMore(event)}
        className="w-full px-4 py-2.5 bg-black text-white rounded-lg hover:bg-neutral-900 transition-colors text-sm font-medium"
      >
        Learn More
      </button>
      </div>
    </motion.div>
  );
}
