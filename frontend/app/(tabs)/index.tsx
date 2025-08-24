import { Text } from "@/components/Themed";
import { authClient } from "@/lib/auth-client";
import { fetchData } from "@/services/api";
import useFetch from "@/services/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Button } from "react-native";

export default function SocialSignIn() {
  const { data, loading, error } = useFetch(() => fetchData());
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
      <Button title="Login with Google" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogOut} />;
      <Text>{session?.user.name || "no user"}</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {!loading && !error && <Text>{data?.users[0].name}</Text>}
    </>
  );
}
