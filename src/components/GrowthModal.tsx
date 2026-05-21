import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { GrowthRecord, addGrowthRecord, todayStr } from '../utils/storage';
import { pushGrowthRecord } from '../lib/sync';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: (record: GrowthRecord) => void;
}

export default function GrowthModal({ visible, onClose, onSaved }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const canSave = weight.trim() !== '' || height.trim() !== '';

  async function handleSave() {
    const record: GrowthRecord = {
      id: Date.now().toString(),
      date: todayStr(),
      weight: weight.trim() ? parseFloat(weight.replace(',', '.')) : undefined,
      height: height.trim() ? parseFloat(height.replace(',', '.')) : undefined,
    };
    await addGrowthRecord(record);
    pushGrowthRecord(record).catch(() => {});
    onSaved(record);
    setWeight('');
    setHeight('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Registrar Crescimento</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.text3} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputsRow}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIconRow}>
                <Ionicons name="scale-outline" size={18} color={colors.orange} />
                <Text style={styles.inputLabel}>PESO</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.bigInput}
                  placeholder="7,2"
                  placeholderTextColor={colors.text3}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>

            <View style={styles.vertDivider} />

            <View style={styles.inputGroup}>
              <View style={styles.inputIconRow}>
                <Ionicons name="resize-outline" size={18} color={colors.primary} />
                <Text style={styles.inputLabel}>ALTURA</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.bigInput}
                  placeholder="68"
                  placeholderTextColor={colors.text3}
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={setHeight}
                />
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>
          </View>

          <Text style={styles.hint}>Preencha pelo menos um dos campos</Text>

          <TouchableOpacity
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
            <Text style={styles.saveBtnText}>Salvar medidas</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  inputsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background, borderRadius: radius.lg,
    padding: spacing.md, marginVertical: spacing.md,
  },
  inputGroup: { flex: 1, alignItems: 'center', gap: spacing.sm },
  inputIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  inputLabel: { ...typography.label, color: colors.text3, letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  bigInput: {
    fontSize: 36, fontFamily: 'Nunito_700Bold', color: colors.text1,
    minWidth: 60, textAlign: 'center',
  },
  unit: { ...typography.bodyMedium, color: colors.text3 },
  vertDivider: { width: 1, height: 60, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  hint: { ...typography.caption, color: colors.text3, textAlign: 'center', marginBottom: spacing.sm },
  saveBtn: {
    flexDirection: 'row', backgroundColor: colors.orange,
    borderRadius: radius.md, paddingVertical: spacing.md,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginTop: spacing.xs,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...typography.bodySemiBold, color: colors.white },
});
