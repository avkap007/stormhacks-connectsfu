"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FiltersDrawerProps {
  onClose: () => void;
}

export default function FiltersDrawer({ onClose }: FiltersDrawerProps) {
  const [selectedCampus, setSelectedCampus] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>('all');
  const [freeOnly, setFreeOnly] = useState(false);

  const campuses = ['Burnaby', 'Surrey', 'Vancouver', 'Off-campus'];
  const categories = ['Technology', 'Business', 'Networking', 'Health & Wellness', 'Cultural', 'Career', 'Environment'];

  const toggleCampus = (campus: string) => {
    setSelectedCampus(prev => 
      prev.includes(campus) 
        ? prev.filter(c => c !== campus)
        : [...prev, campus]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const applyFilters = () => {
    // TODO: Implement filter logic
    onClose();
  };

  const clearFilters = () => {
    setSelectedCampus([]);
    setSelectedCategory([]);
    setDateRange('all');
    setFreeOnly(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-chinese-blue">Filters</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-chinese-blue transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Campus Filter */}
        <div>
          <h4 className="font-semibold text-chinese-blue mb-3">Campus</h4>
          <div className="space-y-2">
            {campuses.map((campus) => (
              <label key={campus} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCampus.includes(campus)}
                  onChange={() => toggleCampus(campus)}
                  className="w-4 h-4 text-chinese-blue rounded focus:ring-chinese-blue/50"
                />
                <span className="text-sm text-gray-700">{campus}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-semibold text-chinese-blue mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-chinese-blue rounded focus:ring-chinese-blue/50"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <h4 className="font-semibold text-chinese-blue mb-3">Date</h4>
          <div className="space-y-2">
            {['Today', 'Tomorrow', 'This weekend', 'Next week', 'This month', 'All dates'].map((date) => (
              <label key={date} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value={date.toLowerCase().replace(' ', '_')}
                  checked={dateRange === date.toLowerCase().replace(' ', '_')}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-4 h-4 text-chinese-blue focus:ring-chinese-blue/50"
                />
                <span className="text-sm text-gray-700">{date}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div>
          <h4 className="font-semibold text-chinese-blue mb-3">More Options</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="w-4 h-4 text-chinese-blue rounded focus:ring-chinese-blue/50"
              />
              <span className="text-sm text-gray-700">Free events only</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Distance
              </label>
              <select className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-chinese-blue/50 text-sm">
                <option>Any distance</option>
                <option>Within 1km</option>
                <option>Within 5km</option>
                <option>Within 10km</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-4 border-t border-white/20">
        <button
          onClick={clearFilters}
          className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 px-6 py-3 rounded-xl bg-chinese-blue text-white hover:bg-ceil transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
}
