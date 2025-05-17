import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  actions?: NotificationAction[];
  timestamp: number;
}

export interface NotificationAction {
  label: string;
  action: () => void;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== newNotification.id)
        }));
      }, notification.duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  }
}));

export function useNotification() {
  const { addNotification, removeNotification, clearNotifications } = useNotificationStore();

  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    addNotification(notification);
  };

  const showSuccess = (message: string, title: string = 'Success') => {
    showNotification({
      title,
      message,
      type: 'success',
      duration: 3000
    });
  };

  const showError = (message: string, title: string = 'Error') => {
    showNotification({
      title,
      message,
      type: 'error',
      duration: 5000
    });
  };

  const showWarning = (message: string, title: string = 'Warning') => {
    showNotification({
      title,
      message,
      type: 'warning',
      duration: 4000
    });
  };

  const showInfo = (message: string, title: string = 'Info') => {
    showNotification({
      title,
      message,
      type: 'info',
      duration: 3000
    });
  };

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications
  };
}