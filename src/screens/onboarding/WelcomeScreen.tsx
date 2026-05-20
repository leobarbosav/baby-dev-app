import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';

const { height } = Dimensions.get('window');

type Props = { onNext: () => void };

const features = [
  { icon: 'rocket-outline' as const,      text: 'Atividades diárias personalizadas' },
  { icon: 'trending-up-outline' as const, text: 'Acompanhe marcos de desenvolvimento' },
  { icon: 'clipboard-outline' as const,   text: 'Registre sono e alimentação' },
];

export default function WelcomeScreen({ onNext }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.top}>
          <View style={styles.iconWrap}>
            <Ionicons name="heart" size={52} color={colors.primary} />
          </View>
          <Text style={styles.appName}>BabyDev</Text>
          <Text style={styles.tagline}>
            Acompanhe o desenvolvimento{'\n'}do seu bebê com carinho
          </Text>
        </View>

        <View style={styles.features}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.btn} onPress={onNext}>
            <Text style={styles.btnText}>Começar</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.hint}>Leva menos de 1 minuto</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingVertical: spacing.xl },
  top: { alignItems: 'center', marginTop: height * 0.04 },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: { fontSize: 36, fontFamily: 'Nunito_700Bold', color: colors.text1, marginBottom: spacing.sm },
  tagline: { ...typography.body, color: colors.text3, textAlign: 'center', lineHeight: 24 },
  features: { gap: spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { ...typography.bodyMedium, color: colors.text1, flex: 1 },
  bottom: { alignItems: 'center', gap: spacing.sm },
  btn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  btnText: { ...typography.bodySemiBold, color: colors.white, fontSize: 17 },
  hint: { ...typography.caption, color: colors.text3 },
});
