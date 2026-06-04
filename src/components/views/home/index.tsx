'use client'

import HeroSection from './HeroSection'
import StatsBar from './StatsBar'
import FeaturedCourses from './FeaturedCourses'
import CategoriesSection from './CategoriesSection'
import TestimonialsSection from './TestimonialsSection'
import CtaSection from './CtaSection'

export default function HomeView() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />

      {/* Section Divider */}
      <div className="flex justify-center py-6">
        <div className="w-24 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />
      </div>

      <FeaturedCourses />

      {/* Section Divider */}
      <div className="bg-white">
        <div className="flex justify-center py-6">
          <div className="w-24 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />
        </div>
      </div>

      <CategoriesSection />

      {/* Section Divider */}
      <div className="bg-gray-50">
        <div className="flex justify-center py-6">
          <div className="w-24 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />
        </div>
      </div>

      <TestimonialsSection />
      <CtaSection />
    </div>
  )
}
