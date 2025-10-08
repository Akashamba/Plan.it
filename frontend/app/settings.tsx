import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          Alert.alert(
            "signed out",
            "",
            [{ text: "OK", onPress: () => router.dismissTo("/sign-in") }],
            {
              cancelable: false,
            }
          );
        },
      },
    });
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          paddingTop: 50,
          paddingLeft: 10,
          fontWeight: "800",
          fontSize: 30,
        }}
      >
        Settings
      </Text>

      <Button title="Logout" onPress={handleLogOut} />
    </SafeAreaView>
  );
};

export default Settings;
