'use client'

import { useState, useEffect } from 'react'
import {
  getDbProducts,
  placeDbOrder,
  createOTP,
  verifyOTP,
  getUserProfileByEmail,
  createUserProfile
} from '@/lib/supabase'
import {
  Search,
  ChevronDown,
  ShoppingBag,
  Download,
  Calculator,
  Truck,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  X,
  FileText,
  BadgeAlert,
  Percent,
  Globe
} from 'lucide-react'

// Core B2B Raw Materials catalog
const PRODUCTS = [
  {
    id: 'butamine-vg40',
    name: 'VG40 Bulk Bitumen (Butamine)',
    category: 'Chemicals & Binders',
    rate: 50832,
    unit: 'MT',
    minOrder: 10,
    marginRate: 0.04, // 4%
    spec: 'Viscosity Grade Bitumen for high-stress paving, heavy industrial applications. Meets IS 73:2013.',
    cert: 'QA-VG40-PRODUCER-TEST.pdf',
    inventory: 4500,
  },
  {
    id: 'butamine-vg30',
    name: 'VG30 Bulk Bitumen (Butamine)',
    category: 'Chemicals & Binders',
    rate: 48242,
    unit: 'MT',
    minOrder: 10,
    marginRate: 0.04, // 4%
    spec: 'Standard Viscosity Grade Bitumen for national highways, airport runways. Meets IS 73:2013.',
    cert: 'QA-VG30-PRODUCER-TEST.pdf',
    inventory: 8200,
  },
  {
    id: 'al-wire',
    name: 'Aluminium Wire (Industrial Grade)',
    category: 'Metals',
    rate: 220000,
    unit: 'MT',
    minOrder: 5,
    marginRate: 0.035, // 3.5%
    spec: 'High conductivity electrical grade aluminium rod/wire. Diameter: 9.5mm. Pure 99.7%.',
    cert: 'QA-ALWIRE-COMPLIANCE.pdf',
    inventory: 150,
  },
  {
    id: 'al-ingot',
    name: 'Aluminium Ingots (99.7% Pure)',
    category: 'Metals',
    rate: 190000,
    unit: 'MT',
    minOrder: 5,
    marginRate: 0.032, // 3.2%
    spec: 'Primary aluminium casting ingots. Ideal for alloys, die casting, extrusion billets.',
    cert: 'QA-ALINGOT-CHEMISTRY.pdf',
    inventory: 300,
  },
  {
    id: 'cu-cathode',
    name: 'Copper Cathode (Grade A, 99.99%)',
    category: 'Metals',
    rate: 710000,
    unit: 'MT',
    minOrder: 2,
    marginRate: 0.045, // 4.5%
    spec: 'Electrolytic Copper Cathodes LME Grade A. Copper purity 99.99% min.',
    cert: 'QA-CUCATHODE-LME-SPEC.pdf',
    inventory: 85,
  },
  {
    id: 'gear-oil',
    name: 'Industrial Gear Oil (EP VG 220)',
    category: 'Lubricants & Fluids',
    rate: 145000,
    unit: 'MT',
    minOrder: 3,
    marginRate: 0.05, // 5%
    spec: 'Extreme pressure gear lubricant. Formulated for heavy-duty closed industrial gears, bearings.',
    cert: 'QA-GEAROIL-SHEAR-TEST.pdf',
    inventory: 240,
  },
  {
    id: 'fluid-metalworking',
    name: 'Soluble Metal Working Fluid',
    category: 'Lubricants & Fluids',
    rate: 138000,
    unit: 'MT',
    minOrder: 3,
    marginRate: 0.05, // 5%
    spec: 'High-performance cutting coolant, emulsifiable oil for CNC machining & grinding.',
    cert: 'QA-METALFLUID-SPEC.pdf',
    inventory: 180,
  },
  {
    id: 'phenol',
    name: 'Phenol (Pharma/Chemical Grade)',
    category: 'Chemicals & Binders',
    rate: 115000,
    unit: 'MT',
    minOrder: 5,
    marginRate: 0.04, // 4%
    spec: 'Pure crystalline phenol 99.6%. Raw input material for resins, pharmaceutical syntheses.',
    cert: 'QA-PHENOL-PURITY.pdf',
    inventory: 500,
  },
  {
    id: 'catalysts',
    name: 'Industrial Processing Catalysts',
    category: 'Chemicals & Binders',
    rate: 340000,
    unit: 'MT',
    minOrder: 1,
    marginRate: 0.06, // 6%
    spec: 'Refined catalytic agents for petrochemical cracking, polymerizations.',
    cert: 'QA-CATALYST-ACTIVITY.pdf',
    inventory: 40,
  },
  {
    id: 'rust-preventive',
    name: 'De-Watering Rust Preventive Fluid',
    category: 'Lubricants & Fluids',
    rate: 155000,
    unit: 'MT',
    minOrder: 2,
    marginRate: 0.05, // 5%
    spec: 'Thin film corrosion inhibitor for raw metals, castings during maritime export transit.',
    cert: 'QA-RUSTPREVENT-FILM.pdf',
    inventory: 120,
  },
  {
    id: 'steel-tmt',
    name: 'Structural Steel TMT Rebars (Fe 550D)',
    category: 'Construction Metals',
    rate: 52000,
    unit: 'MT',
    minOrder: 15,
    marginRate: 0.038, // 3.8%
    spec: 'High-strength thermo-mechanically treated reinforcement bars. Standard length 12m.',
    cert: 'QA-STEEL-TENSIL-TEST.pdf',
    inventory: 15000,
  },
]

const CATEGORIES = [
  'All Materials',
  'Chemicals & Binders',
  'Metals',
  'Lubricants & Fluids',
  'Construction Metals',
]

interface CartItem {
  product: typeof PRODUCTS[0]
  qty: number
  logistics: 'arranged' | 'self'
  payment: 'upfront' | 'credit'
}

export function MarketplaceExchange() {
  const [selectedCategory, setSelectedCategory] = useState('All Materials')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  // Products state (populated initially with default compile-time list)
  const [productsList, setProductsList] = useState<typeof PRODUCTS>(PRODUCTS)
  
  // Quote Estimator State
  const [estimatorProd, setEstimatorProd] = useState<typeof PRODUCTS[0]>(PRODUCTS[0])
  const [estimatorQty, setEstimatorQty] = useState(PRODUCTS[0].minOrder)
  const [estimatorLogistics, setEstimatorLogistics] = useState<'arranged' | 'self'>('arranged')
  const [estimatorPayment, setEstimatorPayment] = useState<'upfront' | 'credit'>('upfront')

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(0) // 0: Cart, 1: Details, 2: Complete
  const [companyName, setCompanyName] = useState('')
  const [gstin, setGstin] = useState('')
  const [address, setAddress] = useState('')
  const [mobile, setMobile] = useState('')
  const [orderSuccessId, setOrderSuccessId] = useState('')

  // Inline Authentication & Payment States
  const [session, setSession] = useState<any>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authName, setAuthName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [authCompany, setAuthCompany] = useState('')
  const [authGstin, setAuthGstin] = useState('')
  const [authPlace, setAuthPlace] = useState('')
  const [authOtp, setAuthOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment' | 'Embedded MSME Credit'>('Cash on Delivery')
  const [countdownNotification, setCountdownNotification] = useState<string | null>(null)
  const [countdownSeconds, setCountdownSeconds] = useState(5)

  // Floating Toast Alert State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load products list from Supabase
  const loadProducts = async () => {
    const list = await getDbProducts()
    setProductsList(list)
  }

  useEffect(() => {
    loadProducts()
    
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('smebhawan_user_session')
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession)
          if (parsed.role === 'customer') {
            setSession(parsed)
            setCompanyName(parsed.companyName)
            setGstin(parsed.gstin)
            setMobile(parsed.phone)
            setAddress(parsed.place)
          }
        } catch (e) {}
      }
    }

    const handleStorageChange = () => {
      loadProducts()
      const activeSession = localStorage.getItem('smebhawan_user_session')
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession)
          if (parsed.role === 'customer') {
            setSession(parsed)
            setCompanyName(parsed.companyName)
            setGstin(parsed.gstin)
            setMobile(parsed.phone)
            setAddress(parsed.place)
          } else {
            setSession(null)
          }
        } catch (e) {
          setSession(null)
        }
      } else {
        setSession(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Filter products
  const filteredProducts = productsList.filter((p) => {
    const matchCat = selectedCategory === 'All Materials' || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.spec.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  // Reset quantity on product change
  const handleEstimatorProductChange = (prodId: string) => {
    const prod = productsList.find((p) => p.id === prodId)
    if (prod) {
      setEstimatorProd(prod)
      setEstimatorQty(prod.minOrder)
    }
  }

  // Cost calculation
  const calculateCosts = (prod: typeof PRODUCTS[0], qty: number, logistics: 'arranged' | 'self', payment: 'upfront' | 'credit') => {
    const rawRate = prod.rate
    const baseCost = rawRate * qty
    const platformMargin = baseCost * prod.marginRate
    const logisticsCharge = logistics === 'arranged' ? 2000 * qty : 0
    const subtotal = baseCost + platformMargin + logisticsCharge
    const creditInterest = payment === 'credit' ? subtotal * (0.16 * (60 / 365)) : 0
    const gstRate = 0.18
    const taxableAmount = subtotal + creditInterest
    const gst = taxableAmount * gstRate
    const grandTotal = taxableAmount + gst

    return {
      baseCost,
      platformMargin,
      logisticsCharge,
      creditInterest,
      taxableAmount,
      gst,
      grandTotal
    }
  }

  const estimatorCalc = calculateCosts(estimatorProd, estimatorQty, estimatorLogistics, estimatorPayment)

  const addToCartFromEstimator = () => {
    const existing = cart.find(
      (item) =>
        item.product.id === estimatorProd.id &&
        item.logistics === estimatorLogistics &&
        item.payment === estimatorPayment
    )

    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === estimatorProd.id &&
          item.logistics === estimatorLogistics &&
          item.payment === estimatorPayment
            ? { ...item, qty: item.qty + estimatorQty }
            : item
        )
      )
    } else {
      setCart([...cart, { product: estimatorProd, qty: estimatorQty, logistics: estimatorLogistics, payment: estimatorPayment }])
    }
    setCartOpen(true)
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const cartTotals = cart.reduce(
    (acc, item) => {
      const costs = calculateCosts(item.product, item.qty, item.logistics, item.payment)
      return {
        baseCost: acc.baseCost + costs.baseCost,
        margin: acc.margin + costs.platformMargin,
        logistics: acc.logistics + costs.logisticsCharge,
        interest: acc.interest + costs.creditInterest,
        gst: acc.gst + costs.gst,
        total: acc.total + costs.grandTotal,
      }
    },
    { baseCost: 0, margin: 0, logistics: 0, interest: 0, gst: 0, total: 0 }
  )

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail || !authEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    setAuthLoading(true)
    try {
      if (!isSignUpMode) {
        const user = await getUserProfileByEmail(authEmail)
        if (!user || user.role !== 'customer') {
          showToast('This email address is not registered as a Customer. Please switch to Register / Sign Up.', 'error')
          setAuthLoading(false)
          return
        }
      } else {
        const existing = await getUserProfileByEmail(authEmail)
        if (existing) {
          if (existing.role === 'supplier') {
            showToast('This email is already registered as a Supplier and cannot be used for a Customer account.', 'error')
            setAuthLoading(false)
            return
          } else {
            showToast('This email is already registered as a Customer. Please switch to Sign In mode.', 'info')
            setAuthLoading(false)
            return
          }
        }
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
      await createOTP(authEmail, generatedCode)

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          email: authEmail,
          code: generatedCode
        })
      })

      setOtpSent(true)
      setCountdownSeconds(5)
      setCountdownNotification(`OTP code has been successfully dispatched to ${authEmail}!`)
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
      showToast('Failed to dispatch OTP. Please check your network or SMTP credentials.', 'error')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authOtp.length < 6) {
      showToast('Please enter a valid 6-digit OTP', 'error')
      return
    }
    setAuthLoading(true)
    try {
      const isValid = await verifyOTP(authEmail, authOtp)
      if (!isValid) {
        showToast('Invalid or expired OTP. Please try again.', 'error')
        setAuthLoading(false)
        return
      }

      if (isSignUpMode) {
        const newProfile = await createUserProfile({
          name: authName,
          place: authPlace,
          email: authEmail.trim().toLowerCase(),
          phone: authPhone,
          companyName: authCompany,
          gstin: authGstin,
          role: 'customer',
          status: 'verified'
        })

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup-success',
            email: authEmail,
            name: authName,
            role: 'Customer Portal'
          })
        })

        localStorage.setItem('smebhawan_user_session', JSON.stringify(newProfile))
        setSession(newProfile)
        setCompanyName(newProfile.companyName)
        setGstin(newProfile.gstin)
        setMobile(newProfile.phone)
        setAddress(newProfile.place)
      } else {
        const existingProfile = await getUserProfileByEmail(authEmail)
        if (existingProfile) {
          localStorage.setItem('smebhawan_user_session', JSON.stringify(existingProfile))
          setSession(existingProfile)
          setCompanyName(existingProfile.companyName)
          setGstin(existingProfile.gstin)
          setMobile(existingProfile.phone)
          setAddress(existingProfile.place)
        }
      }
      showToast('Authenticated successfully!', 'success')
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      console.error(err)
      showToast('Error during authorization. Please check OTP code.', 'error')
    } finally {
      setAuthLoading(false)
    }
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || !gstin || !address || !mobile) {
      showToast('Please fill out all billing & GST details.', 'error')
      return
    }

    const orderId = 'SB-' + Math.floor(100000 + Math.random() * 900000)
    const isCredit = paymentMethod === 'Embedded MSME Credit'
    const newOrder = {
      orderId,
      companyName,
      gstin,
      address,
      mobile,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        qty: item.qty,
        rate: item.product.rate,
        costs: calculateCosts(item.product, item.qty, item.logistics, isCredit ? 'credit' : 'upfront'),
        logistics: item.logistics,
        payment: isCredit ? ('credit' as const) : ('upfront' as const),
      })),
      totals: cartTotals,
      status: 'Placed' as const,
      date: new Date().toISOString(),
      creditTerms: isCredit
        ? { interestRate: '16%', tenureDays: 60, status: 'Pending Approval' }
        : null,
    }

    await placeDbOrder(newOrder as any)

    const metrics = JSON.parse(localStorage.getItem('smebhawan_metrics') || '{"aum": 28500000, "margins": 1140000, "defaultRate": 0.8}')
    if (newOrder.creditTerms) {
      metrics.aum += cartTotals.total
    }
    metrics.margins += cartTotals.margin
    localStorage.setItem('smebhawan_metrics', JSON.stringify(metrics))

    // Send email notifications
    try {
      const emailRecipient = session?.email || authEmail
      // Customer alert
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'order-placed',
          email: emailRecipient,
          orderDetails: {
            orderId,
            companyName,
            totalValue: cartTotals.total,
            paymentMethod,
            status: 'waiting for approval'
          }
        })
      })

      // Admin duplicate alert
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'order-placed',
          email: 'smehouse25@gmail.com',
          orderDetails: {
            orderId,
            companyName,
            totalValue: cartTotals.total,
            paymentMethod,
            status: 'waiting for approval'
          }
        })
      })
    } catch (err) {
      console.warn('Failed to send SMTP order notification:', err)
    }

    setCart([])
    setOrderSuccessId(orderId)
    setCheckoutStep(2)
  }

  const autoFillBuyer = () => {
    setCompanyName('Mahalaxmi Polymers Pvt Ltd')
    setGstin('19AAACM1204K1Z9')
    setAddress('Plot 42, Sector V, Salt Lake Electronic Complex, Kolkata, WB 700091')
    setMobile('+91 9830214820')
  }

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Products Catalogue */}
        <div className="space-y-6">
          {/* Filter controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/65 border border-border/80 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by material grade, chemical name, standards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-background/50 border border-border rounded-xl text-sm outline-none focus:border-accent"
              />
            </div>
            {/* Wrap categories vertically on mobile */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={[
                    'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors border shrink-0',
                    selectedCategory === cat
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleEstimatorProductChange(p.id)}
                className={[
                  'group relative flex flex-col justify-between rounded-2xl border bg-card/75 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md backdrop-blur-md',
                  estimatorProd.id === p.id ? 'border-accent ring-2 ring-accent/15' : 'border-border',
                ].join(' ')}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Min: {p.minOrder} {p.unit}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-extrabold text-foreground group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-xs leading-normal text-muted-foreground line-clamp-2">
                    {p.spec}
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Contract Price
                    </p>
                    <p className="font-display text-xl font-black text-foreground">
                      ₹{p.rate.toLocaleString('en-IN')}
                      <span className="text-xs font-semibold text-muted-foreground">
                        {' '}
                        / {p.unit}
                      </span>
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform"
                  >
                    Select to Estimate <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live B2B Quote Estimator Panel */}
        <div className="bg-card/75 border border-border rounded-3xl p-6 shadow-md h-fit lg:sticky lg:top-24 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Calculator className="h-5 w-5 text-accent animate-pulse" />
            <h2 className="font-display text-lg font-bold text-foreground">
              B2B Quote Estimator
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            {/* Material Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Selected Material
              </label>
              <div className="relative">
                <select
                  value={estimatorProd.id}
                  onChange={(e) => handleEstimatorProductChange(e.target.value)}
                  className="w-full h-11 border border-border bg-background/50 px-3 pr-10 rounded-xl text-xs font-bold outline-none focus:border-accent appearance-none"
                >
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.substring(0, 30)}...
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            {/* Quantity Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">
                  Quantity (in Metric Tons)
                </label>
                <span className="text-[10px] font-bold text-accent">
                  Min MOQ: {estimatorProd.minOrder} MT
                </span>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setEstimatorQty(Math.max(estimatorProd.minOrder, estimatorQty - 5))}
                  className="h-11 w-11 flex items-center justify-center border border-r-0 border-border bg-muted/50 rounded-l-xl hover:bg-border transition-colors text-foreground font-bold"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min={estimatorProd.minOrder}
                  value={estimatorQty}
                  onChange={(e) => setEstimatorQty(Math.max(estimatorProd.minOrder, parseInt(e.target.value) || estimatorProd.minOrder))}
                  className="flex-1 h-11 border border-border bg-background/50 text-center text-xs font-extrabold outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setEstimatorQty(estimatorQty + 5)}
                  className="h-11 w-11 flex items-center justify-center border border-l-0 border-border bg-muted/50 rounded-r-xl hover:bg-border transition-colors text-foreground font-bold"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Logistics - Responsive Stack on Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Fulfillment Channel
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setEstimatorLogistics('arranged')}
                  className={[
                    'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
                    estimatorLogistics === 'arranged'
                      ? 'border-accent bg-accent/5 text-accent font-bold'
                      : 'border-border bg-background/30 hover:bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  <Truck className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] leading-tight font-bold">Arrange Logistics</span>
                  <span className="text-[8px] text-muted-foreground/90 leading-tight">(+₹2,000 / MT)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEstimatorLogistics('self')}
                  className={[
                    'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
                    estimatorLogistics === 'self'
                      ? 'border-accent bg-accent/5 text-accent font-bold'
                      : 'border-border bg-background/30 hover:bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] leading-tight font-bold">Self-Collection</span>
                  <span className="text-[8px] text-muted-foreground/90 leading-tight">(Hub Ex-Works)</span>
                </button>
              </div>
            </div>

            {/* Payment Option - Responsive Stack on Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Settlement Terms
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setEstimatorPayment('upfront')}
                  className={[
                    'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
                    estimatorPayment === 'upfront'
                      ? 'border-accent bg-accent/5 text-accent font-bold'
                      : 'border-border bg-background/30 hover:bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  <CreditCard className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] leading-tight font-bold">Spot Cash</span>
                  <span className="text-[8px] text-muted-foreground/90 leading-tight">(Upfront Pay)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEstimatorPayment('credit')}
                  className={[
                    'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
                    estimatorPayment === 'credit'
                      ? 'border-accent bg-accent/5 text-accent font-bold'
                      : 'border-border bg-background/30 hover:bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  <Percent className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] leading-tight font-bold">Embedded Credit</span>
                  <span className="text-[8px] text-muted-foreground/90 leading-tight">(16% Line, 60d)</span>
                </button>
              </div>
            </div>

            {/* Quality papers link */}
            <div className="flex items-center gap-2 bg-muted/50 border border-border/80 p-3 rounded-xl text-xs text-muted-foreground">
              <FileText className="h-4.5 w-4.5 text-accent shrink-0" />
              <div className="flex-1 truncate">
                <span>Cert: {estimatorProd.cert}</span>
              </div>
              <button
                type="button"
                onClick={() => alert(`Downloaded quality compliance test reports for ${estimatorProd.name}`)}
                className="text-accent font-bold hover:underline shrink-0"
              >
                <Download className="h-3.5 w-3.5 inline" />
              </button>
            </div>

            {/* Live calculation table */}
            <div className="mt-4 border-t border-dashed border-border/80 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Cost ({estimatorQty} MT × ₹{estimatorProd.rate.toLocaleString('en-IN')})</span>
                <span>₹{estimatorCalc.baseCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>smebhawan Margin ({estimatorProd.marginRate * 100}%)</span>
                <span>₹{estimatorCalc.platformMargin.toLocaleString('en-IN')}</span>
              </div>
              {estimatorLogistics === 'arranged' && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Logistics Fee (₹2,000 / MT)</span>
                  <span>₹{estimatorCalc.logisticsCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              {estimatorPayment === 'credit' && (
                <div className="flex justify-between text-amber-500 font-semibold">
                  <span>Credit Interest (16% p.a., 60 Days)</span>
                  <span>+ ₹{estimatorCalc.creditInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18% B2B)</span>
                <span>₹{estimatorCalc.gst.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm font-extrabold text-foreground">
                <span>Estimated Quote</span>
                <span className="text-accent">₹{estimatorCalc.grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={addToCartFromEstimator}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-xs font-extrabold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/15 transition-transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-4.5 w-4.5" /> Add to B2B Cart
            </button>
          </div>
        </div>
      </div>

      {/* Cart & Checkout Slide Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent animate-bounce" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  Procurement Cart ({cart.length} materials)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutStep(0)
                }}
                className="p-1 hover:bg-muted rounded-lg"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {checkoutStep < 2 && (
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                <div
                  className={[
                    'py-1 text-center border-b-2',
                    checkoutStep === 0 ? 'border-accent text-accent' : 'border-border text-muted-foreground',
                  ].join(' ')}
                >
                  1. Review Cart
                </div>
                <div
                  className={[
                    'py-1 text-center border-b-2',
                    checkoutStep === 1 ? 'border-accent text-accent' : 'border-border text-muted-foreground',
                  ].join(' ')}
                >
                  2. GST & Settlement
                </div>
              </div>
            )}

            <div className="flex-1 py-4 overflow-y-auto">
              {checkoutStep === 0 && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-3" />
                      <p className="font-bold text-muted-foreground">Your B2B Cart is empty</p>
                      <p className="text-xs text-muted-foreground/80 mt-1">Select materials and add to cart to request quotes.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, idx) => {
                        const costs = calculateCosts(item.product, item.qty, item.logistics, item.payment)
                        return (
                          <div key={idx} className="relative rounded-2xl border border-border bg-background p-4 shadow-sm">
                            <button
                              type="button"
                              onClick={() => removeFromCart(idx)}
                              className="absolute right-3 top-3 p-1 hover:bg-muted rounded text-muted-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            
                            <h4 className="font-bold text-sm text-foreground pr-6">{item.product.name}</h4>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="block font-medium">Quantity: {item.qty} MT</span>
                                <span className="block mt-0.5">Price: ₹{item.product.rate.toLocaleString('en-IN')}/MT</span>
                              </div>
                              <div>
                                <span className="block font-medium">Logistics: {item.logistics === 'arranged' ? 'smebhawan' : 'Self'}</span>
                                <span className="block mt-0.5">Pay Terms: {item.payment === 'credit' ? '16% Credit Line' : 'Upfront Spot'}</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-dashed border-border flex justify-between text-xs font-bold text-foreground">
                              <span>Total (incl. GST)</span>
                              <span className="text-accent">₹{costs.grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                          </div>
                        )
                      })}

                      <div className="border-t border-border pt-4 space-y-2 text-xs bg-muted p-4 rounded-2xl">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total Base Material Cost</span>
                          <span>₹{cartTotals.baseCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>smebhawan Combined Margins</span>
                          <span>₹{cartTotals.margin.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total Logistics Charge</span>
                          <span>₹{cartTotals.logistics.toLocaleString('en-IN')}</span>
                        </div>
                        {cartTotals.interest > 0 && (
                          <div className="flex justify-between text-amber-500 font-semibold">
                            <span>Estimated Credit Interest</span>
                            <span>₹{cartTotals.interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total B2B GST (18%)</span>
                          <span>₹{cartTotals.gst.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 text-sm font-extrabold text-foreground">
                          <span>Grand Total Quote</span>
                          <span className="text-accent text-base">₹{cartTotals.total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 1 && !session && (
                <div className="space-y-6 text-xs">
                  {countdownNotification && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-500 flex flex-col gap-1.5 animate-pulse">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold flex items-center gap-1">✉️ Mail Dispatched</span>
                        <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-lg text-[9px]">{countdownSeconds}s</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{countdownNotification}</p>
                    </div>
                  )}
                  <div className="text-center bg-accent/5 border border-accent/20 p-4 rounded-2xl">
                    <p className="text-sm font-extrabold text-foreground">Secure B2B Authorization Required</p>
                    <p className="text-[11px] text-muted-foreground mt-1">To execute raw material contracts, please verify your customer profile.</p>
                  </div>

                  <div className="flex border-b border-border text-center font-bold tracking-wider uppercase mb-4">
                    <button
                      type="button"
                      onClick={() => { setIsSignUpMode(false); setOtpSent(false); }}
                      className={`flex-1 pb-2 border-b-2 transition-colors ${!isSignUpMode ? 'border-accent text-accent' : 'border-transparent text-muted-foreground'}`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsSignUpMode(true); setOtpSent(false); }}
                      className={`flex-1 pb-2 border-b-2 transition-colors ${isSignUpMode ? 'border-accent text-accent' : 'border-transparent text-muted-foreground'}`}
                    >
                      Register / Sign Up
                    </button>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-3.5">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-muted-foreground">Business Email Address *</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="e.g. procurement@company.com"
                          className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                        />
                      </div>

                      {isSignUpMode && (
                        <>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted-foreground">Authorized Name *</label>
                              <input
                                type="text"
                                required
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted-foreground">Contact Phone *</label>
                              <input
                                type="tel"
                                required
                                value={authPhone}
                                onChange={(e) => setAuthPhone(e.target.value)}
                                placeholder="+91 "
                                className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted-foreground">Company Name *</label>
                              <input
                                type="text"
                                required
                                value={authCompany}
                                onChange={(e) => setAuthCompany(e.target.value)}
                                placeholder="Acme Ltd"
                                className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted-foreground">Business GSTIN *</label>
                              <input
                                type="text"
                                required
                                value={authGstin}
                                onChange={(e) => setAuthGstin(e.target.value)}
                                placeholder="GSTIN Code"
                                className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent uppercase"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-semibold text-muted-foreground">Warehouse / Delivery City *</label>
                            <input
                              type="text"
                              required
                              value={authPlace}
                              onChange={(e) => setAuthPlace(e.target.value)}
                              placeholder="City, State"
                              className="w-full h-10 border border-border px-3 rounded-lg bg-background text-foreground outline-none focus:border-accent"
                            />
                          </div>
                        </>
                      )}

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5 mt-2"
                      >
                        {authLoading ? 'Sending OTP...' : 'Request Email Verification OTP'} <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="bg-accent/10 border border-accent/20 p-3.5 rounded-xl text-[10px] text-accent leading-normal flex items-start gap-2">
                        <BadgeAlert className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>OTP security code sent to <strong>{authEmail}</strong>. Check your inbox and type it below.</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-muted-foreground text-center">Enter 6-Digit OTP Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={authOtp}
                          onChange={(e) => setAuthOtp(e.target.value)}
                          placeholder="XXXXXX"
                          className="w-full h-10 border border-border px-3 rounded-lg text-center font-bold tracking-[0.2em] outline-none focus:border-accent bg-background text-foreground"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full h-11 bg-accent text-accent-foreground font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5"
                      >
                        {authLoading ? 'Verifying...' : 'Verify & Authorize Sourcing'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="w-full text-center text-xs text-muted-foreground hover:underline"
                      >
                        Change Email
                      </button>
                    </form>
                  )}
                </div>
              )}

              {checkoutStep === 1 && session && (
                <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between bg-accent/10 border border-accent/20 p-3.5 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-accent">Authorized Buyer Profile</p>
                      <p className="text-[10px] text-muted-foreground">Logged in as: <strong className="text-foreground">{session.email}</strong></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('smebhawan_user_session');
                        setSession(null);
                        window.dispatchEvent(new Event('storage'));
                      }}
                      className="border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      Log Out
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Polymers Ltd"
                      className="w-full h-11 border border-border px-3 rounded-xl text-sm outline-none focus:border-accent bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">GSTIN (15-Digit Number)</label>
                    <input
                      type="text"
                      required
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="19AAACMXXXXK1Z9"
                      className="w-full h-11 border border-border px-3 rounded-xl text-sm outline-none focus:border-accent bg-background uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Billing & Delivery Address</label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full delivery warehouse address"
                      rows={3}
                      className="w-full border border-border p-3 rounded-xl text-sm outline-none focus:border-accent bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Authorized Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full h-11 border border-border px-3 rounded-xl text-sm outline-none focus:border-accent bg-background"
                    />
                  </div>

                  {/* Payment Selection Selector */}
                  <div className="flex flex-col gap-1.5 border-t border-border pt-4">
                    <label className="text-xs font-bold text-foreground">Select Payment Settlement Option</label>
                    <div className="space-y-2 mt-1">
                      {[
                        { key: 'Cash on Delivery', title: 'Cash on Delivery (COD)', desc: 'Pay at warehouse during shipment clearance.' },
                        { key: 'Online Payment', title: 'Pay Online (Instant Spot)', desc: 'Clear contract using simulated B2B Netbanking/UPI.' },
                        { key: 'Embedded MSME Credit', title: 'Embedded MSME Credit Line', desc: 'Accrue on 16% p.a. line with 60 days repayment window.' }
                      ].map((item) => (
                        <label
                          key={item.key}
                          onClick={() => setPaymentMethod(item.key as any)}
                          className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === item.key ? 'border-accent bg-accent/5 font-semibold text-foreground' : 'border-border bg-background hover:bg-muted text-muted-foreground'}`}
                        >
                          <input
                            type="radio"
                            name="paymentOption"
                            checked={paymentMethod === item.key}
                            onChange={() => {}}
                            className="mt-1 accent-accent"
                          />
                          <div>
                            <span className="block text-xs font-bold">{item.title}</span>
                            <span className="block text-[10px] text-muted-foreground/90 mt-0.5">{item.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'Embedded MSME Credit' && (
                    <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                      <BadgeAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-500">Embedded Credit Term Agreement</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                          By placing this order, you apply for 16% annualized credit. Approval requires KYC validation by credit officers inside the Operations Console.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {checkoutStep === 2 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
                  <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                    Procurement Order Logged!
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your Order ID is <span className="font-bold text-accent">{orderSuccessId}</span>
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground leading-normal max-w-sm">
                    {cartTotals.interest > 0
                      ? 'This order requires credit underwriting. Go to the Admin Operations Board to approve the credit line, then check the status in the Buyer Console.'
                      : 'Spot order placed. Suppliers inside the Supplier Hub can now mark it as Dispatched and upload shipment credentials.'}
                  </p>
                  <div className="mt-8 flex flex-col gap-2 w-full">
                    <a
                      href="/login/buyer"
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-xs font-bold text-accent-foreground shadow-md text-center"
                    >
                      Go to Buyer Console <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href="/login/admin"
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground text-center"
                    >
                      Go to Admin Console <ArrowRight className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false)
                        setCheckoutStep(0)
                      }}
                      className="text-xs text-muted-foreground font-bold hover:underline mt-2"
                    >
                      Continue Sourcing
                    </button>
                  </div>
                </div>
              )}
            </div>

            {checkoutStep < 2 && cart.length > 0 && (
              <div className="border-t border-border pt-4 bg-card">
                {checkoutStep === 0 ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/15"
                  >
                    Proceed to Settlement <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(0)}
                      className="w-full border border-border py-3 rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      Back to Review
                    </button>
                    {session ? (
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/15"
                      >
                        Confirm order <CheckCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="w-full text-center text-xs text-muted-foreground py-3 bg-muted rounded-xl select-none font-bold">
                        Authenticate Above
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-slate-900 border border-emerald-500/20 text-emerald-500 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold font-sans tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
