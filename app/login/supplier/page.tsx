'use client'

import { useState, useEffect } from 'react'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { ScrollProgress } from '@/components/site/scroll-progress'
import {
  Store,
  Factory,
  Boxes,
  Truck,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Lock,
  ArrowRight,
  Upload,
  Calendar,
  AlertTriangle,
  Settings,
  Plus,
  ArrowLeft,
  FileText,
  Clock,
  Mail,
  Edit2,
  X,
  PlusCircle,
  AlertCircle
} from 'lucide-react'
import { 
  getDbOrders, 
  updateDbOrder, 
  updateDbProduct,
  getUserProfileByEmail,
  createUserProfile,
  updateUserProfile,
  createOTP,
  verifyOTP,
  getDbDoubts,
  sendDbDoubt,
  getDbProducts,
  getPendingProducts,
  createPendingProduct,
  type UserProfile,
  type Doubt,
  type PendingProduct
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
  status: 'Placed' | 'Confirmed' | 'Dispatched' | 'Out for Dispatch' | 'Shipped' | 'Out for Delivery' | 'Delivered'
  date: string
  creditTerms: { interestRate: string; tenureDays: number; status: string } | null
  dispatchDetails?: { vehicleNo: string; lrNo: string; dispatchedAt: string } | null
}

export default function SupplierPortal() {
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

  // Dispatch popup state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [vehicleNo, setVehicleNo] = useState('')
  const [lrNo, setLrNo] = useState('')

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

  // Inventory price state
  const [bitumenPrice, setBitumenPrice] = useState('50832')

  // Product addition/editing states
  const [productsList, setProductsList] = useState<any[]>([])
  const [pendingListings, setPendingListings] = useState<PendingProduct[]>([])
  const [showListModal, setShowListModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const [pName, setPName] = useState('')
  const [pCategory, setPCategory] = useState('Chemicals & Binders')
  const [pRate, setPRate] = useState(0)
  const [pUnit, setPUnit] = useState('MT')
  const [pMinOrder, setPMinOrder] = useState(1)
  const [pSpec, setPSpec] = useState('')
  const [pInventory, setPInventory] = useState(0)

  // Floating Toast Alert State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }
  const [pCert, setPCert] = useState('')

  // In-page countdown alerts state
  const [countdownNotification, setCountdownNotification] = useState<string | null>(null)
  const [countdownSeconds, setCountdownSeconds] = useState(5)

  // Load session from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = sessionStorage.getItem('smebhawan_user_session')
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession)
          if (parsed.role === 'supplier') {
            setIsLoggedIn(true)
            setSession(parsed)
          } else {
            sessionStorage.removeItem('smebhawan_user_session')
          }
        } catch (e) {
          sessionStorage.removeItem('smebhawan_user_session')
        }
      }
    }
  }, [])

  // Load orders & doubts associated with supplier
  const loadDashboardData = async () => {
    if (!session || session.status === 'pending') return
    
    // Fetch orders
    const allOrders = await getDbOrders()
    setOrders(allOrders)

    // Fetch doubts
    const allDoubts = await getDbDoubts()
    const supplierDoubts = allDoubts.filter(
      (d) => d.email.toLowerCase() === session.email.toLowerCase()
    )
    setDoubts(supplierDoubts)

    // Load products and pending listing approvals
    const list = await getDbProducts()
    setProductsList(list)
    const pended = await getPendingProducts()
    setPendingListings(pended)
  }

  useEffect(() => {
    if (isLoggedIn && session && session.status !== 'pending') {
      loadDashboardData()
      
      const handleStorageChange = () => {
        loadDashboardData()
      }

      window.addEventListener('storage', handleStorageChange)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
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
      showToast('Please enter a valid email address', 'error')
      return
    }

    setLoading(true)
    try {
      if (!isSignUpMode) {
        // Sign In - check if email is registered
        const user = await getUserProfileByEmail(email)
        if (!user || user.role !== 'supplier') {
          showToast('This email address is not registered as a Supplier. Please switch to Sign Up.', 'error')
          setLoading(false)
          return
        }
      } else {
        const existing = await getUserProfileByEmail(email)
        if (existing) {
          if (existing.role === 'customer') {
            showToast('This email is already registered as a Customer and cannot be used for a Supplier account.', 'error')
            setLoading(false)
            return
          } else {
            showToast('This email is already registered as a Supplier. Please switch to Sign In mode.', 'info')
            setLoading(false)
            return
          }
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
      setCountdownSeconds(5)
      setCountdownNotification(`OTP code has been successfully dispatched to ${email}!`)
      const interval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setCountdownNotification(null)
            return 5
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      console.error(err)
      showToast('Failed to dispatch OTP. Please check SMTP parameters.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) {
      showToast('Please enter a valid 6-digit OTP', 'error')
      return
    }

    setLoading(true)
    try {
      const isValid = await verifyOTP(email, otp)
      if (!isValid) {
        showToast('Invalid or expired OTP. Please try again.', 'error')
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
          role: 'supplier',
          status: 'pending' // Supplier starts as pending verification
        })

        // Send Registration Welcome Email
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup-success',
            email: email,
            name: name,
            role: 'Supplier Portal (Pending Audit)'
          })
        })

        // Set login state
        sessionStorage.setItem('smebhawan_user_session', JSON.stringify(newProfile))
        setSession(newProfile)
        setIsLoggedIn(true)
        await triggerLoginAlertEmail(newProfile.email, 'Supplier Portal (Pending Audit)')
      } else {
        // Log in existing profile
        const existingProfile = await getUserProfileByEmail(email)
        if (existingProfile) {
          sessionStorage.setItem('smebhawan_user_session', JSON.stringify(existingProfile))
          setSession(existingProfile)
          setIsLoggedIn(true)
          await triggerLoginAlertEmail(existingProfile.email, 'Supplier Portal')
        }
      }
    } catch (err) {
      console.error(err)
      showToast('Error during verification. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('smebhawan_user_session')
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
            role: 'Supplier Profile Update'
          })
        })
      }
    } catch (err) {
      showToast('Failed to update profile settings.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Help Desk Submission Handler
  const handleRaiseHelp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    if (!helpSubject || !helpMessage) {
      showToast('Please fill in both Subject and Message fields.', 'error')
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

      showToast('Your enquiry has been submitted. Operations desk will review and reply via email.', 'success')
      setHelpSubject('')
      setHelpMessage('')
      loadDashboardData()
    } catch (err) {
      showToast('Failed to submit enquiry.', 'error')
    } finally {
      setSubmittingHelp(false)
    }
  }

  // Handle order dispatch clearance
  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    const updates = {
      status: 'Dispatched' as const,
      dispatchDetails: { vehicleNo, lrNo, dispatchedAt: new Date().toISOString() } as any
    }

    const updated = await updateDbOrder(selectedOrder.orderId, updates)
    if (updated) {
      setOrders(orders.map((o) => o.orderId === selectedOrder.orderId ? { ...o, ...updates } : o))
      setSelectedOrder(null)
      setVehicleNo('')
      setLrNo('')
      showToast('Order has been marked as Dispatched! Shipment info propagated to buyer dashboard.', 'success')

      // Notify customer, admin, and supplier
      try {
        const recipient = selectedOrder.mobile || 'smehouse25@gmail.com'
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'order-status-update',
            email: recipient,
            orderDetails: {
              orderId: selectedOrder.orderId,
              companyName: selectedOrder.companyName,
              status: 'Dispatched',
              vehicleNo,
              lrNo
            }
          })
        })
      } catch (err) {
        console.warn('Failed to send status transition email:', err)
      }
    }
  }

  const progressShipmentStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus: 'Placed' | 'Confirmed' | 'Dispatched' | 'Out for Dispatch' | 'Shipped' | 'Out for Delivery' | 'Delivered'
    if (currentStatus === 'Dispatched') {
      nextStatus = 'Out for Dispatch'
    } else if (currentStatus === 'Out for Dispatch') {
      nextStatus = 'Shipped'
    } else if (currentStatus === 'Shipped') {
      nextStatus = 'Out for Delivery'
    } else if (currentStatus === 'Out for Delivery') {
      nextStatus = 'Delivered'
    } else {
      return
    }

    const updated = await updateDbOrder(orderId, { status: nextStatus })
    if (updated) {
      setOrders(orders.map((o) => o.orderId === orderId ? { ...o, status: nextStatus } : o))
      showToast(`Order ${orderId} status transitioned to: ${nextStatus}`, 'success')

      // Send status update notification via SMTP
      try {
        const targetOrder = orders.find(o => o.orderId === orderId)
        const recipient = targetOrder?.mobile || 'smehouse25@gmail.com'
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'order-status-update',
            email: recipient,
            orderDetails: {
              orderId,
              companyName: targetOrder?.companyName,
              status: nextStatus,
              vehicleNo: targetOrder?.dispatchDetails?.vehicleNo,
              lrNo: targetOrder?.dispatchDetails?.lrNo
            }
          })
        })
      } catch (err) {
        console.warn('Failed to send status transition email:', err)
      }
    }
  }

  const handleCreateProductRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    try {
      const details = {
        name: pName,
        category: pCategory,
        rate: pRate,
        unit: pUnit,
        minOrder: pMinOrder,
        marginRate: 0.04,
        spec: pSpec,
        cert: pCert || `QA-${pName.replace(/\s+/g, '-').toUpperCase()}-SPEC.pdf`,
        inventory: pInventory,
        supplierEmail: session.email,
        supplierCompany: session.companyName,
        type: 'new' as const
      }
      
      await createPendingProduct(details)
      
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'listing-request',
          email: 'smehouse25@gmail.com',
          productDetails: {
            name: pName,
            rate: pRate,
            inventory: pInventory,
            supplierCompany: session.companyName,
            supplierEmail: session.email,
            type: 'new'
          }
        })
      })

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'listing-request',
          email: session.email,
          productDetails: {
            name: pName,
            rate: pRate,
            inventory: pInventory,
            supplierCompany: session.companyName,
            supplierEmail: session.email,
            type: 'new'
          }
        })
      })

      showToast('Material listing request submitted to Admin for verification.', 'success')
      setShowListModal(false)
      loadDashboardData()
    } catch (err) {
      showToast('Failed to submit listing request.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProductRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !selectedProduct) return
    setLoading(true)
    try {
      const details = {
        id: selectedProduct.id,
        name: pName,
        category: pCategory,
        rate: pRate,
        unit: pUnit,
        minOrder: pMinOrder,
        marginRate: selectedProduct.marginRate || 0.04,
        spec: pSpec,
        cert: pCert || selectedProduct.cert,
        inventory: pInventory,
        supplierEmail: session.email,
        supplierCompany: session.companyName,
        type: 'edit' as const
      }

      await createPendingProduct(details)

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'listing-request',
          email: 'smehouse25@gmail.com',
          productDetails: {
            name: pName,
            rate: pRate,
            inventory: pInventory,
            supplierCompany: session.companyName,
            supplierEmail: session.email,
            type: 'edit'
          }
        })
      })

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'listing-request',
          email: session.email,
          productDetails: {
            name: pName,
            rate: pRate,
            inventory: pInventory,
            supplierCompany: session.companyName,
            supplierEmail: session.email,
            type: 'edit'
          }
        })
      })

      showToast('Material price/inventory update request sent to Admin for vetting.', 'success')
      setShowEditProductModal(false)
      setSelectedProduct(null)
      loadDashboardData()
    } catch (err) {
      showToast('Failed to submit product edit request.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openListModal = () => {
    setPName('')
    setPCategory('Chemicals & Binders')
    setPRate(0)
    setPUnit('MT')
    setPMinOrder(1)
    setPSpec('')
    setPInventory(0)
    setPCert('')
    setShowListModal(true)
  }

  const openEditProductModal = (p: any) => {
    setSelectedProduct(p)
    setPName(p.name)
    setPCategory(p.category)
    setPRate(p.rate)
    setPUnit(p.unit)
    setPMinOrder(p.minOrder)
    setPSpec(p.spec)
    setPInventory(p.inventory)
    setPCert(p.cert)
    setShowEditProductModal(true)
  }

  const handleUpdatePrice = async () => {
    const rateVal = parseInt(bitumenPrice)
    if (isNaN(rateVal)) {
      showToast('Please enter a valid price.', 'error')
      return
    }
    const updated = await updateDbProduct('butamine-vg40', { rate: rateVal })
    if (updated) {
      showToast(`VG40 base price updated to ₹${rateVal}/MT inside Supabase. Changes are propagated to the marketplace!`, 'success')
    } else {
      showToast('Failed to update price in database.', 'error')
    }
  }

  // Check solved status automatically if ticket replied for > 24 hours
  const isTicketSolved = (d: Doubt) => {
    if (!d.reply || !d.replied_at) return false
    const diff = new Date().getTime() - new Date(d.replied_at).getTime()
    return diff > 24 * 60 * 60 * 1000 // 24 hours
  }

  // Orders awaiting dispatch (status: Confirmed)
  const pendingShipments = orders.filter((o) => o.status === 'Confirmed')
  // Dispatched or cleared payouts
  const payoutsLedger = orders.filter((o) => o.status === 'Dispatched' || o.status === 'Delivered')

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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shadow-sm">
                  <Store className="h-6 w-6" />
                </div>
                <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
                  Supplier Hub
                </h1>
                <p className="mt-2 text-xs text-muted-foreground">
                  Verify Udyam credentials, coordinate logistics shipments, and check 45-day payment ledgers.
                </p>
              </div>

              {countdownNotification && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-500 flex flex-col gap-1.5 animate-pulse mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold flex items-center gap-1">✉️ Mail Dispatched</span>
                    <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-lg text-[9px]">{countdownSeconds}s</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{countdownNotification}</p>
                </div>
              )}

              {/* Login/Signup Tabs */}
              {!otpSent && (
                <div className="flex border-b border-white/10 mb-6 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(false)}
                    className={`flex-1 pb-3 text-center transition-colors ${!isSignUpMode ? 'text-blue-500 border-b-2 border-blue-500' : 'text-muted-foreground'}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(true)}
                    className={`flex-1 pb-3 text-center transition-colors ${isSignUpMode ? 'text-blue-500 border-b-2 border-blue-500' : 'text-muted-foreground'}`}
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
                      placeholder="e.g. supplier@company.com"
                      className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-blue-500"
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
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-blue-500"
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
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-blue-500"
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
                            placeholder="Apex Chembinders"
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-semibold text-muted-foreground">Business Udyam / GSTIN *</label>
                          <input
                            type="text"
                            required
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            placeholder="UDYAM No. or GSTIN"
                            className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-blue-500"
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
                          placeholder="Kolkata, West Bengal"
                          className="w-full h-11 border border-border px-3 rounded-xl bg-background text-foreground outline-none focus:border-blue-500"
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
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-[10px] text-blue-500 leading-normal flex items-start gap-2">
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
                      className="w-full h-11 border border-border px-3 rounded-xl text-center font-black tracking-[0.3em] outline-none focus:border-blue-500 bg-background text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
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
        ) : session?.status === 'pending' ? (
          /* Supplier Vetting Intercept Block Screen */
          <section className="mx-auto max-w-md px-4 py-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md text-center space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse">
                <Clock className="h-7 w-7" />
              </div>
              
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-foreground">Verification Under Process</h2>
                <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider bg-amber-500/5 py-1 px-3.5 rounded-lg border border-amber-500/15 inline-block">Audit Status: Pending</p>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Your supplier profile has been saved in our secure registry and is undergoing compliance check audits.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verification status outcome notifications will be sent to your registered email <span className="font-semibold text-foreground">{session.email}</span> within <strong>7 working days</strong>.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-xs font-bold transition-transform hover:-translate-y-0.5"
                >
                  Return / Log Out
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Verified Supplier Hub Dashboard */
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Verified Supplier Portal</span>
                <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl mt-1">
                  {session?.companyName}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">Udyam: {session?.gstin} · Place: {session?.place}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-muted/80 border border-border px-3.5 py-2 rounded-xl text-muted-foreground font-semibold">
                  🔒 Edits Locked (Use Help Desk)
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold border border-border px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                    <Boxes className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Inventory</h3>
                    <p className="font-display text-2xl font-black text-foreground mt-0.5">3 Active Categories</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <Truck className="h-5 w-5 animate-bounce" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Shipments</h3>
                    <p className="font-display text-2xl font-black text-foreground mt-0.5">{pendingShipments.length} Contracts</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <CheckCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total cleared volume</h3>
                    <p className="font-display text-2xl font-black text-foreground mt-0.5">8,450 MT cleared</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Operations Split */}
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              
              {/* Left Column: Fulfillment */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Fulfillment Console</h2>
                  <span className="text-xs bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-xl border border-amber-500/20 font-bold">
                    Credit Underwritten Orders
                  </span>
                </div>

                {pendingShipments.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
                    <Boxes className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-bold text-muted-foreground">No pending shipments to allocate</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Orders appear here after a buyer places an order and the credit check is approved by the admin panel.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingShipments.map((o) => (
                      <div key={o.orderId} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground">CONTRACT</span>
                            <p className="font-bold text-sm text-foreground">{o.orderId}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground">SHIP TO</span>
                            <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">{o.companyName}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground">TOTAL WT</span>
                            <p className="text-xs font-bold text-foreground">
                              {o.items.reduce((sum, item) => sum + item.qty, 0)} MT
                            </p>
                          </div>
                        </div>

                        {/* Order items lists */}
                        <div className="space-y-2 text-xs">
                          {o.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-muted-foreground">
                              <span>{item.productName}</span>
                              <span className="font-bold text-foreground">{item.qty} MT</span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-xs font-bold text-accent-foreground shadow-md"
                        >
                          Clear Logistics & Dispatch <Truck className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Logistics active shipments tracking list */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Logistics Tracker / Progress Shipments</h3>
                  {orders.filter(o => ['Dispatched', 'Out for Dispatch', 'Shipped', 'Out for Delivery'].includes(o.status)).length === 0 ? (
                    <p className="text-xs text-muted-foreground leading-normal">No active shipments in transit. Dispatch pending shipments to track logistics progression.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders
                        .filter(o => ['Dispatched', 'Out for Dispatch', 'Shipped', 'Out for Delivery'].includes(o.status))
                        .map((o) => (
                          <div key={o.orderId} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                            <div className="flex justify-between items-center border-b border-border pb-3">
                              <div>
                                <span className="text-[10px] font-bold text-muted-foreground">LOGISTICS ID</span>
                                <p className="font-bold text-sm text-foreground">{o.orderId}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-muted-foreground">CURRENT STATUS</span>
                                <span className="block mt-0.5 text-xs font-bold text-accent uppercase">{o.status}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-muted-foreground">CONSIGNMENT LR</span>
                                <p className="text-xs font-semibold text-foreground">{(o as any).dispatchDetails?.lrNo || 'N/A'}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs gap-3">
                              <span className="text-muted-foreground">Carrier Vehicle: <strong>{(o as any).dispatchDetails?.vehicleNo}</strong></span>
                              
                              {o.status === 'Dispatched' && (
                                <button
                                  type="button"
                                  onClick={() => progressShipmentStatus(o.orderId, o.status)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-2 rounded-xl font-bold"
                                >
                                  Mark Out for Dispatch
                                </button>
                              )}
                              {o.status === 'Out for Dispatch' && (
                                <button
                                  type="button"
                                  onClick={() => progressShipmentStatus(o.orderId, o.status)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-2 rounded-xl font-bold animate-pulse"
                                >
                                  Mark as Shipped
                                </button>
                              )}
                              {o.status === 'Shipped' && (
                                <button
                                  type="button"
                                  onClick={() => progressShipmentStatus(o.orderId, o.status)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-2 rounded-xl font-bold"
                                >
                                  Mark Out for Delivery
                                </button>
                              )}
                              {o.status === 'Out for Delivery' && (
                                <button
                                  type="button"
                                  onClick={() => progressShipmentStatus(o.orderId, o.status)}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-bold"
                                >
                                  Mark as Delivered
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* HELP TICKETS LIST & BUILDER */}
                <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-accent animate-pulse" />
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">Help Desk & Enquiries</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Submit technical doubts or listing issues directly to support underwriters.</p>
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
                            placeholder="e.g., Inventory limits, GST payouts"
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

              {/* Right Column: Inventory & Payout Schedule */}
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Inventory & MSMED Payouts</h2>

                {/* Supplier Listings Control Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Supplier Listings Control</h3>
                    <button
                      type="button"
                      onClick={openListModal}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                      <Plus className="h-3.5 w-3.5" /> List New Material
                    </button>
                  </div>

                  {/* Active listings table */}
                  <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live Catalog Materials</h4>
                    {productsList.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No catalog materials found.</p>
                    ) : (
                      productsList.map((p) => (
                        <div key={p.id} className="bg-background/40 border border-border p-3 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-foreground block">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground">Rate: ₹{p.rate.toLocaleString('en-IN')}/{p.unit} · MOQ: {p.minOrder} {p.unit}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 px-2.5 py-1.5 rounded-lg text-blue-500 text-[10px] font-bold"
                          >
                            Edit
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pending requests queue */}
                  <div className="space-y-3.5 border-t border-border pt-4 max-h-[250px] overflow-y-auto pr-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Submitted Approvals Queue</h4>
                    {pendingListings.filter(l => l.supplierEmail === session?.email).length === 0 ? (
                      <p className="text-[10px] text-muted-foreground">No pending listing approval requests.</p>
                    ) : (
                      pendingListings
                        .filter(l => l.supplierEmail === session?.email)
                        .map((l) => (
                          <div key={l.tempId} className="bg-muted/50 border border-border p-3 rounded-xl text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-foreground">{l.name}</span>
                              <span className={[
                                'text-[8px] font-bold uppercase border px-2 py-0.5 rounded-md',
                                l.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/25 animate-pulse' :
                                l.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' :
                                'bg-red-500/10 text-red-500 border-red-500/25'
                              ].join(' ')}>{l.status}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              <span className="block">Type: {l.type === 'new' ? 'New Material' : 'Update Parameters'}</span>
                              <span className="block mt-0.5">Proposed Price: ₹{l.rate.toLocaleString('en-IN')}/{l.unit} · Inventory: {l.inventory} {l.unit}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* MSMED Payout Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-md">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground text-emerald-500">MSMED 45-day Ledger</h3>
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Under the MSME Development Act, consolidated buyer payouts must clear within 45 days. Delayed payments accrue compounded monthly interest penalty from buyers.
                  </p>

                  <div className="space-y-3 pt-2">
                    {payoutsLedger.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No active payouts listed. Dispatched orders appear here.</p>
                    ) : (
                      payoutsLedger.map((o) => (
                        <div key={o.orderId} className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-2xl text-xs space-y-1">
                          <div className="flex justify-between font-bold text-foreground">
                            <span>Payout #{o.orderId}</span>
                            <span className="text-emerald-600 font-bold uppercase text-[9px] tracking-wider">Pending Clear</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Fulfill Date:</span>
                            <span>{new Date(o.date).toLocaleDateString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Compliance Window:</span>
                            <span>45 Days Net</span>
                          </div>
                          <div className="flex justify-between font-bold text-foreground border-t border-border pt-1.5 mt-1.5">
                            <span>Estimated Release:</span>
                            <span>₹{o.totals.baseCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dispatch Shipment Popup Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900/95 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display text-lg font-bold text-foreground">Dispatch Shipment</h3>
                <button type="button" onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-muted rounded">
                  <Plus className="h-5 w-5 text-muted-foreground rotate-45" />
                </button>
              </div>

              <form onSubmit={handleDispatchOrder} className="space-y-4 text-xs">
                <div className="bg-muted p-3.5 rounded-2xl text-[10px] space-y-1">
                  <p className="font-bold text-foreground">Fulfilling order for:</p>
                  <p className="text-muted-foreground">{selectedOrder.companyName}</p>
                  <p className="text-muted-foreground">Destination: {selectedOrder.address}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground">Transport Vehicle Carrier Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="WB-14-AX-9021"
                    className="w-full h-10 border border-border px-3 rounded-xl text-xs outline-none focus:border-accent bg-background uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground">Lorry Receipt (LR) / Consignment Slip No.</label>
                  <input
                    type="text"
                    required
                    value={lrNo}
                    onChange={(e) => setLrNo(e.target.value)}
                    placeholder="LR/HD/2026/0014"
                    className="w-full h-10 border border-border px-3 rounded-xl text-xs outline-none focus:border-accent bg-background uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="border border-border py-2.5 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent py-2.5 rounded-xl font-bold text-xs text-accent-foreground"
                  >
                    Mark as Dispatched
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
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
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Business Udyam / GSTIN</label>
                  <input
                    type="text"
                    required
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
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
                  className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? 'Saving Changes...' : 'Save Profile details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* List New Material Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 space-y-4 shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setShowListModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h2 className="font-display text-lg font-bold text-foreground">List New Raw Material</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Submit new material parameters to Admin vetting board.</p>
            </div>

            <form onSubmit={handleCreateProductRequest} className="space-y-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-muted-foreground">Material Name</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. VG40 Bitumen Bulk"
                  className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  >
                    <option value="Chemicals & Binders">Chemicals & Binders</option>
                    <option value="Metals">Metals</option>
                    <option value="Lubricants & Fluids">Lubricants & Fluids</option>
                    <option value="Construction Metals">Construction Metals</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Price Rate (₹/Unit)</label>
                  <input
                    type="number"
                    required
                    value={pRate}
                    onChange={(e) => setPRate(parseInt(e.target.value) || 0)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Fulfillment Unit</label>
                  <input
                    type="text"
                    required
                    value={pUnit}
                    onChange={(e) => setPUnit(e.target.value)}
                    placeholder="e.g. MT"
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Min Order Qty (MOQ)</label>
                  <input
                    type="number"
                    required
                    value={pMinOrder}
                    onChange={(e) => setPMinOrder(parseInt(e.target.value) || 1)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Available Inventory</label>
                  <input
                    type="number"
                    required
                    value={pInventory}
                    onChange={(e) => setPInventory(parseInt(e.target.value) || 0)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">QA Certificate (PDF)</label>
                  <input
                    type="text"
                    value={pCert}
                    onChange={(e) => setPCert(e.target.value)}
                    placeholder="QA-COMPLIANCE.pdf"
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-muted-foreground">Material Specifications</label>
                <textarea
                  required
                  value={pSpec}
                  onChange={(e) => setPSpec(e.target.value)}
                  placeholder="Viscosity Grade specifications conforming to IS 73:2013 standards..."
                  rows={2}
                  className="w-full border border-border p-2.5 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? 'Submitting...' : 'Submit Listing for Approval'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {showEditProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 space-y-4 shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setShowEditProductModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Edit Material Parameters</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Submit price/inventory modifications to Admin vetting board.</p>
            </div>

            <form onSubmit={handleEditProductRequest} className="space-y-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-muted-foreground">Material Name</label>
                <input
                  type="text"
                  required
                  readOnly
                  disabled
                  value={pName}
                  className="w-full h-10 border border-border px-3 rounded-lg bg-muted text-muted-foreground outline-none cursor-not-allowed select-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Price Rate (₹/{pUnit})</label>
                  <input
                    type="number"
                    required
                    value={pRate}
                    onChange={(e) => setPRate(parseInt(e.target.value) || 0)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Available Inventory</label>
                  <input
                    type="number"
                    required
                    value={pInventory}
                    onChange={(e) => setPInventory(parseInt(e.target.value) || 0)}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Fulfillment Unit</label>
                  <input
                    type="text"
                    required
                    readOnly
                    disabled
                    value={pUnit}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-muted text-muted-foreground outline-none cursor-not-allowed select-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted-foreground">Min Order Qty (MOQ)</label>
                  <input
                    type="number"
                    required
                    readOnly
                    disabled
                    value={pMinOrder}
                    className="w-full h-10 border border-border px-3 rounded-lg bg-muted text-muted-foreground outline-none cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-muted-foreground">Material Specifications</label>
                <textarea
                  required
                  value={pSpec}
                  onChange={(e) => setPSpec(e.target.value)}
                  placeholder="Material specs..."
                  rows={2}
                  className="w-full border border-border p-2.5 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? 'Submitting...' : 'Submit Changes for Approval'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-slate-900 border border-emerald-500/20 text-emerald-500 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold font-sans tracking-wide">{toast.message}</span>
        </div>
      )}

      <Footer />
    </>
  )
}
