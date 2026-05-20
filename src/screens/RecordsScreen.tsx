import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import { sleepRecords, feedingRecords } from '../data/mockData';

type Tab = 'sleep' | 'feeding';

const historyDays = [
  { label: '19 Mai', total: '11h 00min' },
  { label: '18 Mai', total: '10h 45min' },
  { label: '17 Mai', total: '9h 50min' },
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
      <View style={styles.header}>
        <Text style={styles.title}>Registros</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sleep' && styles.tabActive]}
            onPress={() => setActiveTab('sleep')}
          >
            <Text style={[styles.tabText, activeTab === 'sleep' && styles.tabTextActive]}>
              😴 Sono
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feeding' && styles.tabActive]}
            onPress={() => setActiveTab('feeding')}
          >
            <Text style={[styles.tabText, activeTab === 'feeding' && styles.tabTextActive]}>
              🍼 Alimentação
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'sleep' ? (
          <>
            <Text style={styles.dayLabel}>Hoje, 20 Mai</Text>

            {lastSleep && (
              <Card style={styles.lastCard}>
                <Text style={styles.cardTitle}>😴 Última soneca</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Início</Text>
                    <Text style={styles.infoValue}>{lastSleep.start}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Fim</Text>
                    <Text style={styles.infoValue}>{lastSleep.end}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Duração</Text>
                    <Text style={styles.infoValue}>
                      {Math.floor(lastSleep.duration / 60)}h {lastSleep.duration % 60}min
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ Registrar sono</Text>
            </TouchableOpacity>

            <Card style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total hoje</Text>
                <Text style={styles.totalValue}>{totalHours}h {remainingMins}min</Text>
              </View>
              <View style={styles.timelineTrack}>
                {[0,2,4,6,8,10,12,14,16,18,20,22].map(h => (
                  <View
                    key={h}
                    style={[
                      styles.timelineBlock,
                      (h >= 9 && h < 11) || (h >= 13 && h < 15) ? styles.timelineActive : null,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.timelineHint}>● dormindo</Text>
            </Card>

            <Text style={styles.sectionLabel}>HISTÓRICO RECENTE</Text>
            {historyDays.map(day => (
              <Card key={day.label} style={styles.historyCard}>
                <Text style={styles.historyIcon}>📅</Text>
                <Text style={styles.historyDay}>{day.label}</Text>
                <Text style={styles.historyTotal}>{day.total}</Text>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.dayLabel}>Hoje, 20 Mai</Text>
            {feedingRecords.map(record => (
              <Card key={record.id} style={styles.feedCard}>
                <View style={styles.feedRow}>
                  <Text style={styles.feedIcon}>🍼</Text>
                  <View style={styles.feedInfo}>
                    <Text style={styles.feedType}>{record.type}</Text>
                    <Text style={styles.feedMeta}>{record.time} • {record.amount}</Text>
                  </View>
                </View>
              </Card>
            ))}
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ Registrar alimentação</Text>
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
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  title: { ...typography.h2, color: colors.text1, marginBottom: spacing.md },
  tabRow: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { ...typography.bodyMedium, color: colors.text3 },
  tabTextActive: { color: colors.primary },
  scroll: { flex: 1, paddingHorizontal: spacing.md },
  dayLabel: { ...typography.bodyMedium, color: colors.text1, marginBottom: spacing.sm },
  lastCard: { marginBottom: spacing.sm },
  cardTitle: { ...typography.bodyMedium, color: colors.text1, marginBottom: spacing.md },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoItem: { alignItems: 'center' },
  infoLabel: { ...typography.caption, color: colors.text3 },
  infoValue: { ...typography.bodyMedium, color: colors.text1, marginTop: 2 },
  addBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginVertical: spacing.sm,
    borderStyle: 'dashed',
  },
  addBtnText: { ...typography.bodyMedium, color: colors.primary },
  totalCard: { marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  totalLabel: { ...typography.bodyMedium, color: colors.text1 },
  totalValue: { ...typography.bodyMedium, color: colors.primary, fontWeight: '700' },
  timelineTrack: { flexDirection: 'row', gap: 3, marginBottom: spacing.xs },
  timelineBlock: { flex: 1, height: 20, backgroundColor: colors.border, borderRadius: 3 },
  timelineActive: { backgroundColor: colors.primary },
  timelineHint: { ...typography.caption, color: colors.text3 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.5 },
  historyCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  historyIcon: { fontSize: 18 },
  historyDay: { ...typography.bodyMedium, color: colors.text1, flex: 1 },
  historyTotal: { ...typography.bodyMedium, color: colors.primary },
  feedCard: { marginBottom: spacing.sm },
  feedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  feedIcon: { fontSize: 28 },
  feedInfo: { flex: 1 },
  feedType: { ...typography.bodyMedium, color: colors.text1 },
  feedMeta: { ...typography.caption, color: colors.text3, marginTop: 2 },
});
