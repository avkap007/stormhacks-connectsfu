"use client";

import { motion } from "framer-motion";
import { Event as SampleEvent } from "@/lib/sampleData";
import { Event } from "@/lib/supabase";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list';
  onLearnMore: (event: Event) => void;
}

export default function EventCard({ event, viewMode, onLearnMore }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `In ${days} days`;
    return formatDate(dateString);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:border-gray-300/50 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex gap-6">
          {/* Event Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {event.clubs?.name || 'SFU Club'} • {formatDate(event.start_at)}
                </p>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  {isLiked ? '♥' : '♡'}
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  {isSaved ? '🔖' : '📑'}
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">
              {event.description}
            </p>

            <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                📍 {event.campus} • {event.location_text}
              </span>
              <span className="flex items-center gap-1">
                👥 {event.attendees || 0}/{event.max_attendees || '∞'}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Primary CTA */}
            <button 
              onClick={() => onLearnMore(event)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Learn More
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View - More Notion-like
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white/40 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 hover:shadow-lg transition-all duration-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
            {event.title}
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            {event.clubs?.name || 'SFU Club'}
          </p>
        </div>
        
        {/* Secondary Actions */}
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-1.5 rounded-md transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            {isLiked ? '♥' : '♡'}
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-1.5 rounded-md transition-colors ${
              isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            {isSaved ? '🔖' : '📑'}
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>📅</span>
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

      {/* Description */}
      <p className="text-gray-700 mb-4 text-sm line-clamp-3 flex-1 leading-relaxed">
        {event.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {event.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
          >
            {tag}
          </span>
        ))}
        {event.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
            +{event.tags.length - 3}
          </span>
        )}
      </div>

      {/* Primary CTA */}
      <button 
        onClick={() => onLearnMore(event)}
        className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
      >
        Learn More
      </button>
    </motion.div>
  );
}