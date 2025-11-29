/**
 * PDF Finance Agreement Parser
 * 
 * Extracts and normalizes finance agreement data from PDF documents
 * Uses pdfjs-dist for text extraction and intelligent regex/proximity parsing
 */

import { Platform } from 'react-native';

let pdfjsLib;
if (Platform.OS === 'web') {
  pdfjsLib = require('pdfjs-dist');
  // Configure PDF.js worker - use local worker file
  // This file is copied from node_modules/pdfjs-dist/build/pdf.worker.min.mjs to public/
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;
}

import { PatternBuilder, CommonLabels, tryPatterns, Transforms, Validators } from './patternBuilder';

/**
 * Extract text content from PDF file
 * @param {File} file - PDF file to extract
 * @returns {Promise<string>} Extracted text content
 */
export const extractPDFText = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Parse finance agreement text and extract structured data
 * @param {string} text - Raw text from PDF
 * @returns {Object} Parsed agreement data with confidence scores
 */
export const parseFinanceAgreement = (text) => {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  
  const parsed = {
    customerName: extractCustomerName(normalizedText),
    customer: extractCustomerInfo(normalizedText),
    vehicle: extractVehicleInfo(normalizedText),
    price: extractPriceInfo(normalizedText),
    finance: extractFinanceInfo(normalizedText),
    dates: extractDatesInfo(normalizedText),
    totals: extractTotalsInfo(normalizedText),
    mileage: extractMileageInfo(normalizedText),
    fees: extractFeesInfo(normalizedText),
    payments: extractPaymentInfo(normalizedText),
    paymentSchedule: extractPaymentSchedule(normalizedText),
    confidence: 0,
    notes: [],
  };
  
  // Apply calculation fallbacks for missing fields
  applyCalculationFallbacks(parsed, normalizedText);
  
  // Calculate overall confidence
  parsed.confidence = calculateConfidence(parsed);
  
  // Clean up invalid registration (placeholder text)
  if (parsed.vehicle.registration && 
      (parsed.vehicle.registration.toLowerCase() === 'vehicle' || 
       parsed.vehicle.registration.toLowerCase() === 'n/a' ||
       parsed.vehicle.registration.toLowerCase() === 'tbd')) {
    console.log('⚠️  Removing placeholder registration:', parsed.vehicle.registration);
    parsed.vehicle.registration = null;
  }
  
  return parsed;
};

/**
 * Extract customer name (simplified for top-level access)
 */
const extractCustomerName = (text) => {
  const namePatterns = [
    // "Buyer / Borrower: John M. Doe" format
    /(?:Buyer\s*\/\s*Borrower|Buyer\s*\/\s*Customer)[:\s]+([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/i,
    // Standard formats
    /(?:customer|buyer|purchaser|name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/i,
    /(?:mr|mrs|ms|miss|dr)\.?\s+([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/i,
    /(?:full name|applicant)[:\s]+([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/i,
    // "Name: John M. Doe" in signature block
    /Name:\s+([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/,
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
};

/**
 * Extract customer information
 */
const extractCustomerInfo = (text) => {
  const customer = {
    name: null,
    address: null,
    postcode: null,
    email: null,
    phone: null,
  };
  
  // Extract name (common patterns)
  const namePatterns = [
    /(?:customer|buyer|purchaser|name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
    /(?:mr|mrs|ms|miss|dr)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      customer.name = match[1].trim();
      break;
    }
  }
  
  // Extract postcode (UK format)
  const postcodeMatch = text.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/);
  if (postcodeMatch) {
    customer.postcode = postcodeMatch[1];
  }
  
  // Extract email
  const emailMatch = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
  if (emailMatch) {
    customer.email = emailMatch[1];
  }
  
  // Extract phone
  const phoneMatch = text.match(/\b(\+?44\s?)?(\d{4,5}\s?\d{6}|\d{3}\s?\d{3}\s?\d{4})\b/);
  if (phoneMatch) {
    customer.phone = phoneMatch[0].trim();
  }
  
  return customer;
};

/**
 * Extract vehicle information
 */
const extractVehicleInfo = (text) => {
  const vehicle = {
    make: null,
    model: null,
    trim: null,
    year: null,
    vin: null,
    registration: null,
  };
  
  // PRIORITY 1: Try unformatted/narrative extraction first
  // Pattern: "2025 Tesla Model X Plaid, VIN: ..."
  const narrativePattern = /(\d{4})\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+([A-Za-z0-9\s]+?),?\s+VIN:/i;
  const narrativeMatch = text.match(narrativePattern);
  
  if (narrativeMatch) {
    vehicle.year = narrativeMatch[1];
    vehicle.make = narrativeMatch[2].trim();
    const modelAndTrim = narrativeMatch[3].trim();
    
    // Split model and trim
    const trimKeywords = ['Plaid', 'Long Range', 'Performance', 'Autobiography', 'HSE', 'SE', 'Sport', 'Dynamic'];
    let foundTrim = false;
    for (const trim of trimKeywords) {
      if (modelAndTrim.includes(trim)) {
        vehicle.model = modelAndTrim.replace(trim, '').trim();
        vehicle.trim = trim;
        foundTrim = true;
        break;
      }
    }
    if (!foundTrim) {
      vehicle.model = modelAndTrim;
    }
    
    console.log('🚗 Vehicle extracted (narrative):', vehicle.year, vehicle.make, vehicle.model, vehicle.trim);
  }
  
  // PRIORITY 2: Try structured extraction
  if (!vehicle.make) {
    // Extract Make - try multiple flexible patterns
    const makePatterns = [
      // Bullet + label variations
      PatternBuilder.build(CommonLabels.make, 'text'),
      // Table format
      new RegExp(`\\|\\s*(?:${CommonLabels.make.join('|')})\\s*\\|\\s*([A-Za-z\\s]+?)\\s*\\|`, 'i'),
      // No separator, just label and value
      new RegExp(`(?:${CommonLabels.make.join('|')})\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)`, 'i'),
    ];
    
    const makeResult = tryPatterns(text, makePatterns, {
      transform: Transforms.text,
      validate: Validators.text,
    });
    
    if (makeResult) {
      vehicle.make = makeResult.value;
      console.log('🚗 Make extracted:', vehicle.make);
    }
  }
  
  // Extract Model - try multiple flexible patterns
  const modelPatterns = [
    // Bullet + label variations
    PatternBuilder.build(CommonLabels.model, 'text'),
    // Table format
    new RegExp(`\\|\\s*(?:${CommonLabels.model.join('|')})\\s*\\|\\s*([A-Za-z0-9\\s]+?)\\s*\\|`, 'i'),
    // No separator
    new RegExp(`(?:${CommonLabels.model.join('|')})\\s+([A-Za-z0-9\\s]+?)(?=\\n|$|[•\\-\\*])`, 'i'),
  ];
  
  const modelResult = tryPatterns(text, modelPatterns, {
    transform: Transforms.text,
    validate: Validators.text,
  });
  
  if (modelResult) {
    const fullModel = modelResult.value;
    
    // Split model and trim - common trim levels
    const trimKeywords = [
      'Autobiography', 'HSE', 'SE', 'Sport', 'Dynamic', 'Vogue', 'SVR',
      'Limited', 'Premium', 'Luxury', 'Base', 'LX', 'EX', 'Touring',
      'S', 'SV', 'R-Dynamic', 'First Edition', 'Black Edition',
      'Platinum', 'Ultimate', 'Elite', 'Prestige', 'GT', 'RS', 'M Sport'
    ];
    
    let modelPart = fullModel;
    let trimPart = null;
    
    // Check if any trim keyword is in the model string
    for (const trim of trimKeywords) {
      const trimRegex = new RegExp(`\\b${trim}\\b`, 'i');
      if (trimRegex.test(fullModel)) {
        // Split at the trim keyword
        const parts = fullModel.split(trimRegex);
        modelPart = parts[0].trim();
        trimPart = fullModel.substring(modelPart.length).trim();
        break;
      }
    }
    
    vehicle.model = modelPart;
    vehicle.trim = trimPart;
    console.log('🚗 Model extracted:', vehicle.model, vehicle.trim ? `(Trim: ${vehicle.trim})` : '');
  }
  
  // Fallback: Try to find known makes in text
  if (!vehicle.make) {
    const knownMakes = [
      'Land Rover', 'Range Rover', 'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes',
      'Mercedes-Benz', 'Audi', 'Volkswagen', 'VW', 'Nissan', 'Mazda', 'Hyundai',
      'Kia', 'Lexus', 'Jaguar', 'Porsche', 'Tesla', 'Volvo', 'Subaru', 'Jeep',
      'Chevrolet', 'Chevy', 'Dodge', 'Ram', 'GMC', 'Cadillac', 'Buick',
      'Lincoln', 'Acura', 'Infiniti', 'Genesis', 'Alfa Romeo', 'Fiat',
      'Mini', 'Bentley', 'Rolls-Royce', 'Aston Martin', 'McLaren', 'Ferrari',
      'Lamborghini', 'Maserati', 'Lotus'
    ];
    
    for (const make of knownMakes) {
      const makePattern = new RegExp(`\\b(${make})\\b`, 'i');
      const match = text.match(makePattern);
      if (match) {
        vehicle.make = match[1];
        console.log('🚗 Make extracted (fallback):', vehicle.make);
        break;
      }
    }
  }
  
  // Special fallback for Tesla models (Model S, Model 3, Model X, Model Y)
  if (vehicle.make && vehicle.make.toLowerCase() === 'tesla' && !vehicle.model) {
    const teslaModelPattern = /\b(Model\s+[S3XY]|Model\s+[0-9])\b/i;
    const teslaMatch = text.match(teslaModelPattern);
    if (teslaMatch) {
      vehicle.model = teslaMatch[1];
      console.log('🚗 Tesla model extracted (fallback):', vehicle.model);
    }
  }
  
  // Extract Tesla trim if Tesla make
  if (vehicle.make && vehicle.make.toLowerCase() === 'tesla' && !vehicle.trim) {
    const teslaTrimPattern = /\b(Long Range|Performance|Plaid|Standard Range|Plus)\b/i;
    const trimMatch = text.match(teslaTrimPattern);
    if (trimMatch) {
      vehicle.trim = trimMatch[1];
      console.log('🚗 Tesla trim extracted:', vehicle.trim);
    }
  }
  
  // Extract Year - try multiple flexible patterns
  const yearPatterns = [
    // Labeled format
    PatternBuilder.build(CommonLabels.year, 'year'),
    // Table format
    new RegExp(`\\|\\s*(?:${CommonLabels.year.join('|')})\\s*\\|\\s*(20\\d{2}|19\\d{2})\\s*\\|`, 'i'),
    // Just year near vehicle context
    /(?:vehicle|car|model).*?(20\d{2}|19\d{2})/i,
  ];
  
  const yearResult = tryPatterns(text, yearPatterns, {
    validate: Validators.year,
  });
  
  if (yearResult) {
    vehicle.year = yearResult.value;
    console.log('🚗 Vehicle year extracted:', vehicle.year);
  } else {
    // Fallback: Find most recent reasonable year
    const yearPattern = /\b(20\d{2}|19\d{2})\b/g;
    const years = text.match(yearPattern);
    if (years && years.length > 0) {
      const validYears = years
        .map(y => parseInt(y))
        .filter(y => y >= 2000 && y <= new Date().getFullYear() + 2);
      if (validYears.length > 0) {
        vehicle.year = Math.max(...validYears).toString();
        console.log('🚗 Vehicle year extracted (fallback):', vehicle.year);
      }
    }
  }
  
  // Extract VIN - try multiple flexible patterns
  const vinPatterns = [
    PatternBuilder.build(CommonLabels.vin, 'vin'),
    // Just VIN pattern anywhere
    /\b([A-HJ-NPR-Z0-9]{17})\b/,
  ];
  
  const vinResult = tryPatterns(text, vinPatterns, {
    validate: Validators.vin,
  });
  
  if (vinResult) {
    vehicle.vin = vinResult.value;
    console.log('🚗 VIN extracted:', vehicle.vin);
  }
  
  // Extract Registration - try multiple flexible patterns
  const regPatterns = [
    PatternBuilder.build(CommonLabels.registration, 'text'),
    // UK format
    /\b([A-Z]{2}\d{2}\s?[A-Z]{3})\b/,
    // US format (letters and numbers, not just numbers)
    /\b([A-Z]{2,3}\s?[A-Z0-9]{3,4})\b/,
  ];
  
  const regResult = tryPatterns(text, regPatterns);
  
  if (regResult) {
    const reg = regResult.value.replace(/\s/g, '');
    // Validate: should not be all numbers (likely a ZIP code)
    if (!/^\d+$/.test(reg) && reg.length >= 5 && reg.length <= 10) {
      vehicle.registration = reg;
      console.log('🚗 Registration extracted:', vehicle.registration);
    } else {
      console.log('⚠️  Skipping invalid registration (likely ZIP):', reg);
    }
  }
  
  return vehicle;
};

/**
 * Extract price information
 */
const extractPriceInfo = (text) => {
  const price = {
    totalPrice: null,
    deposit: null,
    amountFinanced: null,
    tradeIn: null,
  };
  
  // Extract Deposit - try multiple flexible patterns
  // Priority 1: Look for "Net Cash Due at Delivery" (most accurate total)
  const netCashPattern = /Net Cash Due at Delivery[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i;
  const netCashMatch = text.match(netCashPattern);
  
  if (netCashMatch) {
    price.deposit = parseFloat(netCashMatch[1].replace(/,/g, ''));
    console.log('💰 Deposit extracted (Net Cash Due):', price.deposit);
  } else {
    // Priority 2: Try to sum individual deposit components
    let cashDeposit = 0;
    let downPayment = 0;
    let tradeEquity = 0;
    
    // Extract Cash Deposit Received
    const cashDepositMatch = text.match(/Cash Deposit Received[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i);
    if (cashDepositMatch) {
      cashDeposit = parseFloat(cashDepositMatch[1].replace(/,/g, ''));
      console.log('💰 Cash deposit found:', cashDeposit);
    }
    
    // Extract Down Payment
    const downPaymentMatch = text.match(/Down Payment[^:]*?(?:Applied)?[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i);
    if (downPaymentMatch) {
      downPayment = parseFloat(downPaymentMatch[1].replace(/,/g, ''));
      console.log('💰 Down payment found:', downPayment);
    }
    
    // Extract Trade Equity
    const tradeEquityMatch = text.match(/Trade Equity Applied[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i);
    if (tradeEquityMatch) {
      tradeEquity = parseFloat(tradeEquityMatch[1].replace(/,/g, ''));
      console.log('💰 Trade equity found:', tradeEquity);
    }
    
    // Sum all deposit components
    if (cashDeposit > 0 || downPayment > 0 || tradeEquity > 0) {
      price.deposit = cashDeposit + downPayment + tradeEquity;
      console.log('💰 Total deposit calculated:', price.deposit, `(Cash: ${cashDeposit} + Down: ${downPayment} + Trade: ${tradeEquity})`);
    } else {
      // Priority 3: Fallback to generic deposit patterns
      const depositPatterns = [
        PatternBuilder.build(CommonLabels.deposit, 'currency'),
        /(?:you (?:will )?pay|paying)[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)\s*(?:deposit|upfront)/i,
      ];
      
      const depositResult = tryPatterns(text, depositPatterns, {
        transform: Transforms.currency,
        validate: Validators.currency,
      });
      
      if (depositResult) {
        price.deposit = depositResult.value;
        console.log('💰 Deposit extracted (fallback):', price.deposit);
      }
    }
  }
  
  // Fallback: Calculate from Total Price and Amount Financed
  if (!price.deposit && price.totalPrice && price.amountFinanced) {
    price.deposit = price.totalPrice - price.amountFinanced;
    if (price.deposit > 0) {
      console.log('💰 Deposit calculated:', price.deposit);
    } else {
      price.deposit = null;
    }
  }
  
  // Extract Total Price - try multiple flexible patterns
  const pricePatterns = [
    PatternBuilder.build(CommonLabels.price, 'currency'),
    // Narrative format: "Total Agreed Price: $120,000"
    /Total Agreed Price[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // MSRP format
    /MSRP[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Try to find large amounts (likely purchase price)
    /(?:price|cost|value).*?(?:£|\$)\s*([\d,]+\.?\d*)/i,
  ];
  
  const priceResult = tryPatterns(text, pricePatterns, {
    transform: Transforms.currency,
    validate: Validators.currency,
  });
  
  if (priceResult) {
    price.totalPrice = priceResult.value;
    console.log('💰 Total price extracted:', price.totalPrice);
  }
  
  // Fallback: If we have Amount Financed and Deposit, calculate Total Price
  if (!price.totalPrice && price.amountFinanced && price.deposit) {
    price.totalPrice = price.amountFinanced + price.deposit;
    console.log('💰 Total price calculated:', price.totalPrice);
  }
  
  // Extract Amount Financed - CRITICAL: Must avoid "Gross Capitalized Cost"
  // Priority 1: Look for explicit "Amount Financed" with context
  const amountFinancedPatterns = [
    // With (AF) abbreviation or equals sign
    /Amount Financed\s*(?:\(AF\))?\s*[=:]\s*(?:Gross Capitalized Cost\s*[-−]\s*Trade Allowance\s*[-−]\s*Cash Down[^$£]*)?(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // In appendix/disclosure section
    /(?:Appendices|TILA|Disclosure).*?Amount Financed[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/is,
    // Standalone with colon
    /^[•\s]*Amount Financed[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/im,
    // Net Amount Financed
    /Net Amount Financed[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
  ];
  
  let amountFinancedFound = false;
  for (const pattern of amountFinancedPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      // Sanity check: Should be reasonable compared to price
      if (!price.totalPrice || (value > 1000 && value < price.totalPrice * 2)) {
        price.amountFinanced = value;
        console.log('💰 Amount financed extracted:', price.amountFinanced);
        amountFinancedFound = true;
        break;
      }
    }
  }
  
  // Priority 2: If not found, try generic patterns (but validate heavily)
  if (!amountFinancedFound) {
    const genericPatterns = [
      /(?:Amount of Credit|Finance Amount)[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    ];
    
    const financedResult = tryPatterns(text, genericPatterns, {
      transform: Transforms.currency,
      validate: Validators.currency,
    });
    
    if (financedResult) {
      price.amountFinanced = financedResult.value;
      console.log('💰 Amount financed extracted (generic):', price.amountFinanced);
    }
  }
  
  // CRITICAL VALIDATION: Amount Financed should NOT be Gross Capitalized Cost
  if (price.amountFinanced && price.totalPrice) {
    // Check if we accidentally extracted Gross Capitalized Cost
    const grossCapMatch = text.match(/Gross Capitalized Cost[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i);
    if (grossCapMatch) {
      const grossCap = parseFloat(grossCapMatch[1].replace(/,/g, ''));
      if (Math.abs(price.amountFinanced - grossCap) < 1) {
        console.log('⚠️  Detected Gross Capitalized Cost extraction:', price.amountFinanced);
        console.log('   This is NOT the Amount Financed. Recalculating...');
        price.amountFinanced = null; // Clear it
      }
    }
    
    // If Amount Financed > Total Price, it's definitely wrong
    if (price.amountFinanced && price.amountFinanced > price.totalPrice * 1.2) {
      console.log('⚠️  Amount Financed too high:', price.amountFinanced, 'vs Total Price:', price.totalPrice);
      price.amountFinanced = null; // Clear it for recalculation
    }
  }
  
  // Calculate amount financed if not found
  if (!price.amountFinanced && price.totalPrice && price.deposit) {
    price.amountFinanced = price.totalPrice - price.deposit;
    console.log('💰 Amount financed calculated:', price.amountFinanced);
  }
  
  // Extract Trade-in - try multiple flexible patterns
  const tradeInPatterns = [
    PatternBuilder.build(CommonLabels.tradeIn, 'currency'),
  ];
  
  const tradeInResult = tryPatterns(text, tradeInPatterns, {
    transform: Transforms.currency,
    validate: Validators.currency,
  });
  
  if (tradeInResult) {
    price.tradeIn = tradeInResult.value;
    console.log('💰 Trade-in extracted:', price.tradeIn);
  }
  
  return price;
};

/**
 * Extract finance information
 */
const extractFinanceInfo = (text) => {
  const finance = {
    monthlyPayment: null,
    term: null,
    apr: null,
    interestRate: null,
    balloonPayment: null,
    finalPayment: null,
  };
  
  // Extract Monthly Payment - try multiple flexible patterns
  const monthlyPatterns = [
    PatternBuilder.build(CommonLabels.monthlyPayment, 'currency'),
    // Narrative format: "monthly payment $1,500"
    /monthly payment\s+(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Narrative format: "47 payments of $1,095"
    /(?:\d+\s*(?:payments|instalments)\s*of)[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)/i,
    // From payment schedule (first payment amount)
    /1\s+\d{4}-\d{2}-\d{2}\s+(?:\$|£)?\s*[\d,]+\.?\d*\s+(?:\$|£)?\s*[\d,]+\.?\d*\s+(?:\$|£)?\s*([\d,]+\.?\d*)/i,
  ];
  
  const monthlyResult = tryPatterns(text, monthlyPatterns, {
    transform: Transforms.currency,
    validate: Validators.currency,
  });
  
  if (monthlyResult) {
    finance.monthlyPayment = monthlyResult.value;
    console.log('💳 Monthly payment extracted:', finance.monthlyPayment);
  }
  
  // Fallback: Calculate from Amount Financed and Term (simple approximation)
  if (!finance.monthlyPayment && finance.term) {
    // This will be filled in later if we have amountFinanced
  }
  
  // Extract Term - try multiple flexible patterns
  const termPatterns = [
    PatternBuilder.build(CommonLabels.term, 'number'),
    // With "months" suffix
    /(\d+)\s*(?:monthly payments|months|instalments)/i,
    // Narrative format: "60-month term"
    /(\d+)-month\s+term/i,
    // In finance summary
    /term[:\s]*(\d+)\s*months?/i,
  ];
  
  const termResult = tryPatterns(text, termPatterns, {
    transform: Transforms.integer,
  });
  
  if (termResult) {
    finance.term = termResult.value;
    console.log('📅 Term extracted:', finance.term, 'months');
  }
  
  // Fallback: Look for reasonable term values (12-84 months)
  if (!finance.term) {
    const termFallbackPattern = /\b(12|24|36|48|60|72|84)\s*months?\b/i;
    const termMatch = text.match(termFallbackPattern);
    if (termMatch) {
      finance.term = parseInt(termMatch[1]);
      console.log('📅 Term extracted (fallback):', finance.term, 'months');
    }
  }
  
  // Extract APR - try multiple flexible patterns
  const aprPatterns = [
    PatternBuilder.build(CommonLabels.apr, 'percentage'),
    // Narrative format: "APR 5.75%"
    /APR\s+([\d.]+)%/i,
    // Reverse format
    /([\d.]+)%\s*(?:APR|Annual Percentage Rate)/i,
    // Just percentage near APR mention
    /APR.*?([\d.]+)%/i,
    /Interest.*?([\d.]+)%/i,
    // Percentage alone (if reasonable range)
    /\b([\d.]+)%\b/g,
  ];
  
  const aprResult = tryPatterns(text, aprPatterns, {
    transform: Transforms.percentage,
    validate: Validators.percentage,
  });
  
  if (aprResult) {
    finance.apr = aprResult.value;
    finance.interestRate = aprResult.value;
    console.log('📊 APR extracted:', finance.apr, '%');
  }
  
  // Fallback: Look for any reasonable percentage (0.1% - 30%)
  if (!finance.apr) {
    const percentages = text.match(/\b([\d.]+)%/g);
    if (percentages) {
      for (const pct of percentages) {
        const value = parseFloat(pct.replace('%', ''));
        // Reasonable APR range for car loans
        if (value >= 0.1 && value <= 30) {
          finance.apr = value;
          finance.interestRate = value;
          console.log('📊 APR inferred from percentages:', finance.apr, '%');
          break;
        }
      }
    }
  }
  
  // Extract Balloon Payment - CRITICAL: Must be large amount, not monthly payment
  const balloonPatterns = [
    // Balloon with explicit label
    /Balloon[^:]*?(?:Payment|Amount)?[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Residual / GMFV
    /(?:Residual|GMFV|Guaranteed Future Value)[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Optional Final Payment
    /Optional Final Payment[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Final payment (if customer takes vehicle)
    /final payment[^:]*?(?:customer pays to own)?[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Narrative format: "balloon $35,000"
    /balloon\s+(?:£|\$)\s*([\d,]+\.?\d*)/i,
  ];
  
  let balloonFound = false;
  for (const pattern of balloonPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      
      // VALIDATION: Balloon should be a large amount (typically $10K+)
      // NOT the monthly payment or term
      if (value >= 5000) {
        // Additional check: If we have monthly payment, balloon should be much larger
        if (!finance.monthlyPayment || value > finance.monthlyPayment * 5) {
          // Additional check: If we have term, balloon should not equal term
          if (!finance.term || Math.abs(value - finance.term) > 100) {
            finance.balloonPayment = value;
            finance.finalPayment = value;
            console.log('🎈 Balloon payment extracted:', finance.balloonPayment);
            balloonFound = true;
            break;
          }
        }
      }
    }
  }
  
  // Check if document mentions PCP or balloon but no amount found
  if (!balloonFound && /(?:PCP|balloon|residual|GMFV)/i.test(text)) {
    console.log('⚠️  Document mentions balloon/PCP but amount not extracted');
  }
  
  return finance;
};

/**
 * Extract totals information
 */
const extractTotalsInfo = (text) => {
  const totals = {
    totalPayable: null,
    totalCharge: null,
    totalInterest: null,
  };
  
  // Extract total payable
  const payablePatterns = [
    /(?:total amount payable|total payable|total to pay)[:\s]*£?\s*([\d,]+\.?\d*)/i,
    /(?:total cost)[:\s]*£?\s*([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of payablePatterns) {
    const match = text.match(pattern);
    if (match) {
      totals.totalPayable = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract total charge for credit
  const chargePattern = /(?:total charge for credit|credit charge)[:\s]*£?\s*([\d,]+\.?\d*)/i;
  const chargeMatch = text.match(chargePattern);
  if (chargeMatch) {
    totals.totalCharge = parseFloat(chargeMatch[1].replace(/,/g, ''));
  }
  
  // Extract total interest
  const interestPattern = /(?:total interest|interest payable)[:\s]*£?\s*([\d,]+\.?\d*)/i;
  const interestMatch = text.match(interestPattern);
  if (interestMatch) {
    totals.totalInterest = parseFloat(interestMatch[1].replace(/,/g, ''));
  }
  
  return totals;
};

/**
 * Extract mileage information
 */
const extractMileageInfo = (text) => {
  const mileage = {
    allowance: null,
    excessCharge: null,
  };
  
  // Extract mileage allowance
  const allowancePatterns = [
    /(?:mileage allowance|annual mileage|mileage limit)[:\s]*([\d,]+)\s*(?:miles|per year)?/i,
    /([\d,]+)\s*miles?\s*per\s*(?:year|annum)/i,
  ];
  
  for (const pattern of allowancePatterns) {
    const match = text.match(pattern);
    if (match) {
      mileage.allowance = parseInt(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract excess mileage charge
  const excessPatterns = [
    /(?:excess mileage|additional mileage|over mileage)[:\s]*£?\s*([\d.]+)\s*(?:per mile|p\/mile|pence)/i,
    /([\d.]+)\s*(?:pence|p)\s*per\s*(?:excess\s*)?mile/i,
  ];
  
  for (const pattern of excessPatterns) {
    const match = text.match(pattern);
    if (match) {
      let charge = parseFloat(match[1]);
      // Convert pence to pounds if needed
      if (charge > 1) {
        charge = charge / 100;
      }
      mileage.excessCharge = charge;
      break;
    }
  }
  
  return mileage;
};

/**
 * Extract fees information
 */
const extractFeesInfo = (text) => {
  const fees = {
    arrangementFee: null,
    documentationFee: null,
    optionToPurchaseFee: null,
    latePaymentFee: null,
    processingFee: null,
  };
  
  // Extract arrangement fee
  const arrangementPatterns = [
    /(?:Loan Origination|Arrangement Fee|Admin Fee|Acceptance Fee)(?:\s*\/\s*[^:]+)?[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of arrangementPatterns) {
    const match = text.match(pattern);
    if (match) {
      fees.arrangementFee = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract documentation/processing fee
  const docPatterns = [
    // "Documentation / Processing Fee: $299.00"
    /Documentation\s*\/\s*Processing\s*Fee[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)/i,
    // "License / Registration / Doc Fee: $650.00"
    /License\s*\/\s*Registration\s*\/\s*Doc\s*Fee[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)/i,
    // Narrative format: "Documentation Fee: $399"
    /Documentation Fee[:\s]*(?:£|\$)\s*([\d,]+\.?\d*)/i,
    // Generic patterns
    /(?:Doc Fee|Processing Fee)[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of docPatterns) {
    const match = text.match(pattern);
    if (match) {
      fees.documentationFee = parseFloat(match[1].replace(/,/g, ''));
      fees.processingFee = fees.documentationFee;
      console.log('📄 Documentation fee extracted:', fees.documentationFee);
      break;
    }
  }
  
  // Extract option to purchase fee
  const optionPattern = /(?:Option to Purchase Fee|Purchase Fee|Final Fee)[:\s]*(?:£|\$)?\s*([\d,]+\.?\d*)/i;
  const optionMatch = text.match(optionPattern);
  if (optionMatch) {
    fees.optionToPurchaseFee = parseFloat(optionMatch[1].replace(/,/g, ''));
  }
  
  // Extract late payment fee
  const latePattern = /(?:Late Payment Fee)[:\s]*(?:greater of\s*)?(?:£|\$)?\s*([\d,]+\.?\d*)/i;
  const lateMatch = text.match(latePattern);
  if (lateMatch) {
    fees.latePaymentFee = parseFloat(lateMatch[1].replace(/,/g, ''));
  }
  
  return fees;
};

/**
 * Extract dates information
 */
const extractDatesInfo = (text) => {
  const dates = {
    startDate: null,
    agreementDate: null,
    firstPaymentDate: null,
    lastPaymentDate: null,
    nextPaymentDate: null,
  };
  
  // Extract agreement/start date - handle text dates like "October 10, 2026" or "dated July 15, 2025"
  const startPatterns = [
    /(?:Date of Contract|Agreement Date|Start Date|Commencement Date)[:\s]+([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/i,
    /(?:Date of Contract|Agreement Date|Start Date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:Dated|Date)[:\s]+([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/i,
    /(?:Agreement Date|Start Date)[:\s]*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i,
    // Narrative format: "dated July 15, 2025"
    /dated\s+([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/i,
  ];
  
  for (const pattern of startPatterns) {
    const match = text.match(pattern);
    if (match) {
      dates.startDate = normalizeDate(match[1]);
      dates.agreementDate = dates.startDate;
      console.log('📅 Start date extracted:', dates.startDate);
      break;
    }
  }
  
  // Extract first payment date - look for dates in payment schedule
  const firstPaymentPatterns = [
    /(?:First Payment|Initial Payment|Payment Commences)[:\s]*(\d{4}-\d{2}-\d{2})/i,
    /(?:First Payment Date)[:\s]*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i,
    /1\s+(\d{4}-\d{2}-\d{2})\s+(?:\$|£)?[\d,]+\.?\d*/i, // From payment schedule "1   2026-11-10   $..."
    // Narrative format: "First payment due August 15, 2025"
    /First payment due\s+([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/i,
  ];
  
  for (const pattern of firstPaymentPatterns) {
    const match = text.match(pattern);
    if (match) {
      dates.firstPaymentDate = normalizeDate(match[1]);
      console.log('📅 First payment date extracted:', dates.firstPaymentDate);
      console.log('📅 First payment date extracted:', dates.firstPaymentDate);
      break;
    }
  }
  
  // Extract last payment date
  const lastPaymentPatterns = [
    /(?:Final Payment|Last Payment|End Date)[:\s]*(\d{4}-\d{2}-\d{2})/i,
    /(?:Final Payment Date)[:\s]*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i,
  ];
  
  for (const pattern of lastPaymentPatterns) {
    const match = text.match(pattern);
    if (match) {
      dates.lastPaymentDate = normalizeDate(match[1]);
      break;
    }
  }
  
  return dates;
};

/**
 * Extract payment information
 */
const extractPaymentInfo = (text) => {
  const payments = {
    totalPaidToDate: null,
    remainingBalance: null,
    paymentsCompleted: null,
    paymentsRemaining: null,
  };
  
  // Extract total paid to date
  const paidPatterns = [
    /(?:total paid|paid to date|amount paid)[:\s]*£?\s*([\d,]+\.?\d*)/i,
    /(?:you have paid)[:\s]*£?\s*([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of paidPatterns) {
    const match = text.match(pattern);
    if (match) {
      payments.totalPaidToDate = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract remaining balance
  const balancePatterns = [
    /(?:remaining balance|balance outstanding|amount outstanding)[:\s]*£?\s*([\d,]+\.?\d*)/i,
    /(?:you owe|outstanding)[:\s]*£?\s*([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of balancePatterns) {
    const match = text.match(pattern);
    if (match) {
      payments.remainingBalance = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract payments completed
  const completedPattern = /(\d+)\s*(?:payments? (?:made|completed|paid))/i;
  const completedMatch = text.match(completedPattern);
  if (completedMatch) {
    payments.paymentsCompleted = parseInt(completedMatch[1]);
  }
  
  // Extract payments remaining
  const remainingPattern = /(\d+)\s*(?:payments? remaining|remaining payments?)/i;
  const remainingMatch = text.match(remainingPattern);
  if (remainingMatch) {
    payments.paymentsRemaining = parseInt(remainingMatch[1]);
  }
  
  return payments;
};

/**
 * Extract payment schedule information
 */
const extractPaymentSchedule = (text) => {
  const schedule = {
    firstPaymentDate: null,
    paymentDay: null,
    frequency: 'monthly',
    schedule: [],
  };
  
  // Extract payment schedule description
  const schedulePattern = /Payment Schedule:\s*([^•\n]+)/i;
  const scheduleMatch = text.match(schedulePattern);
  if (scheduleMatch) {
    const description = scheduleMatch[1].trim();
    // Extract payment day if mentioned
    const dayPattern = /same day|(\d{1,2})(?:st|nd|rd|th)?\s*(?:of|day)/i;
    const dayMatch = description.match(dayPattern);
    if (dayMatch && dayMatch[1]) {
      schedule.paymentDay = parseInt(dayMatch[1]);
    }
  }
  
  // Extract first few payment dates from schedule table
  const paymentPattern = /(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(?:\$|£)?([\d,]+\.?\d*)\s+(?:\$|£)?([\d,]+\.?\d*)\s+(?:\$|£)?([\d,]+\.?\d*)/g;
  let match;
  while ((match = paymentPattern.exec(text)) !== null && schedule.schedule.length < 6) {
    schedule.schedule.push({
      paymentNumber: parseInt(match[1]),
      dueDate: match[2],
      principalPortion: parseFloat(match[3].replace(/,/g, '')),
      interestPortion: parseFloat(match[4].replace(/,/g, '')),
      paymentAmount: parseFloat(match[5].replace(/,/g, '')),
    });
  }
  
  // Set first payment date from schedule
  if (schedule.schedule.length > 0) {
    schedule.firstPaymentDate = schedule.schedule[0].dueDate;
  }
  
  return schedule;
};

/**
 * Normalize date to YYYY-MM-DD format
 */
const normalizeDate = (dateStr) => {
  try {
    // Handle various date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // If parsing fails, return as-is
  }
  return dateStr;
};

/**
 * Apply calculation fallbacks for missing fields
 */
const applyCalculationFallbacks = (parsed, text) => {
  // Cross-validate Amount Financed, Total Price, and Deposit
  // Amount Financed should equal Total Price - Deposit (approximately)
  if (parsed.price.totalPrice && parsed.price.deposit && parsed.price.amountFinanced) {
    const expectedFinanced = parsed.price.totalPrice - parsed.price.deposit;
    const difference = Math.abs(parsed.price.amountFinanced - expectedFinanced);
    const percentDiff = (difference / expectedFinanced) * 100;
    
    // If difference is > 20%, likely extracted wrong value (e.g., Gross Capitalized Cost)
    if (percentDiff > 20) {
      console.log('⚠️  Amount Financed validation failed:');
      console.log('   Extracted:', parsed.price.amountFinanced);
      console.log('   Expected (Price - Deposit):', expectedFinanced);
      console.log('   Difference:', difference, `(${Math.round(percentDiff)}%)`);
      
      // Use calculated value instead
      parsed.price.amountFinanced = expectedFinanced;
      console.log('💰 Amount financed corrected to:', parsed.price.amountFinanced);
    }
  }
  
  // Calculate Total Price from Amount Financed + Deposit
  if (!parsed.price.totalPrice && parsed.price.amountFinanced && parsed.price.deposit) {
    parsed.price.totalPrice = parsed.price.amountFinanced + parsed.price.deposit;
    console.log('💰 Total price calculated from loan + deposit:', parsed.price.totalPrice);
  }
  
  // Calculate Deposit from Total Price - Amount Financed
  if (!parsed.price.deposit && parsed.price.totalPrice && parsed.price.amountFinanced) {
    parsed.price.deposit = parsed.price.totalPrice - parsed.price.amountFinanced;
    if (parsed.price.deposit > 0) {
      console.log('💰 Deposit calculated from price - loan:', parsed.price.deposit);
    } else {
      parsed.price.deposit = null;
    }
  }
  
  // If still no deposit, try to find any large amount that could be deposit (10-30% of price)
  if (!parsed.price.deposit && parsed.price.totalPrice) {
    const amounts = text.match(/(?:\$|£)\s*([\d,]+\.?\d*)/g);
    if (amounts) {
      for (const amount of amounts) {
        const value = parseFloat(amount.replace(/[$£,]/g, ''));
        const percentOfPrice = (value / parsed.price.totalPrice) * 100;
        if (percentOfPrice >= 5 && percentOfPrice <= 40 && value > 1000) {
          parsed.price.deposit = value;
          console.log('💰 Deposit inferred from amounts:', parsed.price.deposit);
          break;
        }
      }
    }
  }
  
  // If still no Amount Financed, try to find it
  if (!parsed.price.amountFinanced && parsed.price.totalPrice && parsed.price.deposit) {
    parsed.price.amountFinanced = parsed.price.totalPrice - parsed.price.deposit;
    console.log('💰 Amount financed calculated:', parsed.price.amountFinanced);
  }
  
  // Validate monthly payment (sanity check)
  if (parsed.finance.monthlyPayment && parsed.price.amountFinanced && parsed.finance.term) {
    const simplePayment = parsed.price.amountFinanced / parsed.finance.term;
    const expectedMin = simplePayment * 0.5; // 50% of simple (very low interest)
    const expectedMax = simplePayment * 1.5; // 150% of simple (high interest)
    
    // Additional check: Payment should not exceed 15% of purchase price
    const maxReasonable = parsed.price.totalPrice ? parsed.price.totalPrice * 0.15 : Infinity;
    
    // If monthly payment is way off, recalculate
    if (parsed.finance.monthlyPayment < expectedMin || 
        parsed.finance.monthlyPayment > expectedMax ||
        parsed.finance.monthlyPayment > maxReasonable) {
      console.log('⚠️  Monthly payment seems incorrect:', parsed.finance.monthlyPayment);
      console.log('   Expected range:', Math.round(expectedMin), '-', Math.round(expectedMax));
      console.log('   Simple payment:', Math.round(simplePayment));
      
      // Recalculate
      if (parsed.finance.apr && parsed.finance.apr > 0) {
        const monthlyRate = parsed.finance.apr / 100 / 12;
        const numPayments = parsed.finance.term;
        const monthlyPayment = parsed.price.amountFinanced * 
          (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
          (Math.pow(1 + monthlyRate, numPayments) - 1);
        parsed.finance.monthlyPayment = Math.round(monthlyPayment * 100) / 100;
        console.log('💳 Monthly payment recalculated with APR:', parsed.finance.monthlyPayment);
      } else {
        parsed.finance.monthlyPayment = Math.round(simplePayment * 100) / 100;
        console.log('💳 Monthly payment recalculated (simple):', parsed.finance.monthlyPayment);
      }
    }
  }
  
  // Calculate Monthly Payment if missing
  if (!parsed.finance.monthlyPayment && parsed.price.amountFinanced && parsed.finance.term) {
    // Simple calculation without interest (will be inaccurate but better than nothing)
    const simpleMonthly = parsed.price.amountFinanced / parsed.finance.term;
    
    // If we have APR, use it for better calculation
    if (parsed.finance.apr) {
      const monthlyRate = parsed.finance.apr / 100 / 12;
      const numPayments = parsed.finance.term;
      
      // Standard loan payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
      const monthlyPayment = parsed.price.amountFinanced * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      parsed.finance.monthlyPayment = Math.round(monthlyPayment * 100) / 100;
      console.log('💳 Monthly payment calculated with APR:', parsed.finance.monthlyPayment);
    } else {
      parsed.finance.monthlyPayment = Math.round(simpleMonthly * 100) / 100;
      console.log('💳 Monthly payment calculated (simple):', parsed.finance.monthlyPayment);
    }
  }
  
  // Try harder to find balloon payment if PCP mentioned
  if (!parsed.finance.balloonPayment && /(?:PCP|balloon|residual|GMFV)/i.test(text)) {
    // Look for any large amount (20-50% of total price) that could be balloon
    if (parsed.price.totalPrice) {
      const amounts = text.match(/(?:\$|£)\s*([\d,]+\.?\d*)/g);
      if (amounts) {
        for (const amount of amounts) {
          const value = parseFloat(amount.replace(/[$£,]/g, ''));
          const percentOfPrice = (value / parsed.price.totalPrice) * 100;
          // Balloon is typically 20-50% of vehicle price
          if (percentOfPrice >= 20 && percentOfPrice <= 60 && value > 10000) {
            parsed.finance.balloonPayment = value;
            parsed.finance.finalPayment = value;
            console.log('🎈 Balloon payment inferred:', parsed.finance.balloonPayment);
            break;
          }
        }
      }
    }
  }
  
  // Use firstPaymentDate as startDate if startDate is missing
  if (!parsed.dates.startDate && parsed.dates.firstPaymentDate) {
    parsed.dates.startDate = parsed.dates.firstPaymentDate;
    console.log('📅 Start date set from first payment date:', parsed.dates.startDate);
  }
  
  // Use startDate as firstPaymentDate if firstPaymentDate is missing
  if (!parsed.dates.firstPaymentDate && parsed.dates.startDate) {
    parsed.dates.firstPaymentDate = parsed.dates.startDate;
    console.log('📅 First payment date set from start date:', parsed.dates.firstPaymentDate);
  }
};

/**
 * Calculate overall confidence score
 */
const calculateConfidence = (parsed) => {
  let score = 0;
  let maxScore = 0;
  
  // Critical fields (higher weight)
  const criticalFields = [
    { value: parsed.customerName, weight: 2 },
    { value: parsed.vehicle.make, weight: 3 },
    { value: parsed.vehicle.model, weight: 3 },
    { value: parsed.vehicle.year, weight: 2 },
    { value: parsed.price.totalPrice, weight: 3 },
    { value: parsed.finance.monthlyPayment, weight: 3 },
    { value: parsed.finance.term, weight: 2 },
    { value: parsed.dates.startDate, weight: 2 },
  ];
  
  // Important fields (medium weight)
  const importantFields = [
    { value: parsed.price.deposit, weight: 2 },
    { value: parsed.price.amountFinanced, weight: 2 },
    { value: parsed.finance.apr, weight: 2 },
    { value: parsed.totals.totalPayable, weight: 2 },
    { value: parsed.vehicle.vin, weight: 2 },
    { value: parsed.dates.lastPaymentDate, weight: 1 },
  ];
  
  // Optional fields (lower weight)
  const optionalFields = [
    { value: parsed.vehicle.registration, weight: 1 },
    { value: parsed.finance.balloonPayment, weight: 1 },
    { value: parsed.mileage.allowance, weight: 1 },
    { value: parsed.payments.totalPaidToDate, weight: 1 },
    { value: parsed.dates.nextPaymentDate, weight: 1 },
  ];
  
  const allFields = [...criticalFields, ...importantFields, ...optionalFields];
  
  allFields.forEach(field => {
    maxScore += field.weight;
    if (field.value !== null && field.value !== undefined) {
      score += field.weight;
    }
  });
  
  return maxScore > 0 ? score / maxScore : 0;
};

/**
 * Main function to parse PDF finance agreement
 * @param {File} file - PDF file to parse
 * @returns {Promise<Object>} Parsed agreement data
 */
export const parsePDFFinanceAgreement = async (file) => {
  try {
    // Extract text from PDF
    const text = await extractPDFText(file);
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }
    
    // Parse the extracted text
    const parsed = parseFinanceAgreement(text);
    
    // Add metadata
    parsed.metadata = {
      fileName: file.name,
      fileSize: file.size,
      extractedAt: new Date().toISOString(),
      textLength: text.length,
    };
    
    return {
      success: true,
      data: parsed,
      rawText: text, // Include for debugging
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

export default {
  extractPDFText,
  parseFinanceAgreement,
  parsePDFFinanceAgreement,
};
