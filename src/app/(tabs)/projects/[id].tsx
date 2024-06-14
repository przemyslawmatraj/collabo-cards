import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native-ui-lib";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DraxProvider,
  DraxView,
  DraxList,
  DraxScrollView,
} from "react-native-drax";
import { useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ScreenHeight } from "react-native-elements/dist/helpers";
import { Iconify } from "react-native-iconify";
import { useAuth } from "@/providers/AuthProvider";
import { AddStoryButton } from "./AddStoryButton";

enum Status {
  todo = "todo",
  doing = "doing",
  done = "done",
}

const Colors = {
  backGroundColor: "#FFFFFF", // Light background color
  innerBackGroundColor: "#F0F0F0", // Slightly darker inner background color
  borderColor: "#CCCCCC", // Light border color
  draggingColor: "#E0E0E0", // Light dragging color
  hoverDraggingColor: "#E0E0E0", // Light hover dragging color
  receivingColor: "#FF69B4", // Light receiving color
  white: "#fff", // White
  black: "#000", // Black
};

const ProjectScreen = () => {
  const [project, setProject] = useState<any>(null);
  const [receivingItemList, setReceivedItemList] = useState<any>([]);
  const [dragItemMiddleList, setDragItemListMiddle] = useState<any>([]);
  const [doneItemList, setDoneItemList] = useState<any>([]);

  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("owner_id", user?.id)
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

      const todoStories = stories.filter(
        (story) => story.status === Status.todo
      );
      const inProgressStories = stories.filter(
        (story) => story.status === Status.doing
      );
      const doneStories = stories.filter(
        (story) => story.status === Status.done
      );

      setReceivedItemList(todoStories);
      setDragItemListMiddle(inProgressStories);
      setDoneItemList(doneStories);

      //change to back button
      navigation.setOptions({
        drawerLabel: `Project ${data.name}`,
        title: `Project ${data.name}`,
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
    };

    fetchData();

    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stories",
          filter: `owner_id=eq.${user?.id}`,
        },
        async (payload) => {
          await fetchData();
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
  }, [id, user]);

  const DragUIComponent = ({ item, index, status }: any) => {
    return (
      <DraxView
        style={[styles.centeredContent, styles.draggableBox]}
        draggingStyle={styles.dragging}
        dragReleasedStyle={styles.dragging}
        hoverDraggingStyle={styles.hoverDragging}
        payload={item}
        longPressDelay={150}
        key={index}
        receivingStyle={styles.receiving}
        renderContent={() => {
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
                onPress={() => {
                  router.navigate(`/stories/${item.id}`);
                }}
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

  if (!project) {
    return <Text>Loading...</Text>;
  }

  const updateStoryStatus = async (storyId: number, status: string) => {
    console.log(storyId, status);
    const { error } = await supabase
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
          <DraxScrollView horizontal scrollEnabled={true}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <DraxView
                style={styles.innerLayout}
                onReceiveDragDrop={(event) => {
                  if (event.dragged.payload.status === Status.todo) return;
                  updateStoryStatus(event.dragged.payload.id, Status.todo);
                }}
              >
                <Text style={styles.headerText}>To Do</Text>
                <DraxList
                  data={receivingItemList}
                  renderItemContent={({ item, index }) =>
                    DragUIComponent({ item, index, status: Status.todo })
                  }
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  numColumns={1}
                  scrollEnabled={true}
                />
                <AddStoryButton projectId={project.id} status={Status.todo} />
              </DraxView>
              <DraxView
                style={styles.innerLayout}
                onReceiveDragDrop={(event) => {
                  if (event.dragged.payload.status === Status.doing) return;
                  updateStoryStatus(event.dragged.payload.id, Status.doing);
                }}
              >
                <Text style={styles.headerText}>Doing</Text>
                <DraxList
                  data={dragItemMiddleList}
                  renderItemContent={({ item, index }) =>
                    DragUIComponent({ item, index, status: Status.doing })
                  }
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                  scrollEnabled={true}
                />
                <AddStoryButton projectId={project.id} status={Status.doing} />
              </DraxView>
              <DraxView
                style={styles.innerLayout}
                onReceiveDragDrop={(event) => {
                  if (event.dragged.payload.status === Status.done) return;
                  updateStoryStatus(event.dragged.payload.id, Status.done);
                }}
              >
                <Text style={styles.headerText}>Done</Text>
                <DraxList
                  data={doneItemList}
                  renderItemContent={({ item, index }) =>
                    DragUIComponent({ item, index, status: Status.done })
                  }
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                  scrollEnabled={true}
                />
                <AddStoryButton projectId={project.id} status={Status.done} />
              </DraxView>
            </View>
          </DraxScrollView>
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
    borderColor: Colors.borderColor,
    borderWidth: 1,
    minWidth: 300,
    display: "flex",
    flexDirection: "column",
    minHeight: ScreenHeight - 400,
  },

  headerText: {
    fontFamily: "Arial",
    fontSize: 20,
    color: Colors.black,
    marginVertical: 10,
  },

  text: {
    fontSize: 10,
    color: Colors.black,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Arial",
  },
  text1: {
    fontSize: 10,
    color: Colors.black,
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
