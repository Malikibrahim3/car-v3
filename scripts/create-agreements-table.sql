-- Create agreements table for storing parsed finance agreements
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File metadata
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  
  -- Customer information
  customer_name TEXT,
  customer_address TEXT,
  customer_postcode TEXT,
  
  -- Vehicle information
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year TEXT,
  vehicle_vin TEXT,
  vehicle_registration TEXT,
  
  -- Price information
  total_price DECIMAL(10, 2),
  deposit DECIMAL(10, 2),
  amount_financed DECIMAL(10, 2),
  trade_in_value DECIMAL(10, 2),
  
  -- Finance information
  monthly_payment DECIMAL(10, 2),
  term_months INTEGER,
  apr DECIMAL(5, 2),
  interest_rate DECIMAL(5, 2),
  balloon_payment DECIMAL(10, 2),
  final_payment DECIMAL(10, 2),
  
  -- Totals
  total_payable DECIMAL(10, 2),
  total_charge DECIMAL(10, 2),
  total_interest DECIMAL(10, 2),
  
  -- Mileage information
  mileage_allowance INTEGER,
  excess_mileage_charge DECIMAL(5, 2),
  
  -- Fees
  arrangement_fee DECIMAL(10, 2),
  documentation_fee DECIMAL(10, 2),
  option_to_purchase_fee DECIMAL(10, 2),
  
  -- Parsing metadata
  confidence_score DECIMAL(3, 2),
  parsing_notes TEXT[],
  parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full parsed data (JSON)
  parsed_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agreements_user_id ON agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_agreements_parsed_at ON agreements(parsed_at DESC);
CREATE INDEX IF NOT EXISTS idx_agreements_vehicle_make ON agreements(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_agreements_vehicle_registration ON agreements(vehicle_registration);

-- Enable Row Level Security
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own agreements
CREATE POLICY "Users can view own agreements"
  ON agreements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own agreements
CREATE POLICY "Users can insert own agreements"
  ON agreements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own agreements
CREATE POLICY "Users can update own agreements"
  ON agreements FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own agreements
CREATE POLICY "Users can delete own agreements"
  ON agreements FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_agreements_updated_at
  BEFORE UPDATE ON agreements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON agreements TO authenticated;
GRANT ALL ON agreements TO service_role;

COMMENT ON TABLE agreements IS 'Stores parsed finance agreement data from uploaded PDFs';
COMMENT ON COLUMN agreements.confidence_score IS 'Parsing confidence score from 0 to 1';
COMMENT ON COLUMN agreements.parsed_data IS 'Full parsed data structure as JSON';
