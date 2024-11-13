import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddMovieForm = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("not watched");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = () => {
    onSubmit({ name, status, date });
    onClose(); // Close modal after submitting
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
            onChangeText={setName}
            placeholder="Enter movie name"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 8,
              marginBottom: 10,
              borderRadius: 5,
            }}
          />

          <Text>Status:</Text>
          <Picker
            selectedValue={status}
            onValueChange={setStatus}
            style={{ height: 50, marginBottom: 10 }}
          >
            <Picker.Item label="Not Watched" value="not watched" />
            <Picker.Item label="Watched" value="watched" />
          </Picker>

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
