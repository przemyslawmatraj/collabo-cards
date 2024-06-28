import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNotifications } from "@/providers/NotificationProvider";
import { Notification } from "@/utils/NotificationService";
import { View } from "../Themed";

const NotificationDialog: React.FC = () => {
  const notificationService = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = notificationService
      .list()
      .subscribe((notifications) => {
        setNotifications(notifications);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      if (
        latestNotification.priority === "medium" ||
        latestNotification.priority === "high"
      ) {
        Alert.alert(latestNotification.title, latestNotification.message, [
          {
            text: "Mark as Read",
            onPress: () => notificationService.markAsRead(latestNotification),
          },
        ]);
      }
    }
  }, [notifications]);

  return <View></View>;
};

export default NotificationDialog;
