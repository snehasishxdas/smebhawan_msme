const stats = [
  { value: '6.3 cr', label: 'MSMEs in India', sub: 'as of 2025' },
  { value: '27%', label: 'of national GDP', sub: 'projected 40% by 2030' },
  { value: '43.6%', label: 'of India’s exports', sub: '2023 share' },
  { value: '11.1 cr', label: 'people employed', sub: 'across the sector' },
]

export function Stats() {
  return (
    <section className="border-b border-border/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Why now — the market tailwind
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="font-display text-3xl font-bold text-primary sm:text-4xl">
                {s.value}
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-foreground">
                {s.label}
              </dd>
              <dd className="text-xs text-muted-foreground">{s.sub}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Source: Ministry of MSME Annual Report &amp; India Briefing. India aims to
          overtake China in manufacturing by 2040.
        </p>
      </div>
    </section>
  )
}
