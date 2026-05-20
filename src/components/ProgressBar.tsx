import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({ progress, color = colors.primary, height = 8 }: ProgressBarProps) {
  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    flex: 1,
  },
  fill: {
    borderRadius: radius.full,
  },
});
