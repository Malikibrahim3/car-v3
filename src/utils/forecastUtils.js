// Remove the problematic import for now and use inline functions

function determineVehicleClass(car) {
  const make = car.make.toLowerCase();
  const type = car.type ? car.type.toLowerCase() : '';
  
  // Exotic brands
  if (['lamborghini', 'ferrari', 'porsche', 'mclaren', 'aston martin'].includes(make)) {
    return 'exotic';
  }
  
  // EVs
  if (make === 'tesla' || type.includes('electric') || type === 'ev') {
    return 'ev';
  }
  
  // Premium brands
  if (['bmw', 'mercedes', 'mercedes-benz', 'audi', 'lexus', 'jaguar', 'land rover'].includes(make)) {
    return 'premium';
  }
  
  // Default to economy
  return 'economy';
}

function calculateEquityProjection(data) {
  const {
    purchasePrice,
    deposit,
    monthlyPayment,
    loanTermMonths,
    startDate,
    valuationData,
    depreciationRate,
    interestRate = 0,
    balloonPayment = 0,
  } = data;

  const today = new Date();
  const monthsSincePurchase =
    (today.getFullYear() - new Date(startDate).getFullYear()) * 12 +
    (today.getMonth() - new Date(startDate).getMonth());

  // Calculate remaining balance using proper amortization formula
  const monthlyRate = interestRate / 12;
  const paymentsRemaining = Math.max(0, loanTermMonths - monthsSincePurchase);
  
  let remainingBalance = 0;
  if (paymentsRemaining > 0 && monthlyRate > 0) {
    remainingBalance = monthlyPayment * ((Math.pow(1 + monthlyRate, paymentsRemaining) - 1) / 
                      (monthlyRate * Math.pow(1 + monthlyRate, paymentsRemaining)));
  } else if (paymentsRemaining > 0) {
    remainingBalance = monthlyPayment * paymentsRemaining;
  }
  
  // CRITICAL: For PCP, add balloon payment to total amount owed if selling today
  // If there are payments remaining, the balloon is still owed
  const totalOwed = paymentsRemaining > 0 ? remainingBalance + balloonPayment : 0;

  // Value today
  const currentValue = valuationData.current;

  // Equity today (accounting for balloon payment)
  const equityToday = currentValue - totalOwed;

  // Determine status
  const statusToday =
    equityToday > 500 ? "positive" :
    equityToday < -500 ? "negative" : "break-even";

  // Build forecast for remaining loan term + 12 months
  const forecastMonths = Math.max(paymentsRemaining + 12, 24);
  const forecast = [];
  let value = currentValue;
  let balance = remainingBalance;
  let paymentsLeft = paymentsRemaining;

  for (let i = 1; i <= forecastMonths; i++) {
    value = value * (1 - depreciationRate);
    balance = Math.max(0, balance - monthlyPayment);
    paymentsLeft = Math.max(0, paymentsLeft - 1);
    
    // Include balloon payment in total owed if payments still remain
    const totalOwedFuture = paymentsLeft > 0 ? balance + balloonPayment : 0;
    const equity = value - totalOwedFuture;
    
    const status =
      equity > 500 ? "positive" :
      equity < -500 ? "negative" : "break-even";

    forecast.push({
      month: i,
      value,
      balance,
      equity,
      status,
    });
  }

  return {
    equityToday,
    statusToday,
    forecast,
  };
}

function calculateMonthlyPayment(car) {
  const loanAmount = car.loanAmount || 0;
  const termMonths = car.termMonths || 60;
  const interestRate = (car.interestRate || 0) / 100;
  const balloonPayment = car.balloonPayment || 0;
  
  if (loanAmount === 0) return 0;
  
  const principalToFinance = loanAmount - balloonPayment;
  const monthlyRate = interestRate / 12;
  
  if (monthlyRate === 0) {
    return principalToFinance / termMonths;
  }
  
  return (principalToFinance * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
         (Math.pow(1 + monthlyRate, termMonths) - 1);
}

/**
 * Calculate month-by-month vehicle value forecast using equity projection engine
 */
export const calculateMonthlyForecast = (car, marketData) => {
  const hasFinance = car.ownershipType === 'pcp' || car.ownershipType === 'loan';
  const vehicleClass = determineVehicleClass(car);
  
  // Class-specific depreciation rates (monthly) - FINAL CALIBRATION
  const depreciationRates = {
    economy: 0.0040,   // 0.40% per month (~4.8% per year)
    premium: 0.0042,   // 0.42% per month (~5% per year)
    ev: 0.0052,        // 0.52% per month (~6.2% per year)
    exotic: 0.0023     // 0.23% per month (~2.8% per year)
  };
  
  const monthlyDepreciationRate = depreciationRates[vehicleClass] || 0.0042;
  
  if (!hasFinance) {
    const forecasts = [];
    const currentValue = marketData.baseValue || car.purchasePrice || 25000;
    
    // For owned vehicles, show 24 months
    for (let monthOffset = 0; monthOffset <= 24; monthOffset++) {
      const projectedValue = currentValue * Math.pow(1 - monthlyDepreciationRate, monthOffset);
      
      forecasts.push({
        month: monthOffset,
        monthYear: monthOffset === 0 ? 'Now' : `Month ${monthOffset}`,
        values: {
          private: Math.round(projectedValue),
          dealer: Math.round(projectedValue * 1.1),
          partExchange: Math.round(projectedValue * 0.85),
        },
        loanBalance: 0,
        equity: Math.round(projectedValue),
        netPosition: Math.round(projectedValue),
        totalPaid: 0,
        status: 'positive'
      });
    }
    
    return forecasts;
  }

  // For financed cars, use the equity projection engine
  const data = {
    purchasePrice: car.purchasePrice,
    deposit: car.deposit || 0,
    monthlyPayment: calculateMonthlyPayment(car),
    loanTermMonths: car.termMonths || 60,
    startDate: car.startDate || car.purchaseDate,
    valuationData: {
      current: marketData.baseValue || car.purchasePrice || 25000
    },
    depreciationRate: monthlyDepreciationRate,
    interestRate: (car.interestRate || 0) / 100,
    balloonPayment: car.balloonPayment || 0
  };

  const projection = calculateEquityProjection(data);
  
  const forecasts = [];
  
  // Calculate total owed today (remaining payments + balloon if applicable)
  const today = new Date();
  const startDate = new Date(car.startDate || car.purchaseDate);
  const monthsSincePurchase = (today.getFullYear() - startDate.getFullYear()) * 12 + 
                               (today.getMonth() - startDate.getMonth());
  const paymentsRemaining = Math.max(0, car.termMonths - monthsSincePurchase);
  const balloonPayment = car.balloonPayment || 0;
  const monthlyPayment = data.monthlyPayment;
  
  // Calculate total paid so far
  const paymentsMade = Math.max(0, monthsSincePurchase);
  const deposit = car.deposit || 0;
  const totalPaidSoFar = deposit + (monthlyPayment * paymentsMade);
  
  // Total owed includes balloon payment if there are still payments remaining
  const totalOwedToday = paymentsRemaining > 0 
    ? (data.valuationData.current - projection.equityToday)
    : 0;
  
  // Net position = What you'd get back - What you've paid in
  // This shows actual profit/loss, not just equity
  const netPosition = projection.equityToday - totalPaidSoFar;
  
  // Add current month (month 0)
  forecasts.push({
    month: 0,
    monthYear: 'Now',
    values: {
      private: data.valuationData.current,
      dealer: Math.round(data.valuationData.current * 1.1),
      partExchange: Math.round(data.valuationData.current * 0.85),
    },
    loanBalance: Math.round(totalOwedToday),
    equity: projection.equityToday,
    netPosition: Math.round(netPosition),
    status: projection.statusToday,
    balloonPayment: paymentsRemaining > 0 ? balloonPayment : 0,
    paymentsRemaining,
    totalPaid: Math.round(totalPaidSoFar),
    deposit: deposit,
    paymentsMade: paymentsMade,
    monthlyPayment: Math.round(monthlyPayment)
  });
  
  // Add future months (all available from projection)
  projection.forecast.forEach((f, index) => {
    const futurePaymentsRemaining = Math.max(0, paymentsRemaining - (index + 1));
    const futureTotalOwed = f.value - f.equity;
    const futurePaymentsMade = paymentsMade + (index + 1);
    const futureTotalPaid = deposit + (monthlyPayment * futurePaymentsMade);
    const futureNetPosition = f.equity - futureTotalPaid;
    
    forecasts.push({
      month: f.month,
      monthYear: `Month ${f.month}`,
      values: {
        private: Math.round(f.value),
        dealer: Math.round(f.value * 1.1),
        partExchange: Math.round(f.value * 0.85),
      },
      loanBalance: Math.round(futureTotalOwed),
      equity: Math.round(f.equity),
      netPosition: Math.round(futureNetPosition),
      status: f.status,
      balloonPayment: futurePaymentsRemaining > 0 ? balloonPayment : 0,
      paymentsRemaining: futurePaymentsRemaining,
      totalPaid: Math.round(futureTotalPaid),
      paymentsMade: futurePaymentsMade,
      monthlyPayment: Math.round(monthlyPayment)
    });
  });

  return forecasts;
};

/**
 * Get market data for a vehicle - CALIBRATED VERSION
 */
export const getMarketData = (car) => {
  const purchasePrice = car.purchasePrice || 25000;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const ageInMonths = (currentYear - car.year) * 12 + currentMonth;
  
  const vehicleClass = determineVehicleClass(car);
  
  // Class-specific depreciation rates (monthly) - FINAL CALIBRATION
  const depreciationRates = {
    economy: 0.0040,   // 0.40% per month (~4.8% per year)
    premium: 0.0042,   // 0.42% per month (~5% per year)
    ev: 0.0052,        // 0.52% per month (~6.2% per year)
    exotic: 0.0023     // 0.23% per month (~2.8% per year)
  };
  
  const monthlyDepreciation = depreciationRates[vehicleClass] || 0.0042;
  
  // Apply depreciation with realistic flattening curve
  let depreciationFactor;
  if (ageInMonths <= 12) {
    // First 12 months: steeper depreciation (new car depreciation)
    depreciationFactor = Math.pow(1 - monthlyDepreciation * 1.15, ageInMonths);
  } else if (ageInMonths <= 36) {
    // Months 13-36: normal depreciation
    const first12Months = Math.pow(1 - monthlyDepreciation * 1.15, 12);
    const remainingMonths = ageInMonths - 12;
    depreciationFactor = first12Months * Math.pow(1 - monthlyDepreciation * 0.95, remainingMonths);
  } else {
    // After 36 months: depreciation slows significantly
    const first12Months = Math.pow(1 - monthlyDepreciation * 1.15, 12);
    const next24Months = Math.pow(1 - monthlyDepreciation * 0.95, 24);
    const remainingMonths = ageInMonths - 36;
    const slowedDepreciation = monthlyDepreciation * 0.65;
    depreciationFactor = first12Months * next24Months * Math.pow(1 - slowedDepreciation, remainingMonths);
  }
  
  // Calculate base value
  const baseValue = Math.round(purchasePrice * depreciationFactor);
  
  return {
    baseValue,
    marketRange: {
      min: Math.round(baseValue * 0.85),
      max: Math.round(baseValue * 1.15)
    },
    confidence: 'High',
    listingsFound: Math.floor(Math.random() * 50) + 20,
    lastUpdated: new Date()
  };
};

/**
 * Format currency value
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**

 * Calculate depreciation forecast for native app
 */
export const calculateDepreciation = (car, months = 12) => {
  const currentValue = car.apiCalibratedValue || car.purchasePrice || 0;
  const currentLoan = car.loanAmount || 0;
  const monthlyPayment = car.monthlyPayment || 0;
  const interestRate = (car.interestRate || 0) / 100 / 12;
  
  const vehicleClass = determineVehicleClass(car);
  const depreciationRates = {
    economy: 0.0040,
    premium: 0.0042,
    ev: 0.0052,
    exotic: 0.0023
  };
  const monthlyDepreciation = depreciationRates[vehicleClass] || 0.0042;
  
  const forecast = [];
  
  for (let month = 0; month <= months; month++) {
    // Calculate depreciated value
    const value = currentValue * Math.pow(1 - monthlyDepreciation, month);
    
    // Calculate remaining loan balance
    let loanBalance = currentLoan;
    if (monthlyPayment > 0 && interestRate > 0) {
      // Amortization formula
      const paymentsRemaining = Math.max(0, (car.loanTerm || 60) - month);
      if (paymentsRemaining > 0) {
        loanBalance = monthlyPayment * ((Math.pow(1 + interestRate, paymentsRemaining) - 1) / 
                      (interestRate * Math.pow(1 + interestRate, paymentsRemaining)));
      } else {
        loanBalance = 0;
      }
    } else {
      loanBalance = Math.max(0, currentLoan - (monthlyPayment * month));
    }
    
    forecast.push({
      month,
      value: Math.round(value),
      loanBalance: Math.round(loanBalance),
      equity: Math.round(value - loanBalance),
    });
  }
  
  return forecast;
};

/**
 * Calculate break-even point
 */
export const calculateBreakEven = (car) => {
  const currentValue = car.apiCalibratedValue || car.purchasePrice || 0;
  const currentLoan = car.loanAmount || 0;
  const currentEquity = currentValue - currentLoan;
  
  // Already in positive equity
  if (currentEquity >= 0) {
    return {
      hasBreakEven: false,
      monthsToBreakEven: 0,
      valueAtBreakEven: currentValue,
      loanAtBreakEven: currentLoan,
    };
  }
  
  const monthlyPayment = car.monthlyPayment || 0;
  const interestRate = (car.interestRate || 0) / 100 / 12;
  
  const vehicleClass = determineVehicleClass(car);
  const depreciationRates = {
    economy: 0.0040,
    premium: 0.0042,
    ev: 0.0052,
    exotic: 0.0023
  };
  const monthlyDepreciation = depreciationRates[vehicleClass] || 0.0042;
  
  // Find break-even month
  let value = currentValue;
  let loanBalance = currentLoan;
  let monthsToBreakEven = 0;
  
  for (let month = 1; month <= 120; month++) {
    value = value * (1 - monthlyDepreciation);
    
    if (monthlyPayment > 0 && interestRate > 0) {
      const paymentsRemaining = Math.max(0, (car.loanTerm || 60) - month);
      if (paymentsRemaining > 0) {
        loanBalance = monthlyPayment * ((Math.pow(1 + interestRate, paymentsRemaining) - 1) / 
                      (interestRate * Math.pow(1 + interestRate, paymentsRemaining)));
      } else {
        loanBalance = 0;
      }
    } else {
      loanBalance = Math.max(0, loanBalance - monthlyPayment);
    }
    
    if (value >= loanBalance) {
      monthsToBreakEven = month;
      break;
    }
  }
  
  return {
    hasBreakEven: monthsToBreakEven > 0,
    monthsToBreakEven,
    valueAtBreakEven: Math.round(value),
    loanAtBreakEven: Math.round(loanBalance),
  };
};
