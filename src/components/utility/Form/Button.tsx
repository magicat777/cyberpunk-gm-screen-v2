import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from '@/types/form';
import { Icon } from '@/components/utility/Icon';
import styles from './Form.module.css';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className,
  icon,
  iconPosition = 'start',
  'aria-label': ariaLabel,
  title,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        styles.button,
        styles[`button-${variant}`],
        styles[`button-${size}`],
        {
          [styles.fullWidth]: fullWidth,
          [styles.disabled]: isDisabled,
          [styles.loading]: loading,
          [styles.iconOnly]: icon && !children,
          [styles[`icon-${iconPosition}`]]: icon && children,
        },
        className
      )}
      aria-label={ariaLabel}
      title={title}
      aria-busy={loading}
    >
      {loading && (
        <Icon
          name="settings"
          size="sm"
          className={clsx(styles.loadingIcon, styles.spinning)}
          aria-hidden="true"
        />
      )}
      
      {icon && iconPosition === 'start' && !loading && (
        <span className={styles.iconWrapper}>{icon}</span>
      )}
      
      {children && <span className={styles.buttonText}>{children}</span>}
      
      {icon && iconPosition === 'end' && !loading && (
        <span className={styles.iconWrapper}>{icon}</span>
      )}
    </button>
  );
};