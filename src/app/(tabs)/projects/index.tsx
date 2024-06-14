import {
  View,
  Text,
  GridListItem,
  GridList,
  Spacings,
  Card,
  TouchableOpacity,
} from "react-native-ui-lib";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Moment from "moment";
import { router } from "expo-router";

Moment.locale("en");

export default function TabOneScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .then(({ data }) => {
        console.log(data);
        setItems(data);
      });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <GridListItem
        // containerStyle={{width: '100%', borderWidth: 1}}
        itemSize={{ width: "100%", height: 200 }}
        alignToStart={false}
        overlayText={false}
        horizontalAlignment={GridListItem.horizontalAlignment.left}
        renderCustomItem={() => {
          return (
            <TouchableOpacity>
              <Card
                bg-grey80
                flex
                width={"100%"}
                padding-10
                borderRadius={10}
                onPress={() => {
                  router.navigate(`/projects/${item.id}`);
                }}
              >
                <Text text60>
                  Project {index + 1} - {item.name}
                </Text>
                <Text>{item.description}</Text>
                <Text>
                  {item.creation_date
                    ? Moment(item.creation_date).format("d MMMM YYYY")
                    : "No date"}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <View flex paddingH-25 paddingV-20>
      <Text text40 marginB-20>
        All Projects
      </Text>
      <GridList
        data={items}
        numColumns={1}
        renderItem={renderItem}
        pagingEnabled
        itemSpacing={Spacings.s3}
      />
    </View>
  );
}
