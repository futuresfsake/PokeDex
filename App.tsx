import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LandingPage from './src/screens/LandingPage';

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

  // LOGIC FLOW:
  // 1. If User is logged in -> Show Profile
  // 2. If User is NOT logged in:
  //    a. If showLanding is true -> Show Landing Page
  //    b. If showLanding is false -> Show Login Screen

  if (!user) {
    if (showLanding) {
      return (
        <LandingPage 
          onLoginPress={() => setShowLanding(false)} 
          onSignUpPress={() => setShowLanding(false)} 
        />
      );
    }
    // We pass navigation={null} to satisfy TypeScript if you haven't fixed the interface yet
    return <LoginScreen navigation={null} />;
  }

  return <ProfileScreen navigation={null} />;
}