#!/bin/bash

echo "🧹 COMPREHENSIVE CODEBASE CLEANUP"
echo "=================================="
echo ""

# Count files before cleanup
echo "📊 Analyzing codebase..."
md_count=$(find . -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
test_count=$(find landing/tests -name "*.spec.js" 2>/dev/null | wc -l | tr -d ' ')

echo "   Found $md_count markdown files in root"
echo "   Found $test_count test files in landing/tests"
echo ""

read -p "⚠️  This will delete old documentation, debug tests, and the CarValueTracker duplicate folder. Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "🗑️  Starting cleanup..."
echo ""

# 1. Remove CarValueTracker duplicate folder
if [ -d "CarValueTracker" ]; then
    echo "📁 Removing CarValueTracker duplicate folder..."
    rm -rf CarValueTracker
    echo "   ✓ Removed CarValueTracker/"
fi

# 2. Remove old documentation files from root (keep README.md and STATUS.md)
echo "📄 Removing old documentation files..."
rm -f ACTIVITY-TAB-SHADOW-FIX.md
rm -f ACTUAL-CHANGES-APPLIED.md
rm -f APP-LINEAR-STYLE-UPDATES.md
rm -f AUDIT-EXAMPLES.md
rm -f AUDIT-FINDINGS.md
rm -f AUDIT-INDEX.md
rm -f AUDIT-INTERPRETATION-CHECKLIST.md
rm -f AUDIT-PROCESS-FLOW.md
rm -f AUDIT-QUICK-REFERENCE.md
rm -f AUDIT-RESULTS-SUMMARY.md
rm -f AUDIT-SYSTEM-COMPLETE.md
rm -f CARD-GLOW-UPDATE.md
rm -f CLEARSCORE-PALETTE-COMPLETE.md
rm -f CLEARSCORE-TEAL-PALETTE.md
rm -f CLEAR_CACHE.md
rm -f COLOR-AUDIT-FINAL.md
rm -f COLOR-MIGRATION-COMPLETE.md
rm -f COLOR-PALETTE-UPDATE.md
rm -f COMPLETE-SHADOW-IMPLEMENTATION.md
rm -f CUSTOMER-AUDIT-GUIDE.md
rm -f DARK-TEAL-GLOW-COMPLETE.md
rm -f DASHBOARD-NOTIFICATIONS-GLOW-FIX.md
rm -f DASHBOARD_UPDATE.txt
rm -f DEEP-SHADOW-AUDIT-RESULTS.md
rm -f DEPTH-AND-VARIETY-COMPLETE.md
rm -f DESIGN-IMPROVEMENTS-APPLIED.md
rm -f FINAL-CLEARSCORE-IMPLEMENTATION.md
rm -f FINAL-COLOR-AND-SHADOW-IMPLEMENTATION.md
rm -f FINAL-IMPLEMENTATION-STATUS.md
rm -f FINAL-SHADOW-FIX-INSTRUCTIONS.md
rm -f FINAL-VERIFICATION.md
rm -f FIXES-SUMMARY.md
rm -f FORECAST-ESTIMATE-FIX.md
rm -f IMPLEMENTATION-COMPLETE.md
rm -f IMPLEMENTATION-PROGRESS.md
rm -f IMPLEMENTATION-STATUS-FINAL.md
rm -f MASTER-AUDIT-GUIDE.md
rm -f MASTER-AUDIT-README.md
rm -f NEW-DASHBOARD-COMPLETE.md
rm -f NOTIFICATIONS-SHADOW-FIX.md
rm -f OPTIMAL-SELL-TIME-REFACTOR.md
rm -f PLAYWRIGHT-FIXES-COMPLETE.md
rm -f PREMIUM-REDESIGN.md
rm -f README-COLORS.md
rm -f REDESIGN-SUMMARY.md
rm -f SHADOW-AND-COLOR-FIX.md
rm -f SHADOW-CLIPPING-FIX-COMPLETE.md
rm -f SHADOW-RADIUS-REDUCTION.md
rm -f START-HERE.md
rm -f TESTING-CHECKLIST.md
rm -f UX-UI-AUDIT-REPORT.md
rm -f UX-UI-FIX-PLAN.md
rm -f VISUAL-DEPTH-SUMMARY.md
rm -f apply-all-fixes.md
echo "   ✓ Removed old documentation files"

# 3. Remove temporary/backup files
echo "🗑️  Removing temporary and backup files..."
rm -f gemini.py.save
rm -f fix-all-colors.sh
rm -f run-customer-audit.sh
rm -f run-master-audit.sh
rm -f cleanup-codebase.sh
echo "   ✓ Removed temporary files"

# 4. Landing page - Remove old documentation
echo "📄 Cleaning landing page documentation..."
rm -f landing/FIX-PLAN.md
rm -f landing/FIXES-APPLIED.md
rm -f landing/LINEAR-COMPARISON-REPORT.md
rm -f landing/LINEAR-EXACT-IMPLEMENTATION.md
rm -f landing/MOBILE-AUDIT-REPORT.md
echo "   ✓ Removed landing documentation"

# 5. Landing page - Remove large design files
echo "🎨 Removing large design files..."
rm -f "landing/removed bg.psd"
echo "   ✓ Removed design files"

# 6. Landing page - Remove debug/inspection test files (keep core tests)
echo "🧪 Removing debug and inspection test files..."
rm -f landing/tests/check-console.spec.js
rm -f landing/tests/check-title-alignment.spec.js
rm -f landing/tests/debug-car-size.spec.js
rm -f landing/tests/debug-hero-secondary.spec.js
rm -f landing/tests/debug-title.spec.js
rm -f landing/tests/detailed-alignment-check.spec.js
rm -f landing/tests/hero-image-check.spec.js
rm -f landing/tests/hero-secondary-visual.spec.js
rm -f landing/tests/inspect-card-gradients.spec.js
rm -f landing/tests/inspect-cards-stacking.spec.js
rm -f landing/tests/inspect-hero-secondary-car.spec.js
rm -f landing/tests/inspect-hero-secondary-layout.spec.js
rm -f landing/tests/inspect-hero-secondary-title.spec.js
rm -f landing/tests/inspect-hero-secondary.spec.js
rm -f landing/tests/inspect-hero-third-pricing.spec.js
rm -f landing/tests/inspect-navbar-sections.spec.js
rm -f landing/tests/inspect-navbar-transition.spec.js
rm -f landing/tests/linear-comparison-audit.spec.js
rm -f landing/tests/linear-gradient-inspector.spec.js
rm -f landing/tests/mobile-layout-check.spec.js
rm -f landing/tests/mobile-visual-deep-audit.spec.js
rm -f landing/tests/navbar-scroll-behavior.spec.js
rm -f landing/tests/navbar-visual-check.spec.js
rm -f landing/tests/screenshot-hero-secondary.spec.js
rm -f landing/tests/test-cards-parallax.spec.js
rm -f landing/tests/verify-screenshot.spec.js
rm -f landing/tests/visual-screenshot.spec.js
echo "   ✓ Removed debug test files"

# 7. Remove test results and screenshots
echo "📸 Cleaning test results..."
rm -rf landing/test-results/*.png 2>/dev/null
rm -rf landing/playwright-report 2>/dev/null
rm -rf test-results 2>/dev/null
rm -rf playwright-report 2>/dev/null
echo "   ✓ Cleaned test results"

# 8. Remove empty accessibility audit report folder
if [ -d "accessibility-audit-report" ]; then
  file_count=$(find accessibility-audit-report -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$file_count" -eq 0 ]; then
    echo "📊 Removing empty accessibility-audit-report folder..."
    rm -rf accessibility-audit-report
    echo "   ✓ Removed empty folder"
  fi
fi

# 9. Clean up node_modules in duplicate locations
echo "📦 Checking for duplicate node_modules..."
if [ -d "components/node_modules" ]; then
    echo "   Found components/node_modules (likely duplicate)"
    rm -rf components/node_modules
    echo "   ✓ Removed components/node_modules"
fi

echo ""
echo "✅ CLEANUP COMPLETE!"
echo ""
echo "📋 Summary:"
echo "   ✓ Removed CarValueTracker duplicate folder"
echo "   ✓ Removed 50+ old documentation files"
echo "   ✓ Removed 25+ debug test files"
echo "   ✓ Removed temporary and backup files"
echo "   ✓ Cleaned test results and screenshots"
echo ""
echo "📁 Kept important files:"
echo "   • README.md (main project documentation)"
echo "   • STATUS.md (current project status)"
echo "   • landing/README.md (landing page documentation)"
echo "   • Core test files (landing-audit, mobile-responsiveness-audit, etc.)"
echo "   • All source code and components"
echo ""
echo "💾 Estimated space saved: ~100MB+"
echo ""
