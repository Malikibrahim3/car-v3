/**
 * Tests for PDF/Text Parser
 */

const { extractDocumentData, validateDocument } = require('../src/services/documentExtraction');

describe('Document Parser', () => {
  
  describe('File Validation', () => {
    test('should accept PDF files', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateDocument(file);
      expect(result.valid).toBe(true);
    });

    test('should accept text files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateDocument(file);
      expect(result.valid).toBe(true);
    });

    test('should reject image files', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateDocument(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('OCR');
    });

    test('should reject files over 10MB', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
      const result = validateDocument(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10MB');
    });

    test('should reject missing file', () => {
      const result = validateDocument(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('No file');
    });
  });

  describe('Text Extraction', () => {
    test('should extract vehicle make', async () => {
      const content = 'Make: Toyota\nModel: Camry';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.make).toBe('Toyota');
    });

    test('should extract vehicle model', async () => {
      const content = 'Make: Toyota\nModel: Camry\nYear: 2023';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.model).toBe('Camry');
    });

    test('should extract vehicle year', async () => {
      const content = 'Year: 2023\nMake: Toyota';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.year).toBe('2023');
    });

    test('should extract purchase price', async () => {
      const content = 'Vehicle Price: $28,500.00';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.purchasePrice).toBe('28500.00');
    });

    test('should extract loan amount', async () => {
      const content = 'Amount Financed: $25,000.00';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.loanAmount).toBe('25000.00');
    });

    test('should extract monthly payment', async () => {
      const content = 'Monthly Payment: $450.00';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.monthlyPayment).toBe('450.00');
    });

    test('should extract deposit', async () => {
      const content = 'Down Payment: $3,500.00';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.deposit).toBe('3500.00');
    });

    test('should extract interest rate', async () => {
      const content = 'Annual Percentage Rate (APR): 4.5%';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.interestRate).toBe('4.5');
    });

    test('should extract loan term', async () => {
      const content = 'Loan Term: 60 months';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.loanTerm).toBe('60');
    });

    test('should extract customer name', async () => {
      const content = 'Name: John Doe\nAddress: 123 Main St';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.customerName).toBe('John Doe');
    });

    test('should detect ownership type - PCP', async () => {
      const content = 'This is a PCP agreement\nMonthly Payment: $450';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.ownershipType).toBe('pcp');
    });

    test('should detect ownership type - Lease', async () => {
      const content = 'This is a lease agreement\nMonthly Payment: $450';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.ownershipType).toBe('lease');
    });
  });

  describe('Complete Document Extraction', () => {
    test('should extract all fields from sample agreement', async () => {
      const sampleContent = `
VEHICLE FINANCE AGREEMENT
========================

Agreement Number: FA-2023-001234
Date: June 15, 2023

VEHICLE DETAILS
--------------
Make: Toyota
Model: Camry
Year: 2023
VIN: 1HGBH41JXMN109186

FINANCIAL TERMS
--------------
Vehicle Price: $28,500.00
Down Payment: $3,500.00
Amount Financed: $25,000.00

Loan Details:
- Annual Percentage Rate (APR): 4.5%
- Loan Term: 60 months
- Monthly Payment: $450.00

BUYER INFORMATION
----------------
Name: John Doe
Address: 123 Main Street, Anytown, ST 12345
      `;

      const file = new File([sampleContent], 'agreement.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);

      expect(result.success).toBe(true);
      expect(result.data.make).toBe('Toyota');
      expect(result.data.model).toBe('Camry');
      expect(result.data.year).toBe('2023');
      expect(result.data.purchasePrice).toBe('28500.00');
      expect(result.data.deposit).toBe('3500.00');
      expect(result.data.loanAmount).toBe('25000.00');
      expect(result.data.monthlyPayment).toBe('450.00');
      expect(result.data.interestRate).toBe('4.5');
      expect(result.data.loanTerm).toBe('60');
      expect(result.data.customerName).toBe('John Doe');
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Confidence Calculation', () => {
    test('should have high confidence with all required fields', async () => {
      const content = `
        Make: Toyota
        Model: Camry
        Year: 2023
        Vehicle Price: $28,500
        Amount Financed: $25,000
        Monthly Payment: $450
      `;
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should have lower confidence with missing fields', async () => {
      const content = 'Make: Toyota';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.confidence).toBeLessThan(0.3);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty file', async () => {
      const file = new File([''], 'empty.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.success).toBe(true);
      expect(result.confidence).toBeLessThan(0.2);
    });

    test('should handle malformed data gracefully', async () => {
      const content = 'Random text with no structure';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.success).toBe(true);
      // Should return empty strings for missing fields
      expect(result.data).toHaveProperty('make');
      expect(result.data).toHaveProperty('model');
    });
  });

  describe('Date Parsing', () => {
    test('should parse ISO date format', async () => {
      const content = 'Date: 2023-06-15';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.startDate).toBe('2023-06-15');
    });

    test('should calculate months elapsed', async () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const dateStr = oneYearAgo.toISOString().split('T')[0];
      
      const content = `Date: ${dateStr}`;
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await extractDocumentData(file);
      expect(result.data.monthsElapsed).toBeGreaterThanOrEqual(11);
      expect(result.data.monthsElapsed).toBeLessThanOrEqual(13);
    });
  });
});
