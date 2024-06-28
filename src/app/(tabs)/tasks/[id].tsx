import { View, Text } from "react-native-ui-lib";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import { TouchableOpacity } from "react-native-ui-lib";
import { Picker } from "react-native-ui-lib";

export default function TaskScreen() {
  const [task, setTask] = useState<any>(null);
  const [assignee, setAssignee] = useState<any>(null);
  const [profiles, setProfiles] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error: error } = await supabase
        .from("tasks")
        .select(
          `
            *,
            profiles (
                id,
                username
            )
            `
        )
        .eq("id", Number(id));

      if (error) {
        console.log(error);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
      console.log(profilesData);
      if (profilesError) {
        console.log(profilesError);
      }

      setProfiles(
        profilesData?.map((profile) => {
          return {
            label: profile.username,
            value: profile.id,
          };
        })
      );
      setTask(data[0]);

      navigation.setOptions({
        drawerLabel: `Task ${data[0].name}`,
        title: `Task ${data[0].name}`,
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
          table: "tasks",
        },
        async (payload) => {
          await fetchData();
        }
      )
      .subscribe();

    return () => {
      navigation.setOptions({
        drawerLabel: `Task Loading`,
        title: `Task Loading`,
      });
      channels.unsubscribe();
      setTask(null);
      setProfiles([]);
    };
  }, [id]);

  const assignTask = async (user_id: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ assignee_id: user_id, status: "doing", start_date: new Date() })
      .eq("id", task.id);

    if (error) {
      console.log(error);
    }
  };

  if (!task) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Text>Name: {task.name}</Text>
      <Text>Description: {task.description}</Text>
      <Text>Priority: {task.priority}</Text>
      <Text>Status: {task.status}</Text>
      <Text>Start date: {task.start_date ?? "Not specified yet"}</Text>
      <Text>End date: {task.end_date ?? "Not specified yet"}</Text>
      <View>
        <Text>Assigned to</Text>
        <Picker
          defaultValue={task.profiles?.id || ""}
          items={profiles}
          fieldStyle={{
            width: "100%",
            minWidth: 300,
          }}
          containerStyle={{
            width: "100%",
            minWidth: 300,
            borderRadius: 5,
            borderWidth: 1,
            padding: 10,
          }}
          fieldType="settings"
          placeholder={"Assignee"}
          label="Task Assignee"
          onChange={(text) => {
            assignTask(text as string);
            setAssignee(text as string);
          }}
          value={assignee || task.profiles?.id}
        ></Picker>
      </View>
    </View>
  );
}
