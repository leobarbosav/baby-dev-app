import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card';
import VacinaCard from '../components/VacinaCard';
import { useBaby } from '../context/BabyContext';
import { calcularCartao, VacinaComStatus } from '../data/vacinasData';

const STORAGE_KEY = 'vacinasAplicadas';

export default function VacinasScreen() {
  const baby = useBaby();
  const [vacinas, setVacinas] = useState<VacinaComStatus[]>(() =>
    calcularCartao(baby.birthDateObj)
  );
  const [aplicadasVisiveis, setAplicadasVisiveis] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      if (!stored) return;
      const ids: string[] = JSON.parse(stored);
      setVacinas(prev =>
        prev.map(v => ids.includes(v.id) ? { ...v, status: 'aplicada', diasParaData: 0 } : v)
      );
    });
  }, []);

  const aplicadas = vacinas.filter(v => v.status === 'aplicada');
  const pendentes  = vacinas.filter(v => v.status === 'pendente').sort((a, b) => a.diasParaData - b.diasParaData);
  const atrasadas  = vacinas.filter(v => v.status === 'atrasada').sort((a, b) => a.diasParaData - b.diasParaData);
  const proximas30 = pendentes.filter(v => v.diasParaData <= 30);

  const handleMarcarAplicada = (id: string) => {
    setVacinas(prev => {
      const next = prev.map(v =>
        v.id === id ? { ...v, status: 'aplicada' as const, diasParaData: 0 } : v
      );
      const ids = next.filter(v => v.status === 'aplicada').map(v => v.id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      return next;
    });
  };

  const handleVerDetalhe = (v: VacinaComStatus) => {
    Alert.alert(
      `${v.nome} — ${v.dose}`,
      `Previne: ${v.doencaPrevine}\nIdade indicada: ${v.idadeLabel}`,
      [{ text: 'Fechar', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Cartão de Vacinas</Text>
          <Text style={styles.subtitle}>{baby.name} • {baby.age}</Text>
        </View>

        {/* Resumo */}
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, styles.summaryGreen]}>
            <Text style={styles.summaryValue}>{aplicadas.length}</Text>
            <Text style={[styles.summaryLabel, { color: '#2D7A47' }]}>Aplicadas</Text>
          </Card>
          <Card style={[styles.summaryCard, styles.summaryYellow]}>
            <Text style={[styles.summaryValue, { color: '#854D0E' }]}>{proximas30.length}</Text>
            <Text style={[styles.summaryLabel, { color: '#854D0E' }]}>Próximas</Text>
          </Card>
          <Card style={[styles.summaryCard, atrasadas.length > 0 ? styles.summaryRed : styles.summaryNeutral]}>
            <Text style={[styles.summaryValue, atrasadas.length > 0 && { color: '#991B1B' }]}>
              {atrasadas.length}
            </Text>
            <Text style={[styles.summaryLabel, atrasadas.length > 0 && { color: '#991B1B' }]}>
              Atrasadas
            </Text>
          </Card>
        </View>

        {/* Atenção — vacinas atrasadas */}
        {atrasadas.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={16} color="#991B1B" />
              <Text style={[styles.sectionLabel, { color: '#991B1B' }]}>
                ATENÇÃO ({atrasadas.length})
              </Text>
            </View>
            {atrasadas.map(v => (
              <VacinaCard
                key={v.id}
                vacina={v}
                onPress={() => handleVerDetalhe(v)}
                onMarcarAplicada={() => handleMarcarAplicada(v.id)}
              />
            ))}
          </>
        )}

        {/* Próximas vacinas */}
        {pendentes.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>PRÓXIMAS VACINAS</Text>
            {pendentes.map(v => (
              <VacinaCard
                key={v.id}
                vacina={v}
                onPress={() => handleVerDetalhe(v)}
                onMarcarAplicada={() => handleMarcarAplicada(v.id)}
              />
            ))}
          </>
        )}

        {/* Já aplicadas — colapsável */}
        {aplicadas.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setAplicadasVisiveis(v => !v)}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.green} />
              <Text style={[styles.sectionLabel, { color: colors.green }]}>
                JÁ APLICADAS ({aplicadas.length})
              </Text>
              <Ionicons
                name={aplicadasVisiveis ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.text3}
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {aplicadasVisiveis && aplicadas.map(v => (
              <VacinaCard
                key={v.id}
                vacina={v}
                onPress={() => handleVerDetalhe(v)}
                onMarcarAplicada={() => handleMarcarAplicada(v.id)}
              />
            ))}
          </>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.background },
  scroll:      { flex: 1, paddingHorizontal: spacing.md },
  header:      { paddingVertical: spacing.lg },
  title:       { ...typography.h2, color: colors.text1 },
  subtitle:    { ...typography.caption, color: colors.text3, marginTop: 2 },
  summaryRow:  { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  summaryCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  summaryGreen:   { backgroundColor: '#E6F4EA' },
  summaryYellow:  { backgroundColor: '#FEF9C3' },
  summaryRed:     { backgroundColor: '#FEE2E2' },
  summaryNeutral: { backgroundColor: colors.white },
  summaryValue: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: colors.text1 },
  summaryLabel: { ...typography.caption, color: colors.text3, textAlign: 'center', marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text3,
    letterSpacing: 0.8,
  },
});
