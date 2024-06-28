import { BehaviorSubject, Observable } from "rxjs";

type ISOString = string;

export enum NotificationPriority {
  low = "low",
  medium = "medium",
  high = "high",
}

export type Notification = {
  title: string;
  message: string;
  date: ISOString;
  priority: NotificationPriority;
  read: boolean;
};

export class NotificationService {
  private notificationsSubject: BehaviorSubject<Notification[]> =
    new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  constructor() {
    this.updateUnreadCount();
  }

  send(notification: Notification): void {
    const notifications = this.notificationsSubject.getValue();
    notifications.push(notification);
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();

    if (
      notification.priority === NotificationPriority.high ||
      notification.priority === NotificationPriority.medium
    ) {
      alert(
        "new important notification" +
          "\n" +
          notification.title +
          "\n" +
          notification.message
      );
    }
  }

  list(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  private updateUnreadCount(): void {
    const notifications = this.notificationsSubject.getValue();
    const unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;
    this.unreadCountSubject.next(unreadCount);
  }

  markAsRead(notification: Notification): void {
    const notifications = this.notificationsSubject.getValue();
    const index = notifications.findIndex((n) => n === notification);
    if (index !== -1) {
      notifications[index] = { ...notification, read: true };
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.getValue();
    notifications.forEach((notification) => {
      notification.read = true;
    });
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
  }
}

export const notificationService = new NotificationService();
export default notificationService;
