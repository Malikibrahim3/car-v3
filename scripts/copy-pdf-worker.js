#!/usr/bin/env node

/**
 * Copy PDF.js worker file to public folder
 * This ensures the worker is available for both dev and production builds
 */

const fs = require('fs');
const path = require('path');

const workerSource = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const workerDest = path.join(__dirname, '../public/pdf.worker.min.mjs');

try {
  // Check if source exists
  if (!fs.existsSync(workerSource)) {
    console.error('❌ PDF.js worker file not found at:', workerSource);
    console.error('   Make sure pdfjs-dist is installed: npm install pdfjs-dist');
    process.exit(1);
  }

  // Copy the file
  fs.copyFileSync(workerSource, workerDest);
  
  const stats = fs.statSync(workerDest);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('✅ PDF.js worker copied successfully');
  console.log(`   From: ${workerSource}`);
  console.log(`   To: ${workerDest}`);
  console.log(`   Size: ${fileSizeInMB} MB`);
  
} catch (error) {
  console.error('❌ Error copying PDF.js worker:', error.message);
  process.exit(1);
}
