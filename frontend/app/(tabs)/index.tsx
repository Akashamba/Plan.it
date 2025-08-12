import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import useFetch from "@/services/hooks";
import { fetchData } from "@/services/api";

export default function TabOneScreen() {
  const { data, loading, error } = useFetch(() => fetchData());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      {!loading && !error && <Text style={styles.title}>{data?.message}</Text>}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
