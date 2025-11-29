/**
 * Add Vehicle Modal - Native
 * 
 * Updated with Finance Type toggle (PCP/HP/Cash)
 * Includes balloon payment field for PCP
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text as RNText } from 'react-native';
import { IOSText as Text, IOSButton as Button, IOSModal as Modal, IOSSegmentedControl } from '../ios';
import { GlassInput } from '../GlassInput';
import { useCarContext } from '../../context/CarContext';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/DesignSystem';
import Toast from 'react-native-toast-message';
import { Car, CreditCard, Banknote, Info } from 'lucide-react-native';

export default function AddVehicleModal({ visible, onDismiss }) {
  const { addCar } = useCarContext();
  const [inputMethod, setInputMethod] = useState('manual');
  
  // Form state
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [mileage, setMileage] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  
  // Finance type - NEW
  const [financeType, setFinanceType] = useState('pcp'); // 'pcp', 'hp', 'cash'
  
  // Finance details
  const [deposit, setDeposit] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [balloonPayment, setBalloonPayment] = useState(''); // PCP only
  const [monthsElapsed, setMonthsElapsed] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const resetForm = () => {
    setYear('');
    setMake('');
    setModel('');
    setTrim('');
    setMileage('');
    setPurchasePrice('');
    setFinanceType('pcp');
    setDeposit('');
    setLoanAmount('');
    setMonthlyPayment('');
    setInterestRate('');
    setLoanTerm('');
    setBalloonPayment('');
    setMonthsElapsed('');
  };
  
  const handleSubmit = async () => {
    if (!year || !make || !model) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in year, make, and model',
      });
      return;
    }
    
    if (financeType !== 'cash' && (!loanAmount || !monthlyPayment)) {
      Toast.show({
        type: 'error',
        text1: 'Missing Finance Details',
        text2: 'Please fill in loan amount and monthly payment',
      });
      return;
    }
    
    if (financeType === 'pcp' && !balloonPayment) {
      Toast.show({
        type: 'error',
        text1: 'Missing Balloon Payment',
        text2: 'PCP requires a balloon payment (GMFV)',
      });
      return;
    }
    
    setLoading(true);
    
    const newCar = {
      id: Date.now().toString(),
      year: parseInt(year),
      make,
      model,
      trim,
      mileage: parseInt(mileage) || 0,
      purchasePrice: parseFloat(purchasePrice) || 0,
      ownershipType: financeType,
      deposit: parseFloat(deposit) || 0,
      loanAmount: parseFloat(loanAmount) || 0,
      monthlyPayment: parseFloat(monthlyPayment) || 0,
      interestRate: parseFloat(interestRate) || 0,
      termMonths: parseInt(loanTerm) || 48,
      balloonPayment: financeType === 'pcp' ? parseFloat(balloonPayment) || 0 : 0,
      monthsElapsed: parseInt(monthsElapsed) || 0,
      apiCalibratedValue: parseFloat(purchasePrice) || 0,
      addedDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
    };
    
    await addCar(newCar);
    
    Toast.show({
      type: 'success',
      text1: 'Vehicle Added!',
      text2: `${year} ${make} ${model}`,
    });
    
    resetForm();
    setLoading(false);
    onDismiss();
  };

  // Finance type selector component
  const FinanceTypeSelector = () => (
    <View style={styles.financeTypeContainer}>
      <Text style={styles.sectionTitle} weight="semibold">
        Finance Type *
      </Text>
      <View style={styles.financeTypeRow}>
        {[
          { value: 'pcp', label: 'PCP', icon: CreditCard, desc: 'With balloon' },
          { value: 'hp', label: 'HP', icon: Banknote, desc: 'Hire Purchase' },
          { value: 'cash', label: 'Cash', icon: Car, desc: 'Owned outright' },
        ].map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setFinanceType(option.value)}
            style={[
              styles.financeTypeButton,
              financeType === option.value && styles.financeTypeButtonActive
            ]}
          >
            <option.icon 
              size={24} 
              color={financeType === option.value ? PALETTE.accent : PALETTE.textSecondary} 
            />
            <RNText style={[
              styles.financeTypeLabel,
              financeType === option.value && styles.financeTypeLabelActive
            ]}>
              {option.label}
            </RNText>
            <RNText style={styles.financeTypeDesc}>{option.desc}</RNText>
          </Pressable>
        ))}
      </View>
      
      {/* PCP Info Box */}
      {financeType === 'pcp' && (
        <View style={styles.infoBox}>
          <Info size={16} color="#0369A1" />
          <RNText style={styles.infoText}>
            PCP includes a balloon payment (GMFV) at the end. Your equity curve will flatten near contract end.
          </RNText>
        </View>
      )}
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Text style={styles.title} weight="semibold">
          Add Vehicle
        </Text>
        
        <IOSSegmentedControl
          segments={[
            { value: 'manual', label: 'Manual Entry' },
            { value: 'upload', label: 'Upload Doc' },
          ]}
          value={inputMethod}
          onChange={setInputMethod}
          style={styles.segmented}
        />
            
        <Text style={styles.sectionTitle} weight="semibold">
          Vehicle Information
        </Text>
        
        <GlassInput
          label="Year *"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          placeholder="2024"
        />
        
        <GlassInput
          label="Make *"
          value={make}
          onChangeText={setMake}
          placeholder="BMW"
        />
        
        <GlassInput
          label="Model *"
          value={model}
          onChangeText={setModel}
          placeholder="3 Series"
        />
        
        <GlassInput
          label="Trim"
          value={trim}
          onChangeText={setTrim}
          placeholder="M Sport"
        />
        
        <GlassInput
          label="Current Mileage"
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric"
          placeholder="25,000"
        />
        
        <GlassInput
          label="Purchase Price (Retail)"
          value={purchasePrice}
          onChangeText={setPurchasePrice}
          keyboardType="numeric"
          placeholder="£35,000"
        />
        
        {/* Finance Type Selector */}
        <FinanceTypeSelector />
        
        {/* Finance Details - Only show if not cash */}
        {financeType !== 'cash' && (
          <>
            <Text style={styles.sectionTitle} weight="semibold">
              Finance Details
            </Text>
            
            <GlassInput
              label="Deposit Paid"
              value={deposit}
              onChangeText={setDeposit}
              keyboardType="numeric"
              placeholder="£5,000"
            />
            
            <GlassInput
              label="Original Loan Amount *"
              value={loanAmount}
              onChangeText={setLoanAmount}
              keyboardType="numeric"
              placeholder="£30,000"
            />
            
            <GlassInput
              label="Monthly Payment *"
              value={monthlyPayment}
              onChangeText={setMonthlyPayment}
              keyboardType="numeric"
              placeholder="£450"
            />
            
            <GlassInput
              label="Interest Rate (APR %)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
              placeholder="6.9"
            />
            
            <GlassInput
              label="Contract Length (months)"
              value={loanTerm}
              onChangeText={setLoanTerm}
              keyboardType="numeric"
              placeholder="48"
            />
            
            <GlassInput
              label="Months Already Paid"
              value={monthsElapsed}
              onChangeText={setMonthsElapsed}
              keyboardType="numeric"
              placeholder="12"
            />
            
            {/* Balloon Payment - PCP Only */}
            {financeType === 'pcp' && (
              <GlassInput
                label="Balloon Payment (GMFV) *"
                value={balloonPayment}
                onChangeText={setBalloonPayment}
                keyboardType="numeric"
                placeholder="£12,000"
              />
            )}
          </>
        )}
            
        <View style={styles.actions}>
          <Button
            variant="outlined"
            onPress={() => {
              resetForm();
              onDismiss();
            }}
            style={styles.button}
          >
            Cancel
          </Button>
          
          <Button
            variant="filled"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Add Vehicle
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 600,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    marginTop: 16,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
  
  // Finance Type Selector - simplified
  financeTypeContainer: {
    marginTop: SPACING.lg,
  },
  financeTypeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  financeTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: PALETTE.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  financeTypeButtonActive: {
    borderColor: PALETTE.accent,
    backgroundColor: PALETTE.background,
  },
  financeTypeLabel: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    marginTop: SPACING.xs,
  },
  financeTypeLabelActive: {
    color: PALETTE.accent,
  },
  financeTypeDesc: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    marginTop: 2,
  },
  
  // Info Box - simplified
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#F0F9FF',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.caption1,
    color: '#0369A1',
    lineHeight: 18,
  },
});
