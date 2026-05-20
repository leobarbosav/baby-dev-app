import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import Card from '../components/Card';
import { baby } from '../data/mockData';

const menuItems = [
  { icon: '👶', label: 'Dados do bebê', sub: 'Nome, data de nascimento, foto' },
  { icon: '🔔', label: 'Notificações', sub: 'Lembretes de atividades e registros' },
  { icon: '👩‍👧', label: 'Família', sub: 'Adicionar cuidadores' },
  { icon: '📊', label: 'Exportar dados', sub: 'Compartilhar com pediatra' },
  { icon: '❓', label: 'Ajuda', sub: 'FAQ e suporte' },
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
              <Text style={styles.babyBirth}>Nasceu em {baby.birthDate}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Atividades feitas</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Marcos conquistados</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>30</Text>
            <Text style={styles.statLabel}>Dias no app</Text>
          </Card>
        </View>

        <Text style={styles.sectionLabel}>CONFIGURAÇÕES</Text>
        <Card style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutBtn}>
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
  babyBirth: { ...typography.caption, color: colors.text3, marginTop: 2 },
  editBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  editBtnText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { ...typography.h2, color: colors.primary, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.text3, textAlign: 'center', marginTop: 2 },
  sectionLabel: { ...typography.label, color: colors.text3, marginVertical: spacing.sm, letterSpacing: 0.5 },
  menuCard: { padding: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: { fontSize: 22, width: 32 },
  menuInfo: { flex: 1 },
  menuLabel: { ...typography.bodyMedium, color: colors.text1 },
  menuSub: { ...typography.caption, color: colors.text3, marginTop: 2 },
  menuArrow: { fontSize: 20, color: colors.text3 },
  logoutBtn: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: { ...typography.bodyMedium, color: colors.error },
});
