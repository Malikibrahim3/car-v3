/**
 * Flexible Pattern Builder for PDF Extraction
 * Handles variations in formatting, labels, and separators
 */

export const PatternBuilder = {
  /**
   * Build flexible label pattern
   * Accepts multiple label variations and separator types
   */
  label: (terms, separators = '[:=\\-|]?') => {
    const termPattern = terms.join('|');
    return `(?:${termPattern})${separators}\\s*`;
  },

  /**
   * Value pattern builders
   */
  text: () => '([A-Za-z0-9\\s]+?)',
  
  currency: () => {
    // Matches: $1000, 1,000, 1000.00, USD 1000, £1000, €1000, etc.
    return '(?:[$£€]|USD|GBP|EUR)?\\s*([\\d,]+\\.?\\d*)';
  },
  
  year: () => '(20\\d{2}|19\\d{2})',
  
  date: () => {
    // Matches: 10/10/2026, 10-10-2026, October 10, 2026, 2026-10-10, etc.
    return '(\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{2,4}|[A-Z][a-z]+\\s+\\d{1,2},?\\s+\\d{4}|\\d{4}-\\d{2}-\\d{2})';
  },
  
  percentage: () => '([\\d.]+)\\s*%?',
  
  vin: () => '([A-HJ-NPR-Z0-9]{17})',
  
  number: () => '([\\d,]+\\.?\\d*)',

  /**
   * Build complete pattern
   */
  build: (labels, valueType, options = {}) => {
    const labelPattern = PatternBuilder.label(labels, options.separators);
    const valuePattern = PatternBuilder[valueType]();
    const terminator = options.terminator || '(?:\\n|$|[•\\-\\*]|\\||;)';
    const flags = options.flags || 'i';
    
    return new RegExp(
      `${labelPattern}${valuePattern}${terminator}`,
      flags
    );
  },

  /**
   * Build multiple patterns at once
   */
  buildMultiple: (labelGroups, valueType, options = {}) => {
    return labelGroups.map(labels => 
      PatternBuilder.build(labels, valueType, options)
    );
  },
};

/**
 * Common label variations for finance documents
 */
export const CommonLabels = {
  // Vehicle Information
  make: [
    'Make', 'Manufacturer', 'Mfr', 'Brand', 'Vehicle Make', 'Car Make',
    'Auto Make', 'Vehicle Manufacturer'
  ],
  
  model: [
    'Model', 'Vehicle Model', 'Car Model', 'Mdl', 'Vehicle Type',
    'Model Name'
  ],
  
  year: [
    'Year', 'Model Year', 'Yr', 'Year of Manufacture', 'Manufacturing Year',
    'Vehicle Year', 'MY'
  ],
  
  vin: [
    'VIN', 'Vehicle Identification Number', 'Chassis Number', 'Serial Number',
    'Vehicle ID', 'Chassis No', 'Serial No'
  ],
  
  registration: [
    'Registration', 'Reg', 'License Plate', 'Plate Number', 'Reg No',
    'Registration Number', 'Vehicle Registration'
  ],
  
  // Price Information
  price: [
    'Price', 'Purchase Price', 'Sale Price', 'Cash Price', 'Agreed Price',
    'Total Price', 'MSRP', 'Vehicle Price', 'Selling Price', 'List Price',
    'Agreed Cash Price', 'Price of Goods'
  ],
  
  deposit: [
    'Deposit', 'Down Payment', 'Cash Deposit', 'Initial Payment',
    'Upfront Payment', 'Customer Deposit', 'Cash Down', 'Deposit Received',
    'Cash Deposit Received', 'Down Pmt'
  ],
  
  loanAmount: [
    'Loan Amount', 'Amount Financed', 'Amount of Credit', 'Finance Amount',
    'Principal', 'Total Credit', 'Credit Amount', 'Advance Payment',
    'Amount to Finance', 'Financed Amount'
  ],
  
  tradeIn: [
    'Trade-in', 'Trade in', 'Trade In Allowance', 'Part Exchange',
    'Trade Value', 'Trade-in Value', 'Trade Allowance'
  ],
  
  // Financial Terms
  monthlyPayment: [
    'Monthly Payment', 'Regular Payment', 'Monthly Instalment', 'Payment Amount',
    'Monthly Amount', 'Regular Payment Amount', 'Monthly Pmt', 'Instalment',
    'Payment', 'Monthly Installment'
  ],
  
  apr: [
    'APR', 'Annual Percentage Rate', 'Interest Rate', 'Rate', 'Annual Rate',
    'Percentage Rate', 'Finance Rate', 'Interest'
  ],
  
  term: [
    'Term', 'Loan Term', 'Finance Term', 'Duration', 'Period', 'Length',
    'Repayment Period', 'Contract Term', 'Agreement Term'
  ],
  
  balloonPayment: [
    'Balloon Payment', 'Balloon', 'Final Payment', 'Residual', 'GMFV',
    'Guaranteed Future Value', 'Guaranteed Minimum Future Value',
    'Optional Final Payment', 'Residual Value', 'Final Value',
    'Balloon / Residual'
  ],
  
  // Fees
  documentationFee: [
    'Documentation Fee', 'Doc Fee', 'Processing Fee', 'Admin Fee',
    'Documentation / Processing Fee', 'License / Registration / Doc Fee',
    'Document Fee', 'Processing Charge'
  ],
  
  arrangementFee: [
    'Arrangement Fee', 'Loan Origination', 'Admin Fee', 'Acceptance Fee',
    'Setup Fee', 'Origination Fee'
  ],
  
  latePaymentFee: [
    'Late Payment Fee', 'Late Fee', 'Overdue Fee', 'Penalty Fee',
    'Late Charge', 'Default Fee'
  ],
  
  // Dates
  contractDate: [
    'Date of Contract', 'Contract Date', 'Agreement Date', 'Signed Date',
    'Date', 'Dated', 'Signature Date', 'Commencement Date'
  ],
  
  firstPaymentDate: [
    'First Payment', 'First Payment Date', 'Initial Payment Date',
    'Payment Commences', 'First Instalment', 'Start Date'
  ],
  
  // Totals
  totalPayable: [
    'Total Payable', 'Total Amount Payable', 'Total to Pay', 'Total Cost',
    'Total of Payments', 'Grand Total'
  ],
  
  totalCharge: [
    'Total Charge for Credit', 'Credit Charge', 'Finance Charge',
    'Total Interest', 'Interest Payable'
  ],
  
  // Mileage
  mileageAllowance: [
    'Mileage Allowance', 'Annual Mileage', 'Mileage Limit', 'Miles per Year',
    'Mileage Cap', 'Allowed Mileage'
  ],
  
  excessMileage: [
    'Excess Mileage', 'Additional Mileage', 'Over Mileage', 'Excess Charge',
    'Mileage Charge', 'Per Mile Charge'
  ],
};

/**
 * Helper function to try multiple patterns
 */
export function tryPatterns(text, patterns, options = {}) {
  const { transform, validate } = options;
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let value = match[1].trim();
      
      // Apply transformation if provided
      if (transform) {
        value = transform(value);
      }
      
      // Validate if validator provided
      if (validate && !validate(value)) {
        continue;
      }
      
      return {
        value,
        pattern: pattern.source,
        confidence: 0.8, // High confidence for pattern match
      };
    }
  }
  
  return null;
}

/**
 * Common transformations
 */
export const Transforms = {
  // Remove currency symbols and parse as float
  currency: (value) => {
    return parseFloat(value.replace(/[$£€,]/g, ''));
  },
  
  // Parse as integer
  integer: (value) => {
    return parseInt(value.replace(/,/g, ''));
  },
  
  // Normalize date to YYYY-MM-DD
  date: (value) => {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      // Return as-is if parsing fails
    }
    return value;
  },
  
  // Parse percentage
  percentage: (value) => {
    return parseFloat(value.replace(/%/g, ''));
  },
  
  // Clean text (remove extra whitespace)
  text: (value) => {
    return value.replace(/\s+/g, ' ').trim();
  },
};

/**
 * Common validators
 */
export const Validators = {
  // Validate year is reasonable
  year: (value) => {
    const year = parseInt(value);
    return year >= 1900 && year <= new Date().getFullYear() + 2;
  },
  
  // Validate currency is positive
  currency: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },
  
  // Validate VIN format
  vin: (value) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
  },
  
  // Validate percentage is reasonable
  percentage: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  },
  
  // Validate text is not empty
  text: (value) => {
    return value && value.length > 0 && value.length < 200;
  },
};
