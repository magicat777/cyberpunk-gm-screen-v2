import { useState } from 'react';
import { AppError } from '../../../types/errors';
import { Button } from '../Form/Button';
import { TextArea } from '../Form/TextArea';
import { Icon } from '../Icon';
import { useNotification } from '../../../hooks/useNotification';
import { ErrorLogger } from '../../../utils/errorLogger';
import styles from './ErrorReporter.module.css';

interface ErrorReporterProps {
  error: AppError;
  onClose: () => void;
  onReport?: (error: AppError, userMessage: string) => Promise<void>;
}

export function ErrorReporter({ error, onClose, onReport }: ErrorReporterProps) {
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async () => {
    if (!userMessage.trim()) {
      showError('Please describe what you were doing when the error occurred');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onReport) {
        await onReport(error, userMessage);
      } else {
        // Default behavior: log with additional context
        await ErrorLogger.log(error, { userReport: userMessage });
      }

      showSuccess('Error report submitted successfully');
      onClose();
    } catch (err) {
      showError('Failed to submit error report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Report Error</h3>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close reporter"
        >
          <Icon name="close" size="sm" />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.errorInfo}>
          <p className={styles.errorMessage}>{error.message}</p>
          <p className={styles.errorCode}>Error Code: {error.code}</p>
        </div>

        <TextArea
          label="What were you doing when this error occurred?"
          value={userMessage}
          onChange={(value) => setUserMessage(value)}
          placeholder="Please describe the steps that led to this error..."
          rows={4}
          fullWidth
        />

        <div className={styles.privacy}>
          <Icon name="shield" size="sm" />
          <p>Your report will include technical details to help us fix this issue.</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="tertiary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          startIcon={<Icon name="send" />}
        >
          Send Report
        </Button>
      </div>
    </div>
  );
}