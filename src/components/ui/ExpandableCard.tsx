import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE } from '@/src/constants/DesignSystem';

interface ExpandableCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  header,
  children,
  defaultExpanded = false,
  onToggle,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const height = useSharedValue(defaultExpanded ? 1 : 0);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    height.value = withSpring(newExpanded ? 1 : 0, {
      damping: 20,
      stiffness: 90,
    });
    
    rotation.value = withTiming(newExpanded ? 180 : 0, {
      duration: 200,
    });
    
    onToggle?.(newExpanded);
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    maxHeight: height.value === 0 ? 0 : undefined,
    overflow: 'hidden',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View>
      {/* Header */}
      <Pressable onPress={handleToggle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>{header}</View>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={20} color={PALETTE.textSecondary} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Expandable Content */}
      <Animated.View style={contentStyle}>
        {children}
      </Animated.View>
    </View>
  );
};
