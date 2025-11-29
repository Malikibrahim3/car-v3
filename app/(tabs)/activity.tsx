/**
 * Activity - Premium Notification Feed
 * 
 * Rich activity feed with:
 * - Grouped sections
 * - Colorful status indicators
 * - Premium card styling
 */

import React from 'react';
import { 
  Text, 
  View, 
  SectionList, 
  StyleSheet,
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Zap, Bell } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, haptic, IconSizes } from '@/src/constants/AutoTrackDesign';

const DATA = [
  {
    title: 'Today',
    data: [
      { 
        id: '1', 
        type: 'positive', 
        title: 'Mercedes entered positive equity', 
        desc: 'You can now sell without a shortfall',
        time: '2h ago',
      },
      { 
        id: '2', 
        type: 'negative', 
        title: 'BMW value decreased', 
        desc: 'Market value dropped by £400',
        time: '5h ago',
      },
    ]
  },
  {
    title: 'This Week',
    data: [
      { 
        id: '3', 
        type: 'info', 
        title: 'Market update', 
        desc: 'Used car values up 1.2% this week',
        time: '2d ago',
      },
      { 
        id: '4', 
        type: 'positive', 
        title: 'Audi equity milestone', 
        desc: 'Reached £4,500 positive equity',
        time: '3d ago',
      },
    ]
  },
  {
    title: 'Earlier',
    data: [
      { 
        id: '5', 
        type: 'alert', 
        title: 'Tesla approaching break-even', 
        desc: 'Expected in 8 months',
        time: '1w ago',
      },
      { 
        id: '6', 
        type: 'positive', 
        title: 'Portfolio value increased', 
        desc: 'Total equity up by £1,200',
        time: '2w ago',
      },
    ]
  }
];

const getIconConfig = (type: string) => {
  switch (type) {
    case 'positive':
      return { 
        Icon: TrendingUp, 
        color: Colors.positive, 
        bg: Colors.positiveBg,
        gradient: Colors.gradientPositive,
      };
    case 'negative':
      return { 
        Icon: TrendingDown, 
        color: Colors.negative, 
        bg: Colors.negativeBg,
        gradient: Colors.gradientNegative,
      };
    case 'alert':
      return { 
        Icon: AlertCircle, 
        color: Colors.warning, 
        bg: `${Colors.warning}20`,
        gradient: [Colors.warning, '#E6A700'],
      };
    default:
      return { 
        Icon: Zap, 
        color: Colors.brand, 
        bg: `${Colors.brand}15`,
        gradient: Colors.gradientBrand,
      };
  }
};

export default function ActivityPage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SectionList
          sections={DATA}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={() => (
            <View>
              <Text style={styles.largeTitle} accessibilityRole="header">Activity</Text>
              
              {/* Summary Banner */}
              <View style={styles.summaryBanner}>
                <LinearGradient
                  colors={Colors.gradientBrand}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.summaryGradient}
                >
                  <View style={styles.summaryIcon}>
                    <Bell size={IconSizes.md} color="white" />
                  </View>
                  <View style={styles.summaryContent}>
                    <Text style={styles.summaryTitle}>4 Updates</Text>
                    <Text style={styles.summaryDesc}>This week</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
          renderItem={({ item, index, section }) => {
            const isLast = index === section.data.length - 1;
            const { Icon, color, bg, gradient } = getIconConfig(item.type);
            
            return (
              <Pressable
                onPress={() => haptic.light()}
                style={({ pressed }) => [
                  styles.itemContainer,
                  index === 0 && styles.itemFirst,
                  isLast && styles.itemLast,
                  pressed && styles.itemPressed,
                ]}
              >
                <View style={[
                  styles.itemRow,
                  !isLast && styles.itemBorder,
                ]}>
                  <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                    <Icon size={IconSizes.sm} color={color} />
                  </View>
                  
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                  </View>
                  
                  <Text style={styles.itemTime}>{item.time}</Text>
                </View>
              </Pressable>
            );
          }}
        />
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
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 100,
    maxWidth: '100%',
  },
  
  // Large Title
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  // Summary Banner
  summaryBanner: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.brandGlow,
  },
  summaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    ...Typography.headline,
    color: 'white',
  },
  summaryDesc: {
    ...Typography.footnote,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  
  // Section
  sectionHeader: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  sectionFooter: {
    height: Spacing.xl,
  },
  
  // Item
  itemContainer: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  itemFirst: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  itemLast: {
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  itemPressed: {
    backgroundColor: Colors.borderLight,
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.headline,
    color: Colors.text,
  },
  itemDesc: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  itemTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginLeft: Spacing.sm,
  },
});
