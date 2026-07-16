'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HorizontalScroll({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = () => {
    const el = containerRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 10)
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [children])

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current
    if (!el) return
    const offset = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    })
  }

  return (
    <div className={`relative group/scroll ${className}`}>
      {/* Left button */}
      {showLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-lg text-foreground hover:bg-muted hover:text-accent transition-all opacity-0 group-hover/scroll:opacity-100 duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth scroll-snap-x pb-4"
      >
        {children}
      </div>

      {/* Right button */}
      {showRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-lg text-foreground hover:bg-muted hover:text-accent transition-all opacity-0 group-hover/scroll:opacity-100 duration-300"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
