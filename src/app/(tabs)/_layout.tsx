import { Slot, router, Redirect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "@/providers/AuthProvider";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import NotificationList from "@/components/Notifications/NotificationList";
import { View } from "react-native-ui-lib";

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
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
              </View>
            );
          },
        }}
      />
    </Drawer>
  );
}
