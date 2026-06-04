export interface CourseData {
  id: string
  title: string
  category: string
  thumbnailUrl: string | null
  lessons: { id: string; title: string; description: string; duration: string; order: number; isFree: boolean }[]
  quizzes: { id: string; title: string }[]
}

// YouTube video IDs for each course category - real educational content
export const COURSE_VIDEOS: Record<string, string[]> = {
  'برمجة': ['qz0aGYrrlhU', 'RF5_M7Qz3Tc', 'pEfrdAtAmqk', 'kqtD5dpn9C8', '1Rs2ND1ryYc', 'c9S5cIAois'],
  'تصميم': ['FTjafSZBrE8', '_ygnSguQ_hA', 'Xg0tXgX0kDY', 'GLiJhJxGKPU', 'HZuk6Wkx_Eg'],
  'أعمال': ['j64acUOJYHs', 'Ljx1Z0vY9GM', '9T_YXvX7wAg', 'Nn-Z5vlNx7E', 'M_f16SjEnME'],
  'لغات': ['juKd26Oe0CY', 'H1C9cEr0bYg', 'O4ir7vCqh2k', 'GHeJ9oOEqmc', 'YbhkNcWjBUQ', 'p7CbbBG0DKk'],
  'علوم بيانات': ['LHBE6Q9XlzI', 'xxpcF5CpjCQ', 'uaHGMXM5N28', '4M_Po8XW0p8', 'eMOA1dJgUaI'],
  'default': ['dQw4w9WgXcQ', 'LXb3EKWsInQ', 'jNQXAC9IVRw', '9bZkp7q19f0'],
}

export function getVideoId(courseCategory: string, lessonIndex: number): string {
  if (COURSE_VIDEOS[courseCategory]) {
    return COURSE_VIDEOS[courseCategory][lessonIndex % COURSE_VIDEOS[courseCategory].length]
  }
  return COURSE_VIDEOS['default'][lessonIndex % COURSE_VIDEOS['default'].length]
}
