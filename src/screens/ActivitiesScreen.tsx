import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { activities } from '../data/mockData';

const areaColors: Record<string, { color: string; bg: string }> = {
  motor:    { color: colors.motor,    bg: colors.motorLight },
  cognitive:{ color: colors.cognitive, bg: colors.cognitiveLight },
  social:   { color: colors.social,   bg: colors.socialLight },
  language: { color: colors.language, bg: colors.languageLight },
};

function Stars({ count }: { count: number }) {
  return (
    <Text style={styles.stars}>
      {'⭐'.repeat(count)}{'☆'.repeat(5 - count)}
    </Text>
  );
}

export default function ActivitiesScreen() {
  const [items, setItems] = useState(activities);
  const done = items.filter(a => a.done);
  const pending = items.filter(a => !a.done);

  const markDone = (id: string) => {
    setItems(prev => prev.map(a =>
      a.id === id ? { ...a, done: true, completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } : a
    ));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Atividades de Hoje</Text>
          <Text style={styles.date}>20 Mai • Sofia 8m</Text>
        </View>

        {done.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>✅ CONQUISTADAS ({done.length})</Text>
            {done.map(activity => (
              <Card key={activity.id} style={styles.doneCard}>
                <View style={styles.cardRow}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityMeta}>
                      {activity.area} • {activity.duration} min
                    </Text>
                    <Text style={styles.completedAt}>Feita às {activity.completedAt}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        <Text style={styles.sectionLabel}>📋 PARA FAZER HOJE ({pending.length})</Text>
        {pending.map(activity => {
          const ac = areaColors[activity.areaKey] ?? areaColors.motor;
          return (
            <Card key={activity.id} style={styles.activityCard}>
              <View style={styles.cardHeader}>
                <Badge label={activity.area} color={ac.color} bgColor={ac.bg} />
                <Stars count={activity.stars} />
              </View>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityMeta}>{activity.duration} minutos</Text>
              <Text style={styles.activityDesc}>{activity.description}</Text>
              <TouchableOpacity
                style={[styles.startBtn, { backgroundColor: ac.color }]}
                onPress={() => markDone(activity.id)}
              >
                <Text style={styles.startBtnText}>Marcar como feita ✓</Text>
              </TouchableOpacity>
            </Card>
          );
        })}

        {pending.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>Todas feitas!</Text>
            <Text style={styles.emptyText}>Sofia concluiu todas as atividades de hoje.</Text>
          </Card>
        )}

        <Card style={styles.tipCard}>
          <Text style={styles.tipLabel}>💡 Reforço</Text>
          <Text style={styles.tipText}>Nomeie os brinquedos durante a brincadeira para estimular a linguagem.</Text>
        </Card>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, paddingHorizontal: spacing.md },
  headerRow: { paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.text1 },
  date: { ...typography.caption, color: colors.text3, marginTop: 2 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.5 },
  doneCard: { marginBottom: spacing.sm, opacity: 0.75 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  checkIcon: { fontSize: 22, color: colors.success, marginRight: spacing.sm },
  cardInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  activityCard: { marginBottom: spacing.md },
  activityTitle: { ...typography.bodyMedium, color: colors.text1, marginBottom: 2 },
  activityMeta: { ...typography.caption, color: colors.text3 },
  completedAt: { ...typography.caption, color: colors.success, marginTop: 2 },
  activityDesc: { ...typography.body, color: colors.text3, marginTop: spacing.sm, marginBottom: spacing.md },
  stars: { fontSize: 13 },
  startBtn: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  startBtnText: { ...typography.bodyMedium, color: colors.white },
  emptyCard: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.text1, marginBottom: spacing.xs },
  emptyText: { ...typography.body, color: colors.text3, textAlign: 'center' },
  tipCard: { marginTop: spacing.xs },
  tipLabel: { ...typography.bodyMedium, color: colors.orange, marginBottom: spacing.xs },
  tipText: { ...typography.body, color: colors.text3 },
});
