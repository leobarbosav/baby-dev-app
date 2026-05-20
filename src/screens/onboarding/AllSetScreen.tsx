import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';

const { height } = Dimensions.get('window');

const MONTHS = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
];

function calcAge(month: number, year: number): string {
  const now = new Date();
  const totalMonths = (now.getFullYear() - year) * 12 + (now.getMonth() - month);
  if (totalMonths < 1) return 'recém-nascido';
  if (totalMonths < 12) return `${totalMonths} ${totalMonths === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(totalMonths / 12);
  const rem   = totalMonths % 12;
  if (rem === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${years}a ${rem}m`;
}

type Props = {
  name: string;
  month: number;
  year: number;
  onFinish: () => void;
};

const highlights = [
  { icon: 'calendar-outline' as const, text: 'Atividades novas todo dia' },
  { icon: 'ribbon-outline' as const,   text: 'Marcos personalizados por idade' },
  { icon: 'heart-outline' as const,    text: 'Registros de sono e alimentação' },
];

export default function AllSetScreen({ name, month, year, onFinish }: Props) {
  const age = calcAge(month, year);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
        </View>

        <View style={styles.center}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color={colors.white} />
          </View>
          <Text style={styles.title}>Tudo pronto!</Text>
          <View style={styles.babyPill}>
            <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.babyPillText}>
              {name} • {age} • nasceu em {MONTHS[month]} de {year}
            </Text>
          </View>
        </View>

        <View style={styles.highlights}>
          {highlights.map((h, i) => (
            <View key={i} style={styles.highlightRow}>
              <View style={styles.highlightIcon}>
                <Ionicons name={h.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.highlightText}>{h.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.btn} onPress={onFinish}>
            <Ionicons name="rocket-outline" size={20} color={colors.white} />
            <Text style={styles.btnText}>Entrar no app</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotDone: { width: 24, backgroundColor: colors.primary },
  center: { alignItems: 'center', marginTop: height * 0.02 },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 32, fontFamily: 'Nunito_700Bold', color: colors.text1, marginBottom: spacing.md },
  babyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  babyPillText: { ...typography.bodyMedium, color: colors.primary },
  highlights: { gap: spacing.md },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  highlightIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: { ...typography.bodyMedium, color: colors.text1, flex: 1 },
  bottom: { paddingBottom: spacing.sm },
  btn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  btnText: { ...typography.bodySemiBold, color: colors.white, fontSize: 17 },
});
