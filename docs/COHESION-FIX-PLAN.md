# Cohesion Fix Plan - Complete Implementation Guide

## Overview
This plan transforms the app from "4 disconnected screens" to a cohesive, premium fintech experience in **3 phases over 2 weeks**.

## Phase 1: Foundation (Days 1-3)
**Goal:** Establish unified design system and fix critical accessibility issues.

### Day 1: Design System Consolidation

#### Task 1.1: Create Unified Spacing System
**File:** `src/constants/Spacing.ts`
```typescript
export const SPACING = {
  xs: 4,    // Tiny gaps (icon spacing)
  sm: 8,    // Small gaps (inline elements)
  md: 12,   // Medium gaps (list items)
  base: 16, // Standard gap (sections)
  lg: 20,   // Card padding
  xl: 24,   // Section spacing
  xxl: 32,  // Page margins
  xxxl: 48, // Major sections
};

// Helper for consistent spacing
export const spacing = (multiplier: number) => SPACING.base * multiplier;
```

#### Task 1.2: Update Typography Scale
**File:** `src/constants/Typography.ts`
```typescript
export const TYPOGRAPHY = {
  // Sizes
  hero: 72,      // Hero numbers (was 48px)
  display: 48,   // Page titles
  h1: 32,        // Section headers
  h2: 24,        // Subsection headers
  h3: 20,        // Large body
  body: 16,      // Body text
  small: 14,     // Secondary text
  caption: 12,   // Captions/labels
  
  // Weights
  regular: '400',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  
  // Letter spacing
  tight: -1.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};
```

#### Task 1.3: Update DesignSystem.ts
**File:** `src/constants/DesignSystem.ts`
```typescript
import { SPACING } from './Spacing';
import { TYPOGRAPHY } from './Typography';

export const PALETTE = {
  // ... existing colors ...
};

export const METRICS = {
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  spacing: SPACING,
  typography: TYPOGRAPHY,
};

export { SPACING, TYPOGRAPHY };
```

### Day 2: Accessibility Fixes

#### Task 2.1: Create Accessible Button Component
**File:** `src/components/ui/Button.tsx`
```typescript
import React from 'react';
import { Pressable, Text, ViewStyle, AccessibilityRole } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, triggerHaptic } from '@/constants/DesignSystem';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
}: ButtonProps) => {
  const handlePress = () => {
    if (!disabled) {
      triggerHaptic();
      onPress?.();
    }
  };

  const sizeStyles = {
    small: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    medium: { paddingVertical: SPACING.base, paddingHorizontal: SPACING.xl },
    large: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl },
  };

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      >
        <LinearGradient
          colors={disabled ? ['#9CA3AF', '#6B7280'] : [PALETTE.text, '#374151']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              borderRadius: METRICS.radius.md,
              alignItems: 'center',
              shadowColor: PALETTE.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: disabled ? 0.1 : 0.2,
              shadowRadius: 8,
            },
            sizeStyles[size],
            style,
          ]}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: TYPOGRAPHY.bold,
              fontSize: TYPOGRAPHY.body,
              letterSpacing: TYPOGRAPHY.wide,
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }

  // Secondary and ghost variants...
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={[
        {
          borderRadius: METRICS.radius.md,
          alignItems: 'center',
          backgroundColor: variant === 'secondary' ? PALETTE.surface : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: PALETTE.border,
        },
        sizeStyles[size],
        style,
      ]}
    >
      <Text
        style={{
          color: variant === 'ghost' ? PALETTE.accent : PALETTE.text,
          fontWeight: TYPOGRAPHY.semibold,
          fontSize: TYPOGRAPHY.body,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};
```

#### Task 2.2: Update All Pressables
**Files to update:**
- `app/(tabs)/dashboard.tsx`
- `app/(tabs)/garage.tsx`
- `app/(tabs)/activity.tsx`
- `app/(tabs)/profile.tsx`

**Find and replace:**
```typescript
// OLD
<Pressable onPress={handlePress}>

// NEW
<Pressable 
  onPress={handlePress}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Descriptive label"
>
```

### Day 3: Unified Card Component

#### Task 3.1: Create UnifiedCard Component
**File:** `src/components/ui/UnifiedCard.tsx`
```typescript
import React from 'react';
import { View, Text, Image, ViewStyle, ImageSourcePropType } from 'react-native';
import { GlassCard } from './GlassCard';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/constants/DesignSystem';
import { Button } from './Button';

interface UnifiedCardProps {
  // Visual
  image?: ImageSourcePropType | string;
  imageHeight?: number;
  icon?: React.ReactNode;
  
  // Content
  title: string;
  subtitle?: string;
  value?: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  
  // Data rows
  stats?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
  
  // Progress bar
  progress?: {
    percentage: number;
    label: string;
    color?: string;
  };
  
  // Action
  action?: {
    title: string;
    onPress: () => void;
  };
  
  // Styling
  style?: ViewStyle;
  onPress?: () => void;
}

export const UnifiedCard = ({
  image,
  imageHeight = 150,
  icon,
  title,
  subtitle,
  value,
  trend,
  stats,
  progress,
  action,
  style,
  onPress,
}: UnifiedCardProps) => {
  return (
    <GlassCard 
      style={[{ padding: 0, overflow: 'hidden', marginBottom: SPACING.lg }, style]}
      onPress={onPress}
    >
      {/* Image Header (if provided) */}
      {image && (
        <View style={{ height: imageHeight, width: '100%', backgroundColor: '#E5E7EB' }}>
          {typeof image === 'string' ? (
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Image source={image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          )}
        </View>
      )}

      {/* Content Body */}
      <View style={{ padding: SPACING.lg }}>
        {/* Icon + Title Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
          {icon && <View style={{ marginRight: SPACING.md }}>{icon}</View>}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: TYPOGRAPHY.h3,
                fontWeight: TYPOGRAPHY.extrabold,
                color: PALETTE.text,
                letterSpacing: TYPOGRAPHY.tight,
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={{
                  fontSize: TYPOGRAPHY.small,
                  color: PALETTE.textSecondary,
                  marginTop: 2,
                }}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {value && (
            <Text
              style={{
                fontSize: TYPOGRAPHY.h3,
                fontWeight: TYPOGRAPHY.bold,
                color: PALETTE.text,
              }}
            >
              {value}
            </Text>
          )}
        </View>

        {/* Trend (if provided) */}
        {trend && (
          <View
            style={{
              backgroundColor: trend.isPositive
                ? 'rgba(5, 150, 105, 0.1)'
                : 'rgba(220, 38, 38, 0.1)',
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.xs,
              borderRadius: METRICS.radius.sm,
              alignSelf: 'flex-start',
              marginBottom: SPACING.md,
            }}
          >
            <Text
              style={{
                color: trend.isPositive ? PALETTE.success : PALETTE.danger,
                fontSize: TYPOGRAPHY.small,
                fontWeight: TYPOGRAPHY.bold,
              }}
            >
              {trend.value}
            </Text>
          </View>
        )}

        {/* Stats Grid (if provided) */}
        {stats && stats.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              gap: SPACING.lg,
              marginBottom: SPACING.md,
              paddingTop: SPACING.md,
              borderTopWidth: 1,
              borderTopColor: PALETTE.border,
            }}
          >
            {stats.map((stat, index) => (
              <View key={index} style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.caption,
                    color: PALETTE.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: TYPOGRAPHY.wide,
                    marginBottom: SPACING.xs,
                  }}
                >
                  {stat.label}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.body,
                    fontWeight: TYPOGRAPHY.bold,
                    color: stat.color || PALETTE.text,
                  }}
                >
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Progress Bar (if provided) */}
        {progress && (
          <View style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs }}>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.caption,
                  color: PALETTE.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: TYPOGRAPHY.wide,
                }}
              >
                {progress.label}
              </Text>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.caption,
                  fontWeight: TYPOGRAPHY.bold,
                  color: progress.color || PALETTE.success,
                }}
              >
                {progress.percentage}%
              </Text>
            </View>
            <View
              style={{
                height: 6,
                backgroundColor: '#F3F4F6',
                borderRadius: 3,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${progress.percentage}%`,
                  backgroundColor: progress.color || PALETTE.text,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        )}

        {/* Action Button (if provided) */}
        {action && (
          <Button
            title={action.title}
            onPress={action.onPress}
            variant="primary"
            size="medium"
          />
        )}
      </View>
    </GlassCard>
  );
};
```

## Phase 2: Screen Updates (Days 4-7)
**Goal:** Apply unified components to all screens, add visual interest.

### Day 4: Dashboard Enhancements

#### Task 4.1: Update Hero Section
**File:** `app/(tabs)/dashboard.tsx`
```typescript
// Update hero number size
<Text style={{
  color: PALETTE.text,
  fontSize: TYPOGRAPHY.hero, // Changed from 48 to 72
  fontWeight: TYPOGRAPHY.extrabold,
  letterSpacing: TYPOGRAPHY.tight,
}}>
  {formatCurrency(totalValue)}
</Text>
```

#### Task 4.2: Convert Quick Action Cards
```typescript
// Replace existing cards with UnifiedCard
<UnifiedCard
  icon={<Car size={24} color={PALETTE.accent} />}
  title="Your Garage"
  value={cars.length.toString()}
  subtitle={`${cars.length} vehicle${cars.length !== 1 ? 's' : ''}`}
  onPress={handleGaragePress}
/>
```

### Day 5: Garage Screen Polish

#### Task 5.1: Update Vehicle Cards
**File:** `app/(tabs)/garage.tsx`
```typescript
// Replace renderVehicle with UnifiedCard
<UnifiedCard
  image="https://images.unsplash.com/photo-1560958089-b8a1929cea89"
  title={`${car.make} ${car.model}`}
  subtitle={car.year.toString()}
  value={formatCurrency(value)}
  stats={[
    {
      label: 'Equity',
      value: formatCurrency(equity),
      color: PALETTE.success,
    },
    ...(loan > 0 ? [{
      label: 'Loan',
      value: formatCurrency(loan),
      color: PALETTE.danger,
    }] : []),
  ]}
  progress={{
    percentage: equityPercent,
    label: 'Equity Position',
    color: PALETTE.text,
  }}
  action={{
    title: 'See Forecast',
    onPress: () => handleForecastPress(car),
  }}
/>
```

### Day 6: Activity Screen Transformation

#### Task 6.1: Add Visual Interest
**File:** `app/(tabs)/activity.tsx`
```typescript
import { TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react-native';

// Update activity items with icons
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'positive':
      return <TrendingUp size={20} color={PALETTE.success} />;
    case 'negative':
      return <TrendingDown size={20} color={PALETTE.danger} />;
    case 'alert':
      return <AlertCircle size={20} color={PALETTE.accent} />;
    default:
      return <Zap size={20} color={PALETTE.accent} />;
  }
};

// Use UnifiedCard for each activity
<UnifiedCard
  icon={getActivityIcon(activity.type)}
  title={activity.title}
  subtitle={activity.timeAgo}
  value={activity.value}
  trend={activity.trend}
/>
```

### Day 7: Profile Screen Enhancement

#### Task 7.1: Add User Stats Card
**File:** `app/(tabs)/profile.tsx`
```typescript
// Add stats card at top
<UnifiedCard
  icon={
    <View style={{
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: PALETTE.accent,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
        {user?.name?.charAt(0) || 'U'}
      </Text>
    </View>
  }
  title={user?.name || 'User'}
  subtitle="Pro Member"
  stats={[
    { label: 'Vehicles', value: cars.length.toString() },
    { label: 'Total Value', value: formatCurrency(totalValue) },
    { label: 'Member Since', value: '2024' },
  ]}
/>
```

## Phase 3: Polish & Animations (Days 8-10)
**Goal:** Add transitions, micro-interactions, and final polish.

### Day 8: Screen Transitions

#### Task 8.1: Add Fade Transitions
**File:** `app/_layout.tsx`
```typescript
<Stack
  screenOptions={{
    headerShown: false,
    contentStyle: { backgroundColor: 'transparent' },
    animation: 'fade',
    animationDuration: 200,
  }}
>
```

#### Task 8.2: Add Loading States
**File:** `src/components/ui/LoadingCard.tsx`
```typescript
import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { PALETTE, SPACING } from '@/constants/DesignSystem';

export const LoadingCard = () => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: PALETTE.surface,
          borderRadius: 20,
          padding: SPACING.lg,
          marginBottom: SPACING.lg,
          height: 200,
        },
        animatedStyle,
      ]}
    />
  );
};
```

### Day 9: Micro-interactions

#### Task 9.1: Add Button Press Animation
**File:** `src/components/ui/Button.tsx`
```typescript
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// Inside Button component
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.96);
};

const handlePressOut = () => {
  scale.value = withSpring(1);
};

// Wrap button content in Animated.View
<Animated.View style={animatedStyle}>
  {/* button content */}
</Animated.View>
```

#### Task 9.2: Add Card Hover States (Web)
**File:** `src/components/ui/UnifiedCard.tsx`
```typescript
const [isHovered, setIsHovered] = React.useState(false);

<GlassCard
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  style={[
    { 
      transform: [{ scale: isHovered ? 1.02 : 1 }],
      transition: 'transform 0.2s',
    },
    style,
  ]}
>
```

### Day 10: Final Polish

#### Task 10.1: Add Empty States
**File:** `src/components/ui/EmptyState.tsx`
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/constants/DesignSystem';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    title: string;
    onPress: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <View style={{ alignItems: 'center', padding: SPACING.xxxl }}>
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: PALETTE.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
      }}
    >
      {icon}
    </View>
    <Text
      style={{
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: PALETTE.text,
        marginBottom: SPACING.md,
        textAlign: 'center',
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: TYPOGRAPHY.body,
        color: PALETTE.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
      }}
    >
      {description}
    </Text>
    {action && (
      <Button
        title={action.title}
        onPress={action.onPress}
        variant="primary"
      />
    )}
  </View>
);
```

#### Task 10.2: Update All Empty States
- Dashboard: "No vehicles yet"
- Garage: "Add your first car"
- Activity: "No recent activity"

## Testing & Verification (Days 11-12)

### Day 11: Automated Testing

#### Task 11.1: Create Cohesion Verification Test
**File:** `tests/cohesion-verification.spec.js`
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Cohesion Verification', () => {
  test('All screens use unified card component', async ({ page }) => {
    await page.goto('http://localhost:8081');
    
    // Check dashboard
    const dashboardCards = await page.locator('[data-testid*="unified-card"]').count();
    expect(dashboardCards).toBeGreaterThan(0);
    
    // Check garage
    await page.click('text=Garage');
    const garageCards = await page.locator('[data-testid*="unified-card"]').count();
    expect(garageCards).toBeGreaterThan(0);
    
    // Check activity
    await page.click('text=Activity');
    const activityCards = await page.locator('[data-testid*="unified-card"]').count();
    expect(activityCards).toBeGreaterThan(0);
  });

  test('All buttons have accessibility roles', async ({ page }) => {
    await page.goto('http://localhost:8081');
    
    const buttons = await page.locator('[role="button"]').all();
    expect(buttons.length).toBeGreaterThan(0);
    
    for (const button of buttons) {
      const label = await button.getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
  });

  test('Typography scale is consistent', async ({ page }) => {
    await page.goto('http://localhost:8081');
    
    const fontSizes = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const sizes = new Set();
      elements.forEach(el => {
        const size = window.getComputedStyle(el).fontSize;
        if (size) sizes.add(size);
      });
      return Array.from(sizes);
    });
    
    expect(fontSizes.length).toBeLessThanOrEqual(8);
  });
});
```

### Day 12: Manual QA & Polish

#### Checklist:
- [ ] All screens use UnifiedCard
- [ ] All buttons have accessibility roles
- [ ] Typography scale is consistent (6-8 sizes)
- [ ] Spacing follows 8px grid
- [ ] Colors are consistent across screens
- [ ] Transitions are smooth
- [ ] Loading states work
- [ ] Empty states are helpful
- [ ] Micro-interactions feel good
- [ ] App feels cohesive

## Implementation Checklist

### Phase 1: Foundation ✓
- [ ] Create Spacing.ts
- [ ] Create Typography.ts
- [ ] Update DesignSystem.ts
- [ ] Create Button component
- [ ] Update all Pressables with accessibility
- [ ] Create UnifiedCard component

### Phase 2: Screen Updates ✓
- [ ] Update Dashboard hero section
- [ ] Convert Dashboard cards to UnifiedCard
- [ ] Update Garage vehicle cards
- [ ] Transform Activity screen
- [ ] Enhance Profile screen
- [ ] Update Tools screen
- [ ] Update Estimate screen
- [ ] Update Forecast screen

### Phase 3: Polish ✓
- [ ] Add screen transitions
- [ ] Create LoadingCard component
- [ ] Add button press animations
- [ ] Add card hover states
- [ ] Create EmptyState component
- [ ] Update all empty states
- [ ] Run automated tests
- [ ] Manual QA pass

## Success Metrics

### Before
- ❌ 4 different visual styles
- ❌ No accessibility support
- ❌ Inconsistent spacing
- ❌ Weak hierarchy
- ❌ No animations

### After
- ✅ Unified visual language
- ✅ Full accessibility support
- ✅ 8px grid system
- ✅ Strong hierarchy (72px hero)
- ✅ Smooth transitions
- ✅ Cohesive experience

## Timeline Summary

**Week 1:**
- Days 1-3: Foundation (design system, accessibility, unified card)
- Days 4-7: Screen updates (apply to all screens)

**Week 2:**
- Days 8-10: Polish (animations, micro-interactions, empty states)
- Days 11-12: Testing & QA

**Total:** 12 days (2 weeks)

## Next Steps

1. **Start with Phase 1, Day 1** - Create the spacing and typography systems
2. **Test incrementally** - Don't wait until the end
3. **Get feedback early** - Show progress after each phase
4. **Document as you go** - Update this plan with learnings

## Notes

- This plan assumes 1 developer working full-time
- Can be parallelized with 2 developers (one on foundation, one on screens)
- Adjust timeline based on your velocity
- Prioritize Phase 1 and 2 - Phase 3 is polish

---

**Ready to start? Begin with Phase 1, Day 1: Create Spacing.ts**
