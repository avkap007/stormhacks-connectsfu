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
}: {
  clubs: Club[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={`${className}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-chinese-blue mb-6 text-center">
        {title}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <motion.a
            key={club.id}
            href={club.href ?? "#"}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="block rounded-2xl bg-white/60 backdrop-blur-lg border border-white/30 shadow-sm hover:shadow-xl transition overflow-hidden"
          >
            {/* Club header */}
            <div className="flex items-center gap-4 p-6">
              {club.imageUrl ? (
                <img
                  src={club.imageUrl}
                  alt={club.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-chinese-blue to-ceil text-white grid place-items-center text-2xl">
                  {club.emoji ?? "🏫"}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-chinese-blue">
                  {club.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{club.tagline}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <button className="w-full py-2.5 rounded-xl bg-chinese-blue text-white font-medium text-sm hover:bg-ceil transition">
                Explore Club
              </button>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
