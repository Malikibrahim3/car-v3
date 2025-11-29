/**
 * Market - Premium Coming Soon
 * 
 * Beautiful coming soon page with:
 * - Gradient hero
 * - Feature preview cards
 * - Premium styling
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Store, TrendingUp, Sparkles, Bell, ArrowRight } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, haptic, IconSizes } from '@/src/constants/AutoTrackDesign';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'AI-powered suggestions based on your preferences',
    color: Colors.positive,
    bg: Colors.positiveBg,
  },
  {
    icon: Sparkles,
    title: 'Exclusive Deals',
    description: 'Partner discounts you won\'t find anywhere else',
    color: Colors.brand,
    bg: `${Colors.brand}15`,
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Get notified when prices drop',
    color: Colors.warning,
    bg: `${Colors.warning}20`,
  },
];

export default function MarketPage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Large Title */}
          <Text style={styles.largeTitle} accessibilityRole="header">Marketplace</Text>

          {/* Hero Card */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={Colors.gradientHero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              {/* Decorative circles */}
              <View style={styles.heroDecor1} />
              <View style={styles.heroDecor2} />
              
              <View style={styles.heroIconContainer}>
                <Store size={IconSizes.xl} color="white" />
              </View>
              <Text style={styles.heroTitle}>Launching Soon</Text>
              <Text style={styles.heroDescription}>
                Exclusive deals and partnerships with top automotive brands
              </Text>
              
              <Pressable
                onPress={() => haptic.light()}
                style={({ pressed }) => [
                  styles.notifyButton,
                  pressed && styles.notifyButtonPressed,
                ]}
              >
                <Text style={styles.notifyButtonText}>Notify Me</Text>
                <ArrowRight size={IconSizes.sm} color={Colors.brand} />
              </Pressable>
            </LinearGradient>
          </View>

          {/* Features Section */}
          <Text style={styles.sectionTitle}>What's Coming</Text>
          
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Pressable
                key={index}
                onPress={() => haptic.light()}
                style={({ pressed }) => [
                  styles.featureCard,
                  pressed && styles.featureCardPressed,
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.bg }]}>
                  <Icon size={IconSizes.md} color={feature.color} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </Pressable>
            );
          })}

          {/* Footer Note */}
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>
              We're partnering with dealerships and brands to bring you the best deals. 
              Be the first to know when we launch!
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    maxWidth: '100%',
  },
  
  // Large Title
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  // Hero Card
  heroContainer: {
    marginBottom: Spacing.xl,
    ...Shadows.xl,
  },
  heroCard: {
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroDecor1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    ...Typography.title1,
    color: 'white',
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    gap: Spacing.sm,
  },
  notifyButtonPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  notifyButtonText: {
    ...Typography.headline,
    color: Colors.brand,
  },
  
  // Section
  sectionTitle: {
    ...Typography.title2,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  
  // Feature Card
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  featureCardPressed: {
    backgroundColor: Colors.borderLight,
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.headline,
    color: Colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  
  // Footer
  footerCard: {
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  footerText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
