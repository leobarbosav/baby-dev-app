import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => currentYear - i);

type Props = {
  onNext: (name: string, day: number, month: number, year: number) => void;
  onBack: () => void;
};

export default function BabyInfoScreen({ onNext, onBack }: Props) {
  const [name,  setName]  = useState('');
  const [day,   setDay]   = useState('');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year,  setYear]  = useState(currentYear);

  const dayNum = parseInt(day, 10);
  const canContinue = name.trim().length >= 2 && dayNum >= 1 && dayNum <= 31;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color={colors.text2} />
          </TouchableOpacity>

          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotDone]} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          <View style={styles.iconWrap}>
            <Ionicons name="person-add-outline" size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>Vamos conhecer{'\n'}seu bebê</Text>
          <Text style={styles.subtitle}>Essas informações personalizam as atividades</Text>

          <Text style={styles.label}>Nome do bebê</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sofia, Pedro, Maria..."
            placeholderTextColor={colors.text3}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Dia de nascimento</Text>
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder="Ex: 15"
            placeholderTextColor={colors.text3}
            value={day}
            onChangeText={v => setDay(v.replace(/\D/g, '').slice(0, 2))}
            keyboardType="number-pad"
            returnKeyType="done"
            maxLength={2}
          />

          <Text style={styles.label}>Mês de nascimento</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {MONTHS.map((m, i) => (
              <TouchableOpacity
                key={m}
                style={[styles.chip, month === i && styles.chipActive]}
                onPress={() => setMonth(i)}
              >
                <Text style={[styles.chipText, month === i && styles.chipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Ano de nascimento</Text>
          <View style={styles.yearRow}>
            {YEARS.map(y => (
              <TouchableOpacity
                key={y}
                style={[styles.yearChip, year === y && styles.chipActive]}
                onPress={() => setYear(y)}
              >
                <Text style={[styles.chipText, year === y && styles.chipTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btn, !canContinue && styles.btnDisabled]}
            onPress={() => canContinue && onNext(name.trim(), dayNum, month, year)}
            activeOpacity={canContinue ? 0.8 : 1}
          >
            <Text style={styles.btnText}>Próximo</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  backBtn: { paddingVertical: spacing.md },
  dots: { flexDirection: 'row', gap: 6, marginBottom: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  dotDone: { backgroundColor: colors.primary },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.h2, color: colors.text1, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.text3, marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.text3, marginBottom: spacing.sm, letterSpacing: 0.6 },
  input: {
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 14,
    ...typography.body, color: colors.text1,
    marginBottom: spacing.lg, backgroundColor: colors.white,
  },
  inputSmall: { width: 100 },
  chipScroll: { marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodyMedium, color: colors.text2 },
  chipTextActive: { color: colors.white },
  yearRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  yearChip: {
    flex: 1, paddingVertical: spacing.sm,
    borderRadius: radius.md, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  btn: {
    flexDirection: 'row', backgroundColor: colors.primary,
    borderRadius: radius.md, paddingVertical: spacing.md,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, marginTop: spacing.sm,
  },
  btnDisabled: { backgroundColor: colors.border },
  btnText: { ...typography.bodySemiBold, color: colors.white, fontSize: 17 },
});
