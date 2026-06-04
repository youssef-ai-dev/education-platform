import { create } from 'zustand'

export type ViewType = 'home' | 'courses' | 'course-detail' | 'lesson' | 'quiz' | 'quiz-result' | 'dashboard' | 'certificate'

interface QuizResult {
  score: number
  total: number
  passed: boolean
}

interface UserSession {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

interface AppState {
  currentView: ViewType
  selectedCourseId: string | null
  selectedLessonId: string | null
  selectedQuizId: string | null
  studentEmail: string
  studentName: string
  quizResult: QuizResult | null
  certificateId: string | null
  searchQuery: string
  selectedCategory: string
  user: UserSession | null

  navigate: (view: ViewType, data?: Record<string, string>) => void
  setStudentInfo: (name: string, email: string) => void
  setQuizResult: (result: QuizResult | null) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setUser: (user: UserSession | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  selectedCourseId: null,
  selectedLessonId: null,
  selectedQuizId: null,
  studentEmail: '',
  studentName: '',
  quizResult: null,
  certificateId: null,
  searchQuery: '',
  selectedCategory: 'الكل',
  user: null,

  navigate: (view, data = {}) =>
    set((state) => ({
      currentView: view,
      selectedCourseId: data.courseId ?? state.selectedCourseId,
      selectedLessonId: data.lessonId ?? state.selectedLessonId,
      selectedQuizId: data.quizId ?? state.selectedQuizId,
      certificateId: data.certificateId ?? state.certificateId,
      quizResult: view === 'quiz-result' ? state.quizResult : null,
    })),

  setStudentInfo: (name, email) =>
    set({ studentName: name, studentEmail: email }),

  setQuizResult: (result) =>
    set({ quizResult: result }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  setSelectedCategory: (category) =>
    set({ selectedCategory: category }),

  setUser: (user) =>
    set({
      user,
      studentName: user?.name || '',
      studentEmail: user?.email || '',
    }),

  logout: () =>
    set({
      user: null,
      studentName: '',
      studentEmail: '',
    }),
}))
