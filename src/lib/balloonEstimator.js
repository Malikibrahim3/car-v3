/**
 * Balloon Payment Estimator
 *
 * Calculates estimated balloon payment (GMFV - Guaranteed Minimum Future Value)
 * based on vehicle type, term length, and purchase price.
 *
 * This provides automatic balloon payment estimates for PCP agreements.
 */

// ============================================================================
// CONFIGURATION - Adjustment Factors
// ============================================================================

/**
 * Global market trend factor
 * Default: 1.00 (neutral)
 * Examples: 0.95 = market down 5%, 1.05 = market up 5%
 */
export let MARKET_TREND = 1.00;

/**
 * Set the market trend factor
 * @param {number} factor - Market trend multiplier (e.g., 0.95 for -5%, 1.05 for +5%)
 */
export const setMarketTrend = (factor) => {
  MARKET_TREND = factor;
};

/**
 * Configuration for mileage-based adjustments
 */
const MILEAGE_CONFIG = {
  baseAnnualMileage: 12000, // Expected miles per year
  highMileagePenalty: 0.015, // -1.5% per 10% over expected
  lowMileageBonus: 0.010,    // +1% per 10% under expected
};

/**
 * Configuration for year-based adjustments
 */
const YEAR_CONFIG = {
  newVehicleBonus: 0.02,     // +2% for vehicles < 2 years old
  oldVehiclePenalty: -0.03,  // -3% for vehicles > 5 years old
};

/**
 * Configuration for condition-based adjustments
 */
const CONDITION_CONFIG = {
  excellent: 0.03,  // +3%
  good: 0.00,       // baseline (0%)
  fair: -0.03,      // -3%
  poor: -0.06,      // -6%
};

// ============================================================================
// Residual Value Tables
// ============================================================================

// Residual Value Tables by Vehicle Type and Term
// These percentages represent the expected residual value as % of purchase price
const RESIDUAL_VALUE_TABLE = {
  Standard: {
    12: 0.75,
    24: 0.65,
    36: 0.55,
    48: 0.48,
    60: 0.42,
  },
  Luxury: {
    12: 0.78,
    24: 0.68,
    36: 0.58,
    48: 0.50,
    60: 0.44,
  },
  'Sports/Exotic': {
    12: 0.85,
    24: 0.77,
    36: 0.70,
    48: 0.65,
    60: 0.60,
  },
  Electric: {
    12: 0.75,
    24: 0.65,
    36: 0.55,
    48: 0.48,
    60: 0.43,
  },
};

/**
 * Classify vehicle into a residual value category
 * @param {string} make - Vehicle make
 * @param {string} model - Vehicle model
 * @returns {string} Category name
 */
export const classifyVehicleForResidual = (make, model) => {
  if (!make || !model) return 'Standard';

  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();

  // Sports/Exotic category
  if (
    makeLower === 'ferrari' ||
    makeLower === 'porsche' ||
    makeLower === 'lamborghini' ||
    makeLower === 'corvette' ||
    makeLower === 'mclaren' ||
    makeLower === 'aston martin' ||
    modelLower.includes('911') ||
    modelLower.includes('corvette') ||
    modelLower.includes('amg') ||
    modelLower.includes('gt-r') ||
    modelLower.includes('nsx')
  ) {
    return 'Sports/Exotic';
  }

  // Luxury category
  if (
    makeLower === 'range rover' ||
    makeLower === 'mercedes' ||
    makeLower === 'mercedes-benz' ||
    makeLower === 'bmw' ||
    makeLower === 'audi' ||
    makeLower === 'lexus' ||
    makeLower === 'bentley' ||
    makeLower === 'rolls-royce' ||
    makeLower === 'jaguar' ||
    makeLower === 'maserati' ||
    modelLower.includes('range rover') ||
    modelLower.includes('s-class') ||
    modelLower.includes('7 series') ||
    modelLower.includes('a8') ||
    modelLower.includes('x5') ||
    modelLower.includes('q7') ||
    modelLower.includes('gle') ||
    modelLower.includes('cayenne') ||
    modelLower.includes('escalade')
  ) {
    return 'Luxury';
  }

  // Electric category
  if (
    makeLower === 'tesla' ||
    makeLower === 'polestar' ||
    makeLower === 'rivian' ||
    makeLower === 'lucid' ||
    modelLower.includes('nissan leaf') ||
    modelLower.includes('e-tron') ||
    modelLower.includes('i3') ||
    modelLower.includes('i4') ||
    modelLower.includes('taycan') ||
    modelLower.includes('leaf') ||
    modelLower.includes('electric') ||
    modelLower.includes('ev') ||
    modelLower.includes('id.4') ||
    modelLower.includes('mach-e')
  ) {
    return 'Electric';
  }

  // Default to Standard
  return 'Standard';
};

// ============================================================================
// Adjustment Calculation Functions
// ============================================================================

/**
 * Calculate mileage-based adjustment
 * @param {number} currentMileage - Current vehicle mileage (optional)
 * @param {number} vehicleAge - Vehicle age in years (optional)
 * @returns {number} Adjustment multiplier (e.g., 0.015 = +1.5%, -0.03 = -3%)
 */
const calculateMileageAdjustment = (currentMileage, vehicleAge) => {
  if (!currentMileage || !vehicleAge || vehicleAge <= 0) {
    return 0; // No adjustment if data not provided
  }

  const expectedMileage = MILEAGE_CONFIG.baseAnnualMileage * vehicleAge;
  const actualMileage = currentMileage;
  const mileageDifference = actualMileage - expectedMileage;
  const percentDifference = mileageDifference / expectedMileage;

  // Calculate adjustment based on 10% increments
  if (percentDifference > 0) {
    // Over expected mileage - apply penalty
    const tenPercentIncrements = Math.floor(percentDifference / 0.10);
    return -(tenPercentIncrements * MILEAGE_CONFIG.highMileagePenalty);
  } else if (percentDifference < 0) {
    // Under expected mileage - apply bonus
    const tenPercentIncrements = Math.floor(Math.abs(percentDifference) / 0.10);
    return tenPercentIncrements * MILEAGE_CONFIG.lowMileageBonus;
  }

  return 0;
};

/**
 * Calculate year-based adjustment
 * @param {number} vehicleYear - Vehicle manufacturing year
 * @returns {number} Adjustment multiplier
 */
const calculateYearAdjustment = (vehicleYear) => {
  if (!vehicleYear) {
    return 0; // No adjustment if year not provided
  }

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleYear;

  if (vehicleAge < 2) {
    return YEAR_CONFIG.newVehicleBonus; // +2%
  } else if (vehicleAge > 5) {
    return YEAR_CONFIG.oldVehiclePenalty; // -3%
  }

  return 0; // 3-5 years: no adjustment
};

/**
 * Calculate condition-based adjustment
 * @param {string} condition - Vehicle condition: 'excellent', 'good', 'fair', 'poor'
 * @returns {number} Adjustment multiplier
 */
const calculateConditionAdjustment = (condition) => {
  if (!condition) {
    return 0; // No adjustment if condition not provided
  }

  const conditionLower = condition.toLowerCase();
  return CONDITION_CONFIG[conditionLower] || 0;
};

// ============================================================================
// Residual Value Calculation
// ============================================================================

/**
 * Get residual value percentage for a given term
 * Interpolates between known values if exact term not in table
 * @param {Object} categoryTable - Residual value table for the category
 * @param {number} termMonths - Loan term in months
 * @returns {number} Residual value as a percentage (0-1)
 */
const getResidualValuePercent = (categoryTable, termMonths) => {
  const term = parseInt(termMonths);

  // Return exact match if available
  if (categoryTable[term]) {
    return categoryTable[term];
  }

  // Find surrounding values for interpolation
  const knownTerms = Object.keys(categoryTable).map(Number).sort((a, b) => a - b);

  // If term is below minimum, use minimum
  if (term <= knownTerms[0]) {
    return categoryTable[knownTerms[0]];
  }

  // If term is above maximum, use maximum
  if (term >= knownTerms[knownTerms.length - 1]) {
    return categoryTable[knownTerms[knownTerms.length - 1]];
  }

  // Find surrounding terms for interpolation
  let lowerTerm = knownTerms[0];
  let upperTerm = knownTerms[knownTerms.length - 1];

  for (let i = 0; i < knownTerms.length - 1; i++) {
    if (term > knownTerms[i] && term < knownTerms[i + 1]) {
      lowerTerm = knownTerms[i];
      upperTerm = knownTerms[i + 1];
      break;
    }
  }

  // Linear interpolation
  const lowerValue = categoryTable[lowerTerm];
  const upperValue = categoryTable[upperTerm];
  const ratio = (term - lowerTerm) / (upperTerm - lowerTerm);
  const interpolatedValue = lowerValue + (upperValue - lowerValue) * ratio;

  return interpolatedValue;
};

/**
 * Calculate estimated balloon payment with optional adjustments
 * @param {Object} params - Calculation parameters
 * @param {number} params.purchasePrice - Vehicle purchase price
 * @param {number} params.termMonths - PCP term in months
 * @param {string} params.make - Vehicle make
 * @param {string} params.model - Vehicle model
 * @param {number} params.year - Vehicle year (optional)
 * @param {number} params.currentMileage - Current vehicle mileage (optional)
 * @param {string} params.condition - Vehicle condition: 'excellent', 'good', 'fair', 'poor' (optional)
 * @returns {Object} Balloon payment estimate with range and adjustment details
 */
export const estimateBalloonPayment = ({
  purchasePrice,
  termMonths,
  make,
  model,
  year,
  currentMileage,
  condition
}) => {
  // Validate inputs
  if (!purchasePrice || purchasePrice <= 0) {
    return {
      estimated: 0,
      min: 0,
      max: 0,
      category: 'Standard',
      residualPercent: 0,
      adjustments: {},
      error: 'Purchase price is required',
    };
  }

  if (!termMonths || termMonths <= 0) {
    return {
      estimated: 0,
      min: 0,
      max: 0,
      category: 'Standard',
      residualPercent: 0,
      adjustments: {},
      error: 'Term is required',
    };
  }

  // Classify vehicle
  const category = classifyVehicleForResidual(make, model);
  const categoryTable = RESIDUAL_VALUE_TABLE[category];

  // Get base residual value percentage
  const baseResidualPercent = getResidualValuePercent(categoryTable, termMonths);
  const baseResidualValue = purchasePrice * baseResidualPercent;

  // ============================================================================
  // Calculate Optional Adjustments
  // ============================================================================

  // Calculate vehicle age for mileage adjustment
  const currentYear = new Date().getFullYear();
  const vehicleAge = year ? currentYear - year : null;

  // Calculate each adjustment factor
  const mileageAdj = calculateMileageAdjustment(currentMileage, vehicleAge);
  const yearAdj = calculateYearAdjustment(year);
  const conditionAdj = calculateConditionAdjustment(condition);
  const marketTrendFactor = MARKET_TREND;

  // Apply adjustments multiplicatively:
  // Adjusted Residual = Base Residual × (1 + MileageAdj) × (1 + YearAdj) × (1 + ConditionAdj) × MarketTrend
  const adjustedResidualValue = baseResidualValue
    * (1 + mileageAdj)
    * (1 + yearAdj)
    * (1 + conditionAdj)
    * marketTrendFactor;

  const estimated = Math.round(adjustedResidualValue);

  // Calculate ±5% range
  const variancePercent = 0.05;
  const min = Math.round(estimated * (1 - variancePercent));
  const max = Math.round(estimated * (1 + variancePercent));

  // Build adjustments object for transparency
  const adjustments = {
    mileage: mileageAdj !== 0 ? {
      adjustment: mileageAdj,
      percentChange: (mileageAdj * 100).toFixed(2) + '%',
      applied: true,
      details: currentMileage && vehicleAge ?
        `${currentMileage.toLocaleString()} miles vs expected ${(MILEAGE_CONFIG.baseAnnualMileage * vehicleAge).toLocaleString()} miles`
        : null
    } : { applied: false },

    year: yearAdj !== 0 ? {
      adjustment: yearAdj,
      percentChange: (yearAdj * 100).toFixed(2) + '%',
      applied: true,
      details: year ? `${vehicleAge} year old vehicle` : null
    } : { applied: false },

    condition: conditionAdj !== 0 ? {
      adjustment: conditionAdj,
      percentChange: (conditionAdj * 100).toFixed(2) + '%',
      applied: true,
      details: condition ? `Condition: ${condition}` : null
    } : { applied: false },

    marketTrend: marketTrendFactor !== 1.00 ? {
      factor: marketTrendFactor,
      percentChange: ((marketTrendFactor - 1) * 100).toFixed(2) + '%',
      applied: true,
      details: `Market trend factor: ${marketTrendFactor}`
    } : { applied: false }
  };

  // Calculate total adjustment impact
  const totalAdjustmentFactor = (1 + mileageAdj) * (1 + yearAdj) * (1 + conditionAdj) * marketTrendFactor;
  const totalAdjustmentPercent = ((totalAdjustmentFactor - 1) * 100).toFixed(2);

  return {
    estimated,
    min,
    max,
    category,
    baseResidualPercent: Math.round(baseResidualPercent * 100),
    baseResidualValue: Math.round(baseResidualValue),
    adjustedResidualPercent: Math.round((adjustedResidualValue / purchasePrice) * 100),
    adjustments,
    totalAdjustment: totalAdjustmentPercent + '%',
    hasAdjustments: Object.values(adjustments).some(adj => adj.applied),
    error: null,
  };
};

/**
 * Get all available terms for a category
 * @param {string} category - Vehicle category
 * @returns {Array<number>} Array of available terms in months
 */
export const getAvailableTerms = (category = 'Standard') => {
  const categoryTable = RESIDUAL_VALUE_TABLE[category] || RESIDUAL_VALUE_TABLE.Standard;
  return Object.keys(categoryTable).map(Number).sort((a, b) => a - b);
};

/**
 * Get residual value table for reference
 * @returns {Object} Complete residual value table
 */
export const getResidualValueTable = () => {
  return RESIDUAL_VALUE_TABLE;
};
