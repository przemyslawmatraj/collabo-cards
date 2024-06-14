import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native-ui-lib";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DraxProvider, DraxView, DraxList } from "react-native-drax";
import { useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";

const Colors = {
  backGroundColor: "#1A1A1A",
  innerBackGroundColor: "#1A1A1A",
  borderColor: "#1A1A1A",
  draggingColor: "#1A1A1A",
  hoverDraggingColor: "#1A1A1A",
  receivingColor: "#1A1A1A",
  white: "#fff",
  black: "#000",
};

const ProjectScreen = () => {
  const [project, setProject] = useState<any>(null);
  const [receivingItemList, setReceivedItemList] = React.useState<any>([]);
  const [dragItemMiddleList, setDragItemListMiddle] = React.useState<any>([]);
  const [doneItemList, setDoneItemList] = React.useState<any>([]);

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      const { data: stories, error: storiesError } = await supabase
        .from("stories")
        .select("*")
        .eq("project_id", id)
        .order("creation_date", { ascending: false });

      if (error || storiesError) {
        console.log(error, storiesError);
        return;
      }

      setProject(data);

      const todoStories = stories.filter((story) => story.status === "todo");
      const inProgressStories = stories.filter(
        (story) => story.status === "doing"
      );
      const doneStories = stories.filter((story) => story.status === "done");

      setReceivedItemList(todoStories);
      setDragItemListMiddle(inProgressStories);
      setDoneItemList(doneStories);

      navigation.setOptions({
        drawerLabel: `Project ${data.name}`,
        title: `Project ${data.name}`,
      });
    };

    fetchData();

    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stories" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      navigation.setOptions({
        drawerLabel: `Project Loading`,
        title: `Project Loading`,
      });
      setProject(null);
      setReceivedItemList([]);
      setDragItemListMiddle([]);
      channels.unsubscribe();
    };
  }, [id]);

  const DragUIComponent = ({ item, index }: any) => {
    return (
      <DraxView
        style={[styles.centeredContent, styles.draggableBox]}
        draggingStyle={styles.dragging}
        dragReleasedStyle={styles.dragging}
        hoverDraggingStyle={styles.hoverDragging}
        payload={item.id}
        longPressDelay={150}
        key={index}
        receivingStyle={styles.receiving}
        renderContent={({ viewState }) => {
          return (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.profileImgContainer,
                  { backgroundColor: Colors.black },
                ]}
              >
                <Image
                  source={require("../../../../assets/images/favicon.png")}
                  style={styles.profileImg}
                />
              </TouchableOpacity>

              <Text style={styles.text1}>{item.name}</Text>
            </View>
          );
        }}
      ></DraxView>
    );
  };

  const ReceivingZoneUIComponent = ({ item, index }: any) => {
    return (
      <DraxView
        style={[styles.centeredContent, styles.receivingZone]}
        payload={item.id}
        receivingStyle={styles.receiving}
        renderContent={({ viewState }) => {
          // const receivingDrag = viewState && viewState.receivingDrag;
          // const payload = receivingDrag && receivingDrag.payload;
          return (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.profileImgContainer,
                  { backgroundColor: Colors.black },
                ]}
              >
                <Image
                  source={require("../../../../assets/images/favicon.png")}
                  style={styles.profileImg}
                />
              </TouchableOpacity>

              <Text style={styles.text1}>{item.name}</Text>
            </View>
          );
        }}
        key={index}
      />
    );
  };

  const FlatListItemSeparator = () => {
    return <View style={styles.itemSeparator} />;
  };

  if (!project) {
    return <Text>Loading...</Text>;
  }

  const updateStoryStatus = async (storyId: number, status: string) => {
    console.log(storyId, status);
    const { data, error } = await supabase
      .from("stories")
      .update({ status })
      .eq("id", storyId);

    if (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DraxProvider>
          <DraxView
            style={styles.innerLayout}
            onReceiveDragDrop={(event) => {
              updateStoryStatus(event.dragged.payload, "todo");
            }}
          >
            <Text style={styles.headerText}>To Do</Text>
            <DraxList
              data={receivingItemList}
              renderItemContent={ReceivingZoneUIComponent}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              ItemSeparatorComponent={FlatListItemSeparator}
              numColumns={1}
              scrollEnabled={true}
            />
          </DraxView>
          <DraxView
            style={styles.innerLayout}
            onReceiveDragDrop={(event) => {
              updateStoryStatus(event.dragged.payload, "doing");
            }}
          >
            <Text style={styles.headerText}>Doing</Text>
            <DraxList
              data={dragItemMiddleList}
              renderItemContent={DragUIComponent}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              ItemSeparatorComponent={FlatListItemSeparator}
              scrollEnabled={true}
            />
          </DraxView>
          <DraxView
            style={styles.innerLayout}
            onReceiveDragDrop={(event) => {
              updateStoryStatus(event.dragged.payload, "done");
            }}
          >
            <Text style={styles.headerText}>Done</Text>
            <DraxList
              data={doneItemList}
              renderItemContent={DragUIComponent}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              ItemSeparatorComponent={FlatListItemSeparator}
              scrollEnabled={true}
            />
          </DraxView>
        </DraxProvider>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor,
  },

  innerLayout: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: Colors.innerBackGroundColor,
    borderColor: Colors.borderColor,
    borderWidth: 1,
  },
  innerLayout1: {
    marginStart: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: Colors.innerBackGroundColor,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    flex: 1,
    padding: 10,
  },
  innerLayout2: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    flex: 1,
    padding: 10,
  },

  headerText: {
    fontFamily: "Arial",
    fontSize: 20,
    color: Colors.white,
    marginVertical: 10,
  },

  text: {
    fontSize: 10,
    color: Colors.white,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Arial",
  },
  text1: {
    fontSize: 10,
    color: Colors.white,
    marginTop: 5,
    textAlign: "center",
  },

  profileImgContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.borderColor,
  },
  profileImg: {
    width: 50,
    height: 50,
  },

  itemSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.borderColor,
  },

  receivingContainer: {
    flex: 1,
    backgroundColor: Colors.innerBackGroundColor,
  },

  receivingZone: {
    flex: 1,
    backgroundColor: Colors.innerBackGroundColor,
  },

  draggableBox: {
    flex: 1,
    backgroundColor: Colors.borderColor,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  dragging: {
    backgroundColor: Colors.draggingColor,
  },
  hoverDragging: {
    backgroundColor: Colors.hoverDraggingColor,
  },
  receiving: {
    backgroundColor: Colors.receivingColor,
  },

  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  draxListContainer: {
    flex: 1,
    padding: 10,
  },
});

export default ProjectScreen;
