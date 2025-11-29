/**
 * Edit Vehicle Modal - Native
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { IOSText as Text, IOSButton as Button, IOSModal as Modal } from '../ios';
import { GlassInput } from '../GlassInput';
import { useCarContext } from '../../context/CarContext';
import Toast from 'react-native-toast-message';

export default function EditVehicleModal({ visible, onDismiss, vehicle }) {
  const { updateCar } = useCarContext();
  
  // Form state
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (vehicle) {
      setYear(vehicle.year?.toString() || '');
      setMake(vehicle.make || '');
      setModel(vehicle.model || '');
      setTrim(vehicle.trim || '');
      setPurchasePrice(vehicle.purchasePrice?.toString() || '');
      setLoanAmount(vehicle.loanAmount?.toString() || '');
      setMonthlyPayment(vehicle.monthlyPayment?.toString() || '');
      setInterestRate(vehicle.interestRate?.toString() || '');
      setLoanTerm(vehicle.loanTerm?.toString() || '');
    }
  }, [vehicle]);
  
  const handleSubmit = async () => {
    if (!year || !make || !model) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in year, make, and model',
      });
      return;
    }
    
    setLoading(true);
    
    const updatedCar = {
      ...vehicle,
      year: parseInt(year),
      make,
      model,
      trim,
      purchasePrice: parseFloat(purchasePrice) || 0,
      loanAmount: parseFloat(loanAmount) || 0,
      monthlyPayment: parseFloat(monthlyPayment) || 0,
      interestRate: parseFloat(interestRate) || 0,
      loanTerm: parseInt(loanTerm) || 0,
      apiCalibratedValue: parseFloat(purchasePrice) || vehicle.apiCalibratedValue || 0,
    };
    
    await updateCar(vehicle.id, updatedCar);
    
    Toast.show({
      type: 'success',
      text1: 'Vehicle Updated!',
      text2: `${year} ${make} ${model}`,
    });
    
    setLoading(false);
    onDismiss();
  };
  
  if (!vehicle) return null;
  
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Text style={styles.title} weight="semibold">
          Edit Vehicle
        </Text>
        
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
          placeholder="Toyota"
        />
        
        <GlassInput
          label="Model *"
          value={model}
          onChangeText={setModel}
          placeholder="Camry"
        />
        
        <GlassInput
          label="Trim"
          value={trim}
          onChangeText={setTrim}
          placeholder="SE"
        />
        
        <Text style={styles.sectionTitle} weight="semibold">
          Financial Information
        </Text>
        
        <GlassInput
          label="Purchase Price"
          value={purchasePrice}
          onChangeText={setPurchasePrice}
          keyboardType="numeric"
          placeholder="$25,000"
        />
        
        <GlassInput
          label="Loan Amount"
          value={loanAmount}
          onChangeText={setLoanAmount}
          keyboardType="numeric"
          placeholder="$20,000"
        />
        
        <GlassInput
          label="Monthly Payment"
          value={monthlyPayment}
          onChangeText={setMonthlyPayment}
          keyboardType="numeric"
          placeholder="$400"
        />
        
        <GlassInput
          label="Interest Rate"
          value={interestRate}
          onChangeText={setInterestRate}
          keyboardType="numeric"
          placeholder="5.5%"
        />
        
        <GlassInput
          label="Loan Term (months)"
          value={loanTerm}
          onChangeText={setLoanTerm}
          keyboardType="numeric"
          placeholder="60"
        />
            
        <View style={styles.actions}>
          <Button
            variant="outlined"
            onPress={onDismiss}
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
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
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
  },
  button: {
    flex: 1,
  },
});
