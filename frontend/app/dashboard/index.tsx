import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          Alert.alert(
            "signed out",
            "",
            [{ text: "OK", onPress: () => router.push("/") }],
            {
              cancelable: false,
            }
          );
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text>Redireted from Auth!</Text>
      <Button title="Logout" onPress={handleLogOut} />;
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
