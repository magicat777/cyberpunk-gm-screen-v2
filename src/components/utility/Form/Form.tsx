import React from 'react';
import clsx from 'clsx';
import { FormProps } from '@/types/form';
import styles from './Form.module.css';

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className,
  noValidate = false,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(styles.form, className)}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
};