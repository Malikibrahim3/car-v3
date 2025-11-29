import { Platform } from 'react-native';

let pdfjsLib;
if (Platform.OS === 'web') {
  pdfjsLib = require('pdfjs-dist');
  // Configure PDF.js worker - use local worker file
  // This file is copied from node_modules/pdfjs-dist/build/pdf.worker.min.mjs to public/
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;
}

/**
 * Document Extraction Service
 * 
 * This service handles document upload and information extraction.
 * Parses PDF and text files to extract vehicle and finance information.
 */

/**
 * Extract vehicle and finance information from uploaded document
 * @param {File} file - The uploaded document file
 * @returns {Promise<Object>} Extracted data with confidence scores
 */
export const extractDocumentData = async (file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    let text = '';

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      text = await extractTextFromTextFile(file);
    } else {
      // For images, we'd need OCR - for now, return error
      throw new Error('Image files require OCR service. Please use PDF or text files.');
    }

    // Parse the extracted text
    const extractedData = parseFinanceDocument(text);

    // Calculate confidence score
    const confidence = calculateConfidence(extractedData);

    return {
      success: true,
      data: extractedData,
      confidence: confidence,
      message: 'Document processed successfully',
    };

  } catch (error) {
    console.error('Document extraction error:', error);
    throw new Error(error.message || 'Failed to extract data from document');
  }
};

/**
 * Extract text from PDF file using PDF.js
 * @param {File} file - PDF file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure it is a valid, text-based PDF.');
  }
};

/**
 * Extract text from text file
 * @param {File} file - Text file
 * @returns {Promise<string>} File content
 */
const extractTextFromTextFile = async (file) => {
  try {
    return await file.text();
  } catch (error) {
    console.error('Text file reading error:', error);
    throw new Error('Failed to read text file');
  }
};

/**
 * Parse finance document text and extract structured data
 * @param {string} text - Document text
 * @returns {Object} Extracted structured data
 */
const parseFinanceDocument = (text) => {
  const data = {
    // Vehicle information
    make: extractMake(text),
    model: extractModel(text),
    year: extractYear(text),
    
    // Customer information
    customerName: extractCustomerName(text),
    customerAddress: extractCustomerAddress(text),
    
    // Finance information
    ownershipType: extractOwnershipType(text),
    purchasePrice: extractPurchasePrice(text),
    deposit: extractDeposit(text),
    loanAmount: extractLoanAmount(text),
    monthlyPayment: extractMonthlyPayment(text),
    balloonPayment: extractBalloonPayment(text),
    interestRate: extractInterestRate(text),
    loanTerm: extractLoanTerm(text),
    startDate: extractStartDate(text),
    
    // Calculated fields
    monthsElapsed: calculateMonthsElapsed(extractStartDate(text)),
    currentBalance: null, // Will be calculated
    equity: null, // Will be calculated
    netPosition: null, // Will be calculated
  };

  // Calculate derived fields
  if (data.loanAmount && data.monthlyPayment && data.monthsElapsed) {
    const totalPaid = (parseFloat(data.monthlyPayment) || 0) * data.monthsElapsed;
    const principalPaid = totalPaid * 0.7; // Rough estimate (70% principal, 30% interest)
    data.currentBalance = Math.max(0, (parseFloat(data.loanAmount) || 0) - principalPaid);
  }

  return data;
};

/**
 * Extract vehicle make from text
 */
const extractMake = (text) => {
  const patterns = [
    /Make:\s*([A-Za-z]+)/i,
    /Manufacturer:\s*([A-Za-z]+)/i,
    /Vehicle Make:\s*([A-Za-z]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  // Common makes to look for
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Volkswagen', 'Lexus', 'Jeep', 'Ram', 'GMC', 'Dodge', 'Chrysler'];
  for (const make of makes) {
    if (text.includes(make)) return make;
  }
  
  return '';
};

/**
 * Extract vehicle model from text
 */
const extractModel = (text) => {
  const patterns = [
    /Model:\s*([A-Za-z0-9\s-]+?)(?:\n|Year|VIN|Trim)/i,
    /Vehicle Model:\s*([A-Za-z0-9\s-]+?)(?:\n|Year|VIN)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return '';
};

/**
 * Extract vehicle year from text
 */
const extractYear = (text) => {
  const patterns = [
    /Year:\s*(20\d{2}|19\d{2})/i,
    /Model Year:\s*(20\d{2}|19\d{2})/i,
    /(20\d{2}|19\d{2})\s+[A-Z][a-z]+\s+[A-Z][a-z]+/i, // "2023 Toyota Camry"
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  
  return '';
};

/**
 * Extract customer name from text
 */
const extractCustomerName = (text) => {
  const patterns = [
    /(?:Buyer|Customer|Name):\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /BUYER INFORMATION[\s\S]*?Name:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return '';
};

/**
 * Extract customer address from text
 */
const extractCustomerAddress = (text) => {
  const patterns = [
    /Address:\s*([^\n]+)/i,
    /BUYER INFORMATION[\s\S]*?Address:\s*([^\n]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return '';
};

/**
 * Extract ownership/finance type from text
 */
const extractOwnershipType = (text) => {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('pcp') || textLower.includes('personal contract purchase')) {
    return 'pcp';
  }
  if (textLower.includes('lease') || textLower.includes('leasing')) {
    return 'lease';
  }
  if (textLower.includes('hire purchase') || textLower.includes('hp')) {
    return 'loan';
  }
  if (textLower.includes('cash') || textLower.includes('paid in full')) {
    return 'cash';
  }
  
  // Default to loan if finance terms are present
  if (textLower.includes('loan') || textLower.includes('financed')) {
    return 'loan';
  }
  
  return 'loan'; // Default
};

/**
 * Extract purchase price from text
 */
const extractPurchasePrice = (text) => {
  const patterns = [
    /(?:Vehicle Price|Purchase Price|Sale Price):\s*\$?([\d,]+\.?\d*)/i,
    /Total (?:Vehicle )?Price:\s*\$?([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, '');
  }
  
  return '';
};

/**
 * Extract deposit/down payment from text
 */
const extractDeposit = (text) => {
  const patterns = [
    /(?:Down Payment|Deposit|Initial Payment):\s*\$?([\d,]+\.?\d*)/i,
    /Cash (?:Down|Deposit):\s*\$?([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, '');
  }
  
  return '';
};

/**
 * Extract loan amount from text
 */
const extractLoanAmount = (text) => {
  const patterns = [
    /(?:Amount Financed|Loan Amount|Finance Amount):\s*\$?([\d,]+\.?\d*)/i,
    /Total Amount Financed:\s*\$?([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, '');
  }
  
  return '';
};

/**
 * Extract monthly payment from text
 */
const extractMonthlyPayment = (text) => {
  const patterns = [
    /Monthly Payment:\s*\$?([\d,]+\.?\d*)/i,
    /Payment Amount:\s*\$?([\d,]+\.?\d*)/i,
    /\$?([\d,]+\.?\d*)\s*per month/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, '');
  }
  
  return '';
};

/**
 * Extract balloon payment from text
 */
const extractBalloonPayment = (text) => {
  const patterns = [
    /(?:Balloon Payment|Final Payment|Residual Value):\s*\$?([\d,]+\.?\d*)/i,
    /Optional Final Payment:\s*\$?([\d,]+\.?\d*)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, '');
  }
  
  return '';
};

/**
 * Extract interest rate from text
 */
const extractInterestRate = (text) => {
  const patterns = [
    /(?:APR|Interest Rate|Annual Percentage Rate):\s*([\d.]+)%?/i,
    /Rate:\s*([\d.]+)%/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  
  return '';
};

/**
 * Extract loan term from text
 */
const extractLoanTerm = (text) => {
  const patterns = [
    /(?:Loan Term|Term|Duration):\s*(\d+)\s*months?/i,
    /(\d+)[-\s]month\s+(?:term|loan|finance)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  
  return '';
};

/**
 * Extract start date from text
 */
const extractStartDate = (text) => {
  const patterns = [
    /(?:Date|Agreement Date|Start Date):\s*(\d{4}-\d{2}-\d{2})/i,
    /(?:Date|Agreement Date):\s*([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const dateStr = match[1];
      // Try to parse and format as YYYY-MM-DD
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        // If parsing fails, return as-is
        return dateStr;
      }
    }
  }
  
  return '';
};

/**
 * Calculate months elapsed since start date
 */
const calculateMonthsElapsed = (startDate) => {
  if (!startDate) return 0;
  
  try {
    const start = new Date(startDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return Math.max(0, months);
  } catch (e) {
    return 0;
  }
};

/**
 * Calculate confidence score based on extracted fields
 */
const calculateConfidence = (data) => {
  const requiredFields = [
    'make', 'model', 'year',
    'purchasePrice', 'loanAmount', 'monthlyPayment'
  ];
  
  const optionalFields = [
    'deposit', 'interestRate', 'loanTerm', 'startDate',
    'customerName', 'balloonPayment'
  ];
  
  let score = 0;
  let maxScore = 0;
  
  // Required fields are worth more
  requiredFields.forEach(field => {
    maxScore += 2;
    if (data[field] && data[field] !== '') {
      score += 2;
    }
  });
  
  // Optional fields
  optionalFields.forEach(field => {
    maxScore += 1;
    if (data[field] && data[field] !== '') {
      score += 1;
    }
  });
  
  return maxScore > 0 ? score / maxScore : 0;
};

/**
 * Validate uploaded file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateDocument = (file) => {
  const validTypes = ['application/pdf', 'text/plain'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload a PDF or text file. Images require OCR service.' 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'File size must be less than 10MB' 
    };
  }

  return { valid: true };
};

/**
 * Example backend API endpoint (Node.js/Express)
 * 
 * This is reference code for implementing the backend service
 */
export const exampleBackendCode = `
// Backend API Example (Node.js + Express)
const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const fs = require('fs').promises;

const router = express.Router();
const upload = multer({ 
  dest: '/tmp/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Initialize Google Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient();

router.post('/api/extract-document', upload.single('document'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path;

    // Perform OCR
    const [result] = await visionClient.documentTextDetection(filePath);
    const fullText = result.fullTextAnnotation.text;

    // Extract structured data from text
    const extractedData = parseFinanceDocument(fullText);

    // Delete file immediately
    await fs.unlink(filePath);
    filePath = null;

    res.json({
      success: true,
      data: extractedData,
      confidence: calculateConfidence(extractedData),
    });

  } catch (error) {
    console.error('Extraction error:', error);
    
    // Clean up file if it exists
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
    }

    res.status(500).json({ 
      success: false, 
      error: 'Failed to process document' 
    });
  }
});

// Parse finance document text
function parseFinanceDocument(text) {
  // Implement parsing logic based on common finance document formats
  // Use regex patterns to extract:
  // - Vehicle details (make, model, year)
  // - Financial terms (price, loan amount, payments)
  // - Dates and terms
  
  return {
    make: extractMake(text),
    model: extractModel(text),
    year: extractYear(text),
    purchasePrice: extractPrice(text),
    loanAmount: extractLoanAmount(text),
    monthlyPayment: extractMonthlyPayment(text),
    deposit: extractDeposit(text),
    interestRate: extractInterestRate(text),
    loanTerm: extractLoanTerm(text),
    startDate: extractStartDate(text),
    ownershipType: determineOwnershipType(text),
  };
}

// Calculate confidence score
function calculateConfidence(data) {
  let score = 0;
  let fields = 0;
  
  Object.values(data).forEach(value => {
    fields++;
    if (value && value !== '') score++;
  });
  
  return fields > 0 ? score / fields : 0;
}

module.exports = router;
`;

/**
 * Alternative: Client-side OCR using Tesseract.js
 * 
 * For a simpler implementation without backend infrastructure
 */
export const clientSideOCRExample = `
// Install: npm install tesseract.js

import Tesseract from 'tesseract.js';

export const extractWithTesseract = async (file) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log(m), // Progress logging
      }
    );

    // Parse the extracted text
    const extractedData = parseFinanceText(text);
    
    return {
      success: true,
      data: extractedData,
      confidence: 0.75, // Tesseract provides word-level confidence
    };
  } catch (error) {
    console.error('OCR error:', error);
    throw error;
  }
};
`;

export default {
  extractDocumentData,
  validateDocument,
};
