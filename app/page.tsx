import { Nav } from '@/components/site/nav'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { Hero } from '@/components/site/hero'
import { Stats } from '@/components/site/stats'
import { MarketplaceExchange } from '@/components/site/marketplace-exchange'
import { Problem } from '@/components/site/problem'
import { HowItWorks } from '@/components/site/how-it-works'
import { Materials } from '@/components/site/materials'
import { Credit } from '@/components/site/credit'
import { Ecosystem } from '@/components/site/ecosystem'
import { Portals } from '@/components/site/portals'
import { Team } from '@/components/site/team'
import { CTA } from '@/components/site/cta'
import { Footer } from '@/components/site/footer'

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Stats />
        
        {/* Buy Section Immediately Following Intro */}
        <section id="exchange" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-border/30">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Active Procurement Desk
            </span>
            <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Commodity Procurement & Transaction Panel
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse government-vetted raw material grades, simulate all-in spot quotes with integrated logistics surcharges, and draw credit terms instantly at checkout.
            </p>
          </div>
          <MarketplaceExchange />
        </section>

        <Problem />
        <HowItWorks />
        <Materials />
        <Credit />
        <Ecosystem />
        <Portals />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
