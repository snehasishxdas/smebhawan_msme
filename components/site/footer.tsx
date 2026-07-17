import { Logo } from './logo'
import Link from 'next/link'

const cols = [
  {
    title: 'Platform',
    links: [
      { name: 'Buyer Console', href: '/login/buyer' },
      { name: 'Supplier Hub', href: '/login/supplier' },
      { name: 'Operations Board', href: '/login/admin' },
      { name: 'B2B Marketplace', href: '/shop' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Founding Team', href: '/#team' },
      { name: 'Market Tailwinds', href: '/#problem' },
      { name: 'Procurement Model', href: '/#how' },
      { name: 'Contact Early Access', href: '/#cta' },
    ],
  },
  {
    title: 'MSME Ecosystem',
    links: [
      { name: 'Udyam Registration', href: 'https://udyamregistration.gov.in/' },
      { name: 'GeM Portal', href: 'https://gem.gov.in/' },
      { name: 'MSME Samadhaan', href: 'https://samadhaan.msme.gov.in/' },
      { name: 'TReDS Credit', href: 'https://www.rbi.org.in/' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-lg font-bold tracking-tight text-primary">
                smebhawan
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Building Together — disintermediating raw material procurement & credit
              distribution for India&apos;s MSMEs.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-foreground">{c.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.name}>
                    {l.href.startsWith('http') ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.name}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} smebhawan. All rights reserved.</p>
          <p>smehouse25@gmail.com · +91 86172 19004</p>
        </div>
      </div>
    </footer>
  )
}
