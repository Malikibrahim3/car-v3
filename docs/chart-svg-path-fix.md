# Chart SVG Path Error Fix

## Problem
The app was throwing "malformed path data" errors from `normalize-svg-path` in the stack trace. This happens when:
- SVG path strings are invalid, empty, or null
- Chart data contains NaN, Infinity, or non-numeric values
- Array segments don't have enough points (seg.length < 4)

## Solution

### 1. Data Validation in CinematicChart
Added `sanitizeData()` function that:
- Filters out null, undefined, NaN, and Infinity values
- Ensures at least 2 data points (minimum for a line chart)
- Provides safe fallback data [0, 0] when needed

### 2. Error Boundary
Created `ChartErrorBoundary` component that:
- Catches any SVG path errors at render time
- Logs errors for debugging
- Shows graceful fallback UI instead of crashing
- Specifically handles "malformed path data" errors

### 3. Usage
```tsx
<CinematicChart data={chartData} height={180} />
```

The component now handles:
- Empty arrays: []
- Invalid values: [NaN, 42, Infinity]
- Single values: [42]
- Null/undefined data
- Any SVG path generation errors

## Files Modified
- `src/components/CinematicChart.tsx` - Added data validation
- `src/components/ChartErrorBoundary.tsx` - New error boundary component

## Testing
The chart will now gracefully handle any invalid data and show a fallback instead of crashing the app.
