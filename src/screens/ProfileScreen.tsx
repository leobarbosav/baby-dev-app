import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import GrowthModal from '../components/GrowthModal';
import { useBaby, useBabyUpdate } from '../context/BabyContext';
import { getGrowthRecords, GrowthRecord } from '../utils/storage';

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

const menuItems = [
  { icon: 'notifications-outline' as const, label: 'Notificações',   sub: 'Lembretes de atividades e registros' },
  { icon: 'people-outline' as const,        label: 'Família',         sub: 'Adicionar cuidadores' },
  { icon: 'share-outline' as const,         label: 'Exportar dados',  sub: 'Compartilhar com pediatra' },
  { icon: 'help-circle-outline' as const,   label: 'Ajuda',           sub: 'FAQ e suporte' },
];

function daysOld(birth: Date): number {
  return Math.floor((Date.now() - birth.getTime()) / 86400000);
}

function dateLabel(isoDate: string): string {
  const [, m, d] = isoDate.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

export default function ProfileScreen() {
  const baby = useBaby();
  const updateBaby = useBabyUpdate();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBirth, setEditBirth] = useState(''); // MM/AAAA

  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [vacinasCount, setVacinasCount] = useState(0);

  useEffect(() => {
    getGrowthRecords().then(setGrowthRecords);
    AsyncStorage.getItem('vacinasAplicadas').then(raw => {
      if (raw) setVacinasCount(JSON.parse(raw).length);
    });
  }, []);

  function openEdit() {
    const d = String(baby.birthDateObj.getDate()).padStart(2, '0');
    const m = String(baby.birthDateObj.getMonth() + 1).padStart(2, '0');
    const y = String(baby.birthDateObj.getFullYear());
    setEditName(baby.name);
    setEditBirth(`${d}/${m}/${y}`);
    setEditing(true);
  }

  async function handleSaveEdit() {
    const name = editName.trim();
    const parts = editBirth.split('/');
    const day   = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year  = parseInt(parts[2], 10);
    if (!name || parts.length !== 3 || isNaN(day) || day < 1 || day > 31 || isNaN(month) || month < 1 || month > 12 || isNaN(year) || year < 2020) {
      Alert.alert('Dados inválidos', 'Verifique o nome e a data (DD/MM/AAAA).');
      return;
    }
    await updateBaby(name, day, month - 1, year);
    setEditing(false);
  }

  const lastGrowth = growthRecords[0];
  const stats = [
    { value: String(vacinasCount),        label: 'Vacinas' },
    { value: String(growthRecords.length), label: 'Medidas' },
    { value: String(daysOld(baby.birthDateObj)), label: 'Dias' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Perfil</Text>

        {/* Baby card */}
        <Card style={styles.babyCard}>
          <View style={styles.babyRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{baby.name.charAt(0)}</Text>
            </View>
            <View style={styles.babyInfo}>
              <Text style={styles.babyName}>{baby.name}</Text>
              <Text style={styles.babyAge}>{baby.age}</Text>
              <View style={styles.birthRow}>
                <Ionicons name="calendar-outline" size={12} color={colors.text3} />
                <Text style={styles.babyBirth}>Nasceu em {baby.birthDate}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, editing && styles.editBtnCancel]}
              onPress={editing ? () => setEditing(false) : openEdit}
            >
              <Ionicons
                name={editing ? 'close' : 'pencil-outline'}
                size={14}
                color={editing ? colors.error : colors.primary}
              />
              <Text style={[styles.editBtnText, editing && { color: colors.error }]}>
                {editing ? 'Cancelar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Edit form */}
        {editing && (
          <Card style={styles.editCard}>
            <Text style={styles.fieldLabel}>NOME</Text>
            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            <Text style={styles.fieldLabel}>DATA DE NASCIMENTO (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.textInput}
              value={editBirth}
              onChangeText={setEditBirth}
              placeholder="15/09/2025"
              placeholderTextColor={colors.text3}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
            <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEdit}>
              <Text style={styles.saveEditBtnText}>Salvar alterações</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <Card key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Growth section */}
        <Text style={styles.sectionLabel}>CRESCIMENTO</Text>

        {lastGrowth && (
          <Card style={styles.growthCard}>
            <View style={styles.growthLastRow}>
              {lastGrowth.weight !== undefined && (
                <View style={styles.growthStat}>
                  <Ionicons name="scale-outline" size={20} color={colors.orange} />
                  <Text style={styles.growthStatValue}>{lastGrowth.weight} kg</Text>
                  <Text style={styles.growthStatLabel}>Último peso</Text>
                </View>
              )}
              {lastGrowth.weight !== undefined && lastGrowth.height !== undefined && (
                <View style={styles.growthDivider} />
              )}
              {lastGrowth.height !== undefined && (
                <View style={styles.growthStat}>
                  <Ionicons name="resize-outline" size={20} color={colors.primary} />
                  <Text style={styles.growthStatValue}>{lastGrowth.height} cm</Text>
                  <Text style={styles.growthStatLabel}>Última altura</Text>
                </View>
              )}
            </View>

            {growthRecords.length > 1 && (
              <View style={styles.growthHistory}>
                <Text style={styles.growthHistTitle}>HISTÓRICO</Text>
                {growthRecords.slice(0, 5).map((r, i) => (
                  <View
                    key={r.id}
                    style={[styles.growthHistItem, i < Math.min(growthRecords.length, 5) - 1 && styles.growthHistBorder]}
                  >
                    <Text style={styles.growthHistDate}>{dateLabel(r.date)}</Text>
                    <View style={styles.growthHistValues}>
                      {r.weight !== undefined && (
                        <Text style={styles.growthHistValue}>{r.weight} kg</Text>
                      )}
                      {r.height !== undefined && (
                        <Text style={styles.growthHistValue}>{r.height} cm</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        <TouchableOpacity
          style={styles.addGrowthBtn}
          onPress={() => setShowGrowthModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.orange} />
          <Text style={styles.addGrowthBtnText}>Registrar crescimento</Text>
        </TouchableOpacity>

        {/* Menu */}
        <Text style={styles.sectionLabel}>CONFIGURAÇÕES</Text>
        <Card style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.border} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

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
  scroll: { flex: 1, paddingHorizontal: spacing.md },
  title: { ...typography.h2, color: colors.text1, paddingVertical: spacing.lg },
  babyCard: { marginBottom: spacing.md },
  babyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...typography.h2, color: colors.primary },
  babyInfo: { flex: 1 },
  babyName: { ...typography.h3, color: colors.text1 },
  babyAge: { ...typography.bodyMedium, color: colors.primary, marginTop: 2 },
  birthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  babyBirth: { ...typography.caption, color: colors.text3 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: colors.primary,
    borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 6,
  },
  editBtnCancel: { borderColor: colors.error },
  editBtnText: { ...typography.caption, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  editCard: { marginBottom: spacing.md, gap: spacing.xs },
  fieldLabel: { ...typography.label, color: colors.text3, letterSpacing: 0.5, marginTop: spacing.sm },
  textInput: {
    ...typography.body, color: colors.text1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
  },
  saveEditBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: spacing.sm + 2, alignItems: 'center', marginTop: spacing.sm,
  },
  saveEditBtnText: { ...typography.bodySemiBold, color: colors.white },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: colors.primary },
  statLabel: { ...typography.caption, color: colors.text3, textAlign: 'center', marginTop: 2 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.8 },
  growthCard: { marginBottom: spacing.sm },
  growthLastRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: spacing.sm },
  growthStat: { alignItems: 'center', gap: spacing.xs },
  growthStatValue: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: colors.text1 },
  growthStatLabel: { ...typography.caption, color: colors.text3 },
  growthDivider: { width: 1, height: 48, backgroundColor: colors.border },
  growthHistory: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.sm, paddingTop: spacing.sm },
  growthHistTitle: { ...typography.label, color: colors.text3, letterSpacing: 0.5, marginBottom: spacing.xs },
  growthHistItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  growthHistBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  growthHistDate: { ...typography.bodyMedium, color: colors.text2 },
  growthHistValues: { flexDirection: 'row', gap: spacing.md },
  growthHistValue: { ...typography.bodyMedium, color: colors.primary },
  addGrowthBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, borderWidth: 1.5, borderColor: colors.orange,
    borderRadius: radius.md, paddingVertical: spacing.sm,
    marginBottom: spacing.lg, borderStyle: 'dashed',
  },
  addGrowthBtnText: { ...typography.bodyMedium, color: colors.orange },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuLabel: { ...typography.bodyMedium, color: colors.text1 },
  menuSub: { ...typography.caption, color: colors.text3, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginTop: spacing.md,
    borderRadius: radius.md, paddingVertical: spacing.md,
    borderWidth: 1, borderColor: colors.error,
  },
  logoutText: { ...typography.bodyMedium, color: colors.error },
});
