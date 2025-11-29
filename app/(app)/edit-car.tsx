/**
 * Edit Car - Premium Form Experience
 * 
 * Rich form with:
 * - Gradient header
 * - Premium input styling
 * - Visual feedback
 */

import React, { useState, useCallback } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Check, Car } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, haptic } from '@/src/constants/AutoTrackDesign';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  suffix?: string;
  isLast?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  suffix,
  isLast = false,
}) => (
  <View style={[styles.fieldContainer, !isLast && styles.fieldBorder]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldInputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        style={styles.fieldInput}
      />
      {suffix && <Text style={styles.fieldSuffix}>{suffix}</Text>}
    </View>
  </View>
);

export default function EditCar() {
  const router = useRouter();
  
  const [mileage, setMileage] = useState('45,000');
  const [monthlyMileage, setMonthlyMileage] = useState('800');
  const [marketValue, setMarketValue] = useState('32,500');
  const [monthlyPayment, setMonthlyPayment] = useState('450');
  
  const handleCancel = useCallback(() => {
    haptic.light();
    router.back();
  }, [router]);
  
  const handleSave = useCallback(() => {
    haptic.success();
    router.back();
  }, [router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            onPress={handleCancel}
            hitSlop={12}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.navButtonPressed,
            ]}
          >
            <ChevronLeft size={28} color={Colors.brand} strokeWidth={2.5} />
          </Pressable>
          
          <Text style={styles.navTitle}>Edit Details</Text>
          
          <Pressable
            onPress={handleSave}
            hitSlop={12}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
          >
            <LinearGradient
              colors={Colors.gradientBrand}
              style={styles.saveButtonGradient}
            >
              <Check size={20} color="white" strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Vehicle Header */}
          <View style={styles.vehicleHeader}>
            <LinearGradient
              colors={Colors.gradientBrand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.vehicleHeaderGradient}
            >
              <View style={styles.vehicleIcon}>
                <Car size={24} color="white" />
              </View>
              <View>
                <Text style={styles.vehicleName}>Audi A5 S-Line</Text>
                <Text style={styles.vehicleReg}>KY71 ABC</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Mileage Section */}
          <Text style={styles.sectionHeader}>MILEAGE</Text>
          <View style={styles.formCard}>
            <FormField
              label="Current Mileage"
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
              suffix="miles"
            />
            <FormField
              label="Monthly Average"
              value={monthlyMileage}
              onChangeText={setMonthlyMileage}
              keyboardType="numeric"
              suffix="miles/mo"
              isLast
            />
          </View>
          <Text style={styles.sectionFooter}>
            Keep this updated for accurate equity projections
          </Text>

          {/* Value Section */}
          <Text style={styles.sectionHeader}>VALUATION</Text>
          <View style={styles.formCard}>
            <FormField
              label="Market Value"
              value={marketValue}
              onChangeText={setMarketValue}
              keyboardType="numeric"
              suffix="£"
              isLast
            />
          </View>
          <Text style={styles.sectionFooter}>
            We auto-update this from market data. Override if you have a better estimate.
          </Text>

          {/* Finance Section */}
          <Text style={styles.sectionHeader}>FINANCE</Text>
          <View style={styles.formCard}>
            <FormField
              label="Monthly Payment"
              value={monthlyPayment}
              onChangeText={setMonthlyPayment}
              keyboardType="numeric"
              suffix="£/mo"
              isLast
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveFullButton,
              pressed && styles.saveFullButtonPressed,
            ]}
          >
            <LinearGradient
              colors={Colors.gradientPositive}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveFullGradient}
            >
              <Check size={20} color="white" />
              <Text style={styles.saveFullText}>Save Changes</Text>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  
  // Navigation
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  navTitle: {
    ...Typography.headline,
    color: Colors.text,
  },
  saveButton: {
    // Removed heavy glow
  },
  saveButtonPressed: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  
  // Vehicle Header - simplified
  vehicleHeader: {
    marginBottom: Spacing.xxl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  vehicleHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  vehicleName: {
    ...Typography.headline,
    color: 'white',
  },
  vehicleReg: {
    ...Typography.footnote,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  
  // Section
  sectionHeader: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionFooter: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
  
  // Form Card - simplified
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  // Field
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 54,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  fieldLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  fieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldInput: {
    ...Typography.body,
    color: Colors.text,
    textAlign: 'right',
    minWidth: 80,
  },
  fieldSuffix: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  
  // Save Full Button - simplified
  saveFullButton: {
    marginTop: Spacing.xxl,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  saveFullButtonPressed: {
    opacity: 0.9,
  },
  saveFullGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  saveFullText: {
    ...Typography.headline,
    color: 'white',
  },
});
