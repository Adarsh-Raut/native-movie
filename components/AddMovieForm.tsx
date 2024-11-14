import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  Platform,
  FlatList,
  TouchableHighlight,
  Image,
  GestureResponderEvent,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { Movie } from "@/app/(tabs)/index";

interface AddMovieFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (movie: Omit<Movie, "id">) => void;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface TMDBResponse {
  results: TMDBMovie[];
}

const TMDB_API_KEY = "03a96c70bce925ba25c9e5110048bf29";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const AddMovieForm: React.FC<AddMovieFormProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<Movie["status"]>("not watched");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const performSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      const data: TMDBResponse = await response.json();
      setSearchResults(data.results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const debouncedSearch = React.useCallback(debounce(performSearch, 500), []);

  const handleDateChange = (
    event: any,
    selectedDate?: Date | undefined
  ): void => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = (): void => {
    const movieData = {
      name,
      status,
      date: date.toISOString(),
      imageUrl,
    };
    onSubmit(movieData);

    // Reset form
    setName("");
    setImageUrl("");
    setStatus("not watched");
    setDate(new Date());
    setSearchResults([]);
    setShowSearchResults(false);
    onClose();
  };

  const handleSearch = (query: string): void => {
    setName(query);
    debouncedSearch(query);
  };

  const handleMovieSelect = (
    movieTitle: string,
    posterPath: string | null
  ): void => {
    setName(movieTitle);
    setImageUrl(
      posterPath
        ? `${TMDB_IMAGE_BASE_URL}${posterPath}`
        : "https://via.placeholder.com/50"
    );

    setShowSearchResults(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Add Movie
          </Text>

          <Text>Name:</Text>
          <TextInput
            value={name}
            onChangeText={handleSearch}
            placeholder="Enter movie name"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 8,
              marginBottom: 10,
              borderRadius: 5,
            }}
          />

          {showSearchResults && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }: { item: TMDBMovie }) => (
                <TouchableHighlight
                  onPress={() =>
                    handleMovieSelect(item.title, item.poster_path)
                  }
                  underlayColor="#ddd"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 8,
                      borderBottomWidth: 1,
                      borderColor: "#ddd",
                    }}
                  >
                    <Image
                      source={{
                        uri: item.poster_path
                          ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
                          : "https://via.placeholder.com/50",
                      }}
                      style={{ width: 50, height: 75, marginRight: 10 }}
                      resizeMode="cover"
                    />
                    <Text>{item.title}</Text>
                  </View>
                </TouchableHighlight>
              )}
              style={{
                maxHeight: 200,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 10,
                borderRadius: 5,
              }}
            />
          )}

          <Text>Date:</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ marginBottom: 10 }}
          >
            <Text style={{ color: "blue" }}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Button title="Add Movie" onPress={handleSubmit} />
          <Button title="Cancel" color="red" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default AddMovieForm;
