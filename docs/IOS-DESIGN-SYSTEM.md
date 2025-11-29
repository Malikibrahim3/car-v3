# iOS Design System Implementation

## Overview
This app now uses Apple's exact Human Interface Guidelines for typography and spacing, creating an authentic iOS experience.

## Typography - SF Pro

### Font Families
- **SF Pro Display**: Used for text 20pt and above (large titles, headlines)
- **SF Pro Text**: Used for text below 20pt (body, captions) - optimized for readability at small sizes

### iOS Semantic Text Styles
Following Apple's exact specifications:

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| Large Title | 34pt | Bold | Navigation bars, page titles |
| Title 1 | 28pt | Bold | Primary section headers |
| Title 2 | 22pt | Bold | Secondary section headers |
| Title 3 | 20pt | Semibold | Tertiary headers |
| Headline | 17pt | Semibold | Emphasized content |
| Body | 17pt | Regular | Standard text |
| Callout | 16pt | Regular | Secondary content |
| Subheadline | 15pt | Regular | Descriptive text |
| Footnote | 13pt | Regular | Supplementary info |
| Caption 1 | 12pt | Regular | Image captions, labels |
| Caption 2 | 11pt | Regular | Smallest readable text |

### Custom Financial Styles
- **Hero**: 72pt - Portfolio values, large numbers
- **Display**: 48pt - Feature numbers, highlights

### Font Weights (iOS Standard)
- Ultra Light: 100
- Thin: 200
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Heavy: 800
- Black: 900

### Letter Spacing
- **Tight** (-0.41): Large titles (reduces optical spacing)
- **Normal** (0): Standard text
- **Wide** (0.38): All-caps labels, captions

## Spacing - Base 8pt Grid

### Standard Spacing Scale
Following Apple's 8pt grid system:

| Token | Value | Use Case |
|-------|-------|----------|
| xxs | 2pt | Hairline spacing |
| xs | 4pt | Minimum touch spacing |
| sm | 8pt | Compact spacing, icon gaps |
| md | 12pt | List item vertical spacing |
| base | 16pt | Standard padding/margins |
| lg | 20pt | Card/section padding |
| xl | 24pt | Large section spacing |
| xxl | 32pt | Screen edge margins |
| xxxl | 44pt | Major section breaks |

### iOS-Specific Constants
- **screenPadding**: 16pt - Standard screen edge padding
- **cardPadding**: 16pt - Card internal padding
- **listItemHeight**: 44pt - Minimum touch target (Apple HIG requirement)
- **navBarHeight**: 44pt - iOS navigation bar
- **tabBarHeight**: 49pt - iOS tab bar

## Implementation

### Using Typography
```typescript
import { TYPOGRAPHY } from '@/src/constants/Typography';

<Text style={{
  fontFamily: TYPOGRAPHY.fontFamily,
  fontSize: TYPOGRAPHY.body,
  fontWeight: TYPOGRAPHY.regular,
  letterSpacing: TYPOGRAPHY.normal,
}}>
  Standard body text
</Text>
```

### Using Spacing
```typescript
import { SPACING } from '@/src/constants/Spacing';

<View style={{
  padding: SPACING.base,
  marginBottom: SPACING.lg,
  gap: SPACING.sm,
}}>
  {/* Content */}
</View>
```

### Using Text Styles Helper
```typescript
import { textStyles } from '@/src/utils/typography';

<Text style={textStyles.headline}>
  Emphasized headline
</Text>
```

## Benefits

1. **Authentic iOS Feel**: Matches native iOS apps exactly
2. **Accessibility**: Follows Apple's touch target and readability guidelines
3. **Consistency**: Semantic naming ensures consistent usage
4. **Scalability**: Base-8 grid makes layouts predictable
5. **Performance**: SF Pro is optimized for iOS rendering

## Migration Notes

Old constants are aliased for backward compatibility:
- `h1` → `title1` (28pt)
- `h2` → `title2` (22pt)
- `h3` → `title3` (20pt)
- `small` → `subheadline` (15pt)
- `caption` → `caption1` (12pt)
- `extrabold` → `heavy` (800)

## References
- [Apple Human Interface Guidelines - Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple Human Interface Guidelines - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [SF Pro Font Family](https://developer.apple.com/fonts/)
