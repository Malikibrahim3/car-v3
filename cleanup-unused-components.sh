#!/bin/bash

echo "🧹 CLEANING UNUSED COMPONENTS"
echo "=============================="
echo ""

# Check for unused components
echo "🔍 Checking for unused components..."
echo ""

# 1. Remove duplicate GlassCard (root version not used)
if [ -f "src/components/GlassCard.tsx" ]; then
    echo "📦 Found duplicate GlassCard.tsx in root components/"
    echo "   (The ui/GlassCard.tsx version is the one being used)"
    read -p "   Remove src/components/GlassCard.tsx? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f src/components/GlassCard.tsx
        echo "   ✓ Removed duplicate GlassCard.tsx"
    fi
    echo ""
fi

# 2. Check for old/unused test files in root tests folder
if [ -d "tests" ]; then
    test_count=$(find tests -name "*.spec.js" -o -name "*.test.js" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$test_count" -gt 0 ]; then
        echo "🧪 Found $test_count test files in root tests/ folder"
        echo "   Listing files:"
        find tests -name "*.spec.js" -o -name "*.test.js" 2>/dev/null | sed 's/^/   - /'
        echo ""
        read -p "   Review these files? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "   Please review manually and delete if not needed"
        fi
        echo ""
    fi
fi

# 3. Check for old component folders
if [ -d "components" ] && [ -d "src/components" ]; then
    echo "📁 Found both 'components/' and 'src/components/' folders"
    echo "   This might indicate duplicate structure"
    comp_count=$(find components -type f 2>/dev/null | wc -l | tr -d ' ')
    src_comp_count=$(find src/components -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "   - components/: $comp_count files"
    echo "   - src/components/: $src_comp_count files"
    echo ""
    echo "   ⚠️  Manual review recommended to check for duplicates"
    echo ""
fi

# 4. Clean up old scripts
echo "📜 Checking for old utility scripts..."
old_scripts=(
    "gemini.py"
    "app.css"
)

for script in "${old_scripts[@]}"; do
    if [ -f "$script" ]; then
        echo "   Found: $script"
        read -p "   Remove $script? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -f "$script"
            echo "   ✓ Removed $script"
        fi
    fi
done

echo ""
echo "✅ Component cleanup complete!"
echo ""
echo "📋 Recommendations:"
echo "   • Review components/ vs src/components/ for duplicates"
echo "   • Check tests/ folder for outdated test files"
echo "   • Consider consolidating component structure"
echo ""
