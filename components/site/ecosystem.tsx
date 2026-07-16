import { BadgeCheck, Landmark, FileCheck, Handshake } from 'lucide-react'

const items = [
  {
    name: 'Udyam Registration',
    tag: 'MVP',
    desc: 'Capture & verify the Udyam Registration Number at signup for both buyers and suppliers — shown as a trust badge with MSME category.',
    icon: BadgeCheck,
  },
  {
    name: 'GeM Marketplace',
    tag: 'Phase 2',
    desc: 'Optional GeM Seller ID on supplier profiles, displayed as a “GeM Registered” badge to boost buyer trust.',
    icon: Landmark,
  },
  {
    name: 'MSME Samadhaan · 45-day rule',
    tag: 'Phase 1',
    desc: 'Payment-protection messaging plus an internal SLA tracker that flags any supplier payout nearing the 45-day MSMED threshold.',
    icon: FileCheck,
  },
  {
    name: 'TReDS Invoice Financing',
    tag: 'Phase 2/3',
    desc: 'Large repeat buyers can route SmeBhawan invoices toward RBI-regulated TReDS discounting — reducing balance-sheet risk.',
    icon: Handshake,
  },
]

const links = [
  'Udyam',
  'GeM',
  'MSME Samadhaan',
  'CHAMPIONS',
  'TReDS · RXIL / M1xchange / Invoicemart',
  'CGTMSE',
]

export function Ecosystem() {
  return (
    <section id="ecosystem" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Institutional credibility
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Plugged into India&apos;s MSME digital backbone
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            SmeBhawan is built to be a credible player aligned with the Ministry
            of MSME — not just another private intermediary. We reference and
            verify against the real government ecosystem.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.name}
              className="flex gap-4 rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <it.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {it.name}
                  </h3>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                    {it.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {it.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-background p-6">
          <p className="text-sm font-semibold text-foreground">
            MSME support links referenced across the platform
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {links.map((l) => (
              <span
                key={l}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
