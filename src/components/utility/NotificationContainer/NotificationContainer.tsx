import { useNotificationStore } from '../../../hooks/useNotification';
import { Icon } from '../Icon';
import { IconName } from '../../../types/icons';
import { NotificationType } from '../../../hooks/useNotification';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NotificationContainer.module.css';

const iconMap: Record<NotificationType, IconName> = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert-triangle',
  info: 'info-circle'
};

const colorMap: Record<NotificationType, string> = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)'
};

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={styles.notification}
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 300, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={styles.content}
              style={{ borderLeftColor: colorMap[notification.type] }}
            >
              <Icon
                name={iconMap[notification.type]}
                size="md"
                className={styles.icon}
                style={{ color: colorMap[notification.type] }}
              />
              
              <div className={styles.text}>
                <h4 className={styles.title}>{notification.title}</h4>
                <p className={styles.message}>{notification.message}</p>
                
                {notification.actions && (
                  <div className={styles.actions}>
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        className={styles.actionButton}
                        onClick={() => {
                          action.action();
                          removeNotification(notification.id);
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                className={styles.closeButton}
                onClick={() => removeNotification(notification.id)}
                aria-label="Close notification"
              >
                <Icon name="close" size="sm" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}