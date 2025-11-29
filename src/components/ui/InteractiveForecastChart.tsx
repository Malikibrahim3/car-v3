import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, Platform } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { PALETTE } from '@/constants/DesignSystem';

const { width } = Dimensions.get('window');
// Fix width calculation for web/mobile consistency
const CHART_WIDTH = width - 48;

export const InteractiveForecastChart = () => {
  const [selectedYear, setSelectedYear] = useState(0);

  // 1. Realistic Data Generation (Stable, no jitter)
  const generateData = () => {
    const valueData = [];
    const loanData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentValue = 48500;
    let currentLoan = 42000;

    for (let i = 0; i < 12; i++) {
      // Stable "random" walk
      const noise = Math.sin(i) * 200;
      currentValue = currentValue - 350 + noise;
      currentLoan = Math.max(0, currentLoan - 600);
      const equity = currentValue - currentLoan;

      valueData.push({
        value: currentValue,
        label: i % 3 === 0 ? months[i] : '',
        dataPointText: '',
        equity: equity,
        loan: currentLoan,
        monthName: months[i],
        index: i
      });

      loanData.push({
        value: currentLoan,
        dataPointText: ''
      });
    }

    return { valueData, loanData, currentEquity: valueData[0].equity };
  };

  const { valueData, loanData, currentEquity } = useMemo(() => generateData(), []);
  const isPositive = currentEquity > 0;

  // 2. Custom Tooltip (Glass Lens)
  const renderTooltip = (item: any) => {
    const isEdgeRight = item.index > 8;
    const isEdgeLeft = item.index < 3;

    let marginLeft = -60;
    if (isEdgeRight) marginLeft = -120;
    if (isEdgeLeft) marginLeft = 0;

    return (
      <View style={[styles.tooltipWrapper, { marginLeft }]}>
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          <View style={styles.tooltipHeaderRow}>
            <Text style={styles.tooltipDate}>{item.monthName.toUpperCase()} 2025</Text>
            <View style={[
              styles.trendBadge,
              { backgroundColor: item.equity > 0 ? '#DCFCE7' : '#FEE2E2' }
            ]}>
              <Text style={[
                styles.trendText,
                { color: item.equity > 0 ? PALETTE.success : PALETTE.danger }
              ]}>
                {item.equity > 0 ? '▲' : '▼'}
              </Text>
            </View>
          </View>

          <Text style={[
            styles.tooltipBigNum,
            { color: item.equity >= 0 ? PALETTE.success : PALETTE.danger }
          ]}>
            {item.equity >= 0 ? '+' : ''}${Math.round(item.equity).toLocaleString()}
          </Text>
          <Text style={styles.tooltipLabel}>Net Equity</Text>
        </BlurView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>FORECAST MODEL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={[styles.heroNum, { color: isPositive ? PALETTE.success : PALETTE.danger }]}>
              {isPositive ? '+' : ''}${Math.round(currentEquity).toLocaleString()}
            </Text>
            <Text style={styles.subText}>Current Equity</Text>
          </View>
        </View>
      </View>

      {/* Chart Container - Explicit Height for Tests */}
      <View style={{ marginLeft: -10, height: 260, minHeight: 260 }}>
        <LineChart
          areaChart
          curved
          isAnimated
          animationDuration={1200}
          data={valueData}
          data2={loanData}
          height={260}
          width={CHART_WIDTH}
          spacing={CHART_WIDTH / 14}
          initialSpacing={20}

          // Asset Line (Solid Green)
          color1={PALETTE.success}
          thickness1={3}
          startFillColor1={PALETTE.success}
          endFillColor1={PALETTE.background}
          startOpacity={0.15}
          endOpacity={0.0}
          hideDataPoints1={false}
          dataPointsColor1={PALETTE.success}
          dataPointsRadius1={4}

          // Loan Line (Dashed Grey)
          color2={PALETTE.textSecondary}
          thickness2={2}
          strokeDashArray2={[5, 5]}
          hideDataPoints2={true}
          zIndex2={-1}

          // Axes
          hideYAxisText
          hideRules
          xAxisColor="transparent"
          yAxisColor="transparent"
          xAxisLabelTextStyle={styles.axisLabel}

          // Interaction
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          pointerConfig={{
            pointerStripHeight: 240,
            pointerStripColor: PALETTE.border,
            pointerStripWidth: 2,
            pointerColor: PALETTE.text,
            radius: 6,
            pointerLabelWidth: 120,
            pointerLabelHeight: 120,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items: any) => renderTooltip(items[0]),
          }}
        />
      </View>

      {/* Tabs - FIXED: Larger Touch Targets */}
      <View style={styles.tabs}>
        {['2025', '2026', '2027'].map((t, i) => (
          <Pressable
            key={t}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedYear(i);
            }}
            // Ensure min size for tests
            style={({pressed}) => [
              styles.tabItem,
              selectedYear === i && styles.activeTab,
              pressed && { opacity: 0.7 }
            ]}
          >
            <Text style={[styles.tabText, selectedYear === i && styles.activeTabText]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.insightBadge}>
          <Text style={styles.insightText}>🎉 Break-Even: Aug 2025</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PALETTE.surface,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: '#0F81A3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 11,
    elevation: 12,
    marginBottom: 20,
    borderWidth: 0,
    borderColor: 'transparent',
    minHeight: 450 // Force container height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 8
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.textSecondary,
    letterSpacing: 1,
    marginBottom: 6
  },
  heroNum: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  subText: {
    fontSize: 13,
    color: PALETTE.textSecondary,
    fontWeight: '600',
    marginBottom: 6
  },
  axisLabel: {
    color: PALETTE.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10
  },
  tooltipWrapper: {
    width: 150,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0F81A3',
    shadowOpacity: 0.35,
    shadowRadius: 11,
    elevation: 12,
    marginTop: -140,
    backgroundColor: PALETTE.surface
  },
  blurContainer: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  tooltipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  tooltipDate: {
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.textSecondary,
    letterSpacing: 0.5
  },
  trendBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  },
  trendText: {
    fontSize: 8,
    fontWeight: '800'
  },
  tooltipBigNum: {
    fontSize: 22,
    fontWeight: '800',
    color: PALETTE.text,
    fontVariant: ['tabular-nums'],
    marginBottom: 2
  },
  tooltipLabel: {
    fontSize: 11,
    color: PALETTE.textSecondary,
  },
  footer: {
    marginTop: 12,
    paddingHorizontal: 8
  },
  insightBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    alignSelf: 'flex-start'
  },
  insightText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '700'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 12,
    marginTop: 20,
    height: 56, // Explicit container height
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: '100%', // Fill container
    minHeight: 44 // Minimum touch target
  },
  activeTab: {
    backgroundColor: PALETTE.surface,
    shadowColor: '#0F81A3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  activeTabText: {
    color: PALETTE.text,
    fontWeight: '700',
  }
});
