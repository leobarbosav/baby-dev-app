import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import { sleepRecords, feedingRecords } from '../data/mockData';

type Tab = 'sleep' | 'feeding';

const historyDays = [
  { label: '19 Mai', total: '11h 00min', icon: 'moon' as const },
  { label: '18 Mai', total: '10h 45min', icon: 'moon' as const },
  { label: '17 Mai', total: '9h 50min',  icon: 'moon' as const },
];

export default function RecordsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('sleep');

  const todaySleep = sleepRecords.filter(r => r.date === '2026-05-20');
  const totalMins = todaySleep.reduce((acc, r) => acc + r.duration, 0);
  const totalHours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  const lastSleep = todaySleep[todaySleep.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topArea}>
        <Text style={styles.title}>Registros</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sleep' && styles.tabActive]}
            onPress={() => setActiveTab('sleep')}
          >
            <Ionicons
              name="moon-outline"
              size={16}
              color={activeTab === 'sleep' ? colors.primary : colors.text3}
            />
            <Text style={[styles.tabText, activeTab === 'sleep' && styles.tabTextActive]}>Sono</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feeding' && styles.tabActive]}
            onPress={() => setActiveTab('feeding')}
          >
            <Ionicons
              name="nutrition-outline"
              size={16}
              color={activeTab === 'feeding' ? colors.primary : colors.text3}
            />
            <Text style={[styles.tabText, activeTab === 'feeding' && styles.tabTextActive]}>Alimentação</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'sleep' ? (
          <>
            <Text style={styles.dayLabel}>Hoje, 20 Mai</Text>

            {lastSleep && (
              <Card style={styles.lastCard}>
                <View style={styles.lastHeader}>
                  <Ionicons name="moon" size={20} color={colors.purple} />
                  <Text style={styles.cardTitle}>Última soneca</Text>
                </View>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Início</Text>
                    <Text style={styles.infoValue}>{lastSleep.start}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Fim</Text>
                    <Text style={styles.infoValue}>{lastSleep.end}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Duração</Text>
                    <Text style={styles.infoValue}>
                      {Math.floor(lastSleep.duration / 60)}h {lastSleep.duration % 60}m
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addBtnText}>Registrar sono</Text>
            </TouchableOpacity>

            <Card style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total hoje</Text>
                <Text style={styles.totalValue}>{totalHours}h {remainingMins}min</Text>
              </View>
              <View style={styles.timelineTrack}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const hour = i * 2;
                  const active = (hour >= 9 && hour < 11) || (hour >= 13 && hour < 15);
                  return <View key={i} style={[styles.timelineBlock, active && styles.timelineActive]} />;
                })}
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.timelineHint}>dormindo</Text>
              </View>
            </Card>

            <Text style={styles.sectionLabel}>HISTÓRICO RECENTE</Text>
            {historyDays.map(day => (
              <Card key={day.label} style={styles.historyCard}>
                <Ionicons name={day.icon} size={18} color={colors.purple} />
                <Text style={styles.historyDay}>{day.label}</Text>
                <Text style={styles.historyTotal}>{day.total}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.border} />
              </Card>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.dayLabel}>Hoje, 20 Mai</Text>
            {feedingRecords.map(record => (
              <Card key={record.id} style={styles.feedCard}>
                <View style={[styles.feedIconWrap, { backgroundColor: colors.greenLight }]}>
                  <Ionicons name="nutrition-outline" size={22} color={colors.green} />
                </View>
                <View style={styles.feedInfo}>
                  <Text style={styles.feedType}>{record.type}</Text>
                  <Text style={styles.feedMeta}>{record.time} • {record.amount}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.border} />
              </Card>
            ))}
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addBtnText}>Registrar alimentação</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topArea: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  title: { ...typography.h2, color: colors.text1, marginBottom: spacing.md },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { ...typography.bodyMedium, color: colors.text3 },
  tabTextActive: { color: colors.primary },
  scroll: { flex: 1, paddingHorizontal: spacing.md },
  dayLabel: { ...typography.bodyMedium, color: colors.text1, marginBottom: spacing.sm },
  lastCard: { marginBottom: spacing.sm },
  lastHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  cardTitle: { ...typography.bodyMedium, color: colors.text1 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  infoItem: { alignItems: 'center' },
  infoDivider: { width: 1, height: 32, backgroundColor: colors.border },
  infoLabel: { ...typography.caption, color: colors.text3 },
  infoValue: { ...typography.h3, color: colors.text1, marginTop: 4 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    marginVertical: spacing.sm,
    borderStyle: 'dashed',
  },
  addBtnText: { ...typography.bodyMedium, color: colors.primary },
  totalCard: { marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  totalLabel: { ...typography.bodyMedium, color: colors.text1 },
  totalValue: { ...typography.bodyMedium, color: colors.primary, fontFamily: 'Nunito_700Bold' },
  timelineTrack: { flexDirection: 'row', gap: 3, marginBottom: spacing.xs },
  timelineBlock: { flex: 1, height: 20, backgroundColor: colors.border, borderRadius: 3 },
  timelineActive: { backgroundColor: colors.primary },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  timelineHint: { ...typography.caption, color: colors.text3 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.8 },
  historyCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  historyDay: { ...typography.bodyMedium, color: colors.text1, flex: 1 },
  historyTotal: { ...typography.bodyMedium, color: colors.primary },
  feedCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  feedIconWrap: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  feedInfo: { flex: 1 },
  feedType: { ...typography.bodyMedium, color: colors.text1 },
  feedMeta: { ...typography.caption, color: colors.text3, marginTop: 2 },
});
