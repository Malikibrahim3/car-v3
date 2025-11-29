/**
 * Dashboard - Premium AutoTrack Experience
 * 
 * This is the "WOW" moment - rich visuals, bold numbers, 
 * and a premium feel that makes users feel smart about their money.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  Pressable, 
  Image, 
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  Car,
  ArrowUpRight
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, haptic, IconSizes } from '@/src/constants/AutoTrackDesign';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const mockVehicles = [
  {
    id: '1',
    name: 'Audi A5 S-Line',
    registration: 'KY71 ABC',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
    marketValue: 32500,
    settlementFigure: 28000,
  },
  {
    id: '2',
    name: 'BMW 3 Series',
    registration: 'LM22 XYZ',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
    marketValue: 28000,
    settlementFigure: 32000,
  },
  {
    id: '3',
    name: 'Mercedes C-Class',
    registration: 'PN20 DEF',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    marketValue: 38500,
    settlementFigure: 35000,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const portfolio = useMemo(() => {
    let totalValue = 0;
    let totalSettlement = 0;
    let positiveCount = 0;

    mockVehicles.forEach(v => {
      totalValue += v.marketValue;
      totalSettlement += v.settlementFigure;
      if (v.marketValue >= v.settlementFigure) positiveCount++;
    });

    return { 
      totalValue, 
      totalEquity: totalValue - totalSettlement,
      positiveCount,
      negativeCount: mockVehicles.length - positiveCount,
      isPositive: totalValue >= totalSettlement,
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    haptic.light();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.brand}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.title} accessibilityRole="header">Your Portfolio</Text>
            </View>
            <Pressable
              onPress={() => {
                haptic.light();
                router.push('/(tabs)/profile');
              }}
              style={styles.avatarButton}
            >
              <LinearGradient
                colors={Colors.gradientBrand}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>JD</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Hero Card - The WOW Moment */}
          <View style={styles.heroCardContainer}>
            <LinearGradient
              colors={Colors.gradientHero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              {/* Decorative elements */}
              <View style={styles.heroDecor1} />
              <View style={styles.heroDecor2} />
              
              <View style={styles.heroContent}>
                <View style={styles.heroLabelRow}>
                  <Sparkles size={IconSizes.sm} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroLabel}>
                    {portfolio.isPositive ? 'Money You Could Keep' : 'Potential Loss if Sold Today'}
                  </Text>
                </View>
                
                <Text style={styles.heroValue}>
                  {portfolio.isPositive ? '+' : '-'}£{Math.abs(portfolio.totalEquity).toLocaleString()}
                </Text>
                
                <Text style={styles.heroSubtext}>
                  {portfolio.isPositive 
                    ? 'Sell now and pocket this amount' 
                    : 'Wait to avoid losing this money'
                  }
                </Text>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <BlurView intensity={20} tint="light" style={styles.statCard}>
                  <Text style={styles.statValue}>{mockVehicles.length}</Text>
                  <Text style={styles.statLabel}>Vehicles</Text>
                </BlurView>
                <BlurView intensity={20} tint="light" style={styles.statCard}>
                  <Text style={[styles.statValue, { color: Colors.brandLight }]}>
                    {portfolio.positiveCount}
                  </Text>
                  <Text style={styles.statLabel}>Ready</Text>
                </BlurView>
                <BlurView intensity={20} tint="light" style={styles.statCard}>
                  <Text style={[styles.statValue, { color: '#FFB3B3' }]}>
                    {portfolio.negativeCount}
                  </Text>
                  <Text style={styles.statLabel}>Waiting</Text>
                </BlurView>
              </View>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={() => {
                haptic.medium();
                router.push('/(tabs)/garage');
              }}
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionCardPressed,
              ]}
            >
              <LinearGradient
                colors={Colors.gradientBrand}
                style={styles.actionGradient}
              >
                <Car size={IconSizes.md} color="white" />
                <Text style={styles.actionText}>View Garage</Text>
                <ArrowUpRight size={IconSizes.sm} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </Pressable>
            
            <Pressable
              onPress={() => {
                haptic.medium();
                router.push('/(app)/forecast');
              }}
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionCardPressed,
              ]}
            >
              <View style={styles.actionOutline}>
                <TrendingUp size={IconSizes.md} color={Colors.brand} />
                <Text style={styles.actionTextDark}>Forecast</Text>
                <ArrowUpRight size={IconSizes.sm} color={Colors.textTertiary} />
              </View>
            </Pressable>
          </View>

          {/* Vehicles Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Vehicles</Text>
              <Pressable 
                onPress={() => {
                  haptic.light();
                  router.push('/(tabs)/garage');
                }}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={IconSizes.sm} color={Colors.brand} />
              </Pressable>
            </View>

            {mockVehicles.map((vehicle, index) => {
              const equity = vehicle.marketValue - vehicle.settlementFigure;
              const isPositive = equity >= 0;

              return (
                <Pressable
                  key={vehicle.id}
                  onPress={() => {
                    haptic.light();
                    router.push({
                      pathname: '/(app)/car-detail',
                      params: { vehicleId: vehicle.id }
                    });
                  }}
                  style={({ pressed }) => [
                    styles.vehicleCard,
                    pressed && styles.vehicleCardPressed,
                  ]}
                >
                  <Image
                    source={{ uri: vehicle.image }}
                    style={styles.vehicleImage}
                  />
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{vehicle.name}</Text>
                    <Text style={styles.vehicleReg}>{vehicle.registration}</Text>
                  </View>
                  <View style={styles.vehicleEquity}>
                    <Text style={[
                      styles.equityValue,
                      { color: isPositive ? Colors.positive : Colors.negative }
                    ]}>
                      {isPositive ? '+' : ''}£{Math.abs(equity).toLocaleString()}
                    </Text>
                    <View style={[
                      styles.equityBadge,
                      { backgroundColor: isPositive ? Colors.positiveBg : Colors.negativeBg }
                    ]}>
                      {isPositive ? (
                        <TrendingUp size={14} color={Colors.positive} />
                      ) : (
                        <TrendingDown size={14} color={Colors.negative} />
                      )}
                    </View>
                  </View>
                  <ChevronRight size={IconSizes.md} color={Colors.textTertiary} />
                </Pressable>
              );
            })}
          </View>

          {/* Upcoming Deadlines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <View style={styles.deadlinesRow}>
              <View style={styles.deadlineBadge}>
                <Text style={styles.deadlineLabel}>MOT Due</Text>
                <Text style={styles.deadlineValue}>15 Dec</Text>
              </View>
              <View style={styles.deadlineBadge}>
                <Text style={styles.deadlineLabel}>Tax Due</Text>
                <Text style={styles.deadlineValue}>1 Jan</Text>
              </View>
              <View style={[styles.deadlineBadge, styles.deadlineBadgeWarning]}>
                <Text style={styles.deadlineLabel}>Service</Text>
                <Text style={[styles.deadlineValue, { color: Colors.warning }]}>Overdue</Text>
              </View>
            </View>
          </View>

          {/* Savings Insight */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Savings Insight</Text>
            
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightTitle}>Don't leave money on the table</Text>
              </View>
              <Text style={styles.insightText}>
                The average car owner loses <Text style={styles.insightHighlight}>£2,400</Text> by selling at the wrong time. AutoTrack tells you exactly when to sell to maximize your return.
              </Text>
              <View style={styles.insightStats}>
                <View style={styles.insightStat}>
                  <Text style={styles.insightStatValue}>{portfolio.positiveCount}</Text>
                  <Text style={styles.insightStatLabel}>Ready to sell profitably</Text>
                </View>
                <View style={styles.insightStatDivider} />
                <View style={styles.insightStat}>
                  <Text style={styles.insightStatValue}>{portfolio.negativeCount}</Text>
                  <Text style={styles.insightStatLabel}>Wait to avoid loss</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            <View style={styles.activityCard}>
              {[
                { text: 'Mercedes entered positive equity', time: '2h ago', positive: true },
                { text: 'BMW value decreased by £400', time: '1d ago', positive: false },
                { text: 'Audi equity increased by £250', time: '3d ago', positive: true },
              ].map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.activityRow,
                    index < 2 && styles.activityRowBorder
                  ]}
                >
                  <View style={[
                    styles.activityDot,
                    { backgroundColor: item.positive ? Colors.positive : Colors.negative }
                  ]} />
                  <Text style={styles.activityText}>{item.text}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    maxWidth: '100%',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.largeTitle,
    color: Colors.text,
  },
  avatarButton: {
    ...Shadows.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.headline,
    color: 'white',
  },
  
  // Hero Card
  heroCardContainer: {
    marginBottom: Spacing.xl,
    ...Shadows.xl,
    overflow: 'hidden',
    borderRadius: Radius.xxl,
  },
  heroCard: {
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  heroDecor1: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroContent: {
    marginBottom: Spacing.xl,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroValue: {
    ...Typography.hero,
    color: 'white',
    marginBottom: Spacing.xs,
  },
  heroSubtext: {
    ...Typography.subheadline,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    ...Typography.title2,
    color: 'white',
  },
  statLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  
  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  actionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  actionOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
  },
  actionText: {
    ...Typography.headline,
    color: 'white',
    flex: 1,
    marginLeft: Spacing.sm,
  },
  actionTextDark: {
    ...Typography.headline,
    color: Colors.text,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  
  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.title2,
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...Typography.subheadline,
    color: Colors.brand,
  },
  
  // Vehicle Card
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  vehicleCardPressed: {
    backgroundColor: Colors.borderLight,
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  vehicleImage: {
    width: 64,
    height: 48,
    borderRadius: Radius.md,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  vehicleName: {
    ...Typography.headline,
    color: Colors.text,
  },
  vehicleReg: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vehicleEquity: {
    alignItems: 'flex-end',
    marginRight: Spacing.sm,
  },
  equityValue: {
    ...Typography.headline,
  },
  equityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  
  // Insight Card
  insightCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.brand,
    ...Shadows.sm,
  },
  insightHeader: {
    marginBottom: Spacing.sm,
  },
  insightTitle: {
    ...Typography.headline,
    color: Colors.text,
  },
  insightText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  insightHighlight: {
    color: Colors.negative,
    fontWeight: '700',
  },
  insightStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  insightStat: {
    flex: 1,
    alignItems: 'center',
  },
  insightStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  insightStatValue: {
    ...Typography.title1,
    color: Colors.brand,
    fontWeight: '700',
  },
  insightStatLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Activity
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  activityText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  activityTime: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
  
  // Deadlines
  deadlinesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  deadlineBadge: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  deadlineBadgeWarning: {
    backgroundColor: `${Colors.warning}10`,
  },
  deadlineLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  deadlineValue: {
    ...Typography.headline,
    color: Colors.text,
  },
});
