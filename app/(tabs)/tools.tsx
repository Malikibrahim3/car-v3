/**
 * Tools/Estimator - Premium Calculator
 * 
 * Rich form experience with:
 * - Gradient header
 * - Premium input styling
 * - Visual results
 */

import React, { useState, useCallback } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calculator, TrendingDown, DollarSign, Calendar, Sparkles } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, haptic, IconSizes } from '@/src/constants/AutoTrackDesign';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  isLast?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  isLast = false,
}) => (
  <View style={[styles.fieldContainer, !isLast && styles.fieldBorder]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textTertiary}
      keyboardType={keyboardType}
      style={styles.fieldInput}
    />
  </View>
);

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selected,
  onSelect,
}) => (
  <View style={styles.segmentedContainer}>
    {options.map((option) => (
      <Pressable
        key={option}
        onPress={() => {
          haptic.selection();
          onSelect(option);
        }}
        style={[
          styles.segmentedOption,
          selected === option && styles.segmentedOptionSelected,
        ]}
      >
        {selected === option ? (
          <LinearGradient
            colors={Colors.gradientBrand}
            style={styles.segmentedGradient}
          >
            <Text style={styles.segmentedTextSelected}>{option}</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.segmentedText}>{option}</Text>
        )}
      </Pressable>
    ))}
  </View>
);

export default function EstimatorPage() {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [purchaseMethod, setPurchaseMethod] = useState('Cash');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = useCallback(() => {
    haptic.success();
    setShowResults(true);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Large Title */}
          <Text style={styles.largeTitle} accessibilityRole="header">Estimator</Text>

          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <LinearGradient
              colors={Colors.gradientBrand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBannerGradient}
            >
              <View style={styles.heroBannerIcon}>
                <Calculator size={IconSizes.lg} color="white" />
              </View>
              <View style={styles.heroBannerContent}>
                <Text style={styles.heroBannerTitle}>Value Projection</Text>
                <Text style={styles.heroBannerDesc}>
                  See how your car's value changes over time
                </Text>
              </View>
              <Sparkles size={IconSizes.md} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
          </View>

          {/* Vehicle Details Section */}
          <Text style={styles.sectionHeader}>VEHICLE DETAILS</Text>
          <View style={styles.formCard}>
            <FormField
              label="Year"
              value={year}
              onChangeText={setYear}
              placeholder="2020"
              keyboardType="numeric"
            />
            <FormField
              label="Make"
              value={make}
              onChangeText={setMake}
              placeholder="Toyota"
            />
            <FormField
              label="Model"
              value={model}
              onChangeText={setModel}
              placeholder="Camry"
              isLast
            />
          </View>

          <Text style={styles.sectionHeader}>CONDITION</Text>
          <View style={styles.formCard}>
            <View style={styles.segmentedWrapper}>
              <SegmentedControl
                options={['Excellent', 'Good', 'Fair']}
                selected={condition}
                onSelect={setCondition}
              />
            </View>
          </View>

          {/* Purchase Details Section */}
          <Text style={styles.sectionHeader}>PURCHASE DETAILS</Text>
          <View style={styles.formCard}>
            <FormField
              label="Purchase Price"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="£35,000"
              keyboardType="numeric"
              isLast
            />
          </View>

          <Text style={styles.sectionHeader}>PURCHASE METHOD</Text>
          <View style={styles.formCard}>
            <View style={styles.segmentedWrapper}>
              <SegmentedControl
                options={['Cash', 'Finance', 'Lease']}
                selected={purchaseMethod}
                onSelect={setPurchaseMethod}
              />
            </View>
          </View>

          {purchaseMethod !== 'Cash' && (
            <>
              <Text style={styles.sectionHeader}>FINANCE DETAILS</Text>
              <View style={styles.formCard}>
                <FormField
                  label="Down Payment"
                  value={downPayment}
                  onChangeText={setDownPayment}
                  placeholder="£5,000"
                  keyboardType="numeric"
                />
                <FormField
                  label="Loan Term (months)"
                  value={loanTerm}
                  onChangeText={setLoanTerm}
                  placeholder="60"
                  keyboardType="numeric"
                />
                <FormField
                  label="Interest Rate (%)"
                  value={interestRate}
                  onChangeText={setInterestRate}
                  placeholder="4.5"
                  keyboardType="decimal-pad"
                  isLast
                />
              </View>
            </>
          )}

          {/* Calculate Button */}
          <Pressable
            onPress={handleCalculate}
            style={({ pressed }) => [
              styles.calculateButton,
              pressed && styles.calculateButtonPressed,
            ]}
          >
            <LinearGradient
              colors={Colors.gradientBrand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.calculateGradient}
            >
              <Text style={styles.calculateButtonText}>Calculate Projection</Text>
            </LinearGradient>
          </Pressable>

          {/* Results */}
          {showResults && (
            <>
              <Text style={styles.sectionHeader}>PROJECTION RESULTS</Text>
              <View style={styles.resultsCard}>
                <View style={styles.resultRow}>
                  <View style={[styles.resultIcon, { backgroundColor: Colors.negativeBg }]}>
                    <TrendingDown size={IconSizes.sm} color={Colors.negative} />
                  </View>
                  <View style={styles.resultContent}>
                    <Text style={styles.resultLabel}>5-Year Depreciation</Text>
                    <Text style={[styles.resultValue, { color: Colors.negative }]}>
                      £15,000 (42.9%)
                    </Text>
                  </View>
                </View>
                
                <View style={styles.resultDivider} />
                
                <View style={styles.resultRow}>
                  <View style={[styles.resultIcon, { backgroundColor: Colors.positiveBg }]}>
                    <DollarSign size={IconSizes.sm} color={Colors.positive} />
                  </View>
                  <View style={styles.resultContent}>
                    <Text style={styles.resultLabel}>Positive Equity After</Text>
                    <Text style={[styles.resultValue, { color: Colors.positive }]}>
                      3 years
                    </Text>
                  </View>
                </View>
                
                <View style={styles.resultDivider} />
                
                <View style={styles.resultRow}>
                  <View style={[styles.resultIcon, { backgroundColor: `${Colors.brand}15` }]}>
                    <Calendar size={IconSizes.sm} color={Colors.brand} />
                  </View>
                  <View style={styles.resultContent}>
                    <Text style={styles.resultLabel}>Best Time to Sell</Text>
                    <Text style={[styles.resultValue, { color: Colors.brand }]}>
                      Year 2-3
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={{ height: 100 }} />
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
  
  // Hero Banner
  heroBanner: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.brandGlow,
  },
  heroBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  heroBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  heroBannerContent: {
    flex: 1,
  },
  heroBannerTitle: {
    ...Typography.headline,
    color: 'white',
  },
  heroBannerDesc: {
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
    marginTop: Spacing.md,
  },
  
  // Form Card
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    ...Shadows.sm,
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
  fieldInput: {
    ...Typography.body,
    color: Colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  
  // Segmented Control
  segmentedWrapper: {
    padding: Spacing.sm,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.lg,
    padding: 4,
  },
  segmentedOption: {
    flex: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  segmentedOptionSelected: {
    ...Shadows.sm,
  },
  segmentedGradient: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  segmentedText: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
  segmentedTextSelected: {
    ...Typography.subheadline,
    color: 'white',
    fontWeight: '600',
  },
  
  // Calculate Button
  calculateButton: {
    marginTop: Spacing.xl,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.brandGlow,
  },
  calculateButtonPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  calculateGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  calculateButtonText: {
    ...Typography.headline,
    color: 'white',
  },
  
  // Results
  resultsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  resultValue: {
    ...Typography.headline,
    marginTop: 2,
  },
});
