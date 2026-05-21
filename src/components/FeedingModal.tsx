import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { FeedingRecord, addFeedingRecord, todayStr } from '../utils/storage';

const TYPES = ['Amamentação', 'Mamadeira', 'Papa', 'Sólidos'];

const AMOUNT_PLACEHOLDER: Record<string, string> = {
  'Amamentação': 'Ex: 20 min',
  'Mamadeira': 'Ex: 150 ml',
  'Papa': 'Ex: 180g',
  'Sólidos': 'Ex: meia fruta',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: (record: FeedingRecord) => void;
}

function fmt(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function FeedingModal({ visible, onClose, onSaved }: Props) {
  const [type, setType] = useState(TYPES[0]);
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(() => new Date());
  const [showPicker, setShowPicker] = useState(false);

  async function handleSave() {
    const record: FeedingRecord = {
      id: Date.now().toString(),
      date: todayStr(),
      time: fmt(time),
      type,
      amount: amount.trim() || '—',
    };
    await addFeedingRecord(record);
    onSaved(record);
    setAmount('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Registrar Alimentação</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.text3} />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>TIPO</Text>
          <View style={styles.chipsRow}>
            {TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, type === t && styles.chipActive]}
                onPress={() => setType(t)}
              >
                <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>
            QUANTIDADE <Text style={styles.optional}>(opcional)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={AMOUNT_PLACEHOLDER[type]}
            placeholderTextColor={colors.text3}
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={[styles.timeRow, showPicker && styles.timeRowActive]}
            onPress={() => setShowPicker(v => !v)}
          >
            <Ionicons name="time-outline" size={20} color={showPicker ? colors.primary : colors.text3} />
            <Text style={styles.timeLabel}>Horário</Text>
            <Text style={[styles.timeValue, showPicker && { color: colors.primary }]}>{fmt(time)}</Text>
            <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text3} />
          </TouchableOpacity>

          {showPicker && (
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour
                display="spinner"
                onChange={(_, d) => { if (d) setTime(d); }}
              />
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
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
  fieldLabel: {
    ...typography.label, color: colors.text3,
    letterSpacing: 0.6, marginBottom: spacing.sm, marginTop: spacing.sm,
  },
  optional: { fontFamily: 'Inter_400Regular', color: colors.textDisabled, letterSpacing: 0 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
  },
  chipActive: { borderColor: colors.green, backgroundColor: colors.greenLight },
  chipText: { ...typography.bodyMedium, color: colors.text2 },
  chipTextActive: { color: colors.green },
  input: {
    ...typography.body, color: colors.text1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
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
    flexDirection: 'row', backgroundColor: colors.green,
    borderRadius: radius.md, paddingVertical: spacing.md,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginTop: spacing.md,
  },
  saveBtnText: { ...typography.bodySemiBold, color: colors.white },
});
