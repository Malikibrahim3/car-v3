-- Vehicle Reference Data Cache Table
CREATE TABLE IF NOT EXISTS vehicle_reference (
  id SERIAL PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT,
  trim TEXT,
  year INTEGER,
  data_type TEXT NOT NULL CHECK (data_type IN ('make', 'model', 'trim', 'year')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make ON vehicle_reference(make);
CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make_model ON vehicle_reference(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make_model_trim ON vehicle_reference(make, model, trim);
CREATE INDEX IF NOT EXISTS idx_vehicle_reference_data_type ON vehicle_reference(data_type);

-- Vehicle Values Cache Table
CREATE TABLE IF NOT EXISTS car_values (
  id SERIAL PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER NOT NULL,
  cached_value JSONB NOT NULL,
  last_fetched TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(make, model, trim, year)
);

-- Create indexes for fast value lookups
CREATE INDEX IF NOT EXISTS idx_car_values_vehicle ON car_values(make, model, trim, year);
CREATE INDEX IF NOT EXISTS idx_car_values_last_fetched ON car_values(last_fetched);

-- API Call Tracking Table (to monitor usage)
CREATE TABLE IF NOT EXISTS api_call_log (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  make TEXT,
  model TEXT,
  trim TEXT,
  year INTEGER,
  success BOOLEAN DEFAULT TRUE,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for API monitoring
CREATE INDEX IF NOT EXISTS idx_api_call_log_created_at ON api_call_log(created_at);
CREATE INDEX IF NOT EXISTS idx_api_call_log_endpoint ON api_call_log(endpoint);