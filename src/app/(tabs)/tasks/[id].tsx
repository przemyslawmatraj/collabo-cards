import { View, Text, Card } from "react-native-ui-lib";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import { TouchableOpacity } from "react-native-ui-lib";
import { Picker } from "react-native-ui-lib";
import Colors from "@/constants/Colors";
import { useTabEffect } from "@/utils/useTabEffect";

export default function TaskScreen() {
  const [task, setTask] = useState<any>(null);
  const [assignee, setAssignee] = useState<any>(null);
  const [profiles, setProfiles] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

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

  useEffect(() => {
    fetchData();
    return () => {
      navigation.setOptions({
        drawerLabel: `Task Loading`,
        title: `Task Loading`,
      });
      setTask(null);
      setProfiles([]);
    };
  }, [id]);

  useTabEffect(`/tasks/${id}`, () => {
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
      channels.unsubscribe();
    };
  });

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
    <View flex padding-page style={{ backgroundColor: Colors.white }}>
      <Card style={{ padding: 10, marginBottom: 10 }}>
        <Text text50>Name: {task.name}</Text>
        <Text text70>Description: {task.description}</Text>
        <Text text70>Priority: {task.priority}</Text>
        <Text text70>Status: {task.status}</Text>
        <Text text70>Start date: {task.start_date ?? "Not specified yet"}</Text>
        <Text text70>End date: {task.end_date ?? "Not specified yet"}</Text>
      </Card>
      <Card style={{ padding: 10 }}>
        <Text text70 marginB-s3>
          Assigned to
        </Text>
        <Picker
          defaultValue={task.profiles?.id || ""}
          items={profiles}
          fieldStyle={{ borderColor: Colors.borderColor }}
          containerStyle={{
            borderColor: Colors.borderColor,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: Colors.white,
          }}
          placeholder="Assignee"
          label="Task Assignee"
          onChange={(value) => {
            assignTask(value);
            setAssignee(value);
          }}
          value={assignee}
        />
      </Card>
    </View>
  );
}
