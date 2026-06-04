'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Course } from './types'
import CoursesHeader from './CoursesHeader'
import FilterBar from './FilterBar'
import CourseGrid from './CourseGrid'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CoursesView() {
  const { searchQuery, selectedCategory } = useAppStore()
  const [selectedLevel, setSelectedLevel] = useState('الكل')

  const params = new URLSearchParams()
  if (selectedCategory && selectedCategory !== 'الكل') params.set('category', selectedCategory)
  if (searchQuery) params.set('search', searchQuery)

  const { data: courses = [] } = useSWR<Course[]>(
    `/api/courses?${params.toString()}`,
    fetcher
  )

  const filteredCourses = useMemo(() => {
    let filtered = courses
    if (selectedLevel !== 'الكل') {
      filtered = filtered.filter(c => c.level === selectedLevel)
    }
    return filtered
  }, [courses, selectedLevel])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/80">
      <CoursesHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-2">
        <FilterBar
          selectedLevel={selectedLevel}
          onSelectedLevelChange={setSelectedLevel}
          filteredCount={filteredCourses.length}
        />
        <CourseGrid filteredCourses={filteredCourses} />
      </div>
    </div>
  )
}
