'use client'

import { useState, useEffect } from 'react'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { ScrollProgress } from '@/components/site/scroll-progress'
import {
  ShoppingBag,
  CreditCard,
  CheckCircle,
  Truck,
  Building2,
  ArrowRight,
  Download,
  Clock,
  Percent,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  PlusCircle,
  AlertCircle,
  Edit2,
  X
} from 'lucide-react'
import { 
  getDbOrders, 
  getUserProfileByEmail, 
  createUserProfile, 
  updateUserProfile,
  createOTP, 
  verifyOTP,
  getDbDoubts,
  sendDbDoubt,
  type UserProfile,
  type Doubt
} from '@/lib/supabase'

interface Order {
  orderId: string
  companyName: string
  gstin: string
  address: string
  mobile: string
  items: Array<{
    productId: string
    productName: string
    qty: number
    rate: number
    costs: {
      baseCost: number
      platformMargin: number
      logisticsCharge: number
      creditInterest: number
      taxableAmount: number
      gst: number
      grandTotal: number
    }
    logistics: string
    payment: string
  }>
  totals: {
    baseCost: number
    margin: number
    logistics: number
    interest: number
    gst: number
    total: number
  }
  status: 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered'
  date: string
  creditTerms: { interestRate: string; tenureDays: number; status: string } | null
}

export default function BuyerPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [session, setSession] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [doubts, setDoubts] = useState<Doubt[]>([])
  
  // Auth Form State
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [place, setPlace] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [gstin, setGstin] = useState('')
  
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Profile Edit State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPlace, setEditPlace] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editCompanyName, setEditCompanyName] = useState('')
  const [editGstin, setEditGstin] = useState('')

  // Help Section State
  const [helpSubject, setHelpSubject] = useState('')
  const [helpMessage, setHelpMessage] = useState('')
  const [submittingHelp, setSubmittingHelp] = useState(false)

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('smebhawan_user_session')
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession)
          if (parsed.role === 'customer') {
            setIsLoggedIn(true)
            setSession(parsed)
          } else {
            localStorage.removeItem('smebhawan_user_session')
          }
        } catch (e) {
          localStorage.removeItem('smebhawan_user_session')
        }
      }
    }
  }, [])

  // Load orders & doubts associated with this buyer
  const loadDashboardData = async () => {
    if (!session) return
    
    // Fetch orders
    const allOrders = await getDbOrders()
    const buyerOrders = allOrders.filter(
      (o) => o.companyName.toLowerCase() === session.companyName.toLowerCase() || o.gstin === session.gstin
    )
    setOrders(buyerOrders)

    // Fetch doubts
    const allDoubts = await getDbDoubts()
    const buyerDoubts = allDoubts.filter(
      (d) => d.email.toLowerCase() === session.email.toLowerCase()
    )
    setDoubts(buyerDoubts)
  }

  useEffect(() => {
    if (isLoggedIn && session) {
      loadDashboardData()
      window.addEventListener('storage', loadDashboardData)
      return () => window.removeEventListener('storage', loadDashboardData)
    }
  }, [isLoggedIn, session])

  const triggerLoginAlertEmail = async (userEmail: string, userRole: string) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login-alert',
          email: userEmail,
          role: userRole,
          timestamp: new Date().toLocaleString()
        })
      })
    } catch (err) {
      console.warn('Failed to send SMTP login alert:', err)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      if (!isSignUpMode) {
        // Sign In - check if email is registered
        const user = await getUserProfileByEmail(email)
        if (!user || user.role !== 'customer') {
          alert('This email address is not registered as a Customer. Please switch to Sign Up.')
          setLoading(false)
          return
        }
      }

      // Generate 6-digit OTP code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
      await createOTP(email, generatedCode)

      // Dispatch SMTP Email with OTP
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          email: email,
          code: generatedCode
        })
      })

      setOtpSent(true)
      alert(`OTP sent successfully to: ${email}`)
    } catch (err) {
      console.error(err)
      alert('Failed to dispatch OTP. Please check SMTP parameters.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) {
      alert('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const isValid = await verifyOTP(email, otp)
      if (!isValid) {
        alert('Invalid or expired OTP. Please try again.')
        setLoading(false)
        return
      }

      if (isSignUpMode) {
        // Create User Profile in Supabase
        const newProfile = await createUserProfile({
          name,
          place,
          email: email.trim().toLowerCase(),
          phone,
          companyName,
          gstin,
          role: 'customer',
          status: 'verified' // Customer verified instantly
        })

        // Send Registration Welcome Email
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup-success',
            email: email,
            name: name,
            role: 'Customer Portal'
          })
        })

        // Set login state
        localStorage.setItem('smebhawan_user_session', JSON.stringify(newProfile))
        setSession(newProfile)
        setIsLoggedIn(true)
        await triggerLoginAlertEmail(newProfile.email, 'Customer Portal')
      } else {
        // Log in existing profile
        const existingProfile = await getUserProfileByEmail(email)
        if (existingProfile) {
          localStorage.setItem('smebhawan_user_session', JSON.stringify(existingProfile))
          setSession(existingProfile)
          setIsLoggedIn(true)
          await triggerLoginAlertEmail(existingProfile.email, 'Customer Portal')
        }
      }
    } catch (err) {
      console.error(err)
      alert('Error during verification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('smebhawan_user_session')
    setSession(null)
    setIsLoggedIn(false)
    setOtpSent(false)
    setOtp('')
    window.dispatchEvent(new Event('storage'))
  }

  // Edit Profile Handlers
  const openEditModal = () => {
    if (!session) return
    setEditName(session.name)
    setEditPlace(session.place)
    setEditPhone(session.phone)
    setEditCompanyName(session.companyName)
    setEditGstin(session.gstin)
    setShowEditModal(true)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    try {
      const updates = {
        name: editName,
        place: editPlace,
        phone: editPhone,
        companyName: editCompanyName,
        gstin: editGstin
      }
      const updated = await updateUserProfile(session.id, updates)
      if (updated) {
        localStorage.setItem('smebhawan_user_session', JSON.stringify(updated))
        setSession(updated)
        setShowEditModal(false)
        alert('Profile details updated successfully! Sync notification sent to your registered email.')
        
        // Notify Profile Update activity
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup-success',
            email: updated.email,
            name: updated.name,
            role: 'Customer Profile Update'
          })
        })
      }
    } catch (err) {
      alert('Failed to update profile settings.')
    } finally {
      setLoading(false)
    }
  }

  // Help Desk Submission Handler
  const handleRaiseHelp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    if (!helpSubject || !helpMessage) {
      alert('Please fill in both Subject and Message fields.')
      return
    }

    setSubmittingHelp(true)
    try {
      await sendDbDoubt({
        name: session.name,
        email: session.email,
        mobile: session.phone,
        subject: helpSubject,
        message: helpMessage
      })

      alert('Your enquiry has been submitted. smebhawan underwriters will review it shortly.')
      setHelpSubject('')
      setHelpMessage('')
      loadDashboardData()
    } catch (err) {
      alert('Failed to submit enquiry.')
    } finally {
      setSubmittingHelp(false)
    }
  }

  // Dynamic calculations
  const creditLimit = 5000000 // ₹50 Lakhs
  const creditUsed = orders
    .filter((o) => o.status !== 'Delivered' && o.creditTerms)
    .reduce((sum, o) => sum + o.totals.total, 0)
  const creditAvailable = creditLimit - creditUsed

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Placed': return 0
      case 'Confirmed': return 1
      case 'Dispatched': return 2
      case 'Delivered': return 3
      default: return 0
    }
  }

  // Check solved status automatically if ticket replied for > 24 hours
  const isTicketSolved = (d: Doubt) => {
    if (!d.reply || !d.replied_at) return false
    const diff = new Date().getTime() - new Date(d.replied_at).getTime()
    return diff > 24 * 60 * 60 * 1000 // 24 hours
  }

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main className="bg-transparent text-foreground min-h-screen pt-32 pb-20">
        {!isLoggedIn ? (
          /* Login & Registration Screen */
          <section className="mx-auto max-w-md px-4 py-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
                  Customer Portal
                </h1>
                <p className="mt-2 text-xs text-muted-foreground">
                  Source bulk raw materials, access 16-18% credit line financing, and raise enquiry support tickets.
                </p>
              </div>

              {/* Login/Signup Tabs */}
              {!otpSent && (
                <div className="flex border-b border-white/10 mb-6 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(false)}
                    className={`flex-1 pb-3 text-center transition-colors ${!isSignUpMode ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(true)}
                    className={`flex-1 pb-3 text-center transition-colors ${isSignUpMode ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
                  >
                    Register / Sign Up
                  </button>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">Registered Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. buyer@company.com"
                      className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                    />
                  </div>

                  {isSignUpMode && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-semibold text-muted-foreground">Your Full Name *</label>
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
                          <label className="font-semibold text-muted-foreground">Mobile Phone *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 "
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-semibold text-muted-foreground">Company Name *</label>
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Acme Polymers"
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-semibold text-muted-foreground">GSTIN Number *</label>
                          <input
                            type="text"
                            required
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            placeholder="GSTIN Code"
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-muted-foreground">Place / City *</label>
                        <input
                          type="text"
                          required
                          value={place}
                          onChange={(e) => setPlace(e.target.value)}
                          placeholder="Mumbai, Maharashtra"
                          className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-accent"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 mt-2"
                  >
                    {loading ? 'Requesting OTP...' : 'Send Verification OTP'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-[10px] text-accent leading-normal flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>A 6-digit SMTP authorization verification code has been dispatched to: <strong>{email}</strong>. Please verify the code below.</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-muted-foreground">6-Digit Verification Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="XXXXXX"
                      className="w-full h-11 border border-border px-3 rounded-xl text-center font-black tracking-[0.3em] outline-none focus:border-accent bg-background text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5"
                  >
                    {loading ? 'Verifying OTP...' : 'Verify OTP & Authorize'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-muted-foreground hover:underline"
                  >
                    Change Email Address
                  </button>
                </form>
              )}
            </div>
          </section>
        ) : (
          /* Buyer Dashboard */
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Verified Customer Portal</span>
                <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl mt-1">
                  {session?.companyName}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">GSTIN: {session?.gstin} · Place: {session?.place}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openEditModal}
                  className="text-xs font-bold border border-border bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-foreground flex items-center gap-1.5"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold border border-border px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Credit Metrics Section */}
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Credit Limit</h3>
                    <p className="font-display text-2xl font-black text-foreground mt-0.5">₹{creditLimit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <Clock className="h-5 w-5 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Credit Utilized</h3>
                    <p className="font-display text-2xl font-black text-foreground mt-0.5">₹{creditUsed.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <CheckCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Credit</h3>
                    <p className="font-display text-2xl font-black text-emerald-600 mt-0.5">₹{creditAvailable.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Procurement Orders */}
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              
              {/* Left Side: Order Pipeline */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Active Order Pipeline</h2>

                {orders.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-bold text-muted-foreground">No active orders found</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Visit the B2B Marketplace to configure quantities and place raw material contracts.
                    </p>
                    <a
                      href="/shop"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground"
                    >
                      Browse Marketplace <ArrowRight className="h-4.5 w-4.5" />
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((o) => {
                      const stepIdx = getStepIndex(o.status)
                      return (
                        <div key={o.orderId} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-6 backdrop-blur-md">
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground">ORDER ID</span>
                              <h3 className="font-display text-lg font-bold text-foreground mt-0.5">{o.orderId}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-muted-foreground">CONTRACT VALUE</span>
                              <p className="font-display text-base font-extrabold text-accent mt-0.5">
                                ₹{o.totals.total.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground">PAYMENT METHOD</span>
                              <p className="text-xs font-bold text-foreground mt-0.5">
                                {o.items[0]?.payment === 'credit' ? 'Embedded Credit Line (60d)' : 'Spot Cash Net-Banking'}
                              </p>
                            </div>
                          </div>

                          {/* Items breakdown list */}
                          <div className="space-y-2">
                            {o.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-xs text-muted-foreground">
                                <span>{item.productName} ({item.qty} MT)</span>
                                <span className="font-semibold text-foreground">₹{item.costs.grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                              </div>
                            ))}
                          </div>

                          {/* Stepper Timeline */}
                          <div className="pt-2">
                            <p className="text-xs font-bold text-muted-foreground mb-4">LOGISTICS TRACKING TIMELINE</p>
                            <div className="relative flex items-center justify-between">
                              <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-border -translate-y-1/2 -z-0" />
                              <div
                                className="absolute left-6 top-1/2 h-0.5 bg-accent -translate-y-1/2 -z-0 transition-all duration-500"
                                style={{ width: `${(stepIdx / 3) * 100}%` }}
                              />

                              {[
                                { label: 'Order Placed', desc: 'Awaiting checks', icon: ShoppingBag },
                                { label: 'Credit Approved', desc: 'Consolidated', icon: Building2 },
                                { label: 'Dispatched', desc: 'In Transit', icon: Truck },
                                { label: 'Delivered', desc: 'Cleared', icon: CheckCircle },
                              ].map((step, sIdx) => {
                                const Icon = step.icon
                                const isActive = sIdx <= stepIdx
                                return (
                                  <div key={step.label} className="relative flex flex-col items-center z-10">
                                    <div
                                      className={[
                                        'flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300',
                                        isActive
                                          ? 'border-accent bg-accent text-accent-foreground'
                                          : 'border-white/10 bg-white/5 text-muted-foreground',
                                      ].join(' ')}
                                    >
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {step.label}
                                    </span>
                                    <span className="text-[8px] text-muted-foreground leading-none mt-0.5">
                                      {step.desc}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* HELP TICKETS LIST & BUILDER */}
                <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-accent animate-pulse" />
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">Help Desk & Enquiries</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Submit technical doubts or credit-line issues directly to underwriters.</p>
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Ask a question form */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-accent">Submit New enquiry</h3>
                      <form onSubmit={handleRaiseHelp} className="space-y-3.5 text-xs">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-semibold text-muted-foreground">Subject / Area</label>
                          <input
                            type="text"
                            required
                            value={helpSubject}
                            onChange={(e) => setHelpSubject(e.target.value)}
                            placeholder="e.g., Credit line extension, Delivery delay"
                            className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-semibold text-muted-foreground">Doubt Details</label>
                          <textarea
                            required
                            value={helpMessage}
                            onChange={(e) => setHelpMessage(e.target.value)}
                            placeholder="Provide operational details of your enquiry..."
                            rows={3}
                            className="w-full border border-border p-2.5 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingHelp}
                          className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5"
                        >
                          <PlusCircle className="h-4 w-4" />
                          {submittingHelp ? 'Submitting...' : 'Submit enquiry'}
                        </button>
                      </form>
                    </div>

                    {/* Raised Questions History */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enquiry Ticket Status</h3>
                      {doubts.length === 0 ? (
                        <p className="text-xs text-muted-foreground leading-normal bg-white/5 p-4 rounded-xl border border-white/5">No active help tickets raised.</p>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {doubts.map((d) => {
                            const solved = isTicketSolved(d)
                            return (
                              <div key={d.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-foreground">{d.subject}</span>
                                  {solved ? (
                                    <span className="text-[8px] font-bold text-emerald-500 border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 rounded-md uppercase">Solved</span>
                                  ) : d.reply ? (
                                    <span className="text-[8px] font-bold text-accent border border-accent/30 bg-accent/5 px-2 py-0.5 rounded-md uppercase">Replied (Pending Archive)</span>
                                  ) : (
                                    <span className="text-[8px] font-bold text-amber-500 border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 rounded-md uppercase">Open Ticket</span>
                                  )}
                                </div>
                                <p className="text-muted-foreground leading-normal font-mono text-[10px] bg-black/10 p-2 rounded-lg">{d.message}</p>
                                
                                {d.reply && (
                                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl text-[10px] space-y-1">
                                    <span className="font-bold text-emerald-600">Admin Response:</span>
                                    <p className="text-muted-foreground mt-0.5 leading-normal">{d.reply}</p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Documents & Invoice Ledger */}
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Tax & Credit Ledger</h2>

                {/* Simulated Invoice Downloads */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">GST Tax Invoices</h3>
                  <div className="mt-4 space-y-3">
                    {orders.length === 0 ? (
                      <p className="text-xs text-muted-foreground leading-normal">Invoices generate dynamically upon contract confirmation.</p>
                    ) : (
                      orders.map((o) => (
                        <div key={o.orderId} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
                          <div>
                            <span className="block text-xs font-bold text-foreground">Invoice #{o.orderId}</span>
                            <span className="block text-[10px] text-muted-foreground mt-0.5">GST Rate 18% · {o.items[0]?.productName.substring(0, 15)}...</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`Downloaded GST invoice for order ${o.orderId}`)}
                            className="p-2 hover:bg-muted text-accent rounded-xl border border-border hover:border-accent/35 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Credit repayment terms */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground text-amber-500">Repayment Calendars</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Underwritten credits accrue interest on a 16% annualized schedule, with dynamic auto-debits timed with the MSMED compliance window.
                  </p>
                  
                  {orders.some((o) => o.creditTerms) ? (
                    <div className="mt-4 space-y-4">
                      {orders
                        .filter((o) => o.creditTerms)
                        .map((o) => (
                          <div key={o.orderId} className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl space-y-2 text-xs">
                            <div className="flex justify-between font-bold text-amber-500">
                              <span>Order: {o.orderId}</span>
                              <span>Due in 60 Days</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Interest Accruing</span>
                              <span>16% p.a.</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Amortized Interest</span>
                              <span>₹{o.totals.interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between font-bold text-foreground border-t border-border pt-1.5 mt-1.5">
                              <span>Repayment Due</span>
                              <span>₹{o.totals.total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 bg-muted p-3.5 rounded-2xl text-xs text-muted-foreground">
                      <Percent className="h-5 w-5 text-accent shrink-0" />
                      <span>No active credit-backed contracts in pipeline.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 space-y-4 shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Edit Profile details</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Modify registered business directories synced to Supabase database.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">GSTIN</label>
                  <input
                    type="text"
                    required
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-muted-foreground">Place / City</label>
                <input
                  type="text"
                  required
                  value={editPlace}
                  onChange={(e) => setEditPlace(e.target.value)}
                  className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-accent text-accent-foreground py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-accent/15 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? 'Saving Changes...' : 'Save Profile details'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
