import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  label = 'Loading...'
}) => {
  return (
    <div className={styles.container}>
      <div 
        className={`${styles.spinner} ${styles[size]}`}
        role="status"
        aria-label={label}
      >
        <span className={styles.visuallyHidden}>{label}</span>
      </div>
    </div>
  );
};