// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './src/screens/LoginScreen';
import LandingPage from './src/screens/LandingPage';
import TabNavigator from './src/navigation/TabNavigator';
import ProfileScreen from './src/screens/ProfileScreen'; // optional fallback

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // State to determine if we show the Landing Page or the Login Screen
  const [showLanding, setShowLanding] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        showLanding ? (
          <LandingPage
            onLoginPress={() => setShowLanding(false)}
            onSignUpPress={() => setShowLanding(false)}
          />
        ) : (
          // When using React Navigation you should pass navigation prop from navigator.
          // If you prefer to keep LoginScreen as a plain component for now, you can wrap it in a simple stack later.
          <LoginScreen navigation={null} />
        )
      ) : (
        // After login, show the Tab Navigator
        <TabNavigator />
      )}
    </NavigationContainer>
  );
}
