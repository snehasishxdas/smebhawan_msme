-- SQL Schema for SMEBhawan MSME Application
-- Copy and run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/byzrociqsrniqjquhstu/editor)

-- 1. Create users_profiles table
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier', 'admin')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    "companyName" TEXT,
    gstin TEXT,
    place TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create otps table
CREATE TABLE IF NOT EXISTS public.otps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    "minOrder" NUMERIC NOT NULL,
    "marginRate" NUMERIC DEFAULT 0.04 NOT NULL,
    spec TEXT,
    cert TEXT,
    inventory NUMERIC NOT NULL,
    "supplierEmail" TEXT
);

-- 4. Create pending_products table
CREATE TABLE IF NOT EXISTS public.pending_products (
    "tempId" TEXT PRIMARY KEY,
    id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    "minOrder" NUMERIC NOT NULL,
    "marginRate" NUMERIC DEFAULT 0.04 NOT NULL,
    spec TEXT,
    cert TEXT,
    inventory NUMERIC NOT NULL,
    "supplierEmail" TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('new', 'edit')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT NOT NULL,
    "supplierEmail" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    rate NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create doubts table
CREATE TABLE IF NOT EXISTS public.doubts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'replied')),
    "replyText" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable row-level security (RLS) bypass or grant permissions to anon and service_role
ALTER TABLE public.users_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.users_profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.otps TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.pending_products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.doubts TO anon, authenticated, service_role;
