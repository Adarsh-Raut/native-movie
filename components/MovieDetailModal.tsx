import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { Movie } from "@/app/(tabs)";

const { width } = Dimensions.get("window");

export interface MovieDetailModalProps {
  visible: boolean;
  movie: Movie | null;
  onClose: () => void;
  onDelete: (movieId: string) => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  visible,
  movie,
  onClose,
  onDelete,
}) => {
  if (!movie) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: movie.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <ThemedText style={styles.movieTitle}>{movie.name}</ThemedText>
          <ThemedText style={styles.movieDetails}>
            {movie.status} on {new Date(movie.date).toLocaleDateString()}
          </ThemedText>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onDelete(movie.id)}
            >
              <Icon name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    width: width * 0.8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  movieDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    width: "100%",
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default MovieDetailModal;
