import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { developmentAreas } from '../data/mockData';
import { useBaby } from '../context/BabyContext';

const areaIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  motor:     'body-outline',
  cognitive: 'bulb-outline',
  social:    'people-outline',
  language:  'chatbubble-outline',
};

export default function ProgressScreen() {
  const baby = useBaby();
  const [selectedArea, setSelectedArea] = useState(developmentAreas[0].key);
  const area = developmentAreas.find(a => a.key === selectedArea)!;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Desenvolvimento</Text>
          <Text style={styles.subtitle}>{baby.name} • {baby.age}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {developmentAreas.map(a => {
            const active = selectedArea === a.key;
            return (
              <TouchableOpacity
                key={a.key}
                style={[styles.chip, active && { backgroundColor: a.color, borderColor: a.color }]}
                onPress={() => setSelectedArea(a.key)}
              >
                <Ionicons
                  name={areaIcons[a.key]}
                  size={14}
                  color={active ? colors.white : colors.text3}
                />
                <Text style={[styles.chipText, active && { color: colors.white }]}>{a.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Card style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={[styles.overviewIcon, { backgroundColor: area.color + '20' }]}>
              <Ionicons name={areaIcons[area.key]} size={28} color={area.color} />
            </View>
            <View style={styles.overviewRight}>
              <View style={styles.overviewPctRow}>
                <Text style={[styles.overviewPct, { color: area.color }]}>
                  {Math.round(area.progress * 100)}%
                </Text>
                <Text style={styles.overviewLabel}>progresso</Text>
              </View>
              <ProgressBar progress={area.progress} color={area.color} height={10} />
              <Text style={styles.overviewMeta}>
                {area.achieved.length} marcos conquistados
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>CONQUISTADOS</Text>
        <Card style={styles.achievedCard}>
          {area.achieved.map((item, i) => (
            <View key={i} style={[styles.achievedItem, i < area.achieved.length - 1 && styles.itemBorder]}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color={colors.white} />
              </View>
              <Text style={styles.achievedText}>{item}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionLabel}>EM DESENVOLVIMENTO</Text>
        {area.inProgress.map((item, i) => (
          <Card key={i} style={[styles.progressCard, { borderLeftColor: area.color }]}>
            <View style={styles.progressCardRow}>
              <View style={styles.progressCardLeft}>
                <Text style={styles.progressCardTitle}>{item.title}</Text>
                <View style={styles.expectedRow}>
                  <Ionicons name="calendar-outline" size={12} color={colors.text3} />
                  <Text style={styles.progressCardMeta}>Esperado: {item.expected}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.actBtn, { borderColor: area.color }]}>
                <Text style={[styles.actBtnText, { color: area.color }]}>Ver atividades</Text>
                <Ionicons name="arrow-forward" size={12} color={area.color} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <TouchableOpacity style={[styles.reportBtn, { backgroundColor: area.color }]}>
          <Ionicons name="bar-chart-outline" size={18} color={colors.white} />
          <Text style={styles.reportBtnText}>Ver relatório completo</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, paddingHorizontal: spacing.md },
  header: { paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.text1 },
  subtitle: { ...typography.caption, color: colors.text3, marginTop: 2 },
  chipScroll: { marginBottom: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { ...typography.bodyMedium, color: colors.text2 },
  overviewCard: { marginBottom: spacing.md },
  overviewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  overviewIcon: { width: 60, height: 60, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  overviewRight: { flex: 1, gap: spacing.sm },
  overviewPctRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  overviewPct: { fontSize: 32, fontFamily: 'Nunito_700Bold' },
  overviewLabel: { ...typography.caption, color: colors.text3 },
  overviewMeta: { ...typography.caption, color: colors.text3 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.8 },
  achievedCard: { marginBottom: spacing.md },
  achievedItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievedText: { ...typography.body, color: colors.text1 },
  progressCard: { marginBottom: spacing.sm, borderLeftWidth: 4 },
  progressCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressCardLeft: { flex: 1 },
  progressCardTitle: { ...typography.bodyMedium, color: colors.text1 },
  expectedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  progressCardMeta: { ...typography.caption, color: colors.text3 },
  actBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  actBtnText: { ...typography.caption, fontFamily: 'Inter_600SemiBold' },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  reportBtnText: { ...typography.bodySemiBold, color: colors.white },
});
