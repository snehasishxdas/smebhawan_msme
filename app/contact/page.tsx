'use client'

import { useState } from 'react'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft } from 'lucide-react'
import { sendDbDoubt } from '@/lib/supabase'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      alert('Please fill in Name, Email and Message.')
      return
    }

    setSubmitting(true)
    try {
      await sendDbDoubt({
        name,
        email,
        mobile,
        subject: subject || 'General Query',
        message
      })
      setSuccess(true)
      // reset
      setName('')
      setEmail('')
      setMobile('')
      setSubject('')
      setMessage('')
    } catch (err) {
      alert('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main className="bg-transparent text-foreground min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Connect With Us
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Contact Support & Sourcing Desk
            </h1>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Have doubts about credit lines, raw materials logistics, or payout settlement cycles? Leave a query and our team will get back to you directly.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
            {/* Left Side: Contact Information Cards */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Operational Support</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[9px]">Direct Dial</p>
                      <a href="tel:+918617219004" className="text-foreground font-semibold hover:underline block mt-0.5">
                        +91 86172 19004
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[9px]">Email Inquiries</p>
                      <a href="mailto:smehouse25@gmail.com" className="text-foreground font-semibold hover:underline block mt-0.5">
                        smehouse25@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[9px]">Sourcing Headquarters</p>
                      <p className="text-foreground/90 font-medium leading-relaxed mt-0.5">
                        Salt Lake Sector V, Kolkata,<br />West Bengal 700091
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md text-xs text-muted-foreground leading-normal">
                <span className="font-bold text-foreground">SLA Target Response:</span><br />
                We review incoming MSME queries under <span className="font-bold text-accent">4 hours</span>. Replies are dispatched directly to your registered email address via automated SMTP routing.
              </div>
            </div>

            {/* Right Side: Contact Form Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
              {success ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <CheckCircle className="h-14 w-14 text-accent animate-bounce" />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Enquiry Logs Saved!</h2>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Your doubt has been registered. The SmeBhawan command team will inspect it and email a reply to <span className="font-semibold text-foreground">{email}</span>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-muted-foreground">Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-muted-foreground">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-muted-foreground">Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 "
                        className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-muted-foreground">Query Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Bitumen VG40 pricing, Credit Tenure"
                        className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">Message / Doubt Description *</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Explain your doubt in detail..."
                      rows={5}
                      className="w-full border border-border p-3.5 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-accent text-accent-foreground py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-accent/15 transition-transform hover:-translate-y-0.5 mt-2"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'Sending doubt...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
