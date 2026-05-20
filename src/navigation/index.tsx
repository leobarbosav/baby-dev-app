import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';
import { colors, typography } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import RecordsScreen from '../screens/RecordsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabs = [
  { name: 'Home',       label: 'Início',      icon: '🏠', component: HomeScreen },
  { name: 'Activities', label: 'Atividades',   icon: '🎯', component: ActivitiesScreen },
  { name: 'Records',    label: 'Registros',    icon: '📝', component: RecordsScreen },
  { name: 'Progress',   label: 'Progresso',    icon: '📊', component: ProgressScreen },
  { name: 'Profile',    label: 'Perfil',       icon: '👤', component: ProfileScreen },
];

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={styles.icon}>{icon}</Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text3,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        {tabs.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarLabel: tab.label,
              tabBarIcon: ({ focused }) => <TabIcon icon={tab.icon} focused={focused} />,
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 8,
  },
  tabLabel: { ...typography.label, marginTop: 2 },
  iconWrap: { alignItems: 'center' },
  icon: { fontSize: 22 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
});
