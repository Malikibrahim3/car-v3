import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

interface RichAssetCardProps {
  make: string;
  model: string;
  year: number;
  value: number;
  loan: number;
  image?: string;
  onPress?: () => void;
  onAnalyze?: () => void;
}

export const RichAssetCard: React.FC<RichAssetCardProps> = ({
  make,
  model,
  year,
  value,
  loan,
  image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop',
  onPress,
  onAnalyze,
}) => {
  const equity = value - loan;
  const equityPercent = Math.round((equity / value) * 100);
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View style={{ 
      backgroundColor: PALETTE.surface,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: SPACING.lg,
      shadowColor: '#0F81A3',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 11,
      elevation: 12,
    }}>
      {/* 1. IMMERSIVE HEADER */}
      <View style={{ height: 200, width: '100%' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Gradient for Text Readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: 100, 
            justifyContent: 'flex-end', 
            padding: 20 
          }}
        >
          <Text style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: 12, 
            fontWeight: '700', 
            letterSpacing: 1 
          }}>
            {year} MODEL
          </Text>
          <Text style={{ 
            color: 'white', 
            fontSize: 28, 
            fontWeight: '800', 
            letterSpacing: -0.5 
          }}>
            {make} {model}
          </Text>
        </LinearGradient>
      </View>

      {/* 2. DENSE DATA GRID */}
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 11, 
              color: PALETTE.textSecondary, 
              fontWeight: '700', 
              marginBottom: 4 
            }}>
              MARKET VALUE
            </Text>
            <Text style={{ 
              fontSize: 20, 
              color: PALETTE.text, 
              fontWeight: '800' 
            }}>
              {formatCurrency(value)}
            </Text>
          </View>
          
          <View style={{ 
            width: 1, 
            height: '100%', 
            backgroundColor: '#E5E7EB', 
            marginHorizontal: 20 
          }} />
          
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 11, 
              color: PALETTE.textSecondary, 
              fontWeight: '700', 
              marginBottom: 4 
            }}>
              NET EQUITY
            </Text>
            <Text style={{ 
              fontSize: 20, 
              color: PALETTE.success, 
              fontWeight: '800' 
            }}>
              +{formatCurrency(equity)}
            </Text>
          </View>
        </View>

        {/* 3. PROGRESS BAR (Clean & Thin) */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginBottom: 6 
          }}>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: '600', 
              color: PALETTE.textSecondary 
            }}>
              Ownership Progress
            </Text>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: '700', 
              color: PALETTE.text 
            }}>
              {equityPercent}%
            </Text>
          </View>
          <View style={{ 
            height: 6, 
            backgroundColor: '#F3F4F6', 
            borderRadius: 3, 
            overflow: 'hidden' 
          }}>
            <View style={{ 
              height: '100%', 
              width: `${equityPercent}%`, 
              backgroundColor: PALETTE.accent 
            }} />
          </View>
        </View>

        {/* 4. QUICK ACTION BUTTONS */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable 
            onPress={onPress}
            style={{ 
              flex: 1,
              backgroundColor: PALETTE.accent, 
              paddingVertical: 14, 
              borderRadius: 12, 
              alignItems: 'center',
              shadowColor: '#0F81A3', 
              shadowOpacity: 0.35, 
              shadowRadius: 11, 
              shadowOffset: { width: 0, height: 0 },
              elevation: 12
            }}
          >
            <Text style={{ 
              color: 'white', 
              fontWeight: '700', 
              fontSize: 13 
            }}>
              Update Mileage
            </Text>
          </Pressable>
          
          <Pressable 
            onPress={onPress}
            style={{ 
              flex: 1,
              backgroundColor: PALETTE.surface, 
              paddingVertical: 14, 
              borderRadius: 12, 
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: PALETTE.border,
            }}
          >
            <Text style={{ 
              color: PALETTE.text, 
              fontWeight: '700', 
              fontSize: 13 
            }}>
              Edit Details
            </Text>
          </Pressable>
        </View>
        
        <Pressable 
          onPress={onPress}
          style={{ 
            backgroundColor: PALETTE.accentSoft, 
            paddingVertical: 12, 
            borderRadius: 12, 
            alignItems: 'center',
            marginTop: 8,
            borderWidth: 1,
            borderColor: `${PALETTE.accent}30`,
          }}
        >
          <Text style={{ 
            color: PALETTE.accent, 
            fontWeight: '600', 
            fontSize: 13 
          }}>
            Log Maintenance
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
