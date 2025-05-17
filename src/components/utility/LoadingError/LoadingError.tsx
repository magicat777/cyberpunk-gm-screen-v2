import { Button } from '../Form/Button';
import { Icon } from '../Icon';
import styles from './LoadingError.module.css';

interface LoadingErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function LoadingError({ 
  message = 'Failed to load content', 
  onRetry,
  className 
}: LoadingErrorProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Icon 
        name="alert-circle" 
        size="xl" 
        className={styles.icon}
      />
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          startIcon={<Icon name="redo" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}