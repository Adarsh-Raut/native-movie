import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import AddMovieForm from "@/components/AddMovieForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

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
      await fetchWatchlist();
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const MovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={{
        width: width / 2 - 24,
        marginHorizontal: 8,
        marginBottom: 16,
      }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{
          width: "100%",
          height: 225,
          borderRadius: 8,
        }}
        resizeMode="cover"
      />
      <ThemedText
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: "600",
        }}
        numberOfLines={2}
      >
        {item.name}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          opacity: 0.7,
          marginTop: 4,
        }}
      >
        {item.status} • {new Date(item.date).toLocaleDateString()}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Watchlist
          </ThemedText>

          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            onPress={() => setFormVisible(true)}
          >
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Watchlist Items */}
        <FlatList
          data={watchlist}
          renderItem={({ item }) => <MovieCard item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            padding: 8,
          }}
        />

        {/* Add Movie Form Modal */}
        <AddMovieForm
          visible={isFormVisible}
          onClose={() => setFormVisible(false)}
          onSubmit={handleAddMovie}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default WatchlistScreen;
