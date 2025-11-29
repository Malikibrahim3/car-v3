/**
 * Financial Utility Functions for Enhanced Vehicle Forecast
 * Handles color coding, status determination, and financial calculations
 */

import { FinancialStatus, VehicleCategory, CategoryCharacteristics } from '../types/vehicle';

/**
 * Determine financial status based on net position
 */
export const getFinancialStatus = (netPosition: number): FinancialStatus => {
  if (netPosition > 500) return 'profit';
  if (netPosition < -500) return 'loss';
  return 'breakeven';
};

/**
 * Get color code for financial status
 */
export const getStatusColor = (status: FinancialStatus): string => {
  switch (status) {
    case 'profit': return '#059669'; // Green
    case 'loss': return '#DC2626';   // Red
    case 'breakeven': return '#D97706'; // Yellow
    default: return '#6B7280'; // Gray
  }
};

/**
 * Get CSS class for financial status
 */
export const getStatusClass = (status: FinancialStatus): string => {
  switch (status) {
    case 'profit': return 'text-green-600 bg-green-50';
    case 'loss': return 'text-red-600 bg-red-50';
    case 'breakeven': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

/**
 * Format currency values consistently
 */
export const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  return `${sign}$${absValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format currency with profit/loss indicator
 */
export const formatCurrencyWithStatus = (value: number): string => {
  const formatted = formatCurrency(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
};

/**
 * Calculate net position (true profit/loss)
 */
export const calculateNetPosition = (equity: number, totalPaid: number): number => {
  return equity - totalPaid;
};

/**
 * Calculate equity (value minus amount owed)
 */
export const calculateEquity = (vehicleValue: number, amountOwed: number): number => {
  return vehicleValue - amountOwed;
};

/**
 * Get category characteristics for vehicle types
 */
export const getCategoryCharacteristics = (category: VehicleCategory): CategoryCharacteristics => {
  const characteristics: Record<VehicleCategory, CategoryCharacteristics> = {
    economy: {
      name: 'Economy',
      monthlyDepreciationRate: 0.0040,
      annualDepreciationRate: 4.8,
      description: 'Reliable vehicles with steady, moderate depreciation',
      guidance: 'Economy vehicles depreciate predictably. Focus on loan paydown timing for optimal selling.',
      icon: '🚗'
    },
    premium: {
      name: 'Premium',
      monthlyDepreciationRate: 0.0042,
      annualDepreciationRate: 5.0,
      description: 'Luxury vehicles with brand value retention',
      guidance: 'Premium vehicles hold value well initially but depreciate faster after 3-4 years. Timing is crucial.',
      icon: '✨'
    },
    ev: {
      name: 'Electric Vehicle',
      monthlyDepreciationRate: 0.0052,
      annualDepreciationRate: 6.2,
      description: 'Electric vehicles with technology-driven depreciation',
      guidance: 'EVs depreciate faster due to rapid technology advancement. Consider selling before major tech updates.',
      icon: '⚡'
    },
    exotic: {
      name: 'Exotic',
      monthlyDepreciationRate: 0.0023,
      annualDepreciationRate: 2.8,
      description: 'Limited production vehicles with collector potential',
      guidance: 'Exotic vehicles depreciate slowly and may appreciate. Longer holds often beneficial if financially viable.',
      icon: '🏎️'
    }
  };
  
  return characteristics[category];
};

/**
 * Determine vehicle category from make and type
 */
export const determineVehicleCategory = (make: string, type?: string): VehicleCategory => {
  const makeLower = make.toLowerCase();
  const typeLower = type?.toLowerCase() || '';
  
  // Exotic brands
  if (['lamborghini', 'ferrari', 'porsche', 'mclaren', 'aston martin', 'bugatti'].includes(makeLower)) {
    return 'exotic';
  }
  
  // EVs
  if (makeLower === 'tesla' || typeLower.includes('electric') || typeLower === 'ev') {
    return 'ev';
  }
  
  // Premium brands
  if (['bmw', 'mercedes', 'mercedes-benz', 'audi', 'lexus', 'jaguar', 'land rover', 'volvo', 'cadillac'].includes(makeLower)) {
    return 'premium';
  }
  
  // Default to economy
  return 'economy';
};

/**
 * Generate user-friendly status message
 */
export const getStatusMessage = (netPosition: number, status: FinancialStatus): string => {
  const amount = formatCurrency(Math.abs(netPosition));
  
  switch (status) {
    case 'profit':
      return `You would profit ${amount} if sold today`;
    case 'loss':
      return `You would lose ${amount} if sold today`;
    case 'breakeven':
      return `You would break even if sold today`;
    default:
      return 'Financial position unknown';
  }
};

/**
 * Generate recommendation action text
 */
export const getRecommendationText = (
  action: 'sell_now' | 'hold',
  optimalMonth: number,
  optimalOutcome: number
): string => {
  if (action === 'sell_now') {
    return 'Sell now to minimize losses';
  }
  
  const outcomeText = optimalOutcome > 0 
    ? `profit ${formatCurrency(optimalOutcome)}`
    : `minimize loss to ${formatCurrency(Math.abs(optimalOutcome))}`;
    
  return `Hold until Month ${optimalMonth} to ${outcomeText}`;
};

/**
 * Calculate improvement potential
 */
export const calculateImprovement = (currentOutcome: number, optimalOutcome: number): number => {
  return optimalOutcome - currentOutcome;
};

/**
 * Check if vehicle has balloon payment
 */
export const hasBalloonPayment = (balloonAmount?: number): boolean => {
  return (balloonAmount || 0) > 0;
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};