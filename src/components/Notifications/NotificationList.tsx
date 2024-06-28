import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { useNotifications } from "@/providers/NotificationProvider";
import { useObservable } from "rxjs-hooks";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import NotificationUnreadCount from "./NotificationUnreadCount";
import { Iconify } from "react-native-iconify";
import { map } from "rxjs";

const NotificationListModal: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const notificationService = useNotifications();
  const notifications = useObservable(
    () => notificationService.list().pipe(map((n) => [...n].reverse())),
    []
  );

  const toggleModal = () => {
    if (isModalVisible) {
      notificationService.markAllAsRead();
    }
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <Button onPress={toggleModal}>
        <Iconify icon="mingcute:notification-fill" size={20} color="#fff" />
        <NotificationUnreadCount />
      </Button>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text>{item.message}</Text>
                  <Text>{item.date}</Text>
                  <Text>{item.priority}</Text>
                  <Text>{item.read ? "Read" : "Unread"}</Text>
                </View>
              )}
            />
            <Button onPress={toggleModal}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    marginVertical: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationListModal;
