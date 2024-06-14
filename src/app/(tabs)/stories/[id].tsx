import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Iconify } from "react-native-iconify";
import {
  View,
  Text,
  GridListItem,
  GridList,
  Spacings,
  Card,
  TouchableOpacity,
} from "react-native-ui-lib";

export default function StoryScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      drawerLabel: `Story ${id}`,
      title: `Story ${id}`,
      headerLeft: () => (
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            marginHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            router.back();
          }}
        >
          <Iconify icon="lets-icons:back" size={24} color="#0080ff" />
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <View>
      <Text>Story {id}</Text>
    </View>
  );
}
