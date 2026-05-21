import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { SleepRecord, addSleepRecord, todayStr } from '../utils/storage';
import { pushSleepRecord } from '../lib/sync';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: (record: SleepRecord) => void;
}

function fmt(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function SleepModal({ visible, onClose, onSaved }: Props) {
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() - 1, 0, 0, 0);
    return d;
  });
  const [end, setEnd] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    return d;
  });
  const [activeField, setActiveField] = useState<'start' | 'end' | null>(null);

  const durationMins = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const h = Math.floor(durationMins / 60);
  const m = durationMins % 60;
  const durationLabel = durationMins > 0
    ? `${h > 0 ? `${h}h ` : ''}${m > 0 || h === 0 ? `${m}min` : ''}`
    : '--';

  async function handleSave() {
    const record: SleepRecord = {
      id: Date.now().toString(),
      date: todayStr(),
      start: fmt(start),
      end: fmt(end),
      duration: durationMins,
    };
    await addSleepRecord(record);
    pushSleepRecord(record).catch(() => {});
    onSaved(record);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Registrar Sono</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.text3} />
            </TouchableOpacity>
          </View>

          <View style={styles.durationBox}>
            <View style={styles.iconWrap}>
              <Ionicons name="moon" size={28} color={colors.purple} />
            </View>
            <Text style={styles.durationValue}>{durationLabel}</Text>
            <Text style={styles.durationSub}>duração total</Text>
          </View>

          <TouchableOpacity
            style={[styles.timeRow, activeField === 'start' && styles.timeRowActive]}
            onPress={() => setActiveField(prev => prev === 'start' ? null : 'start')}
          >
            <Ionicons name="play-circle-outline" size={20} color={activeField === 'start' ? colors.primary : colors.text3} />
            <Text style={styles.timeLabel}>Início</Text>
            <Text style={[styles.timeValue, activeField === 'start' && { color: colors.primary }]}>{fmt(start)}</Text>
            <Ionicons name={activeField === 'start' ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text3} />
          </TouchableOpacity>

          {activeField === 'start' && (
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={start}
                mode="time"
                is24Hour
                display="spinner"
                onChange={(_, d) => { if (d) setStart(d); }}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.timeRow, activeField === 'end' && styles.timeRowActive]}
            onPress={() => setActiveField(prev => prev === 'end' ? null : 'end')}
          >
            <Ionicons name="stop-circle-outline" size={20} color={activeField === 'end' ? colors.primary : colors.text3} />
            <Text style={styles.timeLabel}>Fim</Text>
            <Text style={[styles.timeValue, activeField === 'end' && { color: colors.primary }]}>{fmt(end)}</Text>
            <Ionicons name={activeField === 'end' ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text3} />
          </TouchableOpacity>

          {activeField === 'end' && (
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={end}
                mode="time"
                is24Hour
                display="spinner"
                onChange={(_, d) => { if (d) setEnd(d); }}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, durationMins <= 0 && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={durationMins <= 0}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
            <Text style={styles.saveBtnText}>Salvar registro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
    ...shadows.modal,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md,
  },
  title: { ...typography.h3, color: colors.text1 },
  durationBox: {
    alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.xs,
  },
  iconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.purpleLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  durationValue: { fontSize: 40, fontFamily: 'Nunito_700Bold', color: colors.text1 },
  durationSub: { ...typography.caption, color: colors.text3 },
  timeRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.md, paddingHorizontal: spacing.sm,
    borderRadius: radius.md, marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  timeRowActive: { backgroundColor: colors.primaryLight },
  timeLabel: { ...typography.bodyMedium, color: colors.text2, flex: 1 },
  timeValue: { ...typography.h3, color: colors.text1 },
  pickerWrap: { marginHorizontal: -spacing.md, backgroundColor: colors.background },
  saveBtn: {
    flexDirection: 'row', backgroundColor: colors.purple,
    borderRadius: radius.md, paddingVertical: spacing.md,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginTop: spacing.md,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...typography.bodySemiBold, color: colors.white },
});
