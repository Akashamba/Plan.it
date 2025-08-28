import { authClient } from "@/lib/auth-client";
import { fetchData } from "@/services/api";
import useFetch from "@/services/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Button, Text } from "react-native";

export default function SocialSignIn() {
  const { data: generalData } = useFetch(() => fetchData("/", ""));
  const { data, loading, error } = useFetch(() => fetchData("/tasks", ""));
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session]);

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    // callback url not working with better auth, hence redirecting with useEffect for now
  };

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          Alert.alert("signed out");
        },
      },
    });
  };

  return (
    <>
      {session?.user ? (
        <Button title="Logout" onPress={handleLogOut} />
      ) : (
        <Button title="Login with Google" onPress={handleLogin} />
      )}
      {data && <Text>{generalData.message}</Text>}

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {!loading && !error && data?.tasks && (
        <>
          {data.tasks.map((task: { name: string }, idx: number) => (
            <Text key={idx}>{task.name}</Text>
          ))}
        </>
      )}
    </>
  );
}
