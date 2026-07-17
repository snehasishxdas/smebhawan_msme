import { Wallet, Percent, TrendingUp, ShieldCheck, Landmark } from 'lucide-react'

export function Credit() {
  return (
    <section id="credit" className="relative overflow-hidden bg-transparent text-foreground">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        
        {/* Header Text wrapped in transparent glass card with problem/how combo styles */}
        <div className="max-w-3xl rounded-2xl border border-border/80 bg-card p-8 shadow-sm relative overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Institutional Trade Finance
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Dual Revenue Velocity: Trading Margin & Embedded Working Capital
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            smebhawan operates a highly optimized business engine, handling both physical raw material procurement and the underlying financial credit layers. By offering transparent spot pricing alongside risk-tiered credit lines directly in the checkout drawer, we unlock operational liquidity for SMBs.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Option 1 - Problem/How card & text combo */}
          <div className="rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:border-accent/40 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/25 border border-accent/30 text-accent">
              <Wallet className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-accent">
              Procurement Option 01
            </p>
            <h3 className="font-display text-2xl font-bold mt-1">Upfront Spot Settlement</h3>
            <p className="mt-4 leading-relaxed text-sm text-muted-foreground">
              Settle orders immediately upon consolidation. For example, steel bought at raw producer rate of <span className="font-semibold text-foreground">₹39,000 / MT</span> plus <span className="font-semibold text-foreground">₹2,000 / MT</span> flat logistics charge is delivered at <span className="font-semibold text-foreground">₹42,560 / MT</span>, leaving a highly optimized <span className="font-semibold text-foreground">₹1,560 / MT</span> platform margin. Spot margins dynamically adjust based on aggregate order volume tiers.
            </p>
          </div>

          {/* Option 2 - Problem/How highlight card & text combo */}
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-8 transition-all duration-300 hover:border-accent/60 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground animate-pulse-slow">
              <Percent className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-accent">
              Procurement Option 02
            </p>
            <h3 className="font-display text-2xl font-bold mt-1">
              Embedded Credit Line (16–18% p.a.)
            </h3>
            <p className="mt-4 leading-relaxed text-sm text-muted-foreground">
              Vetted SMB buyers can leverage instant underwriting at checkout. Repayments, interest amortization, and tenures are visual and transparent before confirmation. Credit exposure is allocated under our supervised AUM risk-pooling framework, backed by automated reconciliation.
            </p>
          </div>
        </div>

        {/* Feature Cards bottom border alignment */}
        <div className="mt-14 grid gap-8 sm:grid-cols-3 border-t border-border/60 pt-10">
          {[
            {
              icon: TrendingUp,
              t: 'Real-Time AUM Ledger',
              d: 'Monitor active credit volume, outstanding balances, and risk provisioning parameters inside the admin panel.',
            },
            {
              icon: ShieldCheck,
              t: 'Risk-Tiered Underwriting',
              d: 'Automated evaluation of company KYC, bank statements, and GSTIN returns to establish individual buyer limits.',
            },
            {
              icon: Landmark,
              t: 'MSME Compliance Engine',
              d: 'Aligned with MSMED regulatory frameworks (45-day payment cycles) ensuring prompt supplier settlements.',
            },
          ].map((f) => (
            <div key={f.t} className="flex gap-4">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 border border-accent/20 text-accent">
                <f.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-bold text-base tracking-tight text-foreground">{f.t}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {f.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
