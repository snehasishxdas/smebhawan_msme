import { Factory, Building2, Boxes, Truck, ShieldCheck } from 'lucide-react'

const steps = [
  {
    icon: Factory,
    title: 'Vetted suppliers',
    body: 'We source directly from trusted suppliers and negotiate supply relationships — cutting out the distributor-to-retailer chain entirely.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality verified',
    body: 'Every batch ships with quality & compliance papers. Verification is a core trust layer of the platform, not an afterthought.',
  },
  {
    icon: Boxes,
    title: 'Asset-light warehousing',
    body: 'Materials are stored in rented third-party warehouses — no capital locked up in owned infrastructure, so pricing stays lean.',
  },
  {
    icon: Truck,
    title: 'Flexible fulfilment',
    body: 'SMBs self-collect via any route at the listed price, or let smebhawan arrange delivery for a flat, upfront logistics charge.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-border/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            The model
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One trusted layer between supply and demand
          </h2>
        </div>

        {/* clean flow */}
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {[
            { label: 'Supplier', icon: Factory },
            { label: 'smebhawan', icon: Building2, highlight: true },
            { label: 'SMB buyer', icon: Boxes },
          ].map((n, i, arr) => (
            <div key={n.label} className="flex flex-1 items-center gap-3">
              <div
                className={`flex w-full items-center gap-3 rounded-xl border p-4 ${
                  n.highlight
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-background'
                }`}
              >
                <n.icon
                  className={`h-6 w-6 ${n.highlight ? 'text-accent' : 'text-primary'}`}
                />
                <span className="font-display text-base font-bold text-foreground">
                  {n.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span className="hidden text-2xl font-light text-muted-foreground sm:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-lg font-bold text-foreground">
                <span className="mr-1.5 text-muted-foreground">0{i + 1}</span>
                {s.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
