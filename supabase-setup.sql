-- CarValue App - Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. USERS TABLE (extends auth.users)
-- ============================================
-- Note: Supabase auth.users table is automatically created
-- We'll create a profiles table to extend it

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ============================================
-- 2. VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic vehicle info
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  
  -- Financial info
  purchase_price DECIMAL(10, 2) NOT NULL,
  purchase_date DATE,
  current_value DECIMAL(10, 2),
  api_calibrated_value DECIMAL(10, 2),
  
  -- Ownership info
  ownership_type TEXT DEFAULT 'cash', -- cash, loan, pcp, lease
  
  -- Loan details
  loan_amount DECIMAL(10, 2) DEFAULT 0,
  monthly_payment DECIMAL(10, 2) DEFAULT 0,
  deposit DECIMAL(10, 2) DEFAULT 0,
  interest_rate DECIMAL(5, 2) DEFAULT 0,
  loan_term INTEGER DEFAULT 0, -- months
  start_date DATE,
  balloon_payment DECIMAL(10, 2) DEFAULT 0,
  documentation_fee DECIMAL(10, 2) DEFAULT 0,
  
  -- Additional info
  mileage INTEGER DEFAULT 0,
  color TEXT,
  vin TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles policies: Users can only see and manage their own vehicles
CREATE POLICY "Users can view own vehicles" 
  ON public.vehicles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" 
  ON public.vehicles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" 
  ON public.vehicles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" 
  ON public.vehicles FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS vehicles_user_id_idx ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS vehicles_created_at_idx ON public.vehicles(created_at DESC);

-- ============================================
-- 3. VEHICLE VALUE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vehicle_value_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  value DECIMAL(10, 2) NOT NULL,
  source TEXT DEFAULT 'manual', -- manual, api, estimated
  notes TEXT,
  
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vehicle_value_history ENABLE ROW LEVEL SECURITY;

-- Value history policies
CREATE POLICY "Users can view own value history" 
  ON public.vehicle_value_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own value history" 
  ON public.vehicle_value_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS value_history_vehicle_id_idx ON public.vehicle_value_history(vehicle_id);
CREATE INDEX IF NOT EXISTS value_history_recorded_at_idx ON public.vehicle_value_history(recorded_at DESC);

-- ============================================
-- 4. USER PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Notification preferences
  equity_alerts BOOLEAN DEFAULT true,
  payment_reminders BOOLEAN DEFAULT true,
  weekly_summary BOOLEAN DEFAULT false,
  
  -- Display preferences
  currency TEXT DEFAULT 'USD',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  theme TEXT DEFAULT 'light', -- light, dark, auto
  
  -- Privacy preferences
  analytics_enabled BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Preferences policies
CREATE POLICY "Users can view own preferences" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own preferences" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own preferences" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at 
  BEFORE UPDATE ON public.vehicles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON public.user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO public.user_preferences (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. INSERT TEST USER (for development)
-- ============================================
-- Note: This creates a test user with the credentials you specified
-- Email: admin@gmail.com
-- Password: Boyo1996!

-- First, you need to create the user in Supabase Auth UI or via API
-- Then run this to create their profile:

-- INSERT INTO public.profiles (id, email, full_name)
-- VALUES (
--   'test-user-id', -- Replace with actual user ID from auth.users
--   'admin@gmail.com',
--   'Test User'
-- ) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- To verify setup, run:
-- SELECT * FROM public.profiles;
-- SELECT * FROM public.vehicles;
-- SELECT * FROM public.vehicle_value_history;
-- SELECT * FROM public.user_preferences;
