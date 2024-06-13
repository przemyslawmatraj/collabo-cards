import { Text, View } from "@components/Themed";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "react-native";

export default function TabOneScreen() {
  const { isAuthenticated, signIn, signOut, signUp, role, loading, user } =
    useAuth();

  const handleSignUp = async () => {
    console.log("sign up");
    await signUp("ddfgdfdddddg@gmail.com", "test12345");
  };

  const handleSignIn = async () => {
    console.log("sign in");
    await signIn("ddfgdfdddddg@gmail.com", "test12345");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View tw="flex flex-col items-center justify-center h-screen flex-1">
      <Text tw="text-yellow-500 mx-auto">Tab One</Text>
      <View tw="flex flex-col items-center justify-center">
        <Text tw="text-yellow-500 mx-auto">
          {isAuthenticated ? "Logged in " + role : "Logged out"}
        </Text>
        <View tw="flex flex-col items-center justify-center">
          <Text tw="text-yellow-500 mx-auto">
            {user ? user.email : "No session"}
          </Text>
        </View>
        <View tw="flex flex-col items-center justify-center">
          <Text tw="text-yellow-500 mx-auto">hgfhgfhgfghfhgf</Text>
        </View>
        <View tw="flex flex-col items-center justify-center">
          <Button title="Sign In" onPress={handleSignIn} />
          <Button title="Sign Out" onPress={handleSignOut} />
          <Button title="Sign Up" onPress={handleSignUp} />
        </View>
      </View>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}
