import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { developmentAreas, baby } from '../data/mockData';

export default function ProgressScreen() {
  const [selectedArea, setSelectedArea] = useState(developmentAreas[0].key);
  const area = developmentAreas.find(a => a.key === selectedArea)!;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Desenvolvimento</Text>
          <Text style={styles.subtitle}>{baby.name} • {baby.age} • 🌱</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.areaScroll}>
          {developmentAreas.map(a => (
            <TouchableOpacity
              key={a.key}
              style={[styles.areaChip, selectedArea === a.key && { backgroundColor: a.color }]}
              onPress={() => setSelectedArea(a.key)}
            >
              <Text style={[styles.areaChipText, selectedArea === a.key && { color: colors.white }]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Card style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewLeft}>
              <Text style={[styles.overviewPct, { color: area.color }]}>
                {Math.round(area.progress * 100)}%
              </Text>
              <Text style={styles.overviewLabel}>progresso</Text>
            </View>
            <View style={styles.overviewRight}>
              <ProgressBar progress={area.progress} color={area.color} height={12} />
              <Text style={styles.overviewMeta}>
                {area.achieved.length} marcos conquistados
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>🏆 CONQUISTADOS</Text>
        <Card style={styles.achievedCard}>
          {area.achieved.map((item, i) => (
            <View key={i} style={[styles.achievedItem, i < area.achieved.length - 1 && styles.itemBorder]}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.achievedText}>{item}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionLabel}>⏳ EM DESENVOLVIMENTO</Text>
        {area.inProgress.map((item, i) => (
          <Card key={i} style={styles.progressCard}>
            <View style={styles.progressCardRow}>
              <View style={styles.progressCardLeft}>
                <Text style={styles.progressCardTitle}>{item.title}</Text>
                <Text style={styles.progressCardMeta}>Esperado: {item.expected}</Text>
              </View>
              <TouchableOpacity style={[styles.actBtn, { borderColor: area.color }]}>
                <Text style={[styles.actBtnText, { color: area.color }]}>Ver atividades →</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <TouchableOpacity style={[styles.reportBtn, { backgroundColor: area.color }]}>
          <Text style={styles.reportBtnText}>📈 Ver relatório completo</Text>
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
  areaScroll: { marginBottom: spacing.md },
  areaChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  areaChipText: { ...typography.bodyMedium, color: colors.text2 },
  overviewCard: { marginBottom: spacing.md },
  overviewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  overviewLeft: { alignItems: 'center', minWidth: 64 },
  overviewPct: { ...typography.h1, fontWeight: '700' },
  overviewLabel: { ...typography.caption, color: colors.text3 },
  overviewRight: { flex: 1, gap: spacing.sm },
  overviewMeta: { ...typography.caption, color: colors.text3 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.5 },
  achievedCard: { marginBottom: spacing.md },
  achievedItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  checkIcon: { fontSize: 18 },
  achievedText: { ...typography.body, color: colors.text1 },
  progressCard: { marginBottom: spacing.sm },
  progressCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressCardLeft: { flex: 1 },
  progressCardTitle: { ...typography.bodyMedium, color: colors.text1 },
  progressCardMeta: { ...typography.caption, color: colors.text3, marginTop: 2 },
  actBtn: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  actBtnText: { ...typography.caption, fontWeight: '600' },
  reportBtn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  reportBtnText: { ...typography.bodyMedium, color: colors.white },
});
