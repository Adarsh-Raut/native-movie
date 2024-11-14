import { Button, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

const Settings = () => {
  const [count, setCount] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      console.log(data.results[0]);
      setUserData(data.results[0]);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button onPress={() => setCount(count + 1)} title="Increment" />
      <Text style={styles.text}>{count}</Text>
      <Button
        onPress={() => count > 0 && setCount(count - 1)}
        title="Decrement"
      /> */}
      <ThemedText>{userData?.name.first}</ThemedText>
      <Image
        source={{ uri: userData?.picture.large }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});
