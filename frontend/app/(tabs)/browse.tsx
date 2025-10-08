import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { authedFetchData } from "@/services/api";
import useFetch from "@/services/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

interface List {
  id: "string";
  name: "string";
  userId: "string";
  status: "completed" | "not completed";
  description: "string";
  priority: "low" | "medium" | "high";
  listId: "string";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Lists {
  lists: List[];
}

export default function Browse() {
  const {
    data: lists,
    loading,
    error,
  } = useFetch(() => authedFetchData<Lists>("/api/lists/"));

  return (
    <SafeAreaView>
      <Link href="/settings">Settings</Link>

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error! {error.message}</Text>}

      {!loading && !error && lists && (
        <FlatList
          data={lists.lists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BrowseItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function BrowseItem({ item }: { item: List }) {
  return (
    <View
      style={{
        padding: 10,
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2,
        margin: 10,
      }}
    >
      <Text>{item.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
