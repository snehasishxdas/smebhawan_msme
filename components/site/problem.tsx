import { ChevronRight, Ban, TrendingUp, HelpCircle, Layers } from 'lucide-react'
import { HorizontalScroll } from './horizontal-scroll'

const oldChain = [
  {
    name: 'Primary Producer (e.g., JSW)',
    note: 'Requires high minimum order volume (MOQs) & upfront capital. Won’t sell directly to SMBs.',
    add: 'Factory Rate',
    badge: 'bg-primary/20 text-primary-foreground border-primary/30',
  },
  {
    name: 'Official Distributor',
    note: 'Tier-1 consolidator charging premium markup.',
    add: '+ ₹100 / kg markup',
    badge: 'bg-destructive/10 text-destructive border-destructive/25',
  },
  {
    name: 'Sub-Distributor',
    note: 'Regional warehouse broker adding logistics overhead.',
    add: '+ ₹20 / kg markup',
    badge: 'bg-destructive/10 text-destructive border-destructive/25',
  },
  {
    name: 'Local Trader',
    note: 'Secondary market supplier with zero quality guarantees.',
    add: '+ ₹20 / kg markup',
    badge: 'bg-destructive/10 text-destructive border-destructive/25',
  },
  {
    name: 'Retailer → SMB Buyer',
    note: 'Inflated prices, diluted quality control, and zero credit flexibility.',
    add: 'Final Price Inflated 40%+',
    badge: 'bg-destructive/20 text-destructive border-destructive/40 font-bold',
  },
]

export function Problem() {
  return (
    <section id="problem" className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Supply Chain Vulnerabilities
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            The Multi-Tier Middleman Tax on Small Manufacturers
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Small and medium businesses (SMBs) represent the backbone of manufacturing, yet they are locked out of buying direct. Without high order quantities or credit backing, they are forced to source from tiered intermediaries, piling on heavy markups and losing raw material trace papers along the way.
          </p>
        </div>

        {/* the broken chain in Horizontal Scroll */}
        <div className="mt-14 rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-destructive/5 blur-3xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Fragmented Distribution Channel
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Swipe / Scroll horizontally to trace the markup escalation.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-1 text-xs font-bold text-destructive">
              Middleman Escalation
            </span>
          </div>

          <div className="mt-8">
            <HorizontalScroll>
              {oldChain.map((step, i) => (
                <div
                  key={step.name}
                  className="flex shrink-0 w-80 items-stretch gap-4 scroll-snap-align-start"
                >
                  <div className="flex flex-1 flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-destructive/30 hover:shadow-md">
                    <div>
                      <span className="font-display text-2xl font-extrabold text-muted-foreground/45 block mb-2">
                        0{i + 1}
                      </span>
                      <h4 className="text-base font-extrabold text-foreground tracking-tight">
                        {step.name}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {step.note}
                      </p>
                    </div>
                    {step.add && (
                      <div className="mt-5">
                        <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${step.badge}`}>
                          {step.add}
                        </span>
                      </div>
                    )}
                  </div>
                  {i < oldChain.length - 1 && (
                    <div className="flex items-center self-center justify-center shrink-0">
                      <ChevronRight className="h-6 w-6 text-muted-foreground/60 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </HorizontalScroll>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Ban,
              t: 'Prohibitive MOQs',
              d: 'Primary producers (e.g. steel, bitumen) enforce bulk quotas that small buyers cannot satisfy on their own.',
            },
            {
              icon: TrendingUp,
              t: 'Compounding Markups',
              d: 'Distributors, sub-distributors, and local traders stack logistics fees and profit margins on every single hop.',
            },
            {
              icon: Layers,
              t: 'Diluted Compliance',
              d: 'Quality control certifications and factory test papers dissolve as raw materials are bundled and split across dealers.',
            },
            {
              icon: HelpCircle,
              t: 'Embedded Credit Void',
              d: 'Traditional suppliers require upfront cash. SMBs fail to expand operations due to a complete lack of credit options.',
            },
          ].map((p) => (
            <div
              key={p.t}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-lg font-bold text-foreground">
                {p.t}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
