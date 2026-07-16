'use client'

import { useState } from 'react'
import { ArrowRight, Phone, Mail, CircleCheck } from 'lucide-react'

export function CTA() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="cta" className="relative overflow-hidden bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md text-primary-foreground">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to build together?
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
                Whether you&apos;re an MSME sourcing raw materials or a supplier
                looking to reach verified buyers — get early access to SmeBhawan.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm">
                <a
                  href="tel:+918617219004"
                  className="inline-flex items-center gap-2.5 text-primary-foreground/90 transition-colors hover:text-accent font-semibold"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  +91 86172 19004
                </a>
                <a
                  href="mailto:smehouse25@gmail.com"
                  className="inline-flex items-center gap-2.5 text-primary-foreground/90 transition-colors hover:text-accent font-semibold"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  smehouse25@gmail.com
                </a>
              </div>

              {/* Direct links to portals */}
              <div className="mt-8 border-t border-primary-foreground/15 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Simulate Platform Portals</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <a
                    href="/login/buyer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  >
                    Buyer Console
                  </a>
                  <a
                    href="/login/supplier"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  >
                    Supplier Hub
                  </a>
                  <a
                    href="/login/admin"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  >
                    Admin Board
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 sm:p-8">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <CircleCheck className="h-10 w-10 text-accent" />
                  <p className="mt-4 font-display text-lg font-bold">
                    Thanks — we&apos;ll be in touch.
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/70">
                    Our team reviews every request personally.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmitted(true)
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Business name" name="business" placeholder="Acme Industries" />
                    <Field label="Contact person" name="name" placeholder="Full name" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Mobile" name="mobile" placeholder="+91 " type="tel" />
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="role" className="text-xs font-medium text-primary-foreground/80">
                        I am a
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="h-11 rounded-lg border border-primary-foreground/20 bg-primary px-3 text-sm text-primary-foreground outline-none focus:border-accent"
                      >
                        <option className="text-foreground">SMB / Buyer</option>
                        <option className="text-foreground">Supplier</option>
                        <option className="text-foreground">Other</option>
                      </select>
                    </div>
                  </div>
                  <Field label="Udyam Registration No. (optional)" name="udyam" placeholder="UDYAM-XX-00-0000000" />
                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Request early access
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  placeholder,
  type = 'text',
}: {
  label: string
  name: string
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-primary-foreground/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-lg border border-primary-foreground/20 bg-primary px-3 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-accent"
      />
    </div>
  )
}
