import React from 'react';
import clsx from 'clsx';
import { TypographyProps } from '@/types/typography';
import styles from './Typography.module.css';

const variantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'regular',
  align = 'inherit',
  color = 'inherit',
  gutterBottom = false,
  noWrap = false,
  className,
  children,
  component,
  id,
  sx,
}) => {
  const Component = (component || variantMapping[variant] || 'span') as React.ElementType;

  return (
    <Component
      id={id}
      className={clsx(
        styles.typography,
        styles[`variant-${variant}`],
        styles[`weight-${weight}`],
        styles[`align-${align}`],
        styles[`color-${color}`],
        {
          [styles.gutterBottom]: gutterBottom,
          [styles.noWrap]: noWrap,
        },
        className
      )}
      style={sx}
    >
      {children}
    </Component>
  );
};