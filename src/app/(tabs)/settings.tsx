import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useState } from "react";
import { StatusBar, View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import { TextField } from "react-native-ui-lib";
import Colors from "@/constants/Colors";

export default function SettingsScreen() {
  const [name, setName] = useState("");
  const { user } = useAuth();

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ username: name })
      .eq("id", user?.id);

    if (error) {
      alert("Your name is too short");
      return;
    }

    alert("Saved!");
    router.navigate("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write you name</Text>
      <View style={styles.separator} />
      <TextField
        placeholder={"Name"}
        floatingPlaceholder
        fieldStyle={{
          width: "100%",
          minWidth: 300,
        }}
        containerStyle={{
          width: "100%",
          minWidth: 300,
          borderRadius: 5,
          backgroundColor: Colors.innerBackGroundColor,
          borderColor: Colors.borderColor,
          borderWidth: 1,
          padding: 10,
        }}
        color={Colors.black}
        onChangeText={(text) => setName(text)}
        enableErrors
        validate={["required", (value) => value.length >= 3]}
        validationMessage={["Field is required", "Your name is too short"]}
        onValidationFailed={() => alert("Your name is too short")}
        maxLength={30}
      />
      <Button title="Save" onPress={handleSave} />
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
