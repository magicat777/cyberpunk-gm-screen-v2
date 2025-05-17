import React, { useId, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { CheckboxProps } from '@/types/form';
import { Icon } from '@/components/utility/Icon';
import styles from './Form.module.css';

export const Checkbox: React.FC<CheckboxProps> = ({
  id: providedId,
  name,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  checked,
  onChange,
  indeterminate = false,
}) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = Boolean(error);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div
      className={clsx(
        styles.checkboxWrapper,
        {
          [styles.hasError]: hasError,
          [styles.disabled]: disabled,
        },
        className
      )}
    >
      <div className={styles.checkboxContainer}>
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={styles.checkboxInput}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
        />
        
        <span className={styles.checkboxBox}>
          {checked && !indeterminate && (
            <Icon name="success" size="sm" className={styles.checkIcon} />
          )}
          {indeterminate && (
            <span className={styles.indeterminateIcon}>—</span>
          )}
        </span>
        
        {label && (
          <label htmlFor={inputId} className={styles.checkboxLabel}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};