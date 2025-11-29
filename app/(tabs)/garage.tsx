/**
 * Garage - ClearScore-inspired Vehicle Portfolio
 * 
 * Clean cards showing:
 * - Equity score ring (like credit score)
 * - Key vehicle info
 * - Simple status indicator
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius, Shadows, haptic, IconSizes } from '@/src/constants/AutoTrackDesign';
import AddVehicleModal from '../../src/components/native/AddVehicleModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data with full vehicle info
const mockVehicles = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    registration: 'EV22 ABC',
    mileage: 28500,
    currentValue: 38000,
    settlementFigure: 32000,
    monthlyPayment: 450,
    monthsRemaining: 19,
    financeType: 'PCP',
  },
  {
    id: '2',
    make: 'BMW',
    model: '3 Series',
    year: 2021,
    registration: 'BM21 XYZ',
    mileage: 38200,
    currentValue: 28000,
    settlementFigure: 22000,
    monthlyPayment: 680,
    monthsRemaining: 22,
    financeType: 'HP',
  },
  {
    id: '3',
    make: 'Audi',
    model: 'A5 S-Line',
    year: 2023,
    registration: 'AU23 DEF',
    mileage: 12500,
    currentValue: 42000,
    settlementFigure: 45000,
    monthlyPayment: 520,
    monthsRemaining: 36,
    financeType: 'PCP',
  },
];

// Equity Score Ring Component
const EquityRing = ({ equity, size = 80 }: { equity: number; size?: number }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate score 0-100 based on equity (-10k to +10k range)
  const score = Math.min(100, Math.max(0, ((equity + 10000) / 20000) * 100));
  const progress = (score / 100) * circumference;
  
  const getColor = () => {
    if (equity >= 2000) return Colors.positive;
    if (equity >= 0) return Colors.brand;
    if (equity >= -2000) return '#F59E0B';
    return Colors.negative;
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <SvgGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={getColor()} stopOpacity="1" />
            <Stop offset="100%" stopColor={getColor()} stopOpacity="0.6" />
          </SvgGradient>
        </Defs>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={[styles.ringValue, { color: getColor() }]}>
        {equity >= 0 ? '+' : ''}£{Math.abs(equity / 1000).toFixed(1)}k
      </Text>
    </View>
  );
};

export default function Garage() {
  const router = useRouter();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const portfolio = useMemo(() => {
    let totalEquity = 0;
    let totalValue = 0;
    mockVehicles.forEach((v) => {
      totalEquity += v.currentValue - v.settlementFigure;
      totalValue += v.currentValue;
    });
    return { totalEquity, totalValue, count: mockVehicles.length };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    haptic.light();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusInfo = (equity: number) => {
    if (equity >= 2000) return { label: 'Sell & Profit', icon: TrendingUp, color: Colors.positive };
    if (equity >= 0) return { label: 'Break-even', icon: Minus, color: Colors.brand };
    return { label: 'Wait to Save', icon: TrendingDown, color: Colors.negative };
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title} accessibilityRole="header">My Garage</Text>
              <Text style={styles.subtitle}>{portfolio.count} vehicles</Text>
            </View>
            <Pressable
              onPress={() => { haptic.medium(); setAddModalVisible(true); }}
              style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
            >
              <LinearGradient colors={Colors.gradientBrand} style={styles.addButtonGradient}>
                <Plus size={IconSizes.md} color="white" strokeWidth={2.5} />
              </LinearGradient>
            </Pressable>
          </View>

          {/* Portfolio Summary */}
          <LinearGradient colors={Colors.gradientHero} style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>
                  {portfolio.totalEquity >= 0 ? 'Profit if Sold Today' : 'Loss if Sold Today'}
                </Text>
                <Text style={styles.summaryValue}>
                  {portfolio.totalEquity >= 0 ? '+' : '-'}£{Math.abs(portfolio.totalEquity).toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Portfolio Value</Text>
                <Text style={styles.summaryValue}>£{portfolio.totalValue.toLocaleString()}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Vehicle Cards */}
          {mockVehicles.map((vehicle) => {
            const equity = vehicle.currentValue - vehicle.settlementFigure;
            const status = getStatusInfo(equity);
            const StatusIcon = status.icon;

            return (
              <Pressable
                key={vehicle.id}
                onPress={() => { haptic.light(); router.push({ pathname: '/(app)/car-detail', params: { vehicleId: vehicle.id } }); }}
                style={({ pressed }) => [styles.vehicleCard, pressed && styles.vehicleCardPressed]}
              >
                <View style={styles.cardLeft}>
                  <EquityRing equity={equity} size={72} />
                </View>
                
                <View style={styles.cardCenter}>
                  <Text style={styles.vehicleName}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
                  <Text style={styles.vehicleReg}>{vehicle.registration}</Text>
                  
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{(vehicle.mileage / 1000).toFixed(0)}k</Text>
                      <Text style={styles.statLabel}>miles</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>£{vehicle.monthlyPayment}</Text>
                      <Text style={styles.statLabel}>/month</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{vehicle.monthsRemaining}</Text>
                      <Text style={styles.statLabel}>left</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
                    <StatusIcon size={IconSizes.sm} color={status.color} />
                  </View>
                  <ChevronRight size={IconSizes.md} color={Colors.textTertiary} />
                </View>
              </Pressable>
            );
          })}

          {/* Add Vehicle CTA */}
          <Pressable
            onPress={() => { haptic.light(); setAddModalVisible(true); }}
            style={({ pressed }) => [styles.addVehicleCta, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
          >
            <Plus size={IconSizes.sm} color={Colors.brand} />
            <Text style={styles.addVehicleText}>Add another vehicle</Text>
          </Pressable>

          <View style={{ height: 100 }} />
        </ScrollView>

        <AddVehicleModal visible={addModalVisible} onDismiss={() => setAddModalVisible(false)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.base, maxWidth: '100%' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md, marginBottom: Spacing.lg },
  title: { ...Typography.largeTitle, color: Colors.text },
  subtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  addButton: { ...Shadows.brandGlow },
  addButtonGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  // Summary
  summaryCard: { borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, ...Shadows.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  summaryLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  summaryValue: { ...Typography.title1, color: 'white', fontWeight: '700' },

  // Vehicle Card
  vehicleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm, maxWidth: '100%', overflow: 'hidden' },
  vehicleCardPressed: { backgroundColor: Colors.borderLight, transform: [{ scale: 0.98 }], opacity: 0.95 },
  cardLeft: { marginRight: Spacing.md },
  cardCenter: { flex: 1 },
  cardRight: { alignItems: 'center', gap: 8 },
  
  vehicleName: { ...Typography.headline, color: Colors.text, marginBottom: 2 },
  vehicleReg: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 8 },
  
  statsRow: { flexDirection: 'row', gap: Spacing.md },
  stat: { alignItems: 'center' },
  statValue: { ...Typography.subheadline, color: Colors.text, fontWeight: '600' },
  statLabel: { ...Typography.caption, color: Colors.textTertiary, fontSize: 10 },

  statusBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  ringValue: { ...Typography.headline, fontWeight: '700', fontSize: 14 },

  // Add Vehicle
  addVehicleCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  addVehicleText: { ...Typography.body, color: Colors.brand, fontWeight: '500' },
});
