import { StyleSheet } from "react-native";
import { Text, View, Button } from "react-native";
import { authClient } from "@/lib/auth-client";
import useFetch from "@/services/hooks";
import { fetchData } from "@/services/api";
import { Link } from "expo-router";

export default function TabOneScreen() {
  const { data, loading, error } = useFetch(() => fetchData());

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/(tabs)/two", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
    });
  };

  return (
    <View>
      {loading && <Text style={styles.title}>Loading...</Text>}
      {error && <Text style={styles.title}>Error: {error.message}</Text>}
      {!loading && !error && (
        <Text style={styles.title}>{data?.users[0].name}</Text>
      )}
      <Button title="Login with Google" onPress={handleLogin} />;
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
