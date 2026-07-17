'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  Store,
  ShieldCheck,
  Lock,
  Globe,
  CircleDot,
  Server,
  Zap,
} from 'lucide-react'
import { Logo } from './logo'

const links = [
  { label: 'Value Drain', href: '/#problem' },
  { label: 'Disintermediation', href: '/#how' },
  { label: 'Raw Commodities', href: '/#materials' },
  { label: 'Liquidity Desk', href: '/#credit' },
  { label: 'Compliance Base', href: '/#ecosystem' },
  { label: 'Procurement Exchange', href: '/shop' },
  { label: 'Contact Us', href: '/contact' },
]

const signInRoles = [
  {
    label: 'Customer Portal',
    badge: 'Buyer Console',
    desc: 'Execute bulk contracts & draw 16-18% credit lines',
    href: '/login/buyer',
    icon: ShoppingBag,
    color: 'text-accent border-accent/30 bg-accent/5 hover:bg-accent/10',
    status: 'Market Live',
    statusColor: 'bg-accent',
  },
  {
    label: 'Supplier Portal',
    badge: 'Supplier Hub',
    desc: 'Manage listed inventory & clear 45d compliant payouts',
    href: '/login/supplier',
    icon: Store,
    color: 'text-blue-500 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10',
    status: 'Udyam Vetted',
    statusColor: 'bg-blue-500',
  },
  {
    label: 'Admin Portal',
    badge: 'Operations Command',
    desc: 'Audit corporate balance sheets & provision platform AUM',
    href: '/login/admin',
    icon: ShieldCheck,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10',
    status: 'Audits Normal',
    statusColor: 'bg-emerald-500',
  },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tickerItems = [
    'BUTAMINE VG40: ₹50,832/MT (Vetted)',
    'BUTAMINE VG30: ₹48,242/MT (Stable)',
    'COPPER CATHODE: ₹7,10,000/MT (LME Grade A)',
    'STRUCTURAL STEEL: ₹52,000/MT (Direct Factory)',
    'ALUMINIUM WIRE: ₹2,20,000/MT (99.7% pure)',
    'MSMED ACT COMPLIANT: 45 DAYS SETTLEMENT MANDATE',
    'UDYAM VERIFICATION INTEGRATED',
  ]

  // Replicate twice for seamless looping marquee
  const doubleItems = [...tickerItems, ...tickerItems]

  return (
    <>
      {/* Live Commodities Marquee Banner */}
      <div className="fixed top-0 inset-x-0 w-full max-w-full h-8 bg-primary/95 text-white/90 backdrop-blur-md flex items-center overflow-hidden z-50 text-[10px] font-extrabold uppercase tracking-widest border-b border-primary-foreground/15">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-ticker {
            display: flex;
            white-space: nowrap;
            animation: marquee 28s linear infinite;
          }
        `}</style>
        <div className="animate-ticker">
          {doubleItems.map((item, idx) => (
            <span key={idx} className="mx-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div
        className={[
          'fixed inset-x-0 z-50 transition-all duration-500 ease-in-out',
          scrolled ? 'top-10 px-4 sm:px-6 lg:px-8' : 'top-8 px-0',
        ].join(' ')}
      >
        <header
          className={[
            'mx-auto max-w-7xl border transition-all duration-500 ease-in-out',
            scrolled
              ? 'rounded-3xl border-border/80 bg-background/75 shadow-2xl shadow-primary/10 backdrop-blur-2xl ring-1 ring-accent/5'
              : 'border-transparent bg-background/0 py-3.5 backdrop-blur-none',
          ].join(' ')}
        >
        <div className="flex h-12 items-center justify-between px-6 lg:px-8">
          {/* Logo and Brand */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-accent/30 group-hover:rotate-1">
              <Logo className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
            </div>
            <div>
              <span className="block font-display text-lg font-black tracking-tight text-foreground group-hover:text-accent transition-colors">
                smebhawan
              </span>
              <span className="block text-[8px] font-semibold uppercase tracking-wider text-muted-foreground -mt-0.5">
                Building Together
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Sliding Pill Effect */}
          <nav className="hidden items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 p-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={[
                  'relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-background/90 hover:shadow-sm',
                ].join(' ')}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions Menu */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Secure Gateway Megamenu */}
            <div
              className="relative"
              onMouseEnter={() => setSignInOpen(true)}
              onMouseLeave={() => setSignInOpen(false)}
            >
              <button
                type="button"
                className={[
                  'inline-flex items-center gap-1.5 rounded-xl border border-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-all duration-300 hover:bg-muted/80',
                  signInOpen ? 'bg-muted' : '',
                ].join(' ')}
                aria-expanded={signInOpen}
              >
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Sign In / Sign Up
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                    signInOpen ? 'rotate-180 text-accent' : ''
                  }`}
                />
              </button>

              <div
                className={[
                  'absolute right-0 top-full w-[420px] pt-3 transition-all duration-300 ease-out',
                  signInOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-2 opacity-0',
                ].join(' ')}
              >
                <div className="overflow-hidden rounded-3xl border border-border bg-popover p-4 shadow-2xl shadow-primary/10 backdrop-blur-2xl">
                  {/* Status header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3 px-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                      <Server className="h-3.5 w-3.5 text-accent" /> System Operational
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase">Underwriting Active</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {signInRoles.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className={[
                          'flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-border hover:shadow-sm',
                          r.color,
                        ].join(' ')}
                      >
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border shadow-sm text-foreground">
                          <r.icon className="h-5 w-5 text-accent" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="block text-xs font-black text-foreground">
                              {r.label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded bg-background border border-border px-1.5 py-0.5 text-[8px] font-extrabold text-muted-foreground uppercase">
                              <CircleDot className="h-2 w-2 text-emerald-500" />
                              {r.status}
                            </span>
                          </div>
                          <span className="mt-1 block text-[10px] leading-relaxed text-muted-foreground">
                            {r.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-foreground hover:bg-muted lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {open && (
          <div className="animate-float-up border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl lg:hidden mt-2 rounded-2xl mx-4">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-5 sm:px-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <div className="my-2 border-t border-border pt-4">
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sign In / Sign Up
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {signInRoles.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <r.icon className="h-4.5 w-4.5 text-accent" />
                      {r.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
    </>
  )
}

