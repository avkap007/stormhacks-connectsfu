"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white/20 backdrop-blur-lg text-chinese-blue z-50 transition-all shadow-md border-b border-white/10">
      <div className="flex items-center justify-between px-8 h-16 w-full">

        {/* Left Side - ConnectSFU Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl">🎉</span>
            <span className="text-xl font-bold text-chinese-blue">ConnectSFU</span>
          </motion.div>
        </Link>

        {/* Right Side - Navigation + Login */}
        <div className="flex items-center space-x-8 text-lg font-medium">
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-ceil transition-colors duration-200">
              Home
            </Link>
            <Link href="/clubs" className="hover:text-ceil transition-colors duration-200">
              Clubs
            </Link>
            <Link href="/events" className="hover:text-ceil transition-colors duration-200">
              Events
            </Link>
            <Link href="#feedback" className="hover:text-ceil transition-colors duration-200">
              Feedback
            </Link>
          </nav>

          {/* Login/User Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-chinese-blue hidden md:inline">
                {user.email}
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
              className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-chinese-blue text-white hover:bg-ceil hover:shadow-lg hidden md:inline-block"
            >
              Login
            </motion.button>
          )}

          {/* Mobile Menu Button */}
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
          className="absolute top-full w-full bg-white/20 backdrop-blur-lg p-6 md:hidden border-b border-white/10"
        >
          <div className="flex flex-col space-y-4 text-center">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-chinese-blue hover:text-ceil transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/clubs" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-chinese-blue hover:text-ceil transition-colors"
            >
              Clubs
            </Link>
            <Link 
              href="/events" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-chinese-blue hover:text-ceil transition-colors"
            >
              Events
            </Link>
            <Link 
              href="#feedback" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-chinese-blue hover:text-ceil transition-colors"
            >
              Feedback
            </Link>
            {user ? (
              <button 
                onClick={signOut}
                className="mt-4 px-6 py-2 rounded-full text-sm font-medium bg-pearly-purple text-white hover:bg-pearly-purple/80 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="mt-4 px-6 py-2 rounded-full text-sm font-medium bg-chinese-blue text-white hover:bg-ceil transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}