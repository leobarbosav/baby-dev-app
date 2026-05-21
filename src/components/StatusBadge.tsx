import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, typography } from '../theme';

type Status = 'aplicada' | 'pendente' | 'atrasada';

interface Props {
  status: Status;
  diasParaData: number;
}

const CONFIG: Record<Status, { bg: string; text: string; label: (d: number) => string }> = {
  aplicada: {
    bg: '#E6F4EA',
    text: '#2D7A47',
    label: () => 'Aplicada',
  },
  pendente: {
    bg: '#FEF9C3',
    text: '#854D0E',
    label: (d) => `Em ${d} dia${d === 1 ? '' : 's'}`,
  },
  atrasada: {
    bg: '#FEE2E2',
    text: '#991B1B',
    label: (d) => `${Math.abs(d)} dia${Math.abs(d) === 1 ? '' : 's'} em atraso`,
  },
};

export default function StatusBadge({ status, diasParaData }: Props) {
  const cfg = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label(diasParaData)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.label,
    fontSize: 11,
    lineHeight: 15,
  },
});
