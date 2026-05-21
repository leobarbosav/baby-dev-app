import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import SleepModal from '../components/SleepModal';
import FeedingModal from '../components/FeedingModal';
import GrowthModal from '../components/GrowthModal';
import {
  getSleepRecords, getFeedingRecords, getGrowthRecords,
  SleepRecord, FeedingRecord, GrowthRecord,
} from '../utils/storage';

type Tab = 'sleep' | 'feeding' | 'growth';

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

function dateLabel(isoDate: string): string {
  const [, month, day] = isoDate.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

export default function RecordsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('sleep');
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [showGrowthModal, setShowGrowthModal] = useState(false);

  const today = todayIso();

  useEffect(() => {
    getSleepRecords().then(setSleepRecords);
    getFeedingRecords().then(setFeedingRecords);
    getGrowthRecords().then(setGrowthRecords);
  }, []);

  const todaySleep   = sleepRecords.filter(r => r.date === today);
  const todayFeeding = feedingRecords.filter(r => r.date === today);

  const totalMins    = todaySleep.reduce((acc, r) => acc + r.duration, 0);
  const totalHours   = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  const lastSleep    = todaySleep[todaySleep.length - 1];

  // Last 3 days with sleep data (excluding today)
  const historyDays = sleepRecords
    .filter(r => r.date !== today)
    .reduce<{ date: string; duration: number }[]>((acc, r) => {
      const entry = acc.find(d => d.date === r.date);
      if (entry) entry.duration += r.duration;
      else acc.push({ date: r.date, duration: r.duration });
      return acc;
    }, [])
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map(d => {
      const h = Math.floor(d.duration / 60);
      const m = d.duration % 60;
      return { label: dateLabel(d.date), total: `${h}h${m > 0 ? ` ${m}min` : ''}` };
    });

  // Timeline: 12 blocks of 2h each, mark blocks where baby slept
  const timelineBlocks = Array.from({ length: 12 }).map((_, i) => {
    const blockStart = i * 120;
    const blockEnd   = (i + 1) * 120;
    return todaySleep.some(r => {
      const [sh, sm] = r.start.split(':').map(Number);
      const [eh, em] = r.end.split(':').map(Number);
      return (sh * 60 + sm) < blockEnd && (eh * 60 + em) > blockStart;
    });
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topArea}>
        <Text style={styles.title}>Registros</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sleep' && styles.tabActive]}
            onPress={() => setActiveTab('sleep')}
          >
            <Ionicons name="moon-outline" size={16} color={activeTab === 'sleep' ? colors.primary : colors.text3} />
            <Text style={[styles.tabText, activeTab === 'sleep' && styles.tabTextActive]}>Sono</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feeding' && styles.tabActive]}
            onPress={() => setActiveTab('feeding')}
          >
            <Ionicons name="nutrition-outline" size={16} color={activeTab === 'feeding' ? colors.primary : colors.text3} />
            <Text style={[styles.tabText, activeTab === 'feeding' && styles.tabTextActive]}>Alimentação</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'growth' && styles.tabActive]}
            onPress={() => setActiveTab('growth')}
          >
            <Ionicons name="resize-outline" size={16} color={activeTab === 'growth' ? colors.primary : colors.text3} />
            <Text style={[styles.tabText, activeTab === 'growth' && styles.tabTextActive]}>Crescimento</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'sleep' && (
          <>
            <Text style={styles.dayLabel}>Hoje, {dateLabel(today)}</Text>

            {lastSleep ? (
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
            ) : (
              <Card style={styles.emptyCard}>
                <Ionicons name="moon-outline" size={32} color={colors.text3} />
                <Text style={styles.emptyText}>Nenhum sono registrado hoje</Text>
              </Card>
            )}

            <TouchableOpacity style={styles.addBtn} onPress={() => setShowSleepModal(true)}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addBtnText}>Registrar sono</Text>
            </TouchableOpacity>

            {totalMins > 0 && (
              <Card style={styles.totalCard}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total hoje</Text>
                  <Text style={styles.totalValue}>{totalHours}h {remainingMins}min</Text>
                </View>
                <View style={styles.timelineTrack}>
                  {timelineBlocks.map((active, i) => (
                    <View key={i} style={[styles.timelineBlock, active && styles.timelineActive]} />
                  ))}
                </View>
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={styles.timelineHint}>dormindo</Text>
                </View>
              </Card>
            )}

            {historyDays.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>HISTÓRICO RECENTE</Text>
                {historyDays.map(day => (
                  <Card key={day.label} style={styles.historyCard}>
                    <Ionicons name="moon" size={18} color={colors.purple} />
                    <Text style={styles.historyDay}>{day.label}</Text>
                    <Text style={styles.historyTotal}>{day.total}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  </Card>
                ))}
              </>
            )}
          </>
        )}
        {activeTab === 'feeding' && (
          <>
            <Text style={styles.dayLabel}>Hoje, {dateLabel(today)}</Text>

            {todayFeeding.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Ionicons name="nutrition-outline" size={32} color={colors.text3} />
                <Text style={styles.emptyText}>Nenhuma alimentação registrada hoje</Text>
              </Card>
            ) : (
              todayFeeding.map(record => (
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
              ))
            )}

            <TouchableOpacity style={styles.addBtn} onPress={() => setShowFeedingModal(true)}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addBtnText}>Registrar alimentação</Text>
            </TouchableOpacity>
          </>
        )}
        {activeTab === 'growth' && (
          <>
            <Text style={styles.dayLabel}>Histórico de medidas</Text>

            {growthRecords.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Ionicons name="resize-outline" size={32} color={colors.text3} />
                <Text style={styles.emptyText}>Nenhuma medida registrada ainda</Text>
              </Card>
            ) : (
              <>
                {/* Últimas medidas em destaque */}
                {(() => {
                  const last = growthRecords[0];
                  return (
                    <Card style={styles.growthHighlight}>
                      <Text style={styles.cardTitle}>Última medição</Text>
                      <Text style={styles.growthDate}>{dateLabel(last.date)}</Text>
                      <View style={styles.growthMetrics}>
                        {last.weight !== undefined && (
                          <View style={styles.growthMetric}>
                            <Ionicons name="scale-outline" size={20} color={colors.orange} />
                            <Text style={styles.growthValue}>{last.weight.toFixed(1)}</Text>
                            <Text style={styles.growthUnit}>kg</Text>
                          </View>
                        )}
                        {last.weight !== undefined && last.height !== undefined && (
                          <View style={styles.infoDivider} />
                        )}
                        {last.height !== undefined && (
                          <View style={styles.growthMetric}>
                            <Ionicons name="resize-outline" size={20} color={colors.primary} />
                            <Text style={styles.growthValue}>{last.height.toFixed(0)}</Text>
                            <Text style={styles.growthUnit}>cm</Text>
                          </View>
                        )}
                      </View>
                    </Card>
                  );
                })()}

                {/* Histórico */}
                {growthRecords.length > 1 && (
                  <>
                    <Text style={styles.sectionLabel}>HISTÓRICO</Text>
                    {growthRecords.slice(1).map(record => (
                      <Card key={record.id} style={styles.growthHistoryCard}>
                        <Ionicons name="calendar-outline" size={16} color={colors.text3} />
                        <Text style={styles.historyDay}>{dateLabel(record.date)}</Text>
                        <View style={styles.growthHistoryValues}>
                          {record.weight !== undefined && (
                            <Text style={styles.growthHistoryText}>{record.weight.toFixed(1)} kg</Text>
                          )}
                          {record.height !== undefined && (
                            <Text style={styles.growthHistoryText}>{record.height.toFixed(0)} cm</Text>
                          )}
                        </View>
                      </Card>
                    ))}
                  </>
                )}
              </>
            )}

            <TouchableOpacity style={styles.addBtn} onPress={() => setShowGrowthModal(true)}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addBtnText}>Registrar medidas</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <SleepModal
        visible={showSleepModal}
        onClose={() => setShowSleepModal(false)}
        onSaved={record => setSleepRecords(prev => [record, ...prev])}
      />
      <FeedingModal
        visible={showFeedingModal}
        onClose={() => setShowFeedingModal(false)}
        onSaved={record => setFeedingRecords(prev => [record, ...prev])}
      />
      <GrowthModal
        visible={showGrowthModal}
        onClose={() => setShowGrowthModal(false)}
        onSaved={record => setGrowthRecords(prev => [record, ...prev])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topArea: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  title: { ...typography.h2, color: colors.text1, marginBottom: spacing.md },
  tabRow: {
    flexDirection: 'row', backgroundColor: colors.border,
    borderRadius: radius.md, padding: 4, marginBottom: spacing.md,
  },
  tab: {
    flex: 1, flexDirection: 'row', paddingVertical: spacing.sm,
    borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
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
  emptyCard: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.text3 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, borderWidth: 1.5, borderColor: colors.primary,
    borderRadius: radius.md, paddingVertical: spacing.sm,
    marginVertical: spacing.sm, borderStyle: 'dashed',
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
  growthHighlight: { marginBottom: spacing.sm },
  growthDate: { ...typography.caption, color: colors.text3, marginTop: 2, marginBottom: spacing.md },
  growthMetrics: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  growthMetric: { alignItems: 'center', gap: 4 },
  growthValue: { fontSize: 32, fontFamily: 'Nunito_700Bold', color: colors.text1 },
  growthUnit: { ...typography.caption, color: colors.text3 },
  growthHistoryCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  growthHistoryValues: { flexDirection: 'row', gap: spacing.md, marginLeft: 'auto' as any },
  growthHistoryText: { ...typography.bodyMedium, color: colors.text2 },
});
