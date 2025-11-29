# Dashboard Redesign - Global Header & Search

## Overview
Redesigned the AutoTrack dashboard with a clean, utility-focused top section that provides clear hierarchy and navigation.

## Changes Implemented

### 1. Global Header (Top Bar)
**Location**: Top of all screens  
**Components**: 
- **Left**: "AutoTrack" app name (22pt, bold, SF Pro Display)
- **Right**: Three utility buttons
  - Search icon (40x40 rounded button)
  - Notifications icon (40x40 rounded button)
  - Profile icon (40x40 rounded button with accent color)

**Styling**:
- Minimal, Apple-style UI
- Rounded icon buttons (20pt radius)
- Subtle shadows (2pt offset, 5% opacity)
- 16pt horizontal padding, 8pt vertical padding
- Background matches app background

### 2. Universal Search Bar
**Location**: Below global header  
**Features**:
- Full-width search input
- Placeholder: "Search your cars, plates, VINs…"
- Search icon on left
- Rounded corners (12pt radius)
- iOS-style input with SF Pro Text

**Styling**:
- White surface background
- Subtle border (1pt, light grey)
- Soft shadow (2pt offset, 5% opacity, 8pt radius)
- 16pt horizontal padding
- 12pt bottom padding

### 3. Portfolio Value - Moved to Secondary Card
**Previous**: Large hero section at top (72pt font)  
**New**: Compact card under "Your Garage" heading

**Changes**:
- Reduced from hero (72pt) to Large Title (34pt)
- Label changed from "Net Portfolio" to "Total Garage Value"
- Positioned as secondary information card
- Smaller, quieter design
- Includes trend indicator (+2.4%) on right side

**Styling**:
- Glass card with 20pt padding
- Horizontal layout (value left, trend right)
- All-caps label (12pt, medium weight, wide spacing)
- Trend badge with success color background

### 4. Quick Action Cards
**Updated**:
- Consistent 24pt icons
- iOS semantic font sizes (Title 1 for numbers)
- Proper spacing using SPACING constants
- Car icon for garage (instead of text)

### 5. Car List Cards
**Updated**:
- iOS Headline (17pt semibold) for car names
- iOS Subheadline (15pt) for model
- iOS Title 3 (20pt bold) for values
- Proper iOS spacing throughout

## New Reusable Components

### GlobalHeader Component
**Path**: `src/components/ui/GlobalHeader.tsx`

**Props**:
```typescript
interface GlobalHeaderProps {
  title?: string;                    // Default: "AutoTrack"
  showSearch?: boolean;              // Default: true
  showNotifications?: boolean;       // Default: true
  showProfile?: boolean;             // Default: true
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}
```

**Usage**:
```tsx
import { GlobalHeader } from '@/components/ui';

<GlobalHeader 
  title="AutoTrack"
  onSearchPress={() => console.log('Search')}
/>
```

### SearchBar Component
**Path**: `src/components/ui/SearchBar.tsx`

**Props**:
```typescript
interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;  // Default: "Search your cars, plates, VINs…"
}
```

**Usage**:
```tsx
import { SearchBar } from '@/components/ui';

const [query, setQuery] = useState('');

<SearchBar 
  value={query}
  onChangeText={setQuery}
  placeholder="Search..."
/>
```

## Design Principles Applied

### 1. Clear Hierarchy
- Global header anchors the page
- Search bar provides immediate utility
- Portfolio value is secondary, not dominant
- Content flows naturally top to bottom

### 2. iOS Human Interface Guidelines
- 44pt minimum touch targets (buttons are 40x40 with padding)
- SF Pro Display for large text (≥20pt)
- SF Pro Text for body text (<20pt)
- Base-8pt spacing grid throughout
- Semantic font sizes (Title 1, Headline, Body, etc.)

### 3. Utility-First Design
- Search is prominent and accessible
- Quick actions are visible but not overwhelming
- Navigation is intuitive with clear icons
- Profile access is always available

### 4. Visual Consistency
- All buttons use same size (40x40)
- Consistent border radius (20pt for buttons, 12pt for cards)
- Unified shadow system (2pt offset, 5% opacity)
- Proper spacing using SPACING constants

## Benefits

1. **Better Navigation**: Global header provides consistent navigation across all screens
2. **Improved Discoverability**: Search bar makes finding cars/data easier
3. **Cleaner Hierarchy**: Portfolio value doesn't dominate the screen
4. **More Professional**: Utility-focused design feels more mature
5. **iOS Native Feel**: Matches Apple's design language exactly
6. **Reusable Components**: GlobalHeader and SearchBar can be used anywhere

## Migration Notes

### Before:
- Hero portfolio value at top (72pt)
- No global navigation
- No search functionality
- Inconsistent spacing

### After:
- Global header with utilities
- Universal search bar
- Portfolio value as secondary card (34pt)
- iOS-accurate spacing throughout
- Reusable header and search components

## Future Enhancements

1. **Search Functionality**: Implement actual search logic
2. **Notifications Badge**: Add unread count indicator
3. **Profile Avatar**: Replace icon with user photo
4. **Search Filters**: Add filters for car type, year, etc.
5. **Recent Searches**: Show recent search history
6. **Voice Search**: Add microphone icon for voice input

## Files Modified

- `app/(tabs)/dashboard.tsx` - Complete redesign
- `src/components/ui/GlobalHeader.tsx` - New component
- `src/components/ui/SearchBar.tsx` - New component
- `components/ui/index.ts` - Export new components

## Testing Checklist

- [ ] Global header appears on all screens
- [ ] Search bar is functional and responsive
- [ ] Portfolio value card displays correctly
- [ ] All buttons trigger haptic feedback
- [ ] Navigation works from header icons
- [ ] Search input accepts text
- [ ] Layout is responsive on different screen sizes
- [ ] Spacing matches iOS guidelines
- [ ] Typography uses correct SF Pro variants
