import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
}

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

const CARD_MARGIN = 5;

export default function PokedexScreen() {
  const navigation = useNavigation();
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const cardWidth = (Dimensions.get("window").width - CARD_MARGIN * 3) / 2; // 2 columns + 3 gaps
  const [pressedCardId, setPressedCardId] = useState<number | null>(null);



  // Fetch Pokémon
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        const data = await response.json();

        const detailedPokemons: Pokemon[] = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              types: details.types.map((t: any) => t.type.name),
              image: details.sprites.front_default,
            };
          })
        );

        setPokemonList(detailedPokemons);
        setFilteredList(detailedPokemons);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  // Filter Pokémon
  useEffect(() => {
    const search = searchText.toLowerCase();
    const filtered = pokemonList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search) ||
        p.id.toString().includes(search) ||
        p.types.some((type) => type.toLowerCase().includes(search));
      const matchesType = selectedType === "all" || p.types.includes(selectedType);
      return matchesSearch && matchesType;
    });
    setFilteredList(filtered);
  }, [searchText, selectedType, pokemonList]);

  // Render type buttons
  const renderTypeButton = (type: string) => {
    const active = selectedType === type;
    return (
      <TouchableOpacity
        key={type}
        style={[styles.filterButton, active && styles.filterButtonActive]}
        onPress={() => setSelectedType(type)}
      >
        <Text style={[styles.filterText, active && styles.filterTextActive]}>
          {type.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render Pokémon card
  const renderItem = ({ item }: { item: Pokemon }) => {
      const isSelected = pressedCardId === item.id;

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Details", { id: item.id })}
          style={[
            styles.card,
            { backgroundColor: isSelected ? "#16a134ff" : "#f2f2f2" },
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={[styles.id, isSelected && { color: "#fff" }]} >
            #{item.id.toString().padStart(4, "0")}
          </Text>
          <Text style={[styles.name, isSelected && { color: "#fff" }]}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>

          <View style={styles.typesContainer}>
            {item.types.map((type) => (
              <View
                key={type}
                style={[
                  styles.typeBadge,
                  { backgroundColor: isSelected ? "#fff" : TYPE_COLORS[type] || "#777" },
                ]}
              >
                <Text style={[styles.typeText, isSelected && { color: "#16a134ff" }]}>
                  {type.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      );
    };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PokeDex</Text>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, type, or ID"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        style={{ maxHeight: 50 }}
      >
        {["all", ...Object.keys(TYPE_COLORS)].map(renderTypeButton)}
      </ScrollView>

      {/* Pokémon List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        key={2} // add this line to force fresh render
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const cardWidth = (Dimensions.get("window").width - 30) / 2; // spacing between cards

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#16a134ff",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#d3d3d3",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "bottom",
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 14,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 34, // fixed height
    flexShrink: 0, // prevent shrinking
  },
  filterButtonActive: {
    backgroundColor: "#16a134ff",
  },
  filterText: {
    fontWeight: "bold",
    color: "#333",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginHorizontal: CARD_MARGIN / 2,
    marginVertical: CARD_MARGIN,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  id: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  typesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    margin: 2,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
