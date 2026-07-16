'use client'

import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { MarketplaceExchange } from '@/components/site/marketplace-exchange'
import { ShieldCheck } from 'lucide-react'

export default function ShopPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      
      <main className="bg-background/40 text-foreground min-h-screen pt-20">
        {/* Header Hero Banner */}
        <section className="relative overflow-hidden bg-primary/90 py-12 text-primary-foreground backdrop-blur-md">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 border border-accent/30 px-3 py-1 text-xs font-bold text-accent">
              <ShieldCheck className="h-4 w-4" /> Direct Supplier Vetted Marketplace
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl mt-3">
              B2B Raw Materials & Procurement Portal
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Consolidated demand platform cutting out intermediary markups. Source Bitumen, Metals, and Processing Liquids direct with integrated credit underwriting at checkout.
            </p>
          </div>
        </section>

        {/* Core Marketplace Workspace */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <MarketplaceExchange />
        </section>
      </main>

      <Footer />
    </>
  )
}
