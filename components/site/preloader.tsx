'use client'

import { useEffect, useState } from 'react'
import { Logo } from './logo'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Prevent repetitive preload cycles within the same session
    const hasPreloaded = sessionStorage.getItem('smebhawan_preloaded')
    if (hasPreloaded) {
      setVisible(false)
      return
    }

    const duration = 3000 // 3 seconds total load duration
    const intervalTime = 30 // Update every 30ms
    const step = 100 / (duration / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setFadeOut(true)
          setTimeout(() => {
            setVisible(false)
            sessionStorage.setItem('smebhawan_preloaded', 'true')
          }, 600)
          return 100
        }
        return Math.min(prev + step, 100)
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ease-out',
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100',
      ].join(' ')}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Animated Brand Logo Container */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl animate-pulse">
          <Logo className="h-full w-full object-cover rounded-3xl" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-3xl font-black tracking-tight text-white">
            smebhawan
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent animate-pulse">
            Building Together
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 space-y-2">
          <div className="h-1.5 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-accent rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-extrabold tracking-wider font-mono text-muted-foreground">
            <span>LOADING MODULES</span>
            <span className="text-emerald-500">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
