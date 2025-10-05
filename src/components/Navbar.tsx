"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, setShowAuthModal } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white text-chinese-blue z-50">
      {/* 3-column grid keeps nav perfectly centered */}
      <div className="grid grid-cols-3 items-center px-8 h-16 w-full">

        {/* Left - Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl">
              <img
                src="/assets/mascot_blue.gif"
                alt="Students collaborating"
                className="block w-8 h-8 sm:h-10 md:h-10 object-cover"
                loading="lazy"
              />
            </span>
            <span className="text-xl font-bold text-chinese-blue">connectSFU</span>
          </motion.div>
        </Link>

        {/* Center - Navigation (always centered because of grid) */}
        <nav className="hidden md:flex justify-center gap-8 text-base font-normal">
          <Link href="/" className="hover:text-ceil transition-colors duration-200">
            home
          </Link>
          <Link href="/clubs" className="hover:text-ceil transition-colors duration-200">
            clubs
          </Link>
          <Link href="/events" className="hover:text-ceil transition-colors duration-200">
            events
          </Link>
        </nav>

        {/* Right - Login / User + Mobile toggle */}
        <div className="flex items-center justify-end space-x-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/profile"
                className="text-sm text-chinese-blue hover:text-ceil transition-colors"
              >
                Profile
              </Link>
              <span className="text-sm text-gray-600">
                {user.user_metadata?.name || user.email?.split("@")[0]}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-pearly-purple text-white hover:bg-pearly-purple/80"
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-chinese-blue text-white hover:bg-ceil hidden md:inline-block"
            >
              login
            </motion.button>
          )}

          {/* Mobile menu toggle (always on far right) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col space-y-1.5 p-2 focus:outline-none"
            >
              <div className={`h-[3px] w-8 bg-chinese-blue transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></div>
              <div className={`h-[3px] w-8 bg-chinese-blue transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></div>
              <div className={`h-[3px] w-8 bg-chinese-blue transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="absolute top-full w-full bg-white p-6 md:hidden border-b border-gray-200"
        >
          <div className="flex flex-col space-y-4 text-center">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-normal text-chinese-blue hover:text-ceil transition-colors">
              home
            </Link>
            <Link href="/clubs" onClick={() => setIsOpen(false)} className="text-lg font-normal text-chinese-blue hover:text-ceil transition-colors">
              clubs
            </Link>
            <Link href="/events" onClick={() => setIsOpen(false)} className="text-lg font-normal text-chinese-blue hover:text-ceil transition-colors">
              events
            </Link>

            {user ? (
              <div className="mt-4 space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-2 rounded-full text-sm font-medium bg-chinese-blue text-white hover:bg-ceil transition-colors text-center"
                >
                  profile
                </Link>
                <button
                  onClick={signOut}
                  className="w-full px-6 py-2 rounded-full text-sm font-medium bg-pearly-purple text-white hover:bg-pearly-purple/80 transition-colors"
                >
                  sign out
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="mt-4 px-6 py-2 rounded-full text-sm font-medium bg-chinese-blue text-white hover:bg-ceil transition-colors">
                login
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
