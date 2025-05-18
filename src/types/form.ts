import { ReactNode } from 'react';

export interface BaseInputProps {
  id?: string;
  name?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
}

export interface TextAreaProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  autoFocus?: boolean;
  readOnly?: boolean;
  resizable?: boolean;
}

export interface CheckboxProps extends BaseInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

export interface RadioProps extends BaseInputProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export interface RadioGroupProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseInputProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options?: SelectOption[];
  multiple?: boolean;
  placeholder?: string;
  children?: ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SliderProps extends BaseInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
  showValue?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SwitchProps extends BaseInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelPosition?: 'start' | 'end';
}

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  'aria-label'?: string;
  title?: string;
}

export interface FormProps {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  noValidate?: boolean;
}

export interface FormGroupProps {
  children: ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export interface FormFieldProps {
  children: ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  htmlFor?: string;
}
