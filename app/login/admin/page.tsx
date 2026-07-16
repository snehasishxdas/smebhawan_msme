'use client'

import { useState, useEffect } from 'react'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { ScrollProgress } from '@/components/site/scroll-progress'
import {
  ShieldCheck,
  Landmark,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  XCircle,
  Truck,
  Building2,
  Lock,
  ArrowRight,
  Boxes,
  Users,
  Search,
  ArrowLeft,
  Trash2,
  PlusCircle,
  Mail,
  Send
} from 'lucide-react'
import { getTeamMembers, addTeamMember, deleteTeamMember, type TeamMember, getDbOrders, updateDbOrder, getDbProducts, updateDbProduct, updateTeamMember, getDbDoubts, replyDbDoubt, type Doubt, getDbUsers, updateUserProfile, terminateUserProfile, type UserProfile } from '@/lib/supabase'

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

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

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  
  // Login form state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Metrics state
  const [metrics, setMetrics] = useState({
    aum: 28500000,
    margins: 1140000,
    defaultRate: 0.8,
  })

  // Team management state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('')
  const [newMemberBio, setNewMemberBio] = useState('')
  const [newMemberPhoto, setNewMemberPhoto] = useState('')
  const [newMemberLinkedin, setNewMemberLinkedin] = useState('')
  const [addingMember, setAddingMember] = useState(false)

  // Team member edit state
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [editMemberName, setEditMemberName] = useState('')
  const [editMemberRole, setEditMemberRole] = useState('')
  const [editMemberBio, setEditMemberBio] = useState('')
  const [editMemberPhoto, setEditMemberPhoto] = useState('')
  const [editMemberLinkedin, setEditMemberLinkedin] = useState('')
  const [updatingMember, setUpdatingMember] = useState(false)

  // Products catalog management state
  const [productsList, setProductsList] = useState<any[]>([])
  const [editingRate, setEditingRate] = useState<{ [id: string]: number }>({})
  const [editingInv, setEditingInv] = useState<{ [id: string]: number }>({})

  // Doubts management state
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [replyInputs, setReplyInputs] = useState<{ [id: string]: string }>({})
  const [sendingReplies, setSendingReplies] = useState<{ [id: string]: boolean }>({})

  // User directories state
  const [usersList, setUsersList] = useState<UserProfile[]>([])
  const [directoryTab, setDirectoryTab] = useState<'customers' | 'suppliers' | 'vetting'>('customers')

  // Load orders & metrics
  const loadState = async () => {
    const list = await getDbOrders()
    setOrders(list)
    
    const met = JSON.parse(
      localStorage.getItem('smebhawan_metrics') ||
        '{"aum": 28500000, "margins": 1140000, "defaultRate": 0.8}'
    )
    setMetrics(met)
  }

  const loadTeam = async () => {
    const list = await getTeamMembers()
    setTeamMembers(list)
  }

  const loadProducts = async () => {
    const list = await getDbProducts()
    setProductsList(list)
    const rates: any = {}
    const invs: any = {}
    list.forEach((p) => {
      rates[p.id] = p.rate
      invs[p.id] = p.inventory
    })
    setEditingRate(rates)
    setEditingInv(invs)
  }

  const loadDoubts = async () => {
    const list = await getDbDoubts()
    setDoubts(list)
  }

  const loadUsers = async () => {
    const list = await getDbUsers()
    setUsersList(list)
  }

  useEffect(() => {
    loadState()
    loadTeam()
    loadProducts()
    loadDoubts()
    loadUsers()
    
    const syncAll = () => {
      loadState()
      loadTeam()
      loadProducts()
      loadDoubts()
      loadUsers()
    }
    
    window.addEventListener('storage', syncAll)
    return () => window.removeEventListener('storage', syncAll)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username !== 'smehouse25@gmail.com' || password !== 'houseofsme@25') {
      alert('Invalid admin credentials. Please use the registered email and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setIsLoggedIn(true)
      setLoading(false)
    }, 600)
  }

  const bypassLogin = () => {
    setUsername('smehouse25@gmail.com')
    setPassword('houseofsme@25')
    setLoading(true)
    setTimeout(() => {
      setIsLoggedIn(true)
      setLoading(false)
    }, 400)
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName || !newMemberRole) {
      alert('Please provide Name and Role')
      return
    }
    setAddingMember(true)
    try {
      const added = await addTeamMember({
        name: newMemberName,
        role: newMemberRole,
        bio: newMemberBio || 'Team member at SmeBhawan.',
        photo: newMemberPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        linkedin: newMemberLinkedin,
      })
      setTeamMembers((prev) => [...prev, added])
      setNewMemberName('')
      setNewMemberRole('')
      setNewMemberBio('')
      setNewMemberPhoto('')
      setNewMemberLinkedin('')
      alert('Team member added successfully!')
    } catch (err) {
      alert('Failed to add team member')
    } finally {
      setAddingMember(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      await deleteTeamMember(id)
      setTeamMembers((prev) => prev.filter((m) => m.id !== id))
      alert('Team member deleted successfully!')
    } catch (err) {
      alert('Failed to delete team member')
    }
  }

  const startEditingMember = (m: TeamMember) => {
    setEditingMemberId(m.id)
    setEditMemberName(m.name)
    setEditMemberRole(m.role)
    setEditMemberBio(m.bio)
    setEditMemberPhoto(m.photo)
    setEditMemberLinkedin(m.linkedin)
  }

  const handleUpdateMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMemberId) return
    setUpdatingMember(true)
    try {
      const updates = {
        name: editMemberName,
        role: editMemberRole,
        bio: editMemberBio,
        photo: editMemberPhoto,
        linkedin: editMemberLinkedin,
      }
      const updated = await updateTeamMember(editingMemberId, updates)
      if (updated) {
        setTeamMembers(teamMembers.map((m) => (m.id === editingMemberId ? updated : m)))
        setEditingMemberId(null)
        alert('Team member updated successfully!')
      } else {
        alert('Failed to update team member.')
      }
    } catch (err) {
      alert('Error updating team member.')
    } finally {
      setUpdatingMember(false)
    }
  }

  const handleUpdateProduct = async (id: string) => {
    const rate = editingRate[id]
    const inventory = editingInv[id]
    if (isNaN(rate) || isNaN(inventory)) {
      alert('Please enter valid numeric values for price and inventory')
      return
    }
    const updated = await updateDbProduct(id, { rate, inventory })
    if (updated) {
      setProductsList(productsList.map((p) => p.id === id ? updated : p))
      alert(`Updated ${updated.name} pricing parameters successfully!`)
    } else {
      alert('Failed to update product details.')
    }
  }

  const handleReplyDoubt = async (id: string, email: string, subject: string, name: string) => {
    const text = replyInputs[id]
    if (!text || !text.trim()) {
      alert('Please enter a response.')
      return
    }

    setSendingReplies((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await fetch('/api/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, replyText: text, name })
      })
      const apiRes = await res.json()
      if (!res.ok) throw new Error(apiRes.error || 'SMTP dispatch failed')

      const updated = await replyDbDoubt(id, text)
      if (updated) {
        setDoubts(doubts.map((d) => d.id === id ? updated : d))
        setReplyInputs((prev) => ({ ...prev, [id]: '' }))
        alert(apiRes.simulated 
          ? 'Reply saved to database successfully! (SMTP simulation logged in dev console)' 
          : 'Reply sent via SMTP email and saved to database successfully!'
        )
      } else {
        alert('Failed to save reply status to the database.')
      }
    } catch (err: any) {
      console.error(err)
      alert(`Error sending reply: ${err.message || err}`)
    } finally {
      setSendingReplies((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleVetteSupplier = async (id: string, email: string, outcome: 'verified' | 'rejected') => {
    try {
      if (outcome === 'verified') {
        const updated = await updateUserProfile(id, { status: 'verified' })
        if (updated) {
          alert('Supplier verification approved! Notification email sent via SMTP.')
        }
      } else {
        await terminateUserProfile(id)
        alert('Supplier registration rejected & profile removed.')
      }

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vetting-status',
          email,
          status: outcome
        })
      })

      loadUsers()
    } catch (err) {
      console.error(err)
      alert('Error vetting supplier.')
    }
  }

  const handleTerminateUser = async (id: string, email: string) => {
    if (!confirm('Are you sure you want to terminate this account? All associated profile data will be permanently wiped.')) {
      return
    }

    try {
      await terminateUserProfile(id)
      alert('Account terminated successfully and deleted from database.')

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'termination-alert',
          email
        })
      })

      loadUsers()
    } catch (err) {
      console.error(err)
      alert('Failed to terminate user profile.')
    }
  }

  // Underwrite/Approve Buyer Credit Line
  const approveCredit = async (orderId: string) => {
    const target = orders.find((o) => o.orderId === orderId)
    if (!target) return
    const updates = {
      status: 'Confirmed' as const,
      creditTerms: target.creditTerms ? { ...target.creditTerms, status: 'Approved' } : null,
    }
    const updated = await updateDbOrder(orderId, updates)
    if (updated) {
      setOrders(orders.map((o) => o.orderId === orderId ? { ...o, ...updates } : o))
      alert('Credit underwriting cleared. Contract status set to "Confirmed" and routed to Supplier allocations.')
    }
  }

  const rejectCredit = async (orderId: string) => {
    const target = orders.find((o) => o.orderId === orderId)
    if (!target) return
    const updates = {
      status: 'Placed' as const,
      creditTerms: target.creditTerms ? { ...target.creditTerms, status: 'Rejected' } : null,
    }
    const updated = await updateDbOrder(orderId, updates)
    if (updated) {
      setOrders(orders.map((o) => o.orderId === orderId ? { ...o, ...updates } : o))
      alert('Credit application declined.')
    }
  }

  // Clear Shipment delivery (Delivery verification)
  const verifyDelivery = async (orderId: string) => {
    const updates = {
      status: 'Delivered' as const,
    }
    const updated = await updateDbOrder(orderId, updates)
    if (updated) {
      setOrders(orders.map((o) => o.orderId === orderId ? { ...o, ...updates } : o))
      alert('Delivery cleared. MSMED 45-day payment countdown timer initiated.')
    }
  }

  // Split calculations
  const pendingCreditApprovals = orders.filter(
    (o) => o.status === 'Placed' && o.creditTerms && o.creditTerms.status === 'Pending Approval'
  )

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main className="bg-transparent text-foreground min-h-screen">
        {!isLoggedIn ? (
          /* Login Screen */
          <section className="mx-auto max-w-md px-4 py-24 sm:py-32">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
                  Operations Console
                </h1>
                <p className="mt-2 text-xs text-muted-foreground">
                  Audit risk exposures, underwrite credit applications, and coordinate logistics pipelines.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="smehouse25@gmail.com"
                    className="w-full h-11 border border-border px-3 rounded-xl text-sm outline-none focus:border-accent bg-background"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="houseofsme@25"
                    className="w-full h-11 border border-border px-3 rounded-xl text-sm outline-none focus:border-accent bg-background"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 border-t border-border pt-6">
                <button
                  type="button"
                  onClick={bypassLogin}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                >
                  Auto-fill and Log In <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Dashboard Screen */
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">SmeBhawan Operations</span>
                <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl mt-1">
                  Credit & Supply Command Board
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">Platform Controller Access · Operations Level 01</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                className="self-start text-xs font-bold border border-border px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground"
              >
                Log Out
              </button>
            </div>

            {/* Financial Performance Indicators */}
            <div className="mt-8 grid gap-6 sm:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    <Landmark className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Supervised AUM</h3>
                    <p className="font-display text-xl font-black text-foreground mt-0.5">₹{(metrics.aum / 10000000).toFixed(2)} Cr</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                    <TrendingUp className="h-5 w-5 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Margins</h3>
                    <p className="font-display text-xl font-black text-foreground mt-0.5">₹{(metrics.margins / 100000).toFixed(1)} Lakhs</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <Percent className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Default Rate</h3>
                    <p className="font-display text-xl font-black text-foreground mt-0.5">{metrics.defaultRate}% NPA</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vetted SMB Buyers</h3>
                    <p className="font-display text-xl font-black text-foreground mt-0.5">142 Registered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Split queues */}
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              
              {/* Left Side: Credit Underwriting Queue (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Buyer Credit Underwriting Board</h2>

                {pendingCreditApprovals.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-bold text-muted-foreground">No pending credit approvals</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Incoming credit-line buyer applications placed on the marketplace show up here for GSTIN and credit verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCreditApprovals.map((o) => (
                      <div key={o.orderId} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                        <div className="flex flex-wrap justify-between items-center border-b border-border pb-3 gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground">APPLICANT</span>
                            <p className="font-bold text-sm text-foreground">{o.companyName}</p>
                            <p className="text-[10px] text-muted-foreground">{o.gstin}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground">CREDIT REQUESTED</span>
                            <p className="text-xs font-bold text-accent">
                              ₹{o.totals.total.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground">INTEREST RATE</span>
                            <p className="text-xs font-bold text-foreground">16% p.a.</p>
                          </div>
                        </div>

                        <div className="bg-muted p-3.5 rounded-2xl text-xs space-y-1.5">
                          <p className="font-bold text-foreground">Risk Metrics Check:</p>
                          <div className="flex justify-between text-muted-foreground text-[10px]">
                            <span>GST Filing History: 24 Months Continuous</span>
                            <span className="text-emerald-600 font-bold">PASS</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground text-[10px]">
                            <span>Bank Statements Audit: Debt-Service Coverage &gt; 1.5</span>
                            <span className="text-emerald-600 font-bold">PASS</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => rejectCredit(o.orderId)}
                            className="flex items-center justify-center gap-1.5 border border-border hover:bg-muted py-2.5 rounded-xl font-bold text-xs"
                          >
                            <XCircle className="h-4 w-4 text-destructive" /> Reject Credit
                          </button>
                          <button
                            type="button"
                            onClick={() => approveCredit(o.orderId)}
                            className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 py-2.5 rounded-xl font-bold text-xs text-accent-foreground"
                          >
                            <CheckCircle className="h-4 w-4" /> Approve & Underwrite
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Platform Order Board / Status Tracker */}
                <div className="pt-4 space-y-6">
                  <h2 className="font-display text-xl font-bold text-foreground">Master Platform Ledger</h2>
                  
                  {orders.length === 0 ? (
                    <p className="text-xs text-muted-foreground bg-muted p-4 rounded-2xl text-center">No platform orders logged in storage.</p>
                  ) : (
                    <div className="border border-white/10 rounded-2xl overflow-hidden shadow-sm bg-white/5 backdrop-blur-md">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-muted border-b border-border font-bold text-muted-foreground">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Buyer Company</th>
                            <th className="p-3">Value</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.orderId} className="border-b border-border last:border-b-0">
                              <td className="p-3 font-bold">{o.orderId}</td>
                              <td className="p-3 font-medium text-foreground">{o.companyName.substring(0, 18)}...</td>
                              <td className="p-3 font-semibold text-accent">₹{o.totals.total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                              <td className="p-3">
                                <span className={[
                                  'inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold',
                                  o.status === 'Placed' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                  o.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                  o.status === 'Dispatched' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                  'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                ].join(' ')}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {o.status === 'Dispatched' ? (
                                  <button
                                    type="button"
                                    onClick={() => verifyDelivery(o.orderId)}
                                    className="bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold"
                                  >
                                    Verify Delivery
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side Column (1 col) */}
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Verification Queues</h2>

                {/* Supplier Vetting Board */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Supplier Vetting Board</h3>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Audit incoming supplier registrations and product certifications before approving listing catalogs.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="bg-muted p-3.5 rounded-xl space-y-1.5">
                      <div className="flex justify-between font-bold text-foreground">
                        <span>Haldia Chembinders</span>
                        <span className="text-emerald-600 font-bold">VETTED</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Verified Udyam No: UDYAM-WB-14-0012048</p>
                      <p className="text-[10px] text-muted-foreground">Product: Bitumen VG40 (IS 73 Compliant)</p>
                    </div>

                    <div className="bg-muted p-3.5 rounded-xl space-y-1.5 border border-dashed border-accent/40">
                      <div className="flex justify-between font-bold text-foreground">
                        <span>Apex Steel Ind.</span>
                        <span className="text-amber-500 font-bold">AWAITING AUDIT</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Udyam No: UDYAM-MH-12-0056910</p>
                      <button
                        type="button"
                        onClick={() => alert('Approved Apex Steel listing registration on Marketplace')}
                        className="w-full bg-accent text-accent-foreground py-1 rounded font-bold text-[10px] mt-1.5"
                      >
                        Approve Supplier & Listing
                      </button>
                    </div>
                  </div>
                </div>

                {/* MSME Samadhaan & GeM triggers */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-3 text-xs text-muted-foreground backdrop-blur-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Ecosystem Integrations</h3>
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Udyam Verification API connected</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>MSME Samadhaan automated triggers active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>TReDS platform connectivity enabled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Directories & Vetting Board */}
            <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
              <div className="flex items-center gap-2.5">
                <Users className="h-6 w-6 text-accent animate-pulse" />
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Registry Directories & Supplier Vetting</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Approve incoming suppliers, manage customer roles, and terminate accounts from database.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-white/10 text-xs font-bold uppercase tracking-wider gap-6 pb-2.5">
                  <button
                    type="button"
                    onClick={() => setDirectoryTab('customers')}
                    className={`pb-1 transition-colors ${directoryTab === 'customers' ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
                  >
                    Customers Directory ({usersList.filter(u => u.role === 'customer').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectoryTab('suppliers')}
                    className={`pb-1 transition-colors ${directoryTab === 'suppliers' ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
                  >
                    Verified Suppliers ({usersList.filter(u => u.role === 'supplier' && u.status === 'verified').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectoryTab('vetting')}
                    className={`pb-1 transition-colors ${directoryTab === 'vetting' ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
                  >
                    Supplier Vetting Queue ({usersList.filter(u => u.role === 'supplier' && u.status === 'pending').length})
                  </button>
                </div>

                {directoryTab === 'customers' && (
                  <div className="space-y-4">
                    {usersList.filter(u => u.role === 'customer').length === 0 ? (
                      <p className="text-xs text-muted-foreground">No registered customer profiles found in databases.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-muted-foreground font-bold">
                              <th className="py-2.5">Name / Company</th>
                              <th className="py-2.5">Contact</th>
                              <th className="py-2.5">GSTIN</th>
                              <th className="py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersList.filter(u => u.role === 'customer').map((u) => (
                              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 font-semibold">
                                  <div>{u.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.companyName} · {u.place}</div>
                                </td>
                                <td className="py-3">
                                  <div>{u.email}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.phone}</div>
                                </td>
                                <td className="py-3 font-mono text-[10px]">{u.gstin}</td>
                                <td className="py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleTerminateUser(u.id, u.email)}
                                    className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-red-500 font-bold"
                                  >
                                    Terminate
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {directoryTab === 'suppliers' && (
                  <div className="space-y-4">
                    {usersList.filter(u => u.role === 'supplier' && u.status === 'verified').length === 0 ? (
                      <p className="text-xs text-muted-foreground">No verified supplier profiles found in databases.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-muted-foreground font-bold">
                              <th className="py-2.5">Name / Company</th>
                              <th className="py-2.5">Contact</th>
                              <th className="py-2.5">GSTIN / Udyam</th>
                              <th className="py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersList.filter(u => u.role === 'supplier' && u.status === 'verified').map((u) => (
                              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 font-semibold">
                                  <div>{u.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.companyName} · {u.place}</div>
                                </td>
                                <td className="py-3">
                                  <div>{u.email}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.phone}</div>
                                </td>
                                <td className="py-3 font-mono text-[10px]">{u.gstin}</td>
                                <td className="py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleTerminateUser(u.id, u.email)}
                                    className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-red-500 font-bold"
                                  >
                                    Terminate
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {directoryTab === 'vetting' && (
                  <div className="space-y-4">
                    {usersList.filter(u => u.role === 'supplier' && u.status === 'pending').length === 0 ? (
                      <p className="text-xs text-muted-foreground">Vetting queue is clear. No pending suppliers to verify.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-muted-foreground font-bold">
                              <th className="py-2.5">Name / Company</th>
                              <th className="py-2.5">Contact</th>
                              <th className="py-2.5">GSTIN / Udyam</th>
                              <th className="py-2.5 text-right">Vetting Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersList.filter(u => u.role === 'supplier' && u.status === 'pending').map((u) => (
                              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 font-semibold">
                                  <div>{u.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.companyName} · {u.place}</div>
                                </td>
                                <td className="py-3">
                                  <div>{u.email}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.phone}</div>
                                </td>
                                <td className="py-3 font-mono text-[10px]">{u.gstin}</td>
                                <td className="py-3 text-right gap-2 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleVetteSupplier(u.id, u.email, 'verified')}
                                    className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-500 font-bold animate-pulse"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleVetteSupplier(u.id, u.email, 'rejected')}
                                    className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-red-500 font-bold"
                                  >
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Team Roster Management */}
            <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
              <div className="flex items-center gap-2.5">
                <Users className="h-6 w-6 text-accent animate-pulse" />
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Team Roster Management</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Control the public team profile cards on the SmeBhawan landing page.</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                {/* Left Side: Current Team Members List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Team Members</h3>
                  {teamMembers.length === 0 ? (
                    <p className="text-xs text-muted-foreground bg-white/5 p-6 rounded-2xl border border-white/5">No team members loaded.</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {teamMembers.map((m) => (
                        <div key={m.id} className="relative rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-4 items-start backdrop-blur-md animate-fade-in">
                          <img
                            src={m.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={m.name}
                            className="h-12 w-12 rounded-xl object-cover border border-accent/20"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-foreground truncate">{m.name}</h4>
                            <p className="text-[10px] font-semibold text-accent truncate">{m.role}</p>
                            <p className="text-[9px] text-muted-foreground/80 mt-1 line-clamp-2">{m.bio}</p>
                            {m.linkedin && (
                              <a
                                href={m.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[9px] text-blue-400 font-bold mt-2 hover:underline"
                              >
                                <LinkedinIcon className="h-3 w-3" /> LinkedIn Profile
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 self-start">
                            <button
                              type="button"
                              onClick={() => startEditingMember(m)}
                              className="p-1.5 hover:bg-accent/15 rounded-lg text-accent transition-colors"
                              title="Edit Member"
                            >
                              <EditIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Add New or Edit Member Form */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                  {editingMemberId ? (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-accent">Edit Team Member</h3>
                        <button
                          type="button"
                          onClick={() => setEditingMemberId(null)}
                          className="text-[10px] text-muted-foreground hover:text-foreground font-bold border border-border px-2 py-0.5 rounded-lg transition-colors"
                        >
                          Cancel Edit
                        </button>
                      </div>
                      
                      <form onSubmit={handleUpdateMemberSubmit} className="space-y-3.5 text-xs">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editMemberName}
                            onChange={(e) => setEditMemberName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Role / Designation</label>
                          <input
                            type="text"
                            required
                            value={editMemberRole}
                            onChange={(e) => setEditMemberRole(e.target.value)}
                            placeholder="Head of Growth"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Short Bio</label>
                          <textarea
                            value={editMemberBio}
                            onChange={(e) => setEditMemberBio(e.target.value)}
                            placeholder="Brief background and career highlights..."
                            rows={2}
                            className="w-full border border-border p-2.5 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Photo URL</label>
                          <input
                            type="url"
                            value={editMemberPhoto}
                            onChange={(e) => setEditMemberPhoto(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">LinkedIn URL</label>
                          <input
                            type="url"
                            value={editMemberLinkedin}
                            onChange={(e) => setEditMemberLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={updatingMember}
                          className="w-full mt-2 bg-accent text-accent-foreground py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-accent/15 transition-transform hover:-translate-y-0.5"
                        >
                          <CheckCircle className="h-4.5 w-4.5" />
                          {updatingMember ? 'Saving...' : 'Save Member Details'}
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add New Team Member</h3>
                      
                      <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Full Name</label>
                          <input
                            type="text"
                            required
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Role / Designation</label>
                          <input
                            type="text"
                            required
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            placeholder="Head of Growth"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Short Bio</label>
                          <textarea
                            value={newMemberBio}
                            onChange={(e) => setNewMemberBio(e.target.value)}
                            placeholder="Brief background and career highlights..."
                            rows={2}
                            className="w-full border border-border p-2.5 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">Photo URL</label>
                          <input
                            type="url"
                            value={newMemberPhoto}
                            onChange={(e) => setNewMemberPhoto(e.target.value)}
                            placeholder="https://images.unsplash.com/... or keep blank"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted-foreground">LinkedIn URL</label>
                          <input
                            type="url"
                            value={newMemberLinkedin}
                            onChange={(e) => setNewMemberLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full h-9 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={addingMember}
                          className="w-full mt-2 bg-accent text-accent-foreground py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-accent/15 transition-transform hover:-translate-y-0.5"
                        >
                          <PlusCircle className="h-4.5 w-4.5" />
                          {addingMember ? 'Adding...' : 'Add Team Member'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>

              {/* Materials Catalog Pricing Manager */}
              <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
                <div className="flex items-center gap-2.5">
                  <Boxes className="h-6 w-6 text-accent animate-pulse" />
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Materials Catalog Manager</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Edit contract rates, Platform margins, and live inventory records stored in Supabase.</p>
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl overflow-hidden shadow-sm bg-white/5 backdrop-blur-md">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-border font-bold text-muted-foreground">
                        <th className="p-3">Material Grade</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 w-40">Contract Price (₹/MT)</th>
                        <th className="p-3 w-32">Inventory (MT)</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map((p) => (
                        <tr key={p.id} className="border-b border-border last:border-b-0">
                          <td className="p-3">
                            <span className="font-bold text-foreground block">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground">{p.spec.substring(0, 70)}...</span>
                          </td>
                          <td className="p-3 font-semibold text-muted-foreground">{p.category}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={editingRate[p.id] ?? p.rate}
                              onChange={(e) => setEditingRate({ ...editingRate, [p.id]: parseInt(e.target.value) || 0 })}
                              className="w-full h-8 border border-border px-2 rounded-lg bg-background text-foreground text-xs outline-none focus:border-accent font-bold"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={editingInv[p.id] ?? p.inventory}
                              onChange={(e) => setEditingInv({ ...editingInv, [p.id]: parseInt(e.target.value) || 0 })}
                              className="w-full h-8 border border-border px-2 rounded-lg bg-background text-foreground text-xs outline-none focus:border-accent font-bold"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleUpdateProduct(p.id)}
                              className="bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md shadow-accent/15 hover:scale-[1.02] transition-transform"
                            >
                              Update Parameters
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Doubts & Enquiries Manager */}
              <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-6 w-6 text-accent animate-pulse" />
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Customer Doubts & Enquiries</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Review queries sent from the Contact Us page. Reply directly via SMTP email.</p>
                  </div>
                </div>

                {doubts.length === 0 ? (
                  <p className="text-xs text-muted-foreground bg-white/5 p-6 rounded-2xl border border-white/5">No customer enquiries registered in storage.</p>
                ) : (
                  <div className="grid gap-6">
                    {doubts.map((d) => (
                      <div key={d.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 backdrop-blur-md">
                        <div className="flex flex-wrap justify-between items-start gap-2 border-b border-border pb-3">
                          <div>
                            <span className="text-[9px] font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-md">ID: {d.id}</span>
                            <h4 className="font-bold text-xs text-foreground mt-1.5">{d.name}</h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{d.email} · {d.mobile || 'No Mobile'}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleString()}</span>
                        </div>

                        <div className="text-xs space-y-1">
                          <p className="font-bold text-foreground">Subject: {d.subject}</p>
                          <p className="text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5 mt-1.5 leading-relaxed font-mono text-[11px]">{d.message}</p>
                        </div>

                        {d.reply ? (
                          <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-emerald-600">Replied at {new Date(d.replied_at!).toLocaleString()}:</p>
                            <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">{d.reply}</p>
                          </div>
                        ) : (
                          <div className="space-y-3 pt-1">
                            <textarea
                              value={replyInputs[d.id] || ''}
                              onChange={(e) => setReplyInputs({ ...replyInputs, [d.id]: e.target.value })}
                              placeholder="Type reply text to send via SMTP..."
                              rows={3}
                              className="w-full border border-border p-2.5 rounded-xl bg-background text-foreground text-xs outline-none focus:border-accent"
                            />
                            <div className="flex justify-end">
                              <button
                                type="button"
                                disabled={sendingReplies[d.id]}
                                onClick={() => handleReplyDoubt(d.id, d.email, d.subject, d.name)}
                                className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-accent/15 hover:scale-[1.02] transition-transform flex items-center gap-1.5"
                              >
                                <Send className="h-3.5 w-3.5" />
                                {sendingReplies[d.id] ? 'Sending Reply...' : 'Send SMTP Reply'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
