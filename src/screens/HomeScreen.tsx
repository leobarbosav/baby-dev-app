import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { activities, developmentAreas } from '../data/mockData';
import { useBaby } from '../context/BabyContext';

const quickActions = [
  { icon: 'moon-outline' as const, label: 'Sono', color: colors.purple },
  { icon: 'nutrition-outline' as const, label: 'Mamou', color: colors.green },
  { icon: 'resize-outline' as const, label: 'Cresceu', color: colors.orange },
];

export default function HomeScreen() {
  const baby = useBaby();
  const doneCount = activities.filter(a => a.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá! 👋</Text>
            <Text style={styles.subtitle}>Bebê: {baby.name} • {baby.age}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>{baby.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.planCard}>
          <View style={styles.planRow}>
            <View style={[styles.planIconWrap, { backgroundColor: colors.orangeLight }]}>
              <Ionicons name="sunny-outline" size={24} color={colors.orange} />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Plano de hoje</Text>
              <Text style={styles.planSub}>
                {activities.length} atividades • {doneCount} feita{doneCount !== 1 ? 's' : ''} ✓
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text3} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Registros rápidos</Text>
        <View style={styles.quickRow}>
          {quickActions.map(action => (
            <TouchableOpacity key={action.label} style={styles.quickBtn}>
              <View style={[styles.quickIconWrap, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={26} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Progresso de {baby.name}</Text>
        <Card>
          {developmentAreas.map((area, i) => (
            <View key={area.key} style={[styles.progressRow, i < developmentAreas.length - 1 && styles.progressRowBorder]}>
              <Text style={styles.progressLabel}>{area.label}</Text>
              <ProgressBar progress={area.progress} color={area.color} />
              <Text style={[styles.progressPct, { color: area.color }]}>
                {Math.round(area.progress * 100)}%
              </Text>
            </View>
          ))}
        </Card>

        <Card style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={20} color={colors.orange} />
            <Text style={styles.tipTitle}>Dica da semana</Text>
          </View>
          <Text style={styles.tipText}>
            Fale o nome dos objetos ao redor para estimular a linguagem do bebê.
          </Text>
        </Card>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, paddingHorizontal: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  greeting: { ...typography.h2, color: colors.text1 },
  subtitle: { ...typography.caption, color: colors.text3, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h3, color: colors.primary },
  planCard: { marginBottom: spacing.lg },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  planIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: { flex: 1 },
  planTitle: { ...typography.bodyMedium, color: colors.text1 },
  planSub: { ...typography.caption, color: colors.text3, marginTop: 2 },
  sectionTitle: { ...typography.h3, color: colors.text1, marginBottom: spacing.sm, marginTop: spacing.xs },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  quickBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.card,
  },
  quickIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { ...typography.label, color: colors.text3 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  progressRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  progressLabel: { ...typography.caption, color: colors.text2, width: 72 },
  progressPct: { ...typography.label, width: 32, textAlign: 'right', fontFamily: 'Nunito_700Bold' },
  tipCard: { marginTop: spacing.md },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  tipTitle: { ...typography.bodyMedium, color: colors.text1 },
  tipText: { ...typography.body, color: colors.text3 },
});
