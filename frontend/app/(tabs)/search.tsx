import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function TabTwoScreen() {
  const [searchQuery, SetsearchQuery] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text>Redireted from Auth!</Text>

      <TextInput
        value={searchQuery}
        placeholder="Search..."
        onChangeText={SetsearchQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
