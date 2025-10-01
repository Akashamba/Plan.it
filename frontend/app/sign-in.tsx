import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";

const SignIn = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/(tabs)");
    }
  }, [session]);

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    // callback url not working with better auth, hence redirecting with useEffect for now
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>✅ Plan.it</Text>
      <View style={styles.heroImage}></View>
      <Button title="Login with Google" onPress={handleLogin} />
      <Text>By continuing you agree to Plan.it&apos;s terms and services</Text>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heroImage: {
    width: "80%",
    height: "60%",
    backgroundColor: "#D9D9D9",
  },
});
