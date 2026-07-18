'use client'

import { useState } from 'react'
import { Phone, Mail, CircleCheck, Send, MapPin } from 'lucide-react'
import { sendDbDoubt } from '@/lib/supabase'

export function CTA() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      showToast('Please fill in Name, Email and Message Details.', 'error')
      return
    }

    setSubmitting(true)
    try {
      await sendDbDoubt({
        name,
        email,
        mobile,
        subject: subject || 'Homepage Inquiry',
        message
      })
      setSuccess(true)
      showToast('Your inquiry has been successfully submitted! Operations team will review and reply.', 'success')
      setName('')
      setEmail('')
      setMobile('')
      setSubject('')
      setMessage('')
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="cta" className="relative overflow-hidden bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md text-primary-foreground">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Connect With Us
              </span>
              <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Sourcing & Credit Desk
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
                Have doubts about credit lines, raw materials logistics, or payout settlement cycles? Leave a query and our team will get back to you directly.
              </p>

              <div className="mt-8 flex flex-col gap-4 text-sm">
                <a
                  href="tel:+918617219004"
                  className="inline-flex items-center gap-3 text-primary-foreground/90 transition-colors hover:text-accent font-semibold"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-accent">
                    <Phone className="h-4 w-4" />
                  </span>
                  +91 86172 19004
                </a>
                <a
                  href="mailto:smehouse25@gmail.com"
                  className="inline-flex items-center gap-3 text-primary-foreground/90 transition-colors hover:text-accent font-semibold"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-accent">
                    <Mail className="h-4 w-4" />
                  </span>
                  smehouse25@gmail.com
                </a>
                <div className="inline-flex items-center gap-3 text-primary-foreground/90 font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-accent">
                    <MapPin className="h-4 w-4" />
                  </span>
                  Salt Lake Sector V, Kolkata, WB 700091
                </div>
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
              {success ? (
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <CircleCheck className="h-10 w-10 text-accent animate-bounce" />
                  <p className="mt-4 font-display text-lg font-bold">
                    Message Sent Successfully!
                  </p>
                  <p className="mt-1 text-xs text-primary-foreground/75 max-w-xs leading-relaxed">
                    🤝 Thank you for reaching out. An operations officer will review your query and reply via email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-xs text-accent font-bold hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="font-semibold text-primary-foreground/80">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="h-11 rounded-lg border border-primary-foreground/20 bg-primary px-3 text-sm text-primary-foreground outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="font-semibold text-primary-foreground/80">Business Email *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@company.com"
                        className="h-11 rounded-lg border border-primary-foreground/20 bg-primary px-3 text-sm text-primary-foreground outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="mobile" className="font-semibold text-primary-foreground/80">Mobile Number (optional)</label>
                      <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 "
                        className="h-11 rounded-lg border border-primary-foreground/20 bg-primary px-3 text-sm text-primary-foreground outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="font-semibold text-primary-foreground/80">Subject / Area (optional)</label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Credit limit, VG40 supply"
                        className="h-11 rounded-lg border border-primary-foreground/20 bg-primary px-3 text-sm text-primary-foreground outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="font-semibold text-primary-foreground/80">Inquiry Details *</label>
                    <textarea
                      id="message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail your procurement, logistics, or compliance requirements here..."
                      rows={3}
                      className="border border-primary-foreground/20 bg-primary p-3 rounded-lg text-sm text-primary-foreground outline-none focus:border-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
                  >
                    {submitting ? 'Sending Message...' : 'Send Message'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-slate-900 border border-emerald-500/20 text-emerald-500 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold font-sans tracking-wide">{toast.message}</span>
        </div>
      )}
    </section>
  )
}
