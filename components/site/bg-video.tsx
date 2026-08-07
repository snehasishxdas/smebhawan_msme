'use client'

import { useEffect, useRef } from 'react'

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // Proactively play the video if browser blocks autoplay initially
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay blocked, attempting retry', err)
      })
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-slate-950">
      {/* Video layer */}
      <video
        ref={videoRef}
        src="/home.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.65] transition-opacity duration-1000"
      />
      {/* Blending overlay screen */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] pointer-events-none" />
    </div>
  )
}
