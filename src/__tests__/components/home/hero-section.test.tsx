import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroSection from '@/components/views/home/HeroSection'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock the zustand store
vi.mock('@/store/useAppStore', () => ({
  useAppStore: () => ({
    navigate: vi.fn(),
  }),
}))

describe('HeroSection', () => {
  it('renders the hero section with main heading', () => {
    render(<HeroSection />)

    expect(screen.getByText('تعلّم بلا حدود')).toBeInTheDocument()
  })

  it('renders the sub-heading', () => {
    render(<HeroSection />)

    // The text appears in both the heading span and the paragraph, so use getAllByText
    const elements = screen.getAllByText(/مع أفضل المدربين/)
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the CTA buttons', () => {
    render(<HeroSection />)

    expect(screen.getByText('استكشف الدورات')).toBeInTheDocument()
    expect(screen.getByText('جرّبه مجاناً')).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    render(<HeroSection />)

    expect(screen.getByText('شهادات معتمدة')).toBeInTheDocument()
    expect(screen.getByText(/دعم متواصل/)).toBeInTheDocument()
  })

  it('renders the floating badges', () => {
    render(<HeroSection />)

    expect(screen.getByText('معتمدة دولياً')).toBeInTheDocument()
    expect(screen.getByText('+500 طالب')).toBeInTheDocument()
  })

  it('renders hero illustration image', () => {
    render(<HeroSection />)

    const img = screen.getByAltText(/علم/)
    expect(img).toBeInTheDocument()
  })
})
