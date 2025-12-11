// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomePageScreen from '../screens/HomePageScreen';
import HuntScreen from '../screens/HuntScreen';
import PokedexScreen from '../screens/PokedexScreen';
import ARScreen from '../screens/ARScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PokedexStack() {
  return (
    <Stack.Navigator initialRouteName="PokedexMain">
      <Stack.Screen
        name="PokedexMain"
        component={PokedexScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Pokemon Details',
          headerStyle: { backgroundColor: '#16a134ff' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#35bd28ff',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { height: 60, paddingBottom: 6 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Hunt') iconName = 'search-outline';
          else if (route.name === 'Pokedex') iconName = 'book-outline';
          else if (route.name === 'AR') iconName = 'scan-outline';
          else if (route.name === 'Feed') iconName = 'share-outline';
          else if (route.name === 'Profile') iconName = 'person-circle-outline';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePageScreen} />
      <Tab.Screen name="Hunt" component={HuntScreen} />

      {/* This mounts the stack that contains PokedexMain + Details */}
      <Tab.Screen name="Pokedex" component={PokedexStack} />

      <Tab.Screen name="AR" component={ARScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
