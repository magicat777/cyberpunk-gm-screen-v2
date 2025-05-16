import { StateCreator } from 'zustand';
import { NotificationItem } from '../types';

export interface NotificationSlice {
  // State
  notifications: NotificationItem[];
  
  // Actions
  addNotification: (
    type: NotificationItem['type'],
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (set, get) => ({
  // Initial state
  notifications: [],
  
  // Actions
  addNotification: (
    type: NotificationItem['type'],
    message: string,
    duration = 5000
  ) => {
    const notification: NotificationItem = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      duration,
    };
    
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, duration);
    }
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  },
});