import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import { baby } from '../data/mockData';

const menuItems = [
  { icon: 'person-outline' as const,       label: 'Dados do bebê',    sub: 'Nome, data de nascimento, foto' },
  { icon: 'notifications-outline' as const, label: 'Notificações',     sub: 'Lembretes de atividades e registros' },
  { icon: 'people-outline' as const,        label: 'Família',          sub: 'Adicionar cuidadores' },
  { icon: 'share-outline' as const,         label: 'Exportar dados',   sub: 'Compartilhar com pediatra' },
  { icon: 'help-circle-outline' as const,   label: 'Ajuda',            sub: 'FAQ e suporte' },
];

const stats = [
  { value: '18', label: 'Atividades' },
  { value: '7',  label: 'Marcos' },
  { value: '30', label: 'Dias no app' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Perfil</Text>

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
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={14} color={colors.primary} />
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <Card key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h2, color: colors.primary },
  babyInfo: { flex: 1 },
  babyName: { ...typography.h3, color: colors.text1 },
  babyAge: { ...typography.bodyMedium, color: colors.primary, marginTop: 2 },
  birthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  babyBirth: { ...typography.caption, color: colors.text3 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  editBtnText: { ...typography.caption, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: colors.primary },
  statLabel: { ...typography.caption, color: colors.text3, textAlign: 'center', marginTop: 2 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.8 },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuLabel: { ...typography.bodyMedium, color: colors.text1 },
  menuSub: { ...typography.caption, color: colors.text3, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: { ...typography.bodyMedium, color: colors.error },
});
