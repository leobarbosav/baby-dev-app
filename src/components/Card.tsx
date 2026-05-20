import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.card,
  },
});
