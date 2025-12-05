import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { getCurrentUser, signOut } from '../config/firebase';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const user = getCurrentUser();
  const [stats, setStats] = useState({
    discovered: 12, // Dummy data for now
    seen: 45,
    rank: 'Novice Trainer'
  });

  // Dummy data for "Discovered Pokemon" list
  const discoveredPokemon = [
    { id: '1', name: 'Bulbasaur', type: 'Grass' },
    { id: '4', name: 'Charmander', type: 'Fire' },
    { id: '7', name: 'Squirtle', type: 'Water' },
  ];

  const handleLogout = async () => {
    await signOut();
    // navigation.replace('Login'); 
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.email ? user.email[0].toUpperCase() : 'T'}
          </Text>
        </View>
        <Text style={styles.emailText}>{user?.email || 'Trainer'}</Text>
        <Text style={styles.rankText}>{stats.rank}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.discovered}</Text>
          <Text style={styles.statLabel}>Caught</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.seen}</Text>
          <Text style={styles.statLabel}>Seen</Text>
        </View>
      </View>

      {/* Recent Discoveries Title */}
      <Text style={styles.sectionTitle}>Recent Discoveries</Text>

      {/* List */}
      <FlatList
        data={discoveredPokemon}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.pokeballIcon} /> 
            <Text style={styles.pokemonName}>{item.name}</Text>
            <Text style={styles.pokemonType}>{item.type}</Text>
          </View>
        )}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b4cca', // Pokemon Blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pokeballIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e3350d',
    marginRight: 15,
  },
  pokemonName: {
    fontSize: 16,
    flex: 1,
  },
  pokemonType: {
    fontSize: 14,
    color: '#888',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#333',
    fontWeight: '600',
  }
});