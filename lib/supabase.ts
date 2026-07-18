import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pMDFtguWUx6nsBzoRwdQWw.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_pMDFtguWUx6nsBzoRwdQWw_lgjjGqX8'

// Real client
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  linkedin: string
  created_at?: string
}

export interface Product {
  id: string
  name: string
  category: string
  rate: number
  unit: string
  minOrder: number
  marginRate: number
  spec: string
  cert: string
  inventory: number
  created_at?: string
}

export interface Order {
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
  created_at?: string
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Swarnabha Ray',
    role: 'Co-Founder & Head of Business Operations',
    bio: 'Handling the Business Operations. ex-IEM UEM student, ex-Founder’s Officer at Techscholars, ex-Participant at Wadhwani Foundation, and NBT Speaker.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    linkedin: 'https://linkedin.com/in/swarnabha-ray',
  },
  {
    id: '2',
    name: 'Snehasish Das',
    role: 'Co-Founder & Head of Technology',
    bio: 'Handling the Technology. Former Microsoft Student Team Head at IEM UEM, Member of the Entrepreneurship Cell, and Wadhwani Incubatee.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    linkedin: 'https://linkedin.com/in/snehasish-das',
  },
]

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'butamine-vg40',
    name: 'VG40 Bulk Bitumen (Butamine)',
    category: 'Chemicals & Binders',
    rate: 50832,
    unit: 'MT',
    minOrder: 10,
    marginRate: 0.04,
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
    marginRate: 0.04,
    spec: 'Standard Viscosity Grade Bitumen for highways, airport runways. Meets IS 73:2013.',
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
    marginRate: 0.035,
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
    marginRate: 0.032,
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
    marginRate: 0.045,
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
    marginRate: 0.05,
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
    marginRate: 0.05,
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
    marginRate: 0.04,
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
    marginRate: 0.06,
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
    marginRate: 0.05,
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
    marginRate: 0.038,
    spec: 'High-strength thermo-mechanically treated reinforcement bars. Standard length 12m.',
    cert: 'QA-STEEL-TENSIL-TEST.pdf',
    inventory: 15000,
  },
]

// ============================================
// 1. TEAM MEMBERS UTILITIES
// ============================================

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    if (data && data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_team', JSON.stringify(data))
      }
      return data
    }

    // Supabase has 0 rows (empty table) - auto seed default team members to database
    console.log('Supabase team_members table is empty. Auto-seeding default team roster.')
    const { data: seededData, error: seedError } = await supabaseClient
      .from('team_members')
      .insert(DEFAULT_TEAM)
      .select()

    if (!seedError && seededData && seededData.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_team', JSON.stringify(seededData))
      }
      return seededData
    }
  } catch (err) {
    console.warn('Supabase team fetch/seed failed, falling back to localStorage:', err)
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('smebhawan_team')
    if (local) {
      try {
        return JSON.parse(local)
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem('smebhawan_team', JSON.stringify(DEFAULT_TEAM))
  }
  return DEFAULT_TEAM
}

export const addTeamMember = async (member: Omit<TeamMember, 'id' | 'created_at'>): Promise<TeamMember> => {
  const newId = Math.random().toString(36).substring(2, 9)
  const newMember: TeamMember = {
    ...member,
    id: newId,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabaseClient
      .from('team_members')
      .insert([newMember])
      .select()

    if (error) throw error
    if (data && data[0]) return data[0]
  } catch (err) {
    console.warn('Supabase team insert failed, syncing locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = await getTeamMembers()
    const updated = [...current, newMember]
    localStorage.setItem('smebhawan_team', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
  return newMember
}

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (err) {
    console.warn('Supabase team delete failed, syncing locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = await getTeamMembers()
    const updated = current.filter((m) => m.id !== id)
    localStorage.setItem('smebhawan_team', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
  return true
}

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalTeamUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase team update failed, updating locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = await getTeamMembers()
    const updated = current.map((m) => m.id === id ? { ...m, ...updates } : m)
    localStorage.setItem('smebhawan_team', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    return updated.find((m) => m.id === id) || null
  }
  return null
}

const triggerLocalTeamUpdate = (updatedMember: TeamMember) => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_team') || '[]')
    const updated = current.map((m: any) => m.id === updatedMember.id ? updatedMember : m)
    localStorage.setItem('smebhawan_team', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

// ============================================
// 2. PRODUCTS / COMMODITIES CATALOG UTILITIES
// ============================================

export const getDbProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error
    if (data && data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_products', JSON.stringify(data))
      }
      return data
    }

    // Database table is empty, auto-upload default products to Supabase
    console.log('Supabase products table is empty. Auto-seeding default materials catalog.')
    const { data: seededData, error: seedError } = await supabaseClient
      .from('products')
      .insert(DEFAULT_PRODUCTS)
      .select()

    if (!seedError && seededData && seededData.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_products', JSON.stringify(seededData))
      }
      return seededData
    }
  } catch (err) {
    console.warn('Supabase products fetch/seed failed, falling back to local:', err)
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('smebhawan_products')
    if (local) {
      try {
        return JSON.parse(local)
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem('smebhawan_products', JSON.stringify(DEFAULT_PRODUCTS))
  }
  return DEFAULT_PRODUCTS
}

export const updateDbProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalProductsUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase product update failed, syncing locally:', err)
  }

  if (typeof window !== 'undefined') {
    const localProducts = await getDbProducts()
    const updatedProducts = localProducts.map((p) => (p.id === id ? { ...p, ...updates } : p))
    localStorage.setItem('smebhawan_products', JSON.stringify(updatedProducts))
    window.dispatchEvent(new Event('storage'))
    return updatedProducts.find((p) => p.id === id) || null
  }
  return null
}

const triggerLocalProductsUpdate = (updatedProd: Product) => {
  if (typeof window !== 'undefined') {
    const localProducts = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
    const updated = localProducts.map((p: any) => (p.id === updatedProd.id ? updatedProd : p))
    localStorage.setItem('smebhawan_products', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

// ============================================
// 3. PROCUREMENT ORDERS UTILITIES
// ============================================

export const getDbOrders = async (): Promise<Order[]> => {
  let localOrders: Order[] = []
  if (typeof window !== 'undefined') {
    try {
      localOrders = JSON.parse(localStorage.getItem('smebhawan_orders') || '[]')
    } catch (e) {
      // ignore
    }
  }

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error

    if (data) {
      // Sync localStorage orders to Supabase backend automatically!
      if (localOrders.length > 0) {
        const dbOrderIds = new Set(data.map((o) => o.orderId))
        const unsynced = localOrders.filter((o) => !dbOrderIds.has(o.orderId))
        
        if (unsynced.length > 0) {
          console.log(`Syncing ${unsynced.length} local orders to Supabase database.`)
          const { error: syncError } = await supabaseClient
            .from('orders')
            .insert(unsynced)
          
          if (!syncError) {
            const { data: syncedList } = await supabaseClient
              .from('orders')
              .select('*')
              .order('date', { ascending: false })
            if (syncedList) {
              if (typeof window !== 'undefined') {
                localStorage.setItem('smebhawan_orders', JSON.stringify(syncedList))
              }
              return syncedList
            }
          }
        }
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_orders', JSON.stringify(data))
      }
      return data
    }
  } catch (err) {
    console.warn('Supabase orders fetch failed, falling back to localStorage:', err)
  }

  return localOrders
}

export const placeDbOrder = async (order: Order): Promise<Order> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([order])
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalOrdersUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase order insert failed, saving locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_orders') || '[]')
    const updated = [order, ...current]
    localStorage.setItem('smebhawan_orders', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
  return order
}

export const updateDbOrder = async (orderId: string, updates: Partial<Order>): Promise<Order | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .update(updates)
      .eq('orderId', orderId)
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalOrdersUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase order update failed, updating locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_orders') || '[]')
    const updated = current.map((o: any) => o.orderId === orderId ? { ...o, ...updates } : o)
    localStorage.setItem('smebhawan_orders', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    return updated.find((o: any) => o.orderId === orderId) || null
  }
  return null
}

const triggerLocalOrdersUpdate = (updatedOrder: Order) => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_orders') || '[]')
    const hasOrder = current.some((o: any) => o.orderId === updatedOrder.orderId)
    const updated = hasOrder 
      ? current.map((o: any) => o.orderId === updatedOrder.orderId ? updatedOrder : o)
      : [updatedOrder, ...current]
    localStorage.setItem('smebhawan_orders', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

// ============================================
// 4. CONTACTS / DOUBTS UTILITIES
// ============================================

export interface Doubt {
  id: string
  name: string
  email: string
  mobile: string
  subject: string
  message: string
  reply: string | null
  replied_at: string | null
  created_at: string
}

export const getDbDoubts = async (): Promise<Doubt[]> => {
  let localDoubts: Doubt[] = []
  if (typeof window !== 'undefined') {
    try {
      localDoubts = JSON.parse(localStorage.getItem('smebhawan_doubts') || '[]')
    } catch (e) {
      // ignore
    }
  }

  try {
    const { data, error } = await supabaseClient
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    if (data) {
      if (localDoubts.length > 0) {
        const dbIds = new Set(data.map((d) => d.id))
        const unsynced = localDoubts.filter((d) => !dbIds.has(d.id))
        if (unsynced.length > 0) {
          console.log(`Syncing ${unsynced.length} unsynced doubts to Supabase.`)
          const { error: syncError } = await supabaseClient
            .from('doubts')
            .insert(unsynced)
          
          if (!syncError) {
            const { data: syncedList } = await supabaseClient
              .from('doubts')
              .select('*')
              .order('created_at', { ascending: false })
            if (syncedList) {
              if (typeof window !== 'undefined') {
                localStorage.setItem('smebhawan_doubts', JSON.stringify(syncedList))
              }
              return syncedList
            }
          }
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_doubts', JSON.stringify(data))
      }
      return data
    }
  } catch (err) {
    console.warn('Supabase doubts fetch failed, falling back to local:', err)
  }

  return localDoubts
}

export const sendDbDoubt = async (doubt: Omit<Doubt, 'id' | 'reply' | 'replied_at' | 'created_at'>): Promise<Doubt> => {
  const newDoubt: Doubt = {
    ...doubt,
    id: 'DB-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    reply: null,
    replied_at: null,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabaseClient
      .from('doubts')
      .insert([newDoubt])
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalDoubtsUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase doubt insert failed, saving locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_doubts') || '[]')
    const updated = [newDoubt, ...current]
    localStorage.setItem('smebhawan_doubts', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
  return newDoubt
}

export const replyDbDoubt = async (id: string, replyText: string): Promise<Doubt | null> => {
  const updates = {
    reply: replyText,
    replied_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabaseClient
      .from('doubts')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalDoubtsUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase doubt reply failed, updating locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_doubts') || '[]')
    const updated = current.map((d: any) => d.id === id ? { ...d, ...updates } : d)
    localStorage.setItem('smebhawan_doubts', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    return updated.find((d: any) => d.id === id) || null
  }
  return null
}

const triggerLocalDoubtsUpdate = (updatedDoubt: Doubt) => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_doubts') || '[]')
    const hasDoubt = current.some((d: any) => d.id === updatedDoubt.id)
    const updated = hasDoubt
      ? current.map((d: any) => d.id === updatedDoubt.id ? updatedDoubt : d)
      : [updatedDoubt, ...current]
    localStorage.setItem('smebhawan_doubts', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

// ============================================
// 5. USER PROFILES & OTP SECURITY UTILITIES
// ============================================

export interface UserProfile {
  id: string
  name: string
  place: string
  email: string
  phone: string
  companyName: string
  gstin: string
  role: 'customer' | 'supplier'
  status: 'pending' | 'verified'
  created_at: string
}

export interface OTPEntry {
  id: string
  email: string
  code: string
  expires_at: string
}

export const getDbUsers = async (role?: 'customer' | 'supplier'): Promise<UserProfile[]> => {
  let localUsers: UserProfile[] = []
  if (typeof window !== 'undefined') {
    try {
      localUsers = JSON.parse(localStorage.getItem('smebhawan_users') || '[]')
    } catch (e) {
      // ignore
    }
  }

  try {
    let query = supabaseClient.from('users_profiles').select('*')
    if (role) {
      query = query.eq('role', role)
    }
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    if (data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_users', JSON.stringify(data))
      }
      return data
    }
  } catch (err) {
    console.warn('Supabase users profiles query failed, using local cache:', err)
  }

  if (role) {
    return localUsers.filter((u) => u.role === role)
  }
  return localUsers
}

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at'>): Promise<UserProfile> => {
  const existing = await getUserProfileByEmail(profile.email)
  if (existing) {
    throw new Error(`Email ${profile.email} is already registered under the role: ${existing.role}`)
  }

  const newUser: UserProfile = {
    ...profile,
    id: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabaseClient
      .from('users_profiles')
      .insert([newUser])
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalUserUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase user profile insertion failed, storing locally:', err)
  }

  triggerLocalUserUpdate(newUser)
  return newUser
}

export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('users_profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (error) throw error
    if (data) return data
  } catch (err) {
    console.warn('Supabase profile query failed, using local search:', err)
  }

  if (typeof window !== 'undefined') {
    const local: UserProfile[] = JSON.parse(localStorage.getItem('smebhawan_users') || '[]')
    const match = local.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase())
    return match || null
  }
  return null
}

export const updateUserProfile = async (id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  if (updates.email) {
    const existing = await getUserProfileByEmail(updates.email)
    if (existing && existing.id !== id) {
      throw new Error(`Email ${updates.email} is already registered.`)
    }
  }

  try {
    const { data, error } = await supabaseClient
      .from('users_profiles')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalUserUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase profile update failed, updating locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_users') || '[]')
    const updated = current.map((u: any) => u.id === id ? { ...u, ...updates } : u)
    localStorage.setItem('smebhawan_users', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    return updated.find((u: any) => u.id === id) || null
  }
  return null
}

export const terminateUserProfile = async (id: string): Promise<boolean> => {
  let emailToDelete: string | null = null

  try {
    const { data: userProfile } = await supabaseClient
      .from('users_profiles')
      .select('email')
      .eq('id', id)
      .maybeSingle()

    if (userProfile?.email) {
      emailToDelete = userProfile.email
    }

    await supabaseClient
      .from('users_profiles')
      .delete()
      .eq('id', id)

    if (emailToDelete) {
      await supabaseClient
        .from('products')
        .delete()
        .eq('supplierEmail', emailToDelete)

      await supabaseClient
        .from('pending_products')
        .delete()
        .eq('supplierEmail', emailToDelete)

      if (typeof window !== 'undefined') {
        const currentProds = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
        const filteredProds = currentProds.filter((p: any) => p.supplierEmail !== emailToDelete)
        localStorage.setItem('smebhawan_products', JSON.stringify(filteredProds))

        const currentPending = JSON.parse(localStorage.getItem('smebhawan_pending_products') || '[]')
        const filteredPending = currentPending.filter((p: any) => p.supplierEmail !== emailToDelete)
        localStorage.setItem('smebhawan_pending_products', JSON.stringify(filteredPending))
        window.dispatchEvent(new Event('storage'))
      }
    }

    removeLocalUser(id)
    return true
  } catch (err) {
    console.warn('Supabase profile deletion failed, deleting locally:', err)
  }

  if (typeof window !== 'undefined') {
    try {
      const currentUsers = JSON.parse(localStorage.getItem('smebhawan_users') || '[]')
      const targetUser = currentUsers.find((u: any) => u.id === id)
      if (targetUser && targetUser.email) {
        const email = targetUser.email
        const currentProds = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
        const filteredProds = currentProds.filter((p: any) => p.supplierEmail !== email)
        localStorage.setItem('smebhawan_products', JSON.stringify(filteredProds))

        const currentPending = JSON.parse(localStorage.getItem('smebhawan_pending_products') || '[]')
        const filteredPending = currentPending.filter((p: any) => p.supplierEmail !== email)
        localStorage.setItem('smebhawan_pending_products', JSON.stringify(filteredPending))
        window.dispatchEvent(new Event('storage'))
      }
    } catch (e) {}
  }

  removeLocalUser(id)
  return true
}

const triggerLocalUserUpdate = (user: UserProfile) => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_users') || '[]')
    const hasUser = current.some((u: any) => u.id === user.id)
    const updated = hasUser
      ? current.map((u: any) => u.id === user.id ? user : u)
      : [user, ...current]
    localStorage.setItem('smebhawan_users', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

const removeLocalUser = (id: string) => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_users') || '[]')
    const updated = current.filter((u: any) => u.id !== id)
    localStorage.setItem('smebhawan_users', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

// OTP UTILITIES
export const createOTP = async (email: string, code: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min expiry
  const otpEntry = {
    id: 'OTP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    email: email.trim().toLowerCase(),
    code,
    expires_at: expiresAt,
  }

  try {
    await supabaseClient
      .from('otps')
      .delete()
      .eq('email', email.trim().toLowerCase())

    const { error } = await supabaseClient
      .from('otps')
      .insert([otpEntry])

    if (error) throw error
    return
  } catch (err) {
    console.warn('Supabase OTP insertion failed, storing locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_otps') || '[]')
    const filtered = current.filter((o: any) => o.email !== email.trim().toLowerCase())
    localStorage.setItem('smebhawan_otps', JSON.stringify([otpEntry, ...filtered]))
  }
}

export const verifyOTP = async (email: string, code: string): Promise<boolean> => {
  const cleanEmail = email.trim().toLowerCase()
  const cleanCode = code.trim()

  try {
    const { data, error } = await supabaseClient
      .from('otps')
      .select('*')
      .eq('email', cleanEmail)
      .eq('code', cleanCode)

    if (error) throw error

    if (data && data.length > 0) {
      const match = data[0]
      const expired = new Date(match.expires_at).getTime() < Date.now()
      await supabaseClient
        .from('otps')
        .delete()
        .eq('id', match.id)

      return !expired
    }
  } catch (err) {
    console.warn('Supabase OTP query failed, using local validation:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_otps') || '[]')
    const match = current.find((o: any) => o.email === cleanEmail && o.code === cleanCode)
    if (match) {
      const expired = new Date(match.expires_at).getTime() < Date.now()
      const updated = current.filter((o: any) => o.id !== match.id)
      localStorage.setItem('smebhawan_otps', JSON.stringify(updated))
      return !expired
    }
  }
  return false
}

// ============================================
// 6. SUPPLIER MATERIAL LISTINGS & APPROVALS
// ============================================

export interface PendingProduct {
  id?: string // if editing existing product
  tempId: string
  name: string
  category: string
  rate: number
  unit: string
  minOrder: number
  marginRate: number
  spec: string
  cert: string
  inventory: number
  supplierEmail: string
  supplierCompany: string
  type: 'new' | 'edit'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export const getPendingProducts = async (): Promise<PendingProduct[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('pending_products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    if (data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smebhawan_pending_products', JSON.stringify(data))
      }
      return data
    }
  } catch (err) {
    console.warn('Supabase pending products fetch failed, using local cache:', err)
  }

  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('smebhawan_pending_products') || '[]')
    } catch (e) {
      // ignore
    }
  }
  return []
}

export const createPendingProduct = async (
  pending: Omit<PendingProduct, 'tempId' | 'status' | 'created_at'>
): Promise<PendingProduct> => {
  const newPending: PendingProduct = {
    ...pending,
    tempId: 'PEND-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabaseClient
      .from('pending_products')
      .insert([newPending])
      .select()

    if (error) throw error
    if (data && data[0]) {
      triggerLocalPendingProductsUpdate(data[0])
      return data[0]
    }
  } catch (err) {
    console.warn('Supabase pending products insert failed, saving locally:', err)
  }

  triggerLocalPendingProductsUpdate(newPending)
  return newPending
}

export const updatePendingProductStatus = async (
  tempId: string,
  status: 'approved' | 'rejected'
): Promise<PendingProduct | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('pending_products')
      .update({ status })
      .eq('tempId', tempId)
      .select()

    if (error) throw error
    if (data && data[0]) {
      const pendingProduct = data[0]
      triggerLocalPendingProductsUpdate(pendingProduct)

      if (status === 'approved') {
        if (pendingProduct.type === 'new') {
          const newProdId = pendingProduct.id || 'prod-' + Math.random().toString(36).substring(2, 9)
          const newProduct: Product = {
            id: newProdId,
            name: pendingProduct.name,
            category: pendingProduct.category,
            rate: pendingProduct.rate,
            unit: pendingProduct.unit,
            minOrder: pendingProduct.minOrder,
            marginRate: pendingProduct.marginRate || 0.04,
            spec: pendingProduct.spec,
            cert: pendingProduct.cert,
            inventory: pendingProduct.inventory,
          }
          await supabaseClient.from('products').insert([newProduct])
          
          if (typeof window !== 'undefined') {
            const currentProds = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
            localStorage.setItem('smebhawan_products', JSON.stringify([newProduct, ...currentProds]))
            window.dispatchEvent(new Event('storage'))
          }
        } else if (pendingProduct.type === 'edit' && pendingProduct.id) {
          const updates = {
            rate: pendingProduct.rate,
            inventory: pendingProduct.inventory,
            spec: pendingProduct.spec,
          }
          await supabaseClient.from('products').update(updates).eq('id', pendingProduct.id)

          if (typeof window !== 'undefined') {
            const currentProds = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
            const updatedProds = currentProds.map((p: any) => p.id === pendingProduct.id ? { ...p, ...updates } : p)
            localStorage.setItem('smebhawan_products', JSON.stringify(updatedProds))
            window.dispatchEvent(new Event('storage'))
          }
        }
      }

      return pendingProduct
    }
  } catch (err) {
    console.warn('Supabase pending products status update failed, syncing locally:', err)
  }

  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_pending_products') || '[]')
    const updated = current.map((p: any) => (p.tempId === tempId ? { ...p, status } : p))
    localStorage.setItem('smebhawan_pending_products', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    
    const pendingProduct = updated.find((p: any) => p.tempId === tempId) || null
    if (pendingProduct && status === 'approved') {
      if (pendingProduct.type === 'new') {
        const newProdId = pendingProduct.id || 'prod-' + Math.random().toString(36).substring(2, 9)
        const newProduct: Product = {
          id: newProdId,
          name: pendingProduct.name,
          category: pendingProduct.category,
          rate: pendingProduct.rate,
          unit: pendingProduct.unit,
          minOrder: pendingProduct.minOrder,
          marginRate: pendingProduct.marginRate || 0.04,
          spec: pendingProduct.spec,
          cert: pendingProduct.cert,
          inventory: pendingProduct.inventory,
        }
        const currentProds = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
        localStorage.setItem('smebhawan_products', JSON.stringify([newProduct, ...currentProds]))
        window.dispatchEvent(new Event('storage'))
      } else if (pendingProduct.type === 'edit' && pendingProduct.id) {
        const updates = {
          rate: pendingProduct.rate,
          inventory: pendingProduct.inventory,
          spec: pendingProduct.spec,
        }
        const currentProds = JSON.parse(localStorage.getItem('smebhawan_products') || '[]')
        const updatedProds = currentProds.map((p: any) => p.id === pendingProduct.id ? { ...p, ...updates } : p)
        localStorage.setItem('smebhawan_products', JSON.stringify(updatedProds))
        window.dispatchEvent(new Event('storage'))
      }
    }

    return pendingProduct
  }
  return null
}

const triggerLocalPendingProductsUpdate = (p: PendingProduct) => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('smebhawan_pending_products') || '[]')
    const exists = current.some((x: any) => x.tempId === p.tempId)
    const updated = exists
      ? current.map((x: any) => (x.tempId === p.tempId ? p : x))
      : [p, ...current]
    localStorage.setItem('smebhawan_pending_products', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
}

