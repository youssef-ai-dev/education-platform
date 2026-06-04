'use client'

import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseData } from './types'

interface VideoPlayerProps {
  course: CourseData
  currentLesson: { id: string; title: string; description: string; duration: string; order: number; isFree: boolean }
  lessonIndex: number
  isPlaying: boolean
  isMuted: boolean
  videoProgress: number
  showVideo: boolean
  currentVideoId: string
  onPlayToggle: () => void
  onMuteToggle: () => void
  onVideoModeToggle: () => void
}

export default function VideoPlayer({
  course,
  currentLesson,
  lessonIndex,
  isPlaying,
  isMuted,
  videoProgress,
  showVideo,
  currentVideoId,
  onPlayToggle,
  onMuteToggle,
  onVideoModeToggle,
}: VideoPlayerProps) {
  return (
    <div className="bg-gray-950 relative">
      <div className="max-w-7xl mx-auto">
        <div className="aspect-video relative group">
          {showVideo && currentVideoId ? (
            /* Real YouTube Video */
            <iframe
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
              title={currentLesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* Simulated Video Player - Cinematic Look */
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center overflow-hidden">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={currentLesson.title} className="w-full h-full object-cover opacity-15" />
              ) : null}
              {/* Cinematic vignette overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
              {/* Subtle film grain texture */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
              <div className="text-center z-10 px-6">
                <motion.p
                  className="text-emerald-400/80 text-sm font-medium mb-3 tracking-wide"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  الدرس {lessonIndex + 1}
                </motion.p>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-6 leading-relaxed drop-shadow-lg">{currentLesson.title}</h3>
                <motion.button
                  onClick={onPlayToggle}
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-gray-950"
                  style={{
                    background: isPlaying
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
                      : 'linear-gradient(135deg, #059669, #047857)',
                    boxShadow: isPlaying
                      ? '0 0 40px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
                      : '0 0 40px rgba(5,150,105,0.3), 0 8px 32px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-9 h-9 text-white/90" />
                  ) : (
                    <Play className="w-9 h-9 text-white mr-[-3px]" />
                  )}
                </motion.button>
                <p className="text-gray-500 text-xs mt-4">
                  {isPlaying ? 'جاري العرض...' : 'اضغط للتشغيل'}
                </p>
              </div>
            </div>
          )}

          {/* Video Controls Bar - only for simulated mode */}
          {!showVideo && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-full bg-white/10 h-1.5 rounded-full mb-4 cursor-pointer backdrop-blur-sm overflow-hidden">
                <motion.div
                  className="bg-gradient-to-l from-emerald-400 to-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${videoProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-4">
                  <button onClick={onPlayToggle} className="hover:text-emerald-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={onMuteToggle} className="hover:text-emerald-400 transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-md backdrop-blur-sm">محاكاة الفيديو</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-300 font-mono">{Math.round(videoProgress)}%</span>
                  <button className="hover:text-emerald-400 transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Video Mode - Subtle settings toggle */}
          <div className="absolute top-3 left-3 z-20">
            <Button
              size="sm"
              variant="ghost"
              className="bg-black/30 text-white/70 hover:text-white hover:bg-black/50 backdrop-blur-md text-xs gap-1.5 border border-white/5 h-8 px-3"
              onClick={onVideoModeToggle}
            >
              <Settings className="w-3 h-3" />
              {showVideo ? 'محاكاة' : 'فيديو حقيقي'}
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient border at the bottom of video area */}
      <div className="h-1 bg-gradient-to-l from-emerald-600/0 via-emerald-500 to-emerald-600/0" />
    </div>
  )
}
