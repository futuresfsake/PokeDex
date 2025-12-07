import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HuntScreen from '../screens/HuntScreen';
import PokedexScreen from '../screens/PokedexScreen';
import ARScreen from '../screens/ARScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#35bd28ff',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { height: 60, paddingBottom: 6 },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Hunt') iconName = 'search-outline';
          else if (route.name === 'PokeDex') iconName = 'book-outline';
          else if (route.name === 'AR') iconName = 'scan-outline';
          else if (route.name === 'Feed') iconName = 'share-outline';
          else if (route.name === 'Profile') iconName = 'person-circle-outline';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Hunt" component={HuntScreen} />
      <Tab.Screen name="PokeDex" component={PokedexScreen} />
      <Tab.Screen name="AR" component={ARScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
