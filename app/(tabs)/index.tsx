import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import AddMovieForm from "@/components/AddMovieForm";

const WatchlistScreen = () => {
  const [watchlist, setWatchlist] = useState([
    {
      id: "1",
      title: "I Care A Lot",
      status: "not watched",
      date: new Date(),
      image: "https://via.placeholder.com/150",
    },
    {
      id: "2",
      title: "Titane",
      status: "watched",
      date: new Date(),
      image: "https://via.placeholder.com/150",
    },
  ]);
  const [isFormVisible, setFormVisible] = useState(false);

  const handleAddMovie = (movie) => {
    setWatchlist([
      ...watchlist,
      {
        id: (watchlist.length + 1).toString(),
        ...movie,
        image: "https://via.placeholder.com/150",
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>
        {item.status} on {item.date.toDateString()}
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
    width: "100%",
    height: 180,
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
