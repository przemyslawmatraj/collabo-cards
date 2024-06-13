import { View, Text, Card } from "react-native-ui-lib";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Moment from "moment";
import { router } from "expo-router";

Moment.locale("en");

export default function TabOneScreen() {
  return (
    <View flex paddingT-50>
      <Text text60 center>
        Manage your projects
      </Text>
      <Text text20 center>
        EASLY
      </Text>
      <Text text60 center>
        With Collabo Cards
      </Text>
      <View flex flexDirection-row justifyContent-center paddingT-50>
        <Card
          bg-grey80
          flex
          width={"100%"}
          padding-10
          borderRadius={10}
          onPress={() => {
            router.navigate("/projects");
          }}
        >
          <Card.Section
            content={[{ text: "Your Projects", text30: true }]}
            contentStyle={{ alignItems: "center" }}
          />
        </Card>
        <Card
          bg-grey80
          flex
          width={"100%"}
          padding-10
          borderRadius={10}
          onPress={() => {
            router.navigate("/settings");
          }}
        >
          <Card.Section
            content={[{ text: "Settings", text30: true }]}
            contentStyle={{ alignItems: "center" }}
          />
        </Card>
        <Card
          bg-grey80
          flex
          width={"100%"}
          padding-10
          borderRadius={10}
          onPress={() => {
            router.navigate("/projects");
          }}
        >
          <Card.Section
            content={[{ text: "Stories", text30: true }]}
            contentStyle={{ alignItems: "center" }}
          />
        </Card>
      </View>
    </View>
  );
}
