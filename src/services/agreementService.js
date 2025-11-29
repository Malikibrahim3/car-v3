/**
 * Agreement Service
 * 
 * Handles saving and retrieving parsed finance agreements from Supabase
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Save parsed agreement to database
 * @param {Object} parsedData - Parsed agreement data
 * @param {string} userId - User ID
 * @param {File} file - Original PDF file
 * @returns {Promise<Object>} Saved agreement record
 */
export const saveAgreement = async (parsedData, userId, file) => {
  try {
    // Prepare agreement record
    const agreement = {
      user_id: userId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      
      // Customer info
      customer_name: parsedData.customer?.name,
      customer_address: parsedData.customer?.address,
      customer_postcode: parsedData.customer?.postcode,
      
      // Vehicle info
      vehicle_make: parsedData.vehicle?.make,
      vehicle_model: parsedData.vehicle?.model,
      vehicle_year: parsedData.vehicle?.year,
      vehicle_vin: parsedData.vehicle?.vin,
      vehicle_registration: parsedData.vehicle?.registration,
      
      // Price info
      total_price: parsedData.price?.totalPrice,
      deposit: parsedData.price?.deposit,
      amount_financed: parsedData.price?.amountFinanced,
      trade_in_value: parsedData.price?.tradeIn,
      
      // Finance info
      monthly_payment: parsedData.finance?.monthlyPayment,
      term_months: parsedData.finance?.term,
      apr: parsedData.finance?.apr,
      interest_rate: parsedData.finance?.interestRate,
      balloon_payment: parsedData.finance?.balloonPayment,
      final_payment: parsedData.finance?.finalPayment,
      
      // Totals
      total_payable: parsedData.totals?.totalPayable,
      total_charge: parsedData.totals?.totalCharge,
      total_interest: parsedData.totals?.totalInterest,
      
      // Mileage
      mileage_allowance: parsedData.mileage?.allowance,
      excess_mileage_charge: parsedData.mileage?.excessCharge,
      
      // Fees
      arrangement_fee: parsedData.fees?.arrangementFee,
      documentation_fee: parsedData.fees?.documentationFee,
      option_to_purchase_fee: parsedData.fees?.optionToPurchaseFee,
      
      // Metadata
      confidence_score: parsedData.confidence,
      parsing_notes: parsedData.notes,
      parsed_at: new Date().toISOString(),
      
      // Store full parsed data as JSON
      parsed_data: parsedData,
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('agreements')
      .insert([agreement])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      agreement: data,
    };
  } catch (error) {
    console.error('Error saving agreement:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all agreements for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of agreements
 */
export const getUserAgreements = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .eq('user_id', userId)
      .order('parsed_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      agreements: data || [],
    };
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return {
      success: false,
      error: error.message,
      agreements: [],
    };
  }
};

/**
 * Get a specific agreement by ID
 * @param {string} agreementId - Agreement ID
 * @returns {Promise<Object>} Agreement record
 */
export const getAgreement = async (agreementId) => {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .eq('id', agreementId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      agreement: data,
    };
  } catch (error) {
    console.error('Error fetching agreement:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete an agreement
 * @param {string} agreementId - Agreement ID
 * @returns {Promise<Object>} Result
 */
export const deleteAgreement = async (agreementId) => {
  try {
    const { error } = await supabase
      .from('agreements')
      .delete()
      .eq('id', agreementId);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting agreement:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update agreement data
 * @param {string} agreementId - Agreement ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated agreement
 */
export const updateAgreement = async (agreementId, updates) => {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .update(updates)
      .eq('id', agreementId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      agreement: data,
    };
  } catch (error) {
    console.error('Error updating agreement:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  saveAgreement,
  getUserAgreements,
  getAgreement,
  deleteAgreement,
  updateAgreement,
};
