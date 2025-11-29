/**
 * Mock Cars Data - Updated for "Optimal Sell Time" Focus
 * 
 * Includes:
 * - Finance type (PCP/HP/Cash)
 * - Balloon payments for PCP
 * - Months elapsed
 * - Realistic depreciation scenarios
 */

export const mockCars = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    type: 'electric',
    mileage: 28500,
    purchaseDate: '2022-06-15',
    purchasePrice: 48000,
    apiCalibratedValue: 38000, // Depreciated from purchase
    estimatedAnnualMileage: 12000,
    
    // Finance details - PCP
    ownershipType: 'pcp',
    deposit: 5000,
    loanAmount: 43000,           // Original loan
    termMonths: 48,
    interestRate: 6.9,
    monthlyPayment: 450,
    balloonPayment: 18000,       // GMFV
    startDate: '2022-06-15',
    firstPaymentDate: '2022-07-15',
    monthsElapsed: 29,           // ~2.5 years in
    
    color: 'primary',
  },
  {
    id: '2',
    make: 'BMW',
    model: '3 Series',
    year: 2021,
    type: 'luxury_sedan',
    mileage: 38200,
    purchaseDate: '2021-09-10',
    purchasePrice: 42000,
    apiCalibratedValue: 28000,
    estimatedAnnualMileage: 12000,
    
    // Finance details - HP
    ownershipType: 'hp',
    deposit: 8000,
    loanAmount: 34000,
    termMonths: 60,
    interestRate: 5.9,
    monthlyPayment: 680,
    balloonPayment: 0,           // No balloon for HP
    startDate: '2021-09-10',
    firstPaymentDate: '2021-10-10',
    monthsElapsed: 38,
    
    color: 'secondary',
  },
  {
    id: '3',
    make: 'Lamborghini',
    model: 'Urus',
    year: 2023,
    type: 'exotic',
    mileage: 12500,
    purchaseDate: '2023-02-20',
    purchasePrice: 245000,
    apiCalibratedValue: 225000,
    estimatedAnnualMileage: 8000,
    
    // Finance details - PCP (exotic)
    ownershipType: 'pcp',
    deposit: 50000,
    loanAmount: 195000,
    termMonths: 48,
    interestRate: 4.9,
    monthlyPayment: 2200,
    balloonPayment: 125000,      // High balloon for exotic
    startDate: '2023-02-20',
    firstPaymentDate: '2023-03-20',
    monthsElapsed: 21,
    
    color: 'warning',
  },
  {
    id: '4',
    make: 'BMW',
    model: 'X5 xDrive40i M Sport',
    year: 2021,
    type: 'luxury_suv',
    mileage: 42000,
    purchaseDate: '2021-01-25',
    purchasePrice: 72000,
    apiCalibratedValue: 43000,
    estimatedAnnualMileage: 12000,
    
    // Finance details - PCP near end
    ownershipType: 'pcp',
    deposit: 7000,
    loanAmount: 65000,
    termMonths: 48,
    interestRate: 5.9,
    monthlyPayment: 750,
    balloonPayment: 28000,
    startDate: '2021-01-25',
    firstPaymentDate: '2021-02-25',
    monthsElapsed: 46,           // Near contract end!
    
    color: 'info',
  },
  {
    id: '5',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    type: 'economy',
    mileage: 15000,
    purchaseDate: '2023-06-01',
    purchasePrice: 28000,
    apiCalibratedValue: 24000,
    estimatedAnnualMileage: 10000,
    
    // Finance details - HP (economy)
    ownershipType: 'hp',
    deposit: 3000,
    loanAmount: 25000,
    termMonths: 48,
    interestRate: 7.9,
    monthlyPayment: 610,
    balloonPayment: 0,
    startDate: '2023-06-01',
    firstPaymentDate: '2023-07-01',
    monthsElapsed: 17,
    
    color: 'success',
  },
];

/**
 * Demo scenarios for testing different equity positions
 */
export const demoScenarios = {
  // User in negative equity (early in contract)
  negativeEquity: {
    ...mockCars[0],
    monthsElapsed: 6,
    mileage: 8000,
  },
  
  // User at break-even point
  breakEven: {
    ...mockCars[1],
    monthsElapsed: 30,
  },
  
  // User in positive equity (sweet spot)
  positiveEquity: {
    ...mockCars[0],
    monthsElapsed: 36,
    mileage: 35000,
  },
  
  // User near PCP end (apathy warning scenario)
  nearPcpEnd: {
    ...mockCars[3],
    monthsElapsed: 46,
  },
  
  // Cash buyer (no finance)
  cashBuyer: {
    id: '99',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    type: 'economy',
    mileage: 20000,
    purchaseDate: '2022-03-01',
    purchasePrice: 25000,
    apiCalibratedValue: 21000,
    ownershipType: 'cash',
    deposit: 25000,
    loanAmount: 0,
    termMonths: 0,
    interestRate: 0,
    monthlyPayment: 0,
    balloonPayment: 0,
    monthsElapsed: 0,
  },
};
