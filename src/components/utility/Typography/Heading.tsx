import React from 'react';
import { Typography } from './Typography';
import { TypographyProps } from '@/types/typography';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps extends Omit<TypographyProps, 'variant'> {
  level?: HeadingLevel;
}

export const Heading: React.FC<HeadingProps> = ({ 
  level = 'h2',
  children,
  ...props 
}) => {
  return (
    <Typography variant={level} {...props}>
      {children}
    </Typography>
  );
};