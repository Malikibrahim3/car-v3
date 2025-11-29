import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { PALETTE, TYPOGRAPHY } from '../constants/DesignSystem';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  height?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error for debugging
    console.warn('Chart Error Boundary caught error:', error.message);
    
    // Check if it's the normalize-svg-path error
    if (error.message?.includes('malformed path data')) {
      console.warn('SVG path normalization failed - likely invalid chart data');
    }
  }

  render() {
    if (this.state.hasError) {
      // Return custom fallback or default empty view
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View
          style={{
            height: this.props.height || 150,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.3,
          }}
        >
          <Text style={{ fontFamily: TYPOGRAPHY.fontFamily, color: PALETTE.textSecondary, fontSize: TYPOGRAPHY.caption }}>
            Chart unavailable
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
