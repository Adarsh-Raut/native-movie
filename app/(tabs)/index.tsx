import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import AddMovieForm from "@/components/AddMovieForm";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Movie {
  id: string;
  name: string;
  status: "watched" | "not watched";
  date: string;
  imageUrl: string;
}

const STORAGE_KEY = "@movie_watchlist";

const WatchlistScreen = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    try {
      const storedMovies = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMovies) {
        const parsedMovies = JSON.parse(storedMovies) as Movie[];
        setWatchlist(parsedMovies);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleAddMovie = async (movie: Omit<Movie, "id">) => {
    try {
      const newMovie: Movie = {
        ...movie,
        id: Date.now().toString(),
      };

      const updatedWatchlist = [...watchlist, newMovie];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWatchlist));

      // Refresh the watchlist
      await fetchWatchlist();
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };
  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>
        watched on {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watchlist</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setFormVisible(true)}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Watchlist Items */}
      <FlatList
        data={watchlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={false}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Movie Form Modal */}
      <AddMovieForm
        visible={isFormVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleAddMovie}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
    width: 160,
    height: 240,
    margin: 8,
    alignItems: "center",
    padding: 10,
  },
  image: {
    objectFit: "contain",
    width: 150,
    height: 150,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    paddingTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardSubtitle: {
    color: "#bbb",
    fontSize: 12,
    textAlign: "center",
  },
});

export default WatchlistScreen;
