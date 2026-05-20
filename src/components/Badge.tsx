import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../theme';

interface BadgeProps {
  label: string;
  color: string;
  bgColor: string;
  style?: ViewStyle;
}

export default function Badge({ label, color, bgColor, style }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.label,
  },
});
