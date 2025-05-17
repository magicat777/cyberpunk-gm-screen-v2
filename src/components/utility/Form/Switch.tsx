import React, { useId } from 'react';
import clsx from 'clsx';
import { SwitchProps } from '@/types/form';
import styles from './Form.module.css';

export const Switch: React.FC<SwitchProps> = ({
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
  labelPosition = 'end',
}) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const switchElement = (
    <div className={styles.switchContainer}>
      <input
        id={inputId}
        name={name}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={styles.switchInput}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
      />
      <span 
        className={clsx(styles.switchTrack, {
          [styles.switchChecked]: checked,
          [styles.switchDisabled]: disabled,
        })}
      >
        <span className={styles.switchThumb} />
      </span>
    </div>
  );

  return (
    <div
      className={clsx(
        styles.switchWrapper,
        {
          [styles.hasError]: hasError,
          [styles.disabled]: disabled,
        },
        className
      )}
    >
      <div className={clsx(styles.switchContent, styles[`label-${labelPosition}`])}>
        {label && labelPosition === 'start' && (
          <label htmlFor={inputId} className={styles.switchLabel}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        {switchElement}
        
        {label && labelPosition === 'end' && (
          <label htmlFor={inputId} className={styles.switchLabel}>
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