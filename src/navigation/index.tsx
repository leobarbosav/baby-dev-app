import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import RecordsScreen from '../screens/RecordsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

type IconName = keyof typeof Ionicons.glyphMap;

const tabs: {
  name: string;
  label: string;
  icon: IconName;
  iconActive: IconName;
  component: React.ComponentType;
}[] = [
  { name: 'Home',       label: 'Início',    icon: 'home-outline',         iconActive: 'home',         component: HomeScreen },
  { name: 'Activities', label: 'Atividades', icon: 'rocket-outline',      iconActive: 'rocket',       component: ActivitiesScreen },
  { name: 'Records',    label: 'Registros', icon: 'clipboard-outline',    iconActive: 'clipboard',    component: RecordsScreen },
  { name: 'Progress',   label: 'Progresso', icon: 'trending-up-outline',  iconActive: 'trending-up',  component: ProgressScreen },
  { name: 'Profile',    label: 'Perfil',    icon: 'person-circle-outline', iconActive: 'person-circle', component: ProfileScreen },
];

export default function Navigation() {
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
