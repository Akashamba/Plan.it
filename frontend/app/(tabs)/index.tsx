import { Text } from "@/components/Themed";
import { authClient } from "@/lib/auth-client";
import { Alert, Button } from "react-native";

export default function SocialSignIn() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard", // TODO: Callback not working
    });
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

  const { data: session } = authClient.useSession();

  return (
    <>
      <Button title="Login with Google" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogOut} />;
      <Text>{session?.user.name || "no user"}</Text>
    </>
  );
}
