import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native-ui-lib";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DraxProvider, DraxView, DraxList } from "react-native-drax";
import { useNavigation } from "expo-router";

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
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      drawerLabel: `Project ${id}`,
      title: `Project ${id}`,
    });
  }, [id]);

  const draggableItemList = [
    {
      id: 1,
      name: "1",
      logo_url: "../images/2.png",
    },
    {
      id: 2,
      name: "2",
      logo_url: "../images/2.png",
    },
    {
      id: 3,
      name: "3",
      logo_url: "../images/2.png",
    },
    {
      id: 4,
      name: "4",
      logo_url: "../images/2.png",
    },
    {
      id: 5,
      name: "5",
      logo_url: "../images/2.png",
    },
  ];
  const FirstReceivingItemList = [
    {
      id: 6,
      name: "6",
      logo_url: "../images/2.png",
    },
    {
      id: 7,
      name: "7",
      logo_url: "../images/2.png",
    },
    {
      id: 8,
      name: "EMI Calculators",
      logo_url: "../images/2.png",
    },
    {
      id: 9,
      name: "EMI Calculators",
      logo_url: "../images/2.png",
    },
  ];

  const [receivingItemList, setReceivedItemList] = React.useState(
    FirstReceivingItemList
  );
  const [dragItemMiddleList, setDragItemListMiddle] =
    React.useState(draggableItemList);

  const DragUIComponent = ({ item, index }: any) => {
    return (
      <DraxView
        style={[styles.centeredContent, styles.draggableBox]}
        draggingStyle={styles.dragging}
        dragReleasedStyle={styles.dragging}
        hoverDraggingStyle={styles.hoverDragging}
        payload={index}
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
        payload={index}
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

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DraxProvider>
          <DraxView
            style={styles.innerLayout}
            onReceiveDragDrop={(event) => {
              console.log(event.dragged);
              let selected_item = dragItemMiddleList[event.dragged.payload];
              let newReceivingItemList = [...receivingItemList];
              newReceivingItemList[newReceivingItemList.length] = selected_item;
              setReceivedItemList(newReceivingItemList);

              const newDragItemMiddleList = [...dragItemMiddleList].filter(
                (item) => item.id !== selected_item.id
              );
              console.log(newDragItemMiddleList);
              setDragItemListMiddle(newDragItemMiddleList);
            }}
          >
            <Text style={styles.headerText}>EMI Calculators</Text>
            <DraxList
              data={receivingItemList}
              renderItemContent={ReceivingZoneUIComponent}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              ItemSeparatorComponent={FlatListItemSeparator}
              numColumns={4}
              scrollEnabled={true}
            />
          </DraxView>
          <DraxView
            style={styles.innerLayout}
            onReceiveDragDrop={(event) => {
              console.log(event.dragged);
              // console.log(receivingItemList);
              let selected_item = receivingItemList[event.dragged.payload];
              // console.log(selected_item);
              let newReceivingItemList = [...dragItemMiddleList];
              newReceivingItemList[newReceivingItemList.length] = selected_item;
              setDragItemListMiddle(newReceivingItemList);

              const newDragItemMiddleList = [...receivingItemList].filter(
                (item) => item.id !== selected_item.id
              );
              // console.log(newDragItemMiddleList);
              setReceivedItemList(newDragItemMiddleList);
            }}
          >
            <Text style={styles.headerText}>Loan</Text>
            <DraxList
              data={dragItemMiddleList}
              renderItemContent={DragUIComponent}
              keyExtractor={(item, index) => index.toString()}
              numColumns={4}
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
