'use client'

import { useAppStore } from '@/store/useAppStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { currentView } = useAppStore()
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(false)
    const timer = requestAnimationFrame(() => {
      setAnimateIn(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [currentView])

  return (
    <motion.div
      initial={false}
      animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
