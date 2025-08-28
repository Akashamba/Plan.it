import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import useFetch from "@/services/hooks";
import { fetchData } from "@/services/api";

export default function Dashboard() {
  const session = authClient.useSession();

  const { data, loading, error } = useFetch(() =>
    fetchData("/tasks", session.data?.session.token || "")
  );

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
      <Text style={styles.title}>Authed User</Text>
      <Text>Redireted from Auth!</Text>
      <Text>{session?.data?.user.name || "no user"}</Text>
      <Button title="Logout" onPress={handleLogOut} />;
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {!loading && !error && data?.tasks && (
        <>
          {data.tasks.map((task: { name: string }, idx: number) => (
            <Text key={idx}>{task.name}</Text>
          ))}
        </>
      )}
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
