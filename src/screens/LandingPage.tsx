import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';

interface LandingPageProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

export default function LandingPage({ onLoginPress, onSignUpPress }: LandingPageProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Section with Title */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {/* Simple CSS Pokeball representation */}
          <View style={styles.pokeballTop} />
          <View style={styles.pokeballBottom} />
          <View style={styles.pokeballCenter} />
        </View>
        <Text style={styles.title}>PokeExplorer</Text>
        <Text style={styles.subtitle}>Gotta discover 'em all!</Text>
      </View>

      {/* Description */}
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          Explore the real world, find hidden Pokémon, and build your ultimate collection.
        </Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={onSignUpPress}>
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokeballTop: {
    position: 'absolute',
    top: 0,
    width: 80,
    height: 40,
    backgroundColor: '#e3350d',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  pokeballBottom: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  pokeballCenter: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 8,
    borderColor: '#333',
    zIndex: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  infoContainer: {
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  loginButton: {
    backgroundColor: '#e3350d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#e3350d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e3350d',
  },
  signupText: {
    color: '#e3350d',
    fontSize: 18,
    fontWeight: 'bold',
  },
});