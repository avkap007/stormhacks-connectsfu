"use client";

import * as React from "react";
import { motion } from "framer-motion";

export type Club = {
  id: string;
  name: string;
  tagline: string;
  emoji?: string;
  imageUrl?: string;
  href?: string;
};

export default function NewClubsSpotlight({
  clubs,
  title = "New Clubs Spotlight",
  className = "",
  subtitle,
}: {
  clubs: Club[];
  title?: string;
  className?: string;
  subtitle?: string;
}) {
  return (
    <section className={`${className}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-2 text-center lowercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-600 mb-8 text-center">{subtitle}</p>
      )}

      {/* Constrain width to align with other sections */}
      <div className="mx-auto max-w-[1200px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.slice(0, 3).map((club) => (
          <motion.a
            key={club.id}
            href={club.href ?? "#"}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="block rounded-2xl bg-white/60 backdrop-blur-lg border border-white/30 shadow-sm hover:shadow-xl transition overflow-hidden"
          >
            {/* Club Image */}
            {club.imageUrl ? (
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={club.imageUrl}
                  alt={club.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-ceil/30 via-pearly-purple/20 to-dessert-sand/30 text-4xl grid place-items-center text-chinese-blue rounded-t-2xl">
                {club.emoji ?? "🏫"}
              </div>
            )}

            {/* Club Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-chinese-blue mb-1">
                {club.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {club.tagline}
              </p>
              <button className="w-full py-2.5 rounded-xl bg-chinese-blue text-white font-medium text-sm hover:bg-ceil transition">
                Explore Club
              </button>
            </div>
          </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
