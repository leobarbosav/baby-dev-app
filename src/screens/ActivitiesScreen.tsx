import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getActivitiesForMonth, getMonthTabs } from '../data/activitiesData';
import { useBaby } from '../context/BabyContext';
import { getActivitiesDone, saveActivityDone, todayStr } from '../utils/storage';

function ageInMonths(birthDateObj: Date): number {
  const now = new Date();
  let months =
    (now.getFullYear() - birthDateObj.getFullYear()) * 12 +
    (now.getMonth() - birthDateObj.getMonth());
  if (now.getDate() < birthDateObj.getDate()) months -= 1;
  return Math.max(0, Math.min(months, 24));
}

const areaColors: Record<string, { color: string; bg: string }> = {
  motor:     { color: colors.motor,     bg: colors.motorLight },
  cognitive: { color: colors.cognitive, bg: colors.cognitiveLight },
  social:    { color: colors.social,    bg: colors.socialLight },
  language:  { color: colors.language,  bg: colors.languageLight },
};

function Stars({ count }: { count: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={13}
          color={i < count ? colors.warning : colors.border}
        />
      ))}
    </View>
  );
}

export default function ActivitiesScreen() {
  const baby = useBaby();
  const currentAge = ageInMonths(baby.birthDateObj);
  const tabs = getMonthTabs(currentAge);
  const [selectedTab, setSelectedTab] = useState(currentAge);
  const [doneMap, setDoneMap] = useState<Record<string, string>>({});
  const today = todayStr();

  useEffect(() => {
    getActivitiesDone(today).then(setDoneMap);
  }, [today]);

  const markDone = async (id: string) => {
    const completedAt = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    await saveActivityDone(today, id, completedAt);
    setDoneMap(prev => ({ ...prev, [id]: completedAt }));
  };

  const activities = getActivitiesForMonth(selectedTab);
  const done    = activities.filter(a => doneMap[a.id]);
  const pending = activities.filter(a => !doneMap[a.id]);

  const dateStr = new Date()
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    .replace('.', '');

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Atividades</Text>
        <Text style={styles.date}>{dateStr} • {baby.name} {baby.age}</Text>
      </View>

      {/* ── Abas de mês ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map(month => {
          const isActive = selectedTab === month;
          const isCurrent = month === currentAge;
          return (
            <TouchableOpacity
              key={month}
              onPress={() => setSelectedTab(month)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {month}m{isCurrent ? ' ✦' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Lista ── */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Feitas */}
        {done.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>FEITAS ({done.length})</Text>
            {done.map(activity => (
              <Card key={activity.id} style={styles.doneCard}>
                <View style={styles.cardRow}>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityMeta}>
                      {activity.area} • {activity.duration} min
                    </Text>
                    <Text style={styles.completedAt}>
                      <Ionicons name="time-outline" size={11} color={colors.success} />{' '}
                      Feita às {doneMap[activity.id]}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Pendentes */}
        <Text style={styles.sectionLabel}>
          {pending.length > 0
            ? `PARA FAZER (${pending.length})`
            : 'TODAS FEITAS!'}
        </Text>

        {pending.length === 0 && (
          <Card style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={48} color={colors.warning} />
            <Text style={styles.emptyTitle}>Incrível!</Text>
            <Text style={styles.emptyText}>
              {baby.name} concluiu todas as atividades deste mês.
            </Text>
          </Card>
        )}

        {pending.map(activity => {
          const ac = areaColors[activity.areaKey] ?? areaColors.motor;
          const isPremium = activity.isPremium;
          return (
            <Card
              key={activity.id}
              style={[styles.activityCard, { borderLeftColor: ac.color }] as any}
            >
              <View style={styles.cardHeader}>
                <Badge label={activity.area} color={ac.color} bgColor={ac.bg} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Stars count={activity.stars} />
                  {isPremium && (
                    <Ionicons name="lock-closed" size={13} color={colors.textDisabled} />
                  )}
                </View>
              </View>

              <Text style={styles.activityTitle}>{activity.title}</Text>

              <View style={styles.metaRow}>
                <Ionicons name="timer-outline" size={13} color={colors.text3} />
                <Text style={styles.activityMeta}>{activity.duration} min</Text>
                {activity.where ? (
                  <>
                    <Text style={styles.dot}>·</Text>
                    <Ionicons name="location-outline" size={13} color={colors.text3} />
                    <Text style={styles.activityMeta}>{activity.where}</Text>
                  </>
                ) : null}
              </View>

              {activity.materials ? (
                <View style={styles.metaRow}>
                  <Ionicons name="cube-outline" size={13} color={colors.text3} />
                  <Text style={styles.activityMeta}>{activity.materials}</Text>
                </View>
              ) : null}

              <Text style={styles.activityDesc}>{activity.description}</Text>

              <TouchableOpacity
                style={[
                  styles.startBtn,
                  { backgroundColor: isPremium ? colors.textDisabled : ac.color },
                ]}
                onPress={() => !isPremium && markDone(activity.id)}
                activeOpacity={isPremium ? 1 : 0.8}
              >
                <Ionicons
                  name={isPremium ? 'lock-closed-outline' : 'checkmark-circle-outline'}
                  size={18}
                  color={colors.white}
                />
                <Text style={styles.startBtnText}>
                  {isPremium ? 'Disponível no Premium' : 'Marcar como feita'}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        })}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  header:  { paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xs },
  title:   { ...typography.h2, color: colors.text1 },
  date:    { ...typography.caption, color: colors.text3, marginTop: 2 },

  tabScroll:   { flexGrow: 0, marginTop: spacing.sm },
  tabContent:  { paddingHorizontal: spacing.md, gap: spacing.xs, paddingBottom: spacing.sm },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive:     { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText:       { ...typography.bodyMedium, color: colors.text2, fontSize: 13 },
  tabTextActive: { color: colors.white },

  scroll:       { flex: 1, paddingHorizontal: spacing.md },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.8 },

  doneCard:    { marginBottom: spacing.sm, opacity: 0.72 },
  cardRow:     { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo:    { flex: 1 },

  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  activityCard:  { marginBottom: spacing.md, borderLeftWidth: 4 },
  activityTitle: { ...typography.bodyMedium, color: colors.text1, marginBottom: 4 },
  activityMeta:  { ...typography.caption, color: colors.text3 },
  completedAt:   { ...typography.caption, color: colors.success, marginTop: 2 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  dot:     { color: colors.text3, marginHorizontal: 2 },

  activityDesc: { ...typography.body, color: colors.text3, marginTop: spacing.xs, marginBottom: spacing.md },

  startBtn: {
    flexDirection: 'row', borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
  },
  startBtnText: { ...typography.bodySemiBold, color: colors.white },

  emptyCard:  { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md, gap: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.text1 },
  emptyText:  { ...typography.body, color: colors.text3, textAlign: 'center' },
});
