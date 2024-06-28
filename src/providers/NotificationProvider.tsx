import {
  type NotificationService,
  notificationService,
} from "@/utils/NotificationService";
import React, { PropsWithChildren, createContext, useContext } from "react";

const NotificationContext = createContext<NotificationService | null>(null);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  return (
    <NotificationContext.Provider value={notificationService}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationService => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
