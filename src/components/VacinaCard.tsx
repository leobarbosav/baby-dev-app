import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { VacinaComStatus } from '../data/vacinasData';
import { colors, spacing, typography, radius } from '../theme';

interface Props {
  vacina: VacinaComStatus;
  onPress: () => void;
  onMarcarAplicada: () => void;
}

export default function VacinaCard({ vacina, onPress, onMarcarAplicada }: Props) {
  const isAtrasada = vacina.status === 'atrasada';
  const isUrgente  = vacina.status === 'pendente' && vacina.diasParaData <= 7;

  const borderStyle = isAtrasada
    ? { borderLeftWidth: 3, borderLeftColor: '#991B1B' }
    : isUrgente
    ? { borderLeftWidth: 3, borderLeftColor: '#854D0E' }
    : {};

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.card, borderStyle]}>
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <Text style={styles.nome}>{vacina.nome}</Text>
            <Text style={styles.dose}>{vacina.dose}</Text>
          </View>
          <StatusBadge status={vacina.status} diasParaData={vacina.diasParaData} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.doenca} numberOfLines={1}>{vacina.doencaPrevine}</Text>
          <Text style={styles.idadeLabel}>{vacina.idadeLabel}</Text>
        </View>

        {vacina.status !== 'aplicada' && (
          <TouchableOpacity style={styles.marcarBtn} onPress={onMarcarAplicada}>
            <Ionicons name="checkmark-circle-outline" size={14} color={colors.green} />
            <Text style={styles.marcarText}>Marcar como aplicada</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  titleGroup: { flex: 1 },
  nome: { ...typography.bodyMedium, color: colors.text1 },
  dose: { ...typography.caption, color: colors.text3, marginTop: 1 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  doenca: { ...typography.caption, color: colors.text3, flex: 1 },
  idadeLabel: { ...typography.label, color: colors.text3 },
  marcarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  marcarText: { ...typography.label, color: colors.green },
});
