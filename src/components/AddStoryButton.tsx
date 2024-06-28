import { Card, Picker, Text, TextField } from "react-native-ui-lib";
import { TouchableOpacity, View, Text as RNText, Button } from "react-native";
import { useState } from "react";
import { Iconify } from "react-native-iconify";
import Modal from "react-native-modal";
import { supabase } from "@/lib/supabase";
import Colors from "@/constants/Colors";
import { Status } from "@/constants/Status";
import { useNotifications } from "@/providers/NotificationProvider";
import { NotificationPriority } from "@/utils/NotificationService";

export const AddStoryButton = ({
  status,
  projectId,
}: {
  status: Status;
  projectId: string | number;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>(
    NotificationPriority.low
  );
  const notificationService = useNotifications();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addStory = async () => {
    if (!name || !description || !priority || !projectId || !status) {
      alert("Please fill all the fields");
      return;
    }

    const { error } = await supabase
      .from("stories")
      .insert({
        name,
        description,
        priority,
        project_id: projectId,
        status,
      })
      .single();

    if (error) {
      console.log(error);
    }

    notificationService.send({
      title: "New Story",
      message: "A new story has been created" + "\n" + name,
      date: new Date().toISOString(),
      priority,
      read: false,
    });

    setName("");
    setDescription("");
    setPriority(NotificationPriority.low);
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
            Add Story {status.toLocaleUpperCase()}
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
                setPriority(
                  text?.toString().toLowerCase() as NotificationPriority
                );
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
