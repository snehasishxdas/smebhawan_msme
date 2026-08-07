import { ArrowRight, CircleCheck } from 'lucide-react'
import Link from 'next/link'

const grades = [
  {
    grade: 'VG40 Bulk (Bitumen)',
    rate: '₹50,832',
    unit: '/ MT',
    margin: '~4% platform margin',
  },
  {
    grade: 'VG30 Bulk (Bitumen)',
    rate: '₹48,242',
    unit: '/ MT',
    margin: '~4% platform margin',
  },
]

const roadmap = [
  'Aluminium Wire',
  'Aluminium Ingots',
  'Copper Cathode',
  'Industrial Gear Oil',
  'Metal Working Fluids',
  'Phenol (Chemical Grade)',
  'Industrial Catalysts',
  'Rust-Preventive Fluids',
  'Structural Steel (TMT Bars)',
]

export function Materials() {
  return (
    <section id="materials" className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Active Category
            </span>
            <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Procuring Bitumen/Butamine at Volume
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              We are starting off with Butamine as a raw material — serving a{' '}
              <span className="font-semibold text-foreground">$1.4B</span> addressable market growing at 5.1% y/y. Manufacturers in pharma, agricultural compounds, and industrial chemicals can browse grades, download vetted test sheets, and place bulk orders with real-time quote calculation.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {grades.map((g) => (
                <div
                  key={g.grade}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30"
                >
                  <p className="text-sm font-semibold text-muted-foreground">
                    {g.grade}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">
                    {g.rate}
                    <span className="text-sm font-medium text-muted-foreground">
                      {' '}
                      {g.unit}
                    </span>
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    <CircleCheck className="h-3.5 w-3.5" />
                    {g.margin}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
            >
              Order via B2B Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent rounded-2xl pointer-events-none" />
            <img
              src="/product-butamine.png"
              alt="Industrial bulk chemical drums for Butamine grades"
              className="aspect-[4/3] w-full rounded-2xl border border-border/80 object-cover shadow-md"
            />
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-xl backdrop-blur sm:left-auto sm:right-6 sm:w-72">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Example Consolidator Order
              </p>
              <p className="mt-1 font-display text-xl font-bold text-foreground">
                3,000 MT · VG40 Bulk
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">
                ₹15.25 Cr order value · ₹61 L (4%) platform margin managed and cleared in 12 days.
              </p>
            </div>
          </div>
        </div>

        {/* roadmap */}
        <div className="mt-24 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Procurement Scaling
              </span>
              <h3 className="font-display text-2xl font-extrabold text-foreground mt-1">
                Raw Material Expansion Roadmap
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Aggregating demand across 8+ industrial material lines without changing the core disintermediated supply chain structure.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent/80"
            >
              Browse roadmap items in shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {roadmap.map((m) => (
              <span
                key={m}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent/40 hover:bg-muted"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
