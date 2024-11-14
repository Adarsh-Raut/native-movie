import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

const TMDB_API_KEY = "03a96c70bce925ba25c9e5110048bf29";
const { width } = Dimensions.get("window");

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface MovieCardProps {
  item: Movie;
}

const Explore = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch movies");
      setLoading(false);
    }
  };

  const MovieCard: React.FC<MovieCardProps> = ({ item }) => (
    <TouchableOpacity
      style={{
        width: width / 2 - 24,
        marginHorizontal: 8,
        marginBottom: 16,
      }}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        }}
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
        {item.title}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          opacity: 0.7,
          marginTop: 4,
        }}
      >
        Rating: {item.vote_average.toFixed(1)}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedText style={{ fontSize: 16 }}>{error}</ThemedText>
          <TouchableOpacity
            onPress={fetchPopularMovies}
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#007AFF",
              borderRadius: 8,
            }}
          >
            <ThemedText style={{ color: "#fff" }}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText
          style={{
            fontSize: 24,
            fontWeight: "bold",
            margin: 16,
          }}
        >
          Popular Movies
        </ThemedText>
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{
            padding: 8,
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default Explore;
