'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale'

const hiddenMap: Record<Direction, string> = {
  up: 'translate-y-10 opacity-0',
  down: '-translate-y-10 opacity-0',
  left: 'translate-x-12 opacity-0',
  right: '-translate-x-12 opacity-0',
  scale: 'scale-95 opacity-0',
}

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  once = true,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  delay?: number
  once?: boolean
  as?: React.ElementType
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setShown(false)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
        shown ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hiddenMap[direction],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
