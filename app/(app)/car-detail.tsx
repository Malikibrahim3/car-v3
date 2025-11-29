/**
 * Car Detail - ClearScore-inspired Financial View
 * 
 * Features:
 * - Large scrubbable equity chart (48 months)
 * - Equity score display
 * - Selling options
 * - Vehicle & finance details
 */

import React, { useState, useMemo, useRef } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Pencil, User, Car, Gauge, Calendar, CreditCard, TrendingUp, TrendingDown } from 'lucide-react-native';
import Svg, { Circle, Path, Line, Rect, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius, Shadows, haptic } from '@/src/constants/AutoTrackDesign';
import { generateProjections } from '@/src/utils/equityCalculator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock vehicle data
const VEHICLE = {
  id: '1',
  make: 'Tesla',
  model: 'Model 3',
  year: 2022,
  registration: 'EV22 ABC',
  mileage: 28500,
  annualMileage: 12000,
  color: 'Pearl White',
  financeType: 'PCP',
  purchasePrice: 48000,
  currentValue: 38000,
  privateValue: 40000,
  tradeInValue: 36000,
  deposit: 5000,
  loanAmount: 43000,
  settlementFigure: 32000,
  monthlyPayment: 450,
  interestRate: 6.9,
  termMonths: 48,
  monthsElapsed: 29,
  balloonPayment: 18000,
};

// Interactive Equity Chart with Color Zones
const EquityChart = ({ 
  data, 
  selectedIndex, 
  onSelectIndex,
  currentMonthIndex 
}: { 
  data: { month: number; equity: number; label: string }[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  currentMonthIndex: number;
}) => {
  const width = SCREEN_WIDTH - 32;
  const height = 260;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 50;
  const paddingRight = 16;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minEquity = Math.min(...data.map(d => d.equity), -5000);
  const maxEquity = Math.max(...data.map(d => d.equity), 5000);
  const absMax = Math.max(Math.abs(minEquity), Math.abs(maxEquity));
  const adjustedMin = -absMax * 1.1;
  const adjustedMax = absMax * 1.1;
  const adjustedRange = adjustedMax - adjustedMin;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (equity: number) => paddingTop + chartHeight - ((equity - adjustedMin) / adjustedRange) * chartHeight;
  const zeroY = getY(0);

  // Build line path
  const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.equity)}`).join(' ');

  // Find break-even point (where line crosses zero)
  let breakEvenIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if ((data[i-1].equity < 0 && data[i].equity >= 0) || (data[i-1].equity >= 0 && data[i].equity < 0)) {
      breakEvenIndex = i;
      break;
    }
  }

  // Pan handler for scrubbing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX),
    })
  ).current;

  const handleTouch = (x: number) => {
    const index = Math.round(((x - paddingLeft) / chartWidth) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    if (clampedIndex !== selectedIndex) {
      haptic.light();
      onSelectIndex(clampedIndex);
    }
  };

  const selectedData = data[selectedIndex];
  const selectedX = getX(selectedIndex);
  const selectedY = getY(selectedData.equity);
  const isPositive = selectedData.equity >= 0;

  // Get status text
  const getStatus = () => {
    if (selectedIndex < currentMonthIndex) return 'Actual';
    if (selectedIndex === currentMonthIndex) return 'Today';
    return 'Projected';
  };

  return (
    <View style={styles.chartWrapper}>
      {/* Selected value display */}
      <View style={styles.chartHeader}>
        <View style={[styles.chartStatusBadge, { backgroundColor: isPositive ? `${Colors.positive}20` : `${Colors.negative}20` }]}>
          <Text style={[styles.chartStatusText, { color: isPositive ? Colors.positive : Colors.negative }]}>
            {isPositive ? 'POSITIVE EQUITY' : 'NEGATIVE EQUITY'}
          </Text>
        </View>
        <Text style={[styles.chartValue, { color: isPositive ? Colors.positive : Colors.negative }]}>
          {isPositive ? '+' : ''}£{Math.abs(selectedData.equity).toLocaleString()}
        </Text>
        <Text style={styles.chartMonth}>{selectedData.label} • {getStatus()}</Text>
      </View>

      <View {...panResponder.panHandlers}>
        <Svg width={width} height={height}>
          <Defs>
            {/* Green zone gradient (above zero) */}
            <SvgGradient id="greenZone" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.positive} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={Colors.positive} stopOpacity="0.02" />
            </SvgGradient>
            {/* Red zone gradient (below zero) */}
            <SvgGradient id="redZone" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.negative} stopOpacity="0.02" />
              <Stop offset="100%" stopColor={Colors.negative} stopOpacity="0.15" />
            </SvgGradient>
          </Defs>

          {/* Green zone (positive equity area) */}
          <Rect
            x={paddingLeft}
            y={paddingTop}
            width={chartWidth}
            height={zeroY - paddingTop}
            fill="url(#greenZone)"
          />
          
          {/* Red zone (negative equity area) */}
          <Rect
            x={paddingLeft}
            y={zeroY}
            width={chartWidth}
            height={height - paddingBottom - zeroY}
            fill="url(#redZone)"
          />

          {/* Break-even line (zero) - prominent */}
          <Line
            x1={paddingLeft}
            y1={zeroY}
            x2={width - paddingRight}
            y2={zeroY}
            stroke={Colors.textSecondary}
            strokeWidth={2}
          />
          
          {/* Break-even label */}
          <Rect x={paddingLeft + 4} y={zeroY - 10} width={70} height={16} fill={Colors.surface} rx={4} />

          {/* Grid lines */}
          {[-absMax, -absMax/2, absMax/2, absMax].map((val, i) => (
            <Line
              key={i}
              x1={paddingLeft}
              y1={getY(val)}
              x2={width - paddingRight}
              y2={getY(val)}
              stroke={Colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.4}
            />
          ))}

          {/* The equity line - color changes based on position */}
          <Path d={pathD} stroke={Colors.brand} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Break-even marker if exists */}
          {breakEvenIndex > 0 && (
            <>
              <Circle cx={getX(breakEvenIndex)} cy={zeroY} r={6} fill={Colors.brand} stroke="white" strokeWidth={2} />
            </>
          )}

          {/* Current month marker */}
          <Circle 
            cx={getX(currentMonthIndex)} 
            cy={getY(data[currentMonthIndex].equity)} 
            r={6} 
            fill={data[currentMonthIndex].equity >= 0 ? Colors.positive : Colors.negative} 
            stroke="white" 
            strokeWidth={2}
          />

          {/* Selected indicator line */}
          <Line x1={selectedX} y1={paddingTop} x2={selectedX} y2={height - paddingBottom} stroke={isPositive ? Colors.positive : Colors.negative} strokeWidth={2} opacity={0.3} />

          {/* Selected point */}
          <Circle cx={selectedX} cy={selectedY} r={10} fill={isPositive ? Colors.positive : Colors.negative} />
          <Circle cx={selectedX} cy={selectedY} r={5} fill="white" />
        </Svg>

        {/* Y-axis labels (React Native Text overlay) */}
        <View style={[styles.yAxisLabels, { height }]} pointerEvents="none">
          <Text style={[styles.axisLabel, styles.axisLabelPositive, { top: paddingTop - 6 }]}>
            +£{Math.abs(adjustedMax / 1000).toFixed(0)}k
          </Text>
          <Text style={[styles.axisLabel, styles.axisLabelZero, { top: zeroY - 8 }]}>BREAK-EVEN</Text>
          <Text style={[styles.axisLabel, styles.axisLabelNegative, { top: height - paddingBottom - 6 }]}>
            -£{Math.abs(adjustedMin / 1000).toFixed(0)}k
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.positive }]} />
          <Text style={styles.legendText}>Positive Equity</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.negative }]} />
          <Text style={styles.legendText}>Negative Equity</Text>
        </View>
      </View>

      {/* Scrub hint */}
      <Text style={styles.scrubHint}>Swipe left/right to explore timeline</Text>
    </View>
  );
};

export default function CarDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(VEHICLE.monthsElapsed);

  const equity = VEHICLE.currentValue - VEHICLE.settlementFigure;
  const privateEquity = VEHICLE.privateValue - VEHICLE.settlementFigure;
  const tradeInEquity = VEHICLE.tradeInValue - VEHICLE.settlementFigure;
  const monthsRemaining = VEHICLE.termMonths - VEHICLE.monthsElapsed;
  const totalPaid = VEHICLE.deposit + (VEHICLE.monthlyPayment * VEHICLE.monthsElapsed);

  // Generate 48+ months of data
  const chartData = useMemo(() => {
    const projections = generateProjections(
      VEHICLE.purchasePrice, 'premium', 'pcp',
      VEHICLE.loanAmount, VEHICLE.monthlyPayment, VEHICLE.interestRate,
      VEHICLE.termMonths, VEHICLE.monthsElapsed, VEHICLE.balloonPayment,
      VEHICLE.mileage, VEHICLE.annualMileage
    );
    return projections.map(p => ({
      month: p.month,
      equity: p.cashPosition.tradeIn,
      label: p.monthLabel || `Month ${p.month}`,
    }));
  }, []);

  const getEquityStatus = (eq: number) => {
    if (eq >= 3000) return { label: 'Excellent', color: Colors.positive };
    if (eq >= 0) return { label: 'Good', color: Colors.brand };
    if (eq >= -3000) return { label: 'Fair', color: '#F59E0B' };
    return { label: 'Poor', color: Colors.negative };
  };

  const status = getEquityStatus(equity);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => { haptic.light(); router.back(); }} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{VEHICLE.year} {VEHICLE.make} {VEHICLE.model}</Text>
            <Text style={styles.headerSubtitle}>{VEHICLE.registration}</Text>
          </View>
          <Pressable onPress={() => router.push({ pathname: '/(app)/edit-car', params: { vehicleId: params.vehicleId } })} style={styles.editButton}>
            <Pencil size={20} color={Colors.brand} />
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Equity Score Summary */}
          <View style={styles.equityHeader}>
            <Text style={styles.equityLabel}>
              {equity >= 0 ? 'MONEY YOU KEEP IF YOU SELL' : 'MONEY YOU LOSE IF YOU SELL NOW'}
            </Text>
            <Text style={[styles.equityValue, { color: status.color }]}>
              {equity >= 0 ? '+' : '-'}£{Math.abs(equity).toLocaleString()}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {equity >= 0 ? '✓ Ready to Sell' : 'Wait to Save Money'}
              </Text>
            </View>
          </View>
          
          {/* Savings Alert */}
          {equity < 0 && (
            <View style={styles.savingsAlert}>
              <Text style={styles.savingsAlertTitle}>💰 Save £{Math.abs(equity).toLocaleString()}</Text>
              <Text style={styles.savingsAlertText}>
                If you sell today, you'll need to pay £{Math.abs(equity).toLocaleString()} out of pocket. Wait until you reach positive equity to avoid this loss.
              </Text>
            </View>
          )}
          
          {equity >= 0 && (
            <View style={styles.profitAlert}>
              <Text style={styles.profitAlertTitle}>🎉 You're in profit!</Text>
              <Text style={styles.profitAlertText}>
                Sell now and walk away with £{equity.toLocaleString()} in your pocket after settling your finance.
              </Text>
            </View>
          )}

          {/* Big Interactive Chart */}
          <View style={styles.chartSection}>
            <EquityChart
              data={chartData}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              currentMonthIndex={VEHICLE.monthsElapsed}
            />
          </View>

          {/* Selling Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selling Options</Text>
            <Text style={styles.sectionSubtitle}>
              {equity >= 0 ? "You're in positive equity! Here's what you could walk away with:" : "Current options if you sold today:"}
            </Text>
            
            <View style={styles.sellOptionsRow}>
              <View style={[styles.sellOption, privateEquity >= 0 && styles.sellOptionPositive]}>
                <View style={styles.sellOptionIcon}>
                  <User size={20} color={privateEquity >= 0 ? Colors.positive : Colors.textSecondary} />
                </View>
                <Text style={styles.sellOptionLabel}>Private Sale</Text>
                <Text style={[styles.sellOptionValue, { color: privateEquity >= 0 ? Colors.positive : Colors.negative }]}>
                  {privateEquity >= 0 ? '+' : ''}£{Math.abs(privateEquity).toLocaleString()}
                </Text>
                <Text style={styles.sellOptionHint}>Sell directly to buyer</Text>
              </View>

              <View style={[styles.sellOption, tradeInEquity >= 0 && styles.sellOptionPositive]}>
                <View style={styles.sellOptionIcon}>
                  <Car size={20} color={tradeInEquity >= 0 ? Colors.positive : Colors.textSecondary} />
                </View>
                <Text style={styles.sellOptionLabel}>Trade-In</Text>
                <Text style={[styles.sellOptionValue, { color: tradeInEquity >= 0 ? Colors.positive : Colors.negative }]}>
                  {tradeInEquity >= 0 ? '+' : ''}£{Math.abs(tradeInEquity).toLocaleString()}
                </Text>
                <Text style={styles.sellOptionHint}>Part exchange at dealer</Text>
              </View>
            </View>
          </View>

          {/* Vehicle Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Gauge size={18} color={Colors.textSecondary} />
                <Text style={styles.detailLabel}>Mileage</Text>
                <Text style={styles.detailValue}>{VEHICLE.mileage.toLocaleString()} miles</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Calendar size={18} color={Colors.textSecondary} />
                <Text style={styles.detailLabel}>Year</Text>
                <Text style={styles.detailValue}>{VEHICLE.year}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Car size={18} color={Colors.textSecondary} />
                <Text style={styles.detailLabel}>Color</Text>
                <Text style={styles.detailValue}>{VEHICLE.color}</Text>
              </View>
            </View>
          </View>

          {/* Finance Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Finance Details</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <CreditCard size={18} color={Colors.textSecondary} />
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{VEHICLE.financeType}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monthly Payment</Text>
                <Text style={styles.detailValue}>£{VEHICLE.monthlyPayment}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Months Remaining</Text>
                <Text style={styles.detailValue}>{monthsRemaining} of {VEHICLE.termMonths}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Paid</Text>
                <Text style={styles.detailValue}>£{totalPaid.toLocaleString()}</Text>
              </View>
              {VEHICLE.balloonPayment > 0 && (
                <>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Balloon Payment</Text>
                    <Text style={styles.detailValue}>£{VEHICLE.balloonPayment.toLocaleString()}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...Typography.headline, color: Colors.text },
  headerSubtitle: { ...Typography.caption, color: Colors.textSecondary },
  editButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Equity Header
  equityHeader: { alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.base },
  equityLabel: { ...Typography.caption, color: Colors.textSecondary, letterSpacing: 1, textAlign: 'center' },
  equityValue: { fontSize: 42, fontWeight: '700', marginVertical: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { ...Typography.caption, fontWeight: '600' },
  
  // Savings/Profit Alerts
  savingsAlert: { 
    marginHorizontal: Spacing.base, 
    marginBottom: Spacing.lg, 
    backgroundColor: `${Colors.negative}10`, 
    borderRadius: Radius.lg, 
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.negative,
  },
  savingsAlertTitle: { ...Typography.headline, color: Colors.negative, marginBottom: 4 },
  savingsAlertText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 20 },
  profitAlert: { 
    marginHorizontal: Spacing.base, 
    marginBottom: Spacing.lg, 
    backgroundColor: `${Colors.positive}10`, 
    borderRadius: Radius.lg, 
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.positive,
  },
  profitAlertTitle: { ...Typography.headline, color: Colors.positive, marginBottom: 4 },
  profitAlertText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 20 },

  // Chart
  chartSection: { paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  chartWrapper: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, ...Shadows.sm },
  chartHeader: { alignItems: 'center', marginBottom: Spacing.md, paddingTop: Spacing.sm },
  chartStatusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 4 },
  chartStatusText: { ...Typography.caption, fontWeight: '700', letterSpacing: 0.5 },
  chartMonth: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
  chartValue: { fontSize: 36, fontWeight: '700' },
  yAxisLabels: { position: 'absolute', left: 0, width: 70 },
  axisLabel: { ...Typography.caption, fontSize: 9, position: 'absolute', left: 2 },
  axisLabelPositive: { color: Colors.positive, fontWeight: '600' },
  axisLabelZero: { color: Colors.textSecondary, fontWeight: '700', fontSize: 8 },
  axisLabelNegative: { color: Colors.negative, fontWeight: '600' },
  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...Typography.caption, color: Colors.textSecondary },
  scrubHint: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center', marginTop: 12 },

  // Sections
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.headline, color: Colors.text, marginBottom: 4 },
  sectionSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.md },

  // Sell Options
  sellOptionsRow: { flexDirection: 'row', gap: Spacing.sm },
  sellOption: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  sellOptionPositive: { borderColor: Colors.positive, backgroundColor: `${Colors.positive}08` },
  sellOptionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  sellOptionLabel: { ...Typography.subheadline, color: Colors.text, fontWeight: '600' },
  sellOptionValue: { ...Typography.title2, fontWeight: '700', marginVertical: 4 },
  sellOptionHint: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },

  // Details Card
  detailsCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, ...Shadows.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: 12 },
  detailDivider: { height: 1, backgroundColor: Colors.border },
  detailLabel: { flex: 1, ...Typography.body, color: Colors.textSecondary },
  detailValue: { ...Typography.body, color: Colors.text, fontWeight: '500' },
});
