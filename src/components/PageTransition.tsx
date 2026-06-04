'use client'

import { useAppStore } from '@/store/useAppStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// Navigation direction tracking for directional animations
let lastViewIndex = 0
const viewOrder = ['home', 'courses', 'course-detail', 'lesson', 'quiz', 'quiz-result', 'dashboard', 'certificate']

function getNavigationDirection(newView: string): number {
  const newIndex = viewOrder.indexOf(newView)
  const direction = newIndex >= lastViewIndex ? 1 : -1
  lastViewIndex = newIndex >= 0 ? newIndex : 0
  return direction
}

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { currentView } = useAppStore()
  const [displayView, setDisplayView] = useState(currentView)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const direction = useRef(1)

  useEffect(() => {
    if (currentView !== displayView) {
      direction.current = getNavigationDirection(currentView)
      setIsTransitioning(true)
      // Small delay to let exit animation play
      const timer = setTimeout(() => {
        setDisplayView(currentView)
        setIsTransitioning(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [currentView, displayView])

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayView}
          initial={false}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction.current * -20, scale: 0.99 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Top loading bar animation */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.6 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 h-0.5 bg-emerald-500 origin-left z-[60]"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
