'use client'

import { useAppStore } from '@/store/useAppStore'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { CATEGORIES, LEVELS } from './constants'

interface FilterBarProps {
  selectedLevel: string
  onSelectedLevelChange: (level: string) => void
  filteredCount: number
}

export default function FilterBar({ selectedLevel, onSelectedLevelChange, filteredCount }: FilterBarProps) {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppStore()

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-white/60 p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search with enhanced focus effects */}
          <div className="relative flex-1 w-full group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
            <Input
              placeholder="ابحث عن دورة باسمها أو مدربها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-12 text-base rounded-xl border-gray-200/80 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:shadow-lg focus:shadow-emerald-100/50 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-500 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-40 h-12 rounded-xl border-gray-200/80 bg-white/60">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={onSelectedLevelChange}>
              <SelectTrigger className="w-full md:w-36 h-12 rounded-xl border-gray-200/80 bg-white/60">
                <SelectValue placeholder="المستوى" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map(lvl => (
                  <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category chips with gradient active state */}
        <div className="flex flex-wrap gap-2 mt-5">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                selectedCategory === cat
                  ? 'text-white shadow-lg shadow-emerald-300/40'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-200'
              }`}
            >
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results count with badge-like appearance */}
      <div className="mb-6 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>عرض {filteredCount} دورة</span>
        </div>
        {(selectedCategory !== 'الكل' || selectedLevel !== 'الكل' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('الكل')
              onSelectedLevelChange('الكل')
              setSearchQuery('')
            }}
            className="text-sm text-gray-400 hover:text-emerald-600 transition-colors underline underline-offset-2"
          >
            مسح الفلاتر
          </button>
        )}
      </div>
    </>
  )
}
