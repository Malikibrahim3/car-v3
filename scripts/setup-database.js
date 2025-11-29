/**
 * Database Setup Script
 * Creates the necessary tables in Supabase for vehicle caching
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createTables = async () => {
  console.log('🚀 Setting up database tables...');

  try {
    // Create vehicle_reference table
    console.log('📋 Creating vehicle_reference table...');
    const { error: refTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (refTableError) {
      console.error('❌ Failed to create vehicle_reference table:', refTableError);
    } else {
      console.log('✅ vehicle_reference table created');
    }

    // Create indexes for vehicle_reference
    console.log('📋 Creating indexes for vehicle_reference...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make ON vehicle_reference(make);',
      'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make_model ON vehicle_reference(make, model);',
      'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make_model_trim ON vehicle_reference(make, model, trim);',
      'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_data_type ON vehicle_reference(data_type);'
    ];

    for (const indexSql of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (error) {
        console.error('❌ Failed to create index:', error);
      }
    }

    // Create car_values table
    console.log('📋 Creating car_values table...');
    const { error: valuesTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (valuesTableError) {
      console.error('❌ Failed to create car_values table:', valuesTableError);
    } else {
      console.log('✅ car_values table created');
    }

    // Create indexes for car_values
    console.log('📋 Creating indexes for car_values...');
    const valueIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_car_values_vehicle ON car_values(make, model, trim, year);',
      'CREATE INDEX IF NOT EXISTS idx_car_values_last_fetched ON car_values(last_fetched);'
    ];

    for (const indexSql of valueIndexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (error) {
        console.error('❌ Failed to create index:', error);
      }
    }

    // Create api_call_log table
    console.log('📋 Creating api_call_log table...');
    const { error: logTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (logTableError) {
      console.error('❌ Failed to create api_call_log table:', logTableError);
    } else {
      console.log('✅ api_call_log table created');
    }

    // Create indexes for api_call_log
    console.log('📋 Creating indexes for api_call_log...');
    const logIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_api_call_log_created_at ON api_call_log(created_at);',
      'CREATE INDEX IF NOT EXISTS idx_api_call_log_endpoint ON api_call_log(endpoint);'
    ];

    for (const indexSql of logIndexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (error) {
        console.error('❌ Failed to create index:', error);
      }
    }

    console.log('\n🎉 Database setup complete!');
    console.log('📊 Tables created:');
    console.log('  - vehicle_reference (for makes, models, trims, years)');
    console.log('  - car_values (for cached valuations)');
    console.log('  - api_call_log (for monitoring API usage)');

    // Test the tables
    console.log('\n🔍 Testing table access...');
    
    const { data: refTest, error: refTestError } = await supabase
      .from('vehicle_reference')
      .select('id')
      .limit(1);

    const { data: valTest, error: valTestError } = await supabase
      .from('car_values')
      .select('id')
      .limit(1);

    const { data: logTest, error: logTestError } = await supabase
      .from('api_call_log')
      .select('id')
      .limit(1);

    if (!refTestError && !valTestError && !logTestError) {
      console.log('✅ All tables accessible');
    } else {
      console.log('⚠️ Some tables may have access issues');
      if (refTestError) console.log('  - vehicle_reference:', refTestError.message);
      if (valTestError) console.log('  - car_values:', valTestError.message);
      if (logTestError) console.log('  - api_call_log:', logTestError.message);
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Alternative method using direct SQL execution
const createTablesDirectSQL = async () => {
  console.log('🚀 Setting up database tables (Direct SQL method)...');

  const sqlCommands = [
    // Create vehicle_reference table
    `CREATE TABLE IF NOT EXISTS vehicle_reference (
      id SERIAL PRIMARY KEY,
      make TEXT NOT NULL,
      model TEXT,
      trim TEXT,
      year INTEGER,
      data_type TEXT NOT NULL CHECK (data_type IN ('make', 'model', 'trim', 'year')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`,

    // Create car_values table
    `CREATE TABLE IF NOT EXISTS car_values (
      id SERIAL PRIMARY KEY,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      trim TEXT,
      year INTEGER NOT NULL,
      cached_value JSONB NOT NULL,
      last_fetched TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(make, model, trim, year)
    );`,

    // Create api_call_log table
    `CREATE TABLE IF NOT EXISTS api_call_log (
      id SERIAL PRIMARY KEY,
      endpoint TEXT NOT NULL,
      make TEXT,
      model TEXT,
      trim TEXT,
      year INTEGER,
      success BOOLEAN DEFAULT TRUE,
      response_time_ms INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );`,

    // Create indexes
    'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make ON vehicle_reference(make);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make_model ON vehicle_reference(make, model);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_make_model_trim ON vehicle_reference(make, model, trim);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_reference_data_type ON vehicle_reference(data_type);',
    'CREATE INDEX IF NOT EXISTS idx_car_values_vehicle ON car_values(make, model, trim, year);',
    'CREATE INDEX IF NOT EXISTS idx_car_values_last_fetched ON car_values(last_fetched);',
    'CREATE INDEX IF NOT EXISTS idx_api_call_log_created_at ON api_call_log(created_at);',
    'CREATE INDEX IF NOT EXISTS idx_api_call_log_endpoint ON api_call_log(endpoint);'
  ];

  console.log('\n📋 SQL Commands to execute in Supabase SQL Editor:');
  console.log('=' .repeat(60));
  console.log(sqlCommands.join('\n\n'));
  console.log('=' .repeat(60));
  
  console.log('\n📝 Instructions:');
  console.log('1. Copy the SQL commands above');
  console.log('2. Go to your Supabase dashboard');
  console.log('3. Navigate to SQL Editor');
  console.log('4. Paste and execute the commands');
  console.log('5. Run this script again to verify setup');
};

// Run setup
if (process.argv.includes('--sql-only')) {
  createTablesDirectSQL();
} else {
  createTables();
}