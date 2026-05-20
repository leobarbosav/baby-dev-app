import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { baby, activities, developmentAreas } from '../data/mockData';

const quickActions = [
  { icon: '😴', label: 'Sono' },
  { icon: '🍼', label: 'Mama' },
  { icon: '📏', label: 'Cresceu' },
];

export default function HomeScreen() {
  const doneCount = activities.filter(a => a.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá! 👋</Text>
            <Text style={styles.subtitle}>Bebê: {baby.name} • {baby.age}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {baby.name.charAt(0)}
            </Text>
          </View>
        </View>

        <Card style={styles.planCard}>
          <View style={styles.planRow}>
            <Text style={styles.planIcon}>🌟</Text>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Plano de hoje</Text>
              <Text style={styles.planSub}>
                {activities.length} atividades • {doneCount} conquistada{doneCount !== 1 ? 's' : ''} ✓
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.planLink}>Ver tudo →</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Registros rápidos</Text>
        <View style={styles.quickRow}>
          {quickActions.map(action => (
            <TouchableOpacity key={action.label} style={styles.quickBtn}>
              <Text style={styles.quickIcon}>{action.icon}</Text>
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
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipTitle}>Dica da semana</Text>
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
  planCard: { marginBottom: spacing.lg, flexDirection: 'row' },
  planRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  planIcon: { fontSize: 28, marginRight: spacing.sm },
  planInfo: { flex: 1 },
  planTitle: { ...typography.bodyMedium, color: colors.text1 },
  planSub: { ...typography.caption, color: colors.text3, marginTop: 2 },
  planLink: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  sectionTitle: { ...typography.h3, color: colors.text1, marginBottom: spacing.sm, marginTop: spacing.sm },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  quickBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIcon: { fontSize: 28 },
  quickLabel: { ...typography.label, color: colors.text3, marginTop: spacing.xs },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  progressRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  progressLabel: { ...typography.caption, color: colors.text2, width: 72 },
  progressPct: { ...typography.label, width: 32, textAlign: 'right', fontWeight: '700' },
  tipCard: { marginTop: spacing.md },
  tipIcon: { fontSize: 22, marginBottom: spacing.xs },
  tipTitle: { ...typography.bodyMedium, color: colors.text1, marginBottom: spacing.xs },
  tipText: { ...typography.body, color: colors.text3 },
});
