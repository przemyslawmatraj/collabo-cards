import React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "@components/EditScreenInfo";
import { Text, View } from "@components/Themed";

export default function TabOneScreen() {
  return (
    <View tw="flex flex-col items-center justify-center h-screen">
      <Text tw="text-yellow-500 mx-auto">Tab One</Text>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
