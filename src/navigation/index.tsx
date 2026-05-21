import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import RecordsScreen from '../screens/RecordsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import VacinasScreen from '../screens/VacinasScreen';
import ProfileScreen from '../screens/ProfileScreen';

import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import BabyInfoScreen from '../screens/onboarding/BabyInfoScreen';
import AllSetScreen from '../screens/onboarding/AllSetScreen';

const Tab = createBottomTabNavigator();
type IconName = keyof typeof Ionicons.glyphMap;

const tabs: {
  name: string;
  label: string;
  icon: IconName;
  iconActive: IconName;
  component: React.ComponentType;
}[] = [
  { name: 'Home',       label: 'Início',     icon: 'home-outline',          iconActive: 'home',          component: HomeScreen },
  { name: 'Activities', label: 'Atividades', icon: 'rocket-outline',        iconActive: 'rocket',        component: ActivitiesScreen },
  { name: 'Records',    label: 'Registros',  icon: 'clipboard-outline',     iconActive: 'clipboard',     component: RecordsScreen },
  { name: 'Progress',   label: 'Progresso',  icon: 'trending-up-outline',   iconActive: 'trending-up',   component: ProgressScreen },
  { name: 'Vacinas',    label: 'Vacinas',    icon: 'medical-outline',       iconActive: 'medical',       component: VacinasScreen },
  { name: 'Profile',    label: 'Perfil',     icon: 'person-circle-outline', iconActive: 'person-circle', component: ProfileScreen },
];

type OnboardingStep = 'loading' | 'welcome' | 'babyInfo' | 'allSet' | 'done';

export default function Navigation() {
  const [step, setStep] = useState<OnboardingStep>('loading');
  const [babyName,  setBabyName]  = useState('');
  const [babyMonth, setBabyMonth] = useState(0);
  const [babyYear,  setBabyYear]  = useState(new Date().getFullYear());

  useEffect(() => {
    AsyncStorage.getItem('onboardingDone').then(val => {
      setStep(val === 'true' ? 'done' : 'welcome');
    });
  }, []);

  const handleBabyInfo = (name: string, month: number, year: number) => {
    setBabyName(name);
    setBabyMonth(month);
    setBabyYear(year);
    setStep('allSet');
  };

  const handleFinish = async () => {
    await AsyncStorage.multiSet([
      ['onboardingDone', 'true'],
      ['babyName',  babyName],
      ['babyMonth', String(babyMonth)],
      ['babyYear',  String(babyYear)],
    ]);
    setStep('done');
  };

  if (step === 'loading') {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (step === 'welcome') {
    return <WelcomeScreen onNext={() => setStep('babyInfo')} />;
  }

  if (step === 'babyInfo') {
    return (
      <BabyInfoScreen
        onNext={handleBabyInfo}
        onBack={() => setStep('welcome')}
      />
    );
  }

  if (step === 'allSet') {
    return (
      <AllSetScreen
        name={babyName}
        month={babyMonth}
        year={babyYear}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text3,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => {
            const tab = tabs.find(t => t.name === route.name)!;
            return (
              <Ionicons
                name={focused ? tab.iconActive : tab.icon}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        {tabs.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{ tabBarLabel: tab.label }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    ...typography.label,
    marginTop: 0,
  },
});
