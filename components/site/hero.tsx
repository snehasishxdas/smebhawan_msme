import { ArrowRight, BadgeCheck, Truck, Wallet } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-transparent text-foreground">
      {/* background image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.34_0.06_256),transparent_60%)]" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="max-w-4xl animate-float-up lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Direct Manufacturer Channel · Aligned with Ministry of MSME
            </span>

            <h1 className="mt-8 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Streamlining Industrial Raw Materials &{' '}
              <span className="text-gradient-accent bg-gradient-to-r from-accent to-amber-500 bg-clip-text text-transparent">
                Credit for India’s SMBs.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-xl">
              smebhawan aggregates demand for fragmented small-to-medium enterprises, bypassing 3–4 layers of middlemen markups. We connect small manufacturers directly to primary producers, integrated with structured trade credit lines (16-18%) to fund production schedules instantly.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#exchange"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-bold text-accent-foreground glow-accent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/25"
              >
                Access B2B Marketplace
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <a
                href="#problem"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/25 bg-white/5 px-7 py-4 text-base font-bold text-foreground transition-all duration-300 hover:bg-white/10 hover:border-border/45"
              >
                Analyze Supply Pain Points
              </a>
            </div>

            <dl className="mt-16 grid max-w-2xl grid-cols-1 gap-8 border-t border-border/15 pt-10 sm:grid-cols-3">
              {[
                { icon: BadgeCheck, k: 'Quality Assured', v: 'Direct factory test reports & compliance paper audits' },
                { icon: Truck, k: 'Asset-Light Logistics', v: 'Integrated warehouse network and flexible fulfillment routes' },
                { icon: Wallet, k: '16–18% Credit Line', v: 'Embedded working capital approved directly at checkout' },
              ].map((s) => (
                <div key={s.k} className="group">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/25 ring-1 ring-accent/15 transition-all duration-300 group-hover:bg-accent/25">
                    <s.icon className="h-5 w-5 text-accent" />
                  </span>
                  <dt className="mt-4 font-display text-lg font-bold text-foreground tracking-tight">
                    {s.k}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex justify-center lg:col-span-5 lg:justify-end animate-float-up">
            <div className="relative group max-w-sm lg:max-w-none">
              <div className="absolute inset-0 -m-1 rounded-3xl bg-gradient-to-r from-accent/30 to-amber-500/30 opacity-60 blur-2xl group-hover:opacity-85 transition duration-500" />
              <div className="relative bg-slate-950/60 p-3 rounded-3xl border border-white/10 backdrop-blur-md">
                <Image
                  src="/logo.jpg"
                  alt="smebhawan Logo"
                  width={380}
                  height={380}
                  priority
                  className="rounded-2xl object-cover shadow-2xl w-full h-auto brightness-90 contrast-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
