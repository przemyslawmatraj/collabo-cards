import { Slot, router, Redirect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "@/providers/AuthProvider";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import UnreadCount from "@/components/Notifications/NotificationUnreadCount";
import NotificationList from "@/components/Notifications/NotificationList";
import NotificationDialog from "@/components/Notifications/NotificationDialog";
import { View } from "react-native-ui-lib";
import { useNotifications } from "@/providers/NotificationProvider";
import { NotificationPriority } from "@/utils/NotificationService";
import { Button } from "react-native";

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  // const notificationService = useNotifications();

  // const addNotification = () => {
  //   const notification = {
  //     title: "New Notification",
  //     message: "This is a new notification",
  //     date: new Date().toISOString(),
  //     priority: NotificationPriority.low,
  //     read: false,
  //   };
  //   notificationService.send(notification);
  // };

  return (
    <DrawerContentScrollView {...props}>
      {/* <Button title="Add Notification" onPress={addNotification} /> */}
      <DrawerItemList {...props} />
      <DrawerItem label="Sign Out" onPress={signOut} />
    </DrawerContentScrollView>
  );
}

export default function LoggedInLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/auth/" />;
  }

  return (
    <Drawer drawerContent={CustomDrawerContent} backBehavior="history">
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerRight: () => {
            return (
              <View>
                <NotificationList />
                <NotificationDialog />
              </View>
            );
          },
        }}
      />
      <Drawer.Screen
        name="projects/index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Projects",
          title: "Projects",
          headerRight: () => {
            return (
              <View>
                <NotificationList />
                <NotificationDialog />
              </View>
            );
          },
        }}
      />
      <Drawer.Screen
        name="projects/[id]" // This is the name of the page and must match the url from root
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: "Project",
          title: "Project",
          headerRight: () => {
            return (
              <View>
                <NotificationList />
                <NotificationDialog />
              </View>
            );
          },
        }}
      />
      <Drawer.Screen
        name="stories/[id]" // This is the name of the page and must match the url from root
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: "Story",
          title: "Story",
          headerRight: () => {
            return (
              <View>
                <NotificationList />
                <NotificationDialog />
              </View>
            );
          },
        }}
      />
      <Drawer.Screen
        name="tasks/[id]" // This is the name of the page and must match the url from root
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: "Task",
          title: "Task",
          headerRight: () => {
            return (
              <View>
                <NotificationList />
                <NotificationDialog />
              </View>
            );
          },
        }}
      />
      <Drawer.Screen
        name="settings" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          headerRight: () => {
            return (
              <View>
                <NotificationList />
                <NotificationDialog />
              </View>
            );
          },
        }}
      />
    </Drawer>
  );
}
