'use client'

import { useEffect, useState } from 'react'
import { getTeamMembers, type TeamMember } from '@/lib/supabase'

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])

  const loadTeam = async () => {
    const list = await getTeamMembers()
    setMembers(list)
  }

  useEffect(() => {
    loadTeam()
    // Listen to local storage updates for instant real-time sync with Admin panel
    window.addEventListener('storage', loadTeam)
    return () => window.removeEventListener('storage', loadTeam)
  }, [])

  return (
    <section id="team" className="relative overflow-hidden border-t border-border/10 bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Founding Leadership & Team
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Builders Backing India&apos;s Industrial Core
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            SmeBhawan pairs on-ground manufacturing business expertise with modern financial technology infrastructure to scale procurement and credit control efficiently.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {members.map((m, i) => (
            <article
              key={m.id || i}
              className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Card Index / Watermark */}
              <span className="absolute right-6 top-4 font-display text-4xl font-extrabold tabular-nums text-muted/20 select-none">
                0{i + 1}
              </span>

              {/* Photo Circle */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-accent/25 shadow-inner transition-transform duration-300 group-hover:scale-105">
                <img
                  src={m.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={m.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Info Block */}
              <div className="mt-5 flex-1 flex flex-col items-center">
                <h3 className="font-display text-lg font-extrabold text-foreground group-hover:text-accent transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs font-bold text-accent mt-0.5 tracking-wider uppercase">
                  {m.role}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80 max-w-[240px]">
                  {m.bio}
                </p>
              </div>

              {/* LinkedIn Icon Link */}
              <div className="mt-6 border-t border-white/5 pt-4 w-full flex justify-center">
                {m.linkedin ? (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-sm"
                    title={`Connect with ${m.name} on LinkedIn`}
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-[10px] text-muted-foreground/40 italic">
                    LinkedIn profile pending
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
