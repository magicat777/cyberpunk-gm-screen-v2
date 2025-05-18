import React, { useId } from 'react';
import clsx from 'clsx';
import { SelectProps } from '@/types/form';
import { Icon } from '@/components/utility/Icon';
import styles from './Form.module.css';

export const Select: React.FC<SelectProps> = ({
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
  options,
  multiple = false,
  placeholder,
  children,
}) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
      onChange(selectedValues);
    } else {
      onChange(e.target.value);
    }
  };

  // Group options by group property
  const groupedOptions = options ? options.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, typeof options>) : {};

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
      
      <div className={styles.selectContainer}>
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          multiple={multiple}
          className={clsx(styles.input, styles.select)}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
        >
          {placeholder && !multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {/* Support both options prop and children */}
          {options ? (
            Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
              if (groupName) {
                return (
                  <optgroup key={groupName} label={groupName}>
                    {groupOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                );
              }
              
              return groupOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ));
            })
          ) : (
            children
          )}
        </select>
        
        <Icon
          name="chevron-down"
          size="sm"
          className={styles.selectIcon}
          aria-hidden="true"
        />
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