import { Boxes, Factory, Landmark, ArrowRight } from 'lucide-react'

const portals = [
  {
    icon: Boxes,
    name: 'SMB / Buyer Portal',
    points: [
      'Browse & bulk-order by MT/kg',
      'Choose upfront or credit at checkout',
      'Track: Placed → Dispatched → Delivered',
      'Credit dashboard & GST invoices',
    ],
  },
  {
    icon: Factory,
    name: 'Supplier Portal',
    points: [
      'List materials with quality papers',
      'Udyam & optional GeM verification',
      'Manage orders & dispatch proof',
      'Payout tracking (MSMED-aligned)',
    ],
  },
  {
    icon: Landmark,
    name: 'Admin & Finance',
    points: [
      'Supplier & credit-tier approvals',
      'Live warehouse & order board',
      'AUM, collections & margin tracking',
      'Supplier scorecards & reports',
    ],
  },
]

export function Portals() {
  return (
    <section id="portals" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Built for every role
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three portals, one platform
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {portals.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-accent/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                {p.name}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
              >
                Request access
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
