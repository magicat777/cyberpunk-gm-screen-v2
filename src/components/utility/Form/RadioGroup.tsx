import React, { useId } from 'react';
import clsx from 'clsx';
import { RadioGroupProps } from '@/types/form';
import styles from './Form.module.css';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  id: providedId,
  name,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  value,
  onChange,
  options,
  orientation = 'vertical',
}) => {
  const generatedId = useId();
  const groupId = providedId || generatedId;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <fieldset
      className={clsx(
        styles.radioGroupWrapper,
        {
          [styles.hasError]: hasError,
          [styles.disabled]: disabled,
        },
        className
      )}
      aria-describedby={
        error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined
      }
    >
      {label && (
        <legend className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </legend>
      )}
      
      <div
        className={clsx(
          styles.radioGroupContainer,
          styles[`orientation-${orientation}`]
        )}
        role="radiogroup"
        aria-required={required}
        aria-invalid={hasError}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isDisabled = disabled || option.disabled;
          
          return (
            <div key={option.value} className={styles.radioWrapper}>
              <input
                id={optionId}
                name={name || groupId}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={isDisabled}
                className={styles.radioInput}
              />
              <span className={styles.radioBox}>
                {value === option.value && (
                  <span className={styles.radioDot} />
                )}
              </span>
              <label
                htmlFor={optionId}
                className={clsx(styles.radioLabel, {
                  [styles.radioDisabled]: isDisabled,
                })}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      
      {error && (
        <span id={`${groupId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span id={`${groupId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </fieldset>
  );
};