import React from 'react';
import styles from './SkeletonScreen.module.css';

interface SkeletonScreenProps {
  variant?: 'text' | 'card' | 'list' | 'button';
  width?: string;
  height?: string;
  count?: number;
}

export const SkeletonScreen: React.FC<SkeletonScreenProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={styles.card} style={{ width, height }}>
            <div className={styles.header} />
            <div className={styles.body}>
              <div className={styles.line} />
              <div className={styles.line} />
              <div className={styles.line} style={{ width: '60%' }} />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={styles.list}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.circle} />
                <div className={styles.content}>
                  <div className={styles.line} />
                  <div className={styles.line} style={{ width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'button':
        return (
          <div 
            className={styles.button} 
            style={{ width: width || '120px', height: height || '40px' }}
          />
        );
      
      case 'text':
      default:
        return (
          <div className={styles.text} style={{ width, height }} />
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeleton}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};