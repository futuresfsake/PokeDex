import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";

const TYPE_COLORS: { [key: string]: string } = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function DetailsScreen({ route }) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  const startShimmer = () => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    startShimmer();
  }, []);

  const fetchPokemon = async () => {
    const cacheKey = `pokemon_${id}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setPokemon(JSON.parse(cached));
        setLoading(false);
      }

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      setPokemon(data);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.log("Offline mode - using cached data only.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (loading || !pokemon) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  const headerColors =
    pokemon.types.length > 1
      ? pokemon.types.map((t: any) => TYPE_COLORS[t.type.name] || "#777")
      : [
          TYPE_COLORS[pokemon.types[0].type.name] || "#16a134",
          TYPE_COLORS[pokemon.types[0].type.name] || "#16a134",
        ];

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-windowWidth, windowWidth],
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header / Name */}
      <LinearGradient
        colors={headerColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // Diagonal gradient
        style={styles.header}
      >
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.sprite}
        />
        {/* Shimmer Overlay */}
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Types</Text>
        <View style={styles.row}>
          {pokemon.types.map((t: any) => (
            <View
              key={t.type.name}
              style={[styles.badge, { backgroundColor: TYPE_COLORS[t.type.name] || "#777" }]}
            >
              <Text style={styles.badgeText}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((a: any) => (
            <View key={a.ability.name} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{a.ability.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Stats</Text>
        {pokemon.stats.map((s: any) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name.toUpperCase()}</Text>
            <View style={styles.statBarBackground}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${Math.min(s.base_stat, 100)}%`,
                    backgroundColor: TYPE_COLORS[pokemon.types[0].type.name] || "#16a134",
                  },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    overflow: "hidden", // To keep shimmer inside
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    transform: [{ rotate: "20deg" }],
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  sprite: {
    width: 150,
    height: 150,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  abilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  abilityCard: {
    flexBasis: "48%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  abilityName: {
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontSize: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statName: {
    width: 90,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 8,
  },
  statBar: {
    height: 10,
    borderRadius: 5,
  },
  statValue: {
    width: 35,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
