import { differenceInMonths, addMonths, format } from 'date-fns';

// Calculate current value - pure API values only
export const calculateCurrentValue = (purchasePrice, purchaseDate, carDetails = {}) => {
  const { apiCalibratedValue } = carDetails;

  // Use API value if available (pure market data)
  if (apiCalibratedValue && apiCalibratedValue > 0) {
    return apiCalibratedValue;
  }

  // Fallback to simple time-based depreciation if details are missing
  const monthsOwned = differenceInMonths(new Date(), new Date(purchaseDate));

  // Depreciation curve: steep in first year, then gradual
  // Year 1: -20%, Year 2: -15%, Year 3: -10%, then -5% per year
  let depreciationRate = 0;

  if (monthsOwned <= 12) {
    depreciationRate = 0.20 * (monthsOwned / 12);
  } else if (monthsOwned <= 24) {
    depreciationRate = 0.20 + 0.15 * ((monthsOwned - 12) / 12);
  } else if (monthsOwned <= 36) {
    depreciationRate = 0.35 + 0.10 * ((monthsOwned - 24) / 12);
  } else {
    const yearsAfter3 = Math.floor((monthsOwned - 36) / 12);
    depreciationRate = 0.45 + (yearsAfter3 * 0.05);
  }

  return purchasePrice * (1 - Math.min(depreciationRate, 0.70)); // Cap at 70% depreciation
};

// Calculate loan balance using amortization formula
export const calculateLoanBalance = (principal, annualRate, termMonths, monthsElapsed, balloonPayment = 0) => {
  if (monthsElapsed >= termMonths) return balloonPayment;
  if (monthsElapsed <= 0) return principal;

  const monthlyRate = annualRate / 100 / 12;

  // Adjust principal for balloon payment
  const financedAmount = principal - (balloonPayment / Math.pow(1 + monthlyRate, termMonths));

  // Standard amortization formula
  const monthlyPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                        (Math.pow(1 + monthlyRate, termMonths) - 1);

  // Remaining balance after monthsElapsed payments
  const remainingBalance = financedAmount * Math.pow(1 + monthlyRate, monthsElapsed) -
                           monthlyPayment * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  return Math.max(remainingBalance + balloonPayment, 0);
};

// Calculate monthly payment
export const calculateMonthlyPayment = (principal, annualRate, termMonths, balloonPayment = 0) => {
  const monthlyRate = annualRate / 100 / 12;
  const financedAmount = principal - (balloonPayment / Math.pow(1 + monthlyRate, termMonths));

  return financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
         (Math.pow(1 + monthlyRate, termMonths) - 1);
};

// Generate projection data for charts
export const generateProjectionData = (car) => {
  const startDate = new Date(car.startDate || car.purchaseDate);
  const currentDate = new Date();
  const monthsElapsed = differenceInMonths(currentDate, startDate);
  const termMonths = car.termMonths || 60;

  const projections = [];

  for (let month = 0; month <= Math.max(termMonths, monthsElapsed + 12); month++) {
    const date = addMonths(startDate, month);
    const projectionDate = date.toISOString().split('T')[0];

    // Calculate value at this point in time using the valuation engine
    const value = calculateCurrentValue(car.purchasePrice, projectionDate, {
      make: car.make,
      model: car.model,
      year: car.year,
      type: car.type,
      mileage: car.mileage,
      marketWeight: car.marketWeight,
    });

    const adjustedValue = value; // Use the engine's calculation directly

    let loanBalance = 0;
    if (car.ownershipType === 'loan' || car.ownershipType === 'pcp') {
      loanBalance = calculateLoanBalance(
        car.loanAmount || 0,
        car.interestRate || 7,
        termMonths,
        month,
        car.balloonPayment || 0
      );
    }

    projections.push({
      month: format(date, 'MMM yy'),
      date: date.toISOString(),
      marketValue: Math.round(adjustedValue),
      loanBalance: Math.round(loanBalance),
      equity: Math.round(adjustedValue - loanBalance),
    });
  }

  return projections;
};

// Calculate how many payments have been made based on first payment date
export const calculatePaymentsMade = (firstPaymentDate) => {
  if (!firstPaymentDate) return 0;
  
  const firstPayment = new Date(firstPaymentDate);
  const today = new Date();
  
  // If first payment hasn't happened yet, return 0
  if (firstPayment > today) return 0;
  
  // Calculate months between first payment and today
  const paymentsMade = differenceInMonths(today, firstPayment) + 1; // +1 because first payment counts
  
  return Math.max(0, paymentsMade);
};

// Main financial model calculator
export const calculateFinancialModel = (car) => {
  const monthsElapsed = differenceInMonths(
    new Date(),
    new Date(car.startDate || car.purchaseDate)
  );

  // Calculate payments made based on first payment date if available
  const paymentsMade = car.firstPaymentDate ? calculatePaymentsMade(car.firstPaymentDate) : monthsElapsed;

  const currentValue = calculateCurrentValue(car.purchasePrice, car.purchaseDate, {
    make: car.make,
    model: car.model,
    year: car.year,
    type: car.type,
    mileage: car.mileage,
    marketWeight: car.marketWeight,
  });

  let loanBalance = 0;
  let monthlyPayment = 0;
  let totalPaid = 0;
  let remainingTerm = 0;

  // Handle different ownership types
  if (car.ownershipType === 'loan' || car.ownershipType === 'pcp' || car.ownershipType === 'tradein') {
    const principal = car.loanAmount || (car.purchasePrice - (car.deposit || 0));
    const termMonths = car.termMonths || 60;

    // Calculate balloon payment for PCP if GFV% is provided
    let balloonPayment = car.balloonPayment || 0;
    if (car.ownershipType === 'pcp' && car.guaranteedFutureValuePercent && !balloonPayment) {
      balloonPayment = car.purchasePrice * (car.guaranteedFutureValuePercent / 100);
    }

    loanBalance = calculateLoanBalance(
      principal,
      car.interestRate || 7,
      termMonths,
      paymentsMade,
      balloonPayment
    );

    monthlyPayment = car.monthlyPayment || calculateMonthlyPayment(
      principal,
      car.interestRate || 7,
      termMonths,
      balloonPayment
    );

    // Add rolled-over debt to total paid for trade-ins
    const rolledOverDebt = car.rolledOverDebt || 0;
    totalPaid = (car.deposit || 0) + (monthlyPayment * paymentsMade) + rolledOverDebt;
    remainingTerm = Math.max(termMonths - paymentsMade, 0);
  } else if (car.ownershipType === 'lease') {
    // For leases, use residual value as the "loan balance" if provided
    monthlyPayment = car.monthlyPayment || 0;
    const leasePaymentsMade = car.firstPaymentDate ? calculatePaymentsMade(car.firstPaymentDate) : monthsElapsed;
    totalPaid = monthlyPayment * leasePaymentsMade;
    remainingTerm = Math.max((car.termMonths || 36) - leasePaymentsMade, 0);
    // Lease has no equity since you don't own the vehicle
    loanBalance = car.residualValue || currentValue; // Assume residual = current value if not specified
  } else if (car.ownershipType === 'cash') {
    totalPaid = car.purchasePrice;
  } else if (car.ownershipType === 'company' || car.ownershipType === 'fleet') {
    // Company/Fleet cars - no loan, but track for benefit-in-kind
    totalPaid = 0; // Employer pays
  }

  const equity = currentValue - loanBalance;
  const totalCost = totalPaid + (currentValue - car.purchasePrice); // Depreciation loss

  // Find break-even point
  const projections = generateProjectionData(car);
  const breakEvenMonth = projections.find(p => p.equity >= 0);

  // Calculate projected equity at maturity (end of term)
  const maturityProjection = projections.find(p => {
    const projectionDate = new Date(p.date);
    const maturityDate = addMonths(new Date(car.startDate || car.purchaseDate), car.termMonths || 60);
    return differenceInMonths(projectionDate, maturityDate) === 0;
  });
  const projectedEquityAtMaturity = maturityProjection ? maturityProjection.equity : equity;

  // Calculate monthly cost of ownership
  const depreciationPerMonth = (car.purchasePrice - currentValue) / Math.max(monthsElapsed, 1);
  const monthlyCostOfOwnership = monthlyPayment + depreciationPerMonth;

  return {
    currentValue: Math.round(currentValue),
    loanBalance: Math.round(loanBalance),
    equity: Math.round(equity),
    monthlyPayment: Math.round(monthlyPayment),
    totalPaid: Math.round(totalPaid),
    remainingTerm,
    paymentsMade: paymentsMade || 0,
    balloonDue: car.balloonPayment || 0,
    monthlyCostOfOwnership: Math.round(monthlyCostOfOwnership),
    breakEvenDate: breakEvenMonth ? breakEvenMonth.date : null,
    projectedEquityAtMaturity: Math.round(projectedEquityAtMaturity),
    projections,
    depreciationRate: ((car.purchasePrice - currentValue) / car.purchasePrice * 100).toFixed(1),
    // Additional fields for advanced tracking
    annualMileageCap: car.annualMileageCap || null,
    residualValue: car.residualValue || null,
    tradeInValue: car.tradeInValue || null,
    rolledOverDebt: car.rolledOverDebt || null,
    firstPaymentDate: car.firstPaymentDate || null,
  };
};

// Calculate portfolio-level metrics
export const calculatePortfolioMetrics = (cars) => {
  const models = cars.map(car => ({
    ...car,
    ...calculateFinancialModel(car)
  }));

  const totalValue = models.reduce((sum, car) => sum + car.currentValue, 0);
  const totalLoanBalance = models.reduce((sum, car) => sum + car.loanBalance, 0);
  const totalEquity = totalValue - totalLoanBalance;
  const totalMonthlyPayments = models.reduce((sum, car) => sum + car.monthlyPayment, 0);
  const avgDepreciation = models.reduce((sum, car) => sum + parseFloat(car.depreciationRate), 0) / models.length;

  return {
    totalValue: Math.round(totalValue),
    totalLoanBalance: Math.round(totalLoanBalance),
    totalEquity: Math.round(totalEquity),
    totalMonthlyPayments: Math.round(totalMonthlyPayments),
    avgDepreciation: avgDepreciation.toFixed(1),
    carCount: cars.length,
    models,
  };
};
