import React from 'react';
import clsx from 'clsx';
import { FormFieldProps } from '@/types/form';
import styles from './Form.module.css';

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  required = false,
  error,
  helperText,
  className,
  htmlFor,
}) => {
  const hasError = Boolean(error);

  return (
    <div
      className={clsx(
        styles.formField,
        {
          [styles.hasError]: hasError,
        },
        className
      )}
    >
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};