"use client";

import { motion } from "framer-motion";
import { Event } from "@/lib/supabase";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  viewMode: "grid" | "list";
  onLearnMore: (event: Event) => void;
}

const chipClass =
  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium bg-blue-mist/20 text-gray-900 border-blue-mist";

export default function EventCard({ event, onLearnMore }: EventCardProps) {
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

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-2xl overflow-hidden h-full"
    >
      {/* Corner poster like Clubs page */}
      <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl overflow-hidden border border-gray-200">
        {event.poster_vertical_url || event.poster_url ? (
          <img
            src={event.poster_vertical_url || event.poster_url!}
            alt="Poster"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-[10px]">
            poster
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 pr-24 sm:pr-28">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug mr-2">
            {event.title}
          </h3>

          <div className="flex gap-1 ml-2 shrink-0">
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

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {DateChip}
          {ClubChip}
        </div>

        {/* Meta */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>
              {event.campus}
              {event.location_text ? ` • ${event.location_text}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{event.attendees || 0} attending</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3 flex-1">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(event.tags ?? []).slice(0, 4).map((tag) => (
            <span key={tag} className={`${chipClass} text-[12px]`}>
              #{tag}
            </span>
          ))}
          {event.tags && event.tags.length > 4 && (
            <span className="px-2 py-1 rounded-md text-xs border bg-gray-50 text-gray-500 border-gray-200">
              +{event.tags.length - 4}
            </span>
          )}
        </div>

        {/* CTA pinned to bottom */}
        <div className="mt-auto pt-2">
          <button
            onClick={() => onLearnMore(event)}
            className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-neutral-900 transition-colors text-sm font-medium"
          >
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}
