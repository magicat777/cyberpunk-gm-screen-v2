import React, { useId } from 'react';
import clsx from 'clsx';
import { TextAreaProps } from '@/types/form';
import styles from './Form.module.css';

export const TextArea: React.FC<TextAreaProps> = ({
  id: providedId,
  name,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  fullWidth = false,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  minLength,
  autoFocus = false,
  readOnly = false,
  resizable = true,
}) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoFocus={autoFocus}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          className={clsx(
            styles.input,
            styles.textArea,
            {
              [styles.noResize]: !resizable,
            }
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
        />
        
        {maxLength && (
          <span className={styles.charCount}>
            {value.length} / {maxLength}
          </span>
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