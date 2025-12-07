import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from "react-native";

import Geolocation from "@react-native-community/geolocation";
import MapView, { Marker } from "react-native-maps";

// Basic biome-based Pokémon list
const BIOME_POKEMON = {
  urban: ["rattata", "magnemite", "grimer", "voltorb"],
  rural: ["pidgey", "caterpie", "oddish", "bellsprout"],
  water: ["psyduck", "magikarp", "tentacool"],
};

// Get Pokémon sprite
const getPokemonImage = (name: string) =>
  `https://img.pokemondb.net/sprites/home/normal/${name}.png`;

export default function HuntScreen() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [pokemonSpawns, setPokemonSpawns] = useState<any[]>([]);

  // Ask permission on Android
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log("Location permission denied");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocation(coords);
        generatePokemon(coords);
      },
      (error) => {
        console.log("Error:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Simple biome logic
  const detectBiome = (lat: number, lon: number) => {
    if (Math.abs(lon % 5) < 1) return "water";
    if (lat > 10 && lon > 120) return "urban";
    return "rural";
  };

  // Spawn Pokémon on the map
  const generatePokemon = (coords: { lat: number; lon: number }) => {
    const biome = detectBiome(coords.lat, coords.lon);
    const biomeList = BIOME_POKEMON[biome];

    const spawns = Array.from({ length: 5 }).map(() => {
      const pokemon = biomeList[Math.floor(Math.random() * biomeList.length)];
      return {
        name: pokemon,
        latitude: coords.lat + (Math.random() - 0.5) * 0.003,
        longitude: coords.lon + (Math.random() - 0.5) * 0.003,
        image: getPokemonImage(pokemon),
      };
    });

    setPokemonSpawns(spawns);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hunt Mode</Text>

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.lat,
            longitude: location.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* User location marker */}
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lon,
            }}
            title="You"
            pinColor="blue"
          />

          {/* Pokémon markers */}
          {pokemonSpawns.map((p, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.name.toUpperCase()}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: p.image }}
                  style={{ width: 45, height: 45 }}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {!location && <Text>Getting location...</Text>}

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Refresh Hunt</Text>
      </TouchableOpacity>
    </View>
  );
}

import { Image } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
  map: {
    width: "100%",
    height: "80%",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});
