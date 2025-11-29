/**
 * Equity Calculator - "Real World" Math
 * 
 * Core Logic: Trade-In Value minus Settlement Figure (Payoff Amount)
 * NOT: Car Value vs Total Remaining Payments
 * 
 * Key Features:
 * - Settlement Figure = Principal Remaining + Interest Penalty
 * - PCP accounts for Balloon Payment (GMFV)
 * - Immediate 10-15% "Drive-Off" depreciation at Month 0
 */

import { 
  FinanceType, 
  FinancialStatus, 
  MonthlyProjection, 
  SwapWindow,
  SettlementCalculation,
  CategoryCharacteristics,
  VehicleCategory
} from '../types/vehicle';

// Drive-off depreciation by category (retail to trade-in gap)
const DRIVE_OFF_RATES: Record<VehicleCategory, number> = {
  economy: 0.12,    // 12% immediate drop
  premium: 0.15,    // 15% - luxury loses more initially
  ev: 0.18,         // 18% - EVs depreciate faster
  exotic: 0.08,     // 8% - exotics hold better
};

// Monthly depreciation rates
const MONTHLY_DEPRECIATION: Record<VehicleCategory, number> = {
  economy: 0.008,   // ~10% per year
  premium: 0.012,   // ~14% per year
  ev: 0.015,        // ~18% per year
  exotic: 0.005,    // ~6% per year
};

/**
 * Calculate the Settlement Figure (Cost to Clear Finance)
 * This is what you'd actually pay to close the loan TODAY
 */
export const calculateSettlementFigure = (
  originalLoan: number,
  monthlyPayment: number,
  interestRate: number,
  termMonths: number,
  monthsElapsed: number,
  financeType: FinanceType,
  balloonPayment: number = 0
): SettlementCalculation => {
  if (financeType === 'cash') {
    return {
      principalRemaining: 0,
      interestPenalty: 0,
      totalSettlement: 0,
      monthsRemaining: 0
    };
  }

  const monthsRemaining = Math.max(0, termMonths - monthsElapsed);
  const monthlyRate = interestRate / 100 / 12;
  
  // Calculate principal remaining using amortization formula
  // For HP: Standard amortization
  // For PCP: Lower monthly payments, balloon at end
  
  let principalRemaining: number;
  
  if (financeType === 'pcp') {
    // PCP: Calculate how much principal has been paid off
    // Monthly payments mostly cover interest + small principal
    // Balloon covers the rest at the end
    
    const totalPrincipalToPay = originalLoan - balloonPayment;
    const principalPerMonth = totalPrincipalToPay / termMonths;
    const principalPaid = principalPerMonth * monthsElapsed;
    
    // Remaining = what's left of regular principal + balloon
    principalRemaining = (totalPrincipalToPay - principalPaid) + balloonPayment;
    
    // Near end of PCP, the balloon dominates
    if (monthsRemaining <= 3) {
      principalRemaining = balloonPayment + (principalPerMonth * monthsRemaining);
    }
  } else {
    // HP: Standard amortization
    // P_remaining = P * [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
    const factor = Math.pow(1 + monthlyRate, termMonths);
    const factorElapsed = Math.pow(1 + monthlyRate, monthsElapsed);
    
    if (factor === 1) {
      principalRemaining = originalLoan * (1 - monthsElapsed / termMonths);
    } else {
      principalRemaining = originalLoan * (factor - factorElapsed) / (factor - 1);
    }
  }
  
  // Early settlement penalty (typically 1-2 months interest)
  // UK FCA rules: max 58 days interest for early settlement
  const interestPenalty = principalRemaining * monthlyRate * 2; // ~2 months
  
  return {
    principalRemaining: Math.max(0, principalRemaining),
    interestPenalty: Math.max(0, interestPenalty),
    totalSettlement: Math.max(0, principalRemaining + interestPenalty),
    monthsRemaining
  };
};

/**
 * Calculate Trade-In Value at a given month
 * Applies drive-off depreciation at month 0, then monthly depreciation
 */
export const calculateTradeInValue = (
  retailPrice: number,
  category: VehicleCategory,
  monthsOwned: number,
  currentMileage: number,
  expectedAnnualMileage: number = 10000
): number => {
  // Apply immediate drive-off depreciation
  const driveOffRate = DRIVE_OFF_RATES[category];
  const afterDriveOff = retailPrice * (1 - driveOffRate);
  
  // Apply monthly depreciation
  const monthlyRate = MONTHLY_DEPRECIATION[category];
  const depreciatedValue = afterDriveOff * Math.pow(1 - monthlyRate, monthsOwned);
  
  // Mileage adjustment (±2% per 5000 miles from average)
  const expectedMileage = (expectedAnnualMileage / 12) * monthsOwned;
  const mileageDiff = currentMileage - expectedMileage;
  const mileageAdjustment = 1 - (mileageDiff / 5000) * 0.02;
  
  return Math.max(0, depreciatedValue * Math.max(0.7, Math.min(1.3, mileageAdjustment)));
};

/**
 * Calculate Private Sale Value (typically 10-15% higher than trade-in)
 */
export const calculatePrivateValue = (tradeInValue: number): number => {
  return tradeInValue * 1.12; // 12% premium for private sale
};

/**
 * Calculate Cash Position (The Key Metric)
 * Positive = "Cash for Next Deposit"
 * Negative = "Cost to Change"
 */
export const calculateCashPosition = (
  tradeInValue: number,
  settlementFigure: number
): number => {
  return tradeInValue - settlementFigure;
};

/**
 * Determine financial status from cash position
 */
export const getFinancialStatus = (cashPosition: number): FinancialStatus => {
  if (cashPosition > 200) return 'winning';
  if (cashPosition < -200) return 'losing';
  return 'breakeven';
};

/**
 * Generate monthly projections for the swap window chart
 */
export const generateProjections = (
  retailPrice: number,
  category: VehicleCategory,
  financeType: FinanceType,
  originalLoan: number,
  monthlyPayment: number,
  interestRate: number,
  termMonths: number,
  currentMonthsElapsed: number,
  balloonPayment: number = 0,
  currentMileage: number = 0,
  expectedAnnualMileage: number = 10000
): MonthlyProjection[] => {
  const projections: MonthlyProjection[] = [];
  const totalMonths = termMonths + 6; // Project 6 months past contract end
  
  let peakEquity = -Infinity;
  let peakMonth = 0;
  let breakEvenMonth = -1;
  
  for (let month = 0; month <= totalMonths; month++) {
    const monthsOwned = month;
    const projectedMileage = currentMileage + ((expectedAnnualMileage / 12) * (month - currentMonthsElapsed));
    
    // Calculate values at this month
    const tradeInValue = calculateTradeInValue(
      retailPrice, 
      category, 
      monthsOwned,
      Math.max(currentMileage, projectedMileage),
      expectedAnnualMileage
    );
    const privateValue = calculatePrivateValue(tradeInValue);
    
    // Settlement figure
    const settlement = calculateSettlementFigure(
      originalLoan,
      monthlyPayment,
      interestRate,
      termMonths,
      month,
      financeType,
      balloonPayment
    );
    
    // Cash positions
    const tradeInCash = calculateCashPosition(tradeInValue, settlement.totalSettlement);
    const privateCash = calculateCashPosition(privateValue, settlement.totalSettlement);
    
    const status = getFinancialStatus(tradeInCash);
    
    // Track peak and break-even
    if (tradeInCash > peakEquity) {
      peakEquity = tradeInCash;
      peakMonth = month;
    }
    
    if (breakEvenMonth === -1 && tradeInCash >= 0) {
      breakEvenMonth = month;
    }
    
    // Generate month label
    const date = new Date();
    date.setMonth(date.getMonth() + (month - currentMonthsElapsed));
    const monthLabel = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    
    projections.push({
      month,
      monthLabel,
      tradeInValue,
      privateValue,
      settlementFigure: settlement.totalSettlement,
      cashPosition: {
        tradeIn: tradeInCash,
        private: privateCash
      },
      status,
      isOptimalMonth: false, // Set after loop
      isBreakEvenMonth: month === breakEvenMonth,
      isBalloonMonth: financeType === 'pcp' && month === termMonths,
      isContractEnd: month === termMonths
    });
  }
  
  // Mark optimal month
  if (projections[peakMonth]) {
    projections[peakMonth].isOptimalMonth = true;
  }
  
  return projections;
};

/**
 * Calculate the Swap Window (Green Zone)
 */
export const calculateSwapWindow = (
  projections: MonthlyProjection[],
  currentMonth: number
): SwapWindow => {
  let startMonth = -1;
  let endMonth = projections.length - 1;
  let peakMonth = 0;
  let peakEquity = -Infinity;
  
  for (let i = 0; i < projections.length; i++) {
    const p = projections[i];
    
    // Find when positive equity starts
    if (startMonth === -1 && p.cashPosition.tradeIn >= 0) {
      startMonth = i;
    }
    
    // Find when positive equity ends (after starting)
    if (startMonth !== -1 && p.cashPosition.tradeIn < 0 && i > startMonth) {
      endMonth = i - 1;
      break;
    }
    
    // Track peak
    if (p.cashPosition.tradeIn > peakEquity) {
      peakEquity = p.cashPosition.tradeIn;
      peakMonth = i;
    }
    
    // Contract end is a natural boundary
    if (p.isContractEnd) {
      endMonth = i;
    }
  }
  
  return {
    startMonth: Math.max(0, startMonth),
    endMonth,
    peakMonth,
    peakEquity,
    currentMonth,
    isInWindow: currentMonth >= startMonth && currentMonth <= endMonth && startMonth !== -1
  };
};

/**
 * Get user-friendly status label
 */
export const getStatusLabel = (cashPosition: number): string => {
  if (cashPosition >= 0) {
    return 'Cash for Next Deposit';
  }
  return 'Cost to Change';
};

/**
 * Get action label - the key question answered
 */
export const getActionLabel = (cashPosition: number): string => {
  if (cashPosition >= 0) {
    return 'You get a check';
  }
  return 'You write a check';
};

/**
 * Format currency for UK market
 */
export const formatCurrency = (value: number, showSign: boolean = false): string => {
  const absValue = Math.abs(value);
  const formatted = `£${absValue.toLocaleString('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  
  if (showSign) {
    if (value > 0) return `+${formatted}`;
    if (value < 0) return `-${formatted}`;
  }
  
  return formatted;
};

/**
 * Calculate PCP Apathy Warning
 * Shows what user loses by just handing keys back vs selling
 */
export const calculateApathyWarning = (
  tradeInValue: number,
  settlementFigure: number,
  balloonPayment: number
): { handBackValue: number; sellValue: number; lostMoney: number } | null => {
  // Only relevant for PCP with positive equity
  const cashPosition = tradeInValue - settlementFigure;
  
  if (cashPosition <= 0) return null;
  
  return {
    handBackValue: 0,              // Hand keys back = £0
    sellValue: cashPosition,       // What they'd get selling
    lostMoney: cashPosition        // Money left on table
  };
};
