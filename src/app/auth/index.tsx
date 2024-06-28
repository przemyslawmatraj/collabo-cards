import { Text, View } from "@components/Themed";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "react-native";
import { TextField } from "react-native-ui-lib";
import { useState } from "react";
import Colors from "@/constants/Colors";

export default function TabOneScreen() {
  const { isAuthenticated, signIn, signOut, signUp, role, loading, user } =
    useAuth();
  const [email, setEmail] = useState("ddfgdfdddddg@gmail.com");
  const [password, setPassword] = useState("test12345");

  const handleSignUp = async () => {
    console.log("sign up");
    await signUp(email, password);
  };

  const handleSignIn = async () => {
    console.log("sign in");
    console.log(email, password);
    await signIn(email, password);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Tab One</Text>
      <View>
        <Text>{isAuthenticated ? "Logged in " + role : "Logged out"}</Text>
        <View>
          <Text>{user ? user.email : "No session"}</Text>
        </View>
        <View>
          <TextField
            placeholder={"Email"}
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
            onChangeText={(text) => setEmail(text)}
            enableErrors
            validate={["required", "email", (value) => value.length >= 3]}
            validationMessage={[
              "Field is required",
              "It must be an valid email",
              "Your name is too short",
            ]}
            onValidationFailed={() => alert("Your name is too short")}
            maxLength={30}
            defaultValue={"ddfgdfdddddg@gmail.com"}
          />
          <TextField
            placeholder={"Password"}
            floatingPlaceholder
            secureTextEntry
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
            onChangeText={(text) => setPassword(text)}
            enableErrors
            validate={["required", (value) => value.length >= 3]}
            validationMessage={[
              "Field is required",
              "Your password is too short",
            ]}
            onValidationFailed={() => alert("Your password is too short")}
            maxLength={30}
            defaultValue={"test12345"}
          />
          <Button title="Sign In" onPress={handleSignIn} />
          <Button title="Sign Out" onPress={handleSignOut} />
          <Button title="Sign Up" onPress={handleSignUp} />
        </View>
      </View>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}
