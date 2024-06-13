import { Button, Text } from "react-native";
import { useAuth } from "@/providers/AuthProvider";

export default function TabOneScreen() {
  const { signOut } = useAuth();

  return <Button title="Sign Out" onPress={signOut} />;
}
