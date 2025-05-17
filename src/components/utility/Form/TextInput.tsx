import React, { useId } from 'react';
import clsx from 'clsx';
import { TextInputProps } from '@/types/form';
import { Icon } from '@/components/utility/Icon';
import styles from './Form.module.css';

export const TextInput: React.FC<TextInputProps> = ({
  id: providedId,
  name,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  fullWidth = false,
  type = 'text',
  value,
  onChange,
  placeholder,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false,
  readOnly = false,
}) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={clsx(
        styles.inputWrapper,
        {
          [styles.fullWidth]: fullWidth,
          [styles.hasError]: hasError,
          [styles.disabled]: disabled,
        },
        className
      )}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputContainer}>
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={clsx(styles.input, styles.textInput)}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
        />
        
        {hasError && (
          <Icon
            name="error"
            size="sm"
            className={styles.errorIcon}
            aria-hidden="true"
          />
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