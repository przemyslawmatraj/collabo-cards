import { Card, Picker, Text, TextField } from "react-native-ui-lib";
import { TouchableOpacity, View, Text as RNText, Button } from "react-native";
import { useState } from "react";
import { Iconify } from "react-native-iconify";
import Modal from "react-native-modal";
import { supabase } from "@/lib/supabase";
import Colors from "@/constants/Colors";
import { Status } from "@/constants/Status";

export const AddTaskButton = ({
  status,
  storyId,
}: {
  status: Status;
  storyId: string | number;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addStory = async () => {
    const { error } = await supabase
      .from("tasks")
      .insert({
        name,
        description,
        priority,
        story_id: storyId,
        status,
      })
      .single();

    if (error) {
      console.log(error);
    }

    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={toggleModal}>
        <Card
          style={[
            {
              marginTop: 10,
              backgroundColor: Colors.backGroundColor,
              borderRadius: 5,
              borderColor: Colors.borderColor,
              borderWidth: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginHorizontal: 10,
              marginVertical: 5,
            },
            {
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            },
          ]}
        >
          <Iconify icon="ph:plus-fill" size={24} color={Colors.black} />
          <Text color={Colors.black} text80>
            Add Task {status.toLocaleUpperCase()}
          </Text>
        </Card>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              rowGap: 10,
            }}
          >
            <RNText>Add New {status.toLocaleUpperCase()} Story</RNText>
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
              validate={["required", (value) => value.length > 6]}
              validationMessage={["Field is required", "Password is too short"]}
              maxLength={30}
            />
            <TextField
              placeholder={"Descripton"}
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
              onChangeText={(text) => setDescription(text)}
              enableErrors
              validate={["required", (value) => value.length > 6]}
              validationMessage={["Field is required", "Password is too short"]}
              maxLength={30}
            />
            <Picker
              items={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
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
              fieldType="settings"
              placeholder={"Priority"}
              label="Project Priority"
              onChange={(text) => {
                setPriority(text as string);
              }}
              value={priority}
            ></Picker>
            <Button title="Add Story" onPress={addStory} />
            <Button title="Close" onPress={toggleModal} />
          </Card>
        </View>
      </Modal>
    </View>
  );
};
