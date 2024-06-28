import React from "react";
import { View, Text } from "react-native-ui-lib";
import { useNotifications } from "@/providers/NotificationProvider";
import { useObservable } from "rxjs-hooks";

const UnreadCount: React.FC = () => {
  const notificationService = useNotifications();
  const unreadCount = useObservable(() => notificationService.unreadCount(), 0);

  return (
    <View>
      <Text
        style={{
          color: "#fff",
        }}
      >
        {unreadCount}
      </Text>
    </View>
  );
};

export default UnreadCount;
