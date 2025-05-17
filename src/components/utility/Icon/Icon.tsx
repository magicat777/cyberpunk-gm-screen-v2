import React from 'react';
import clsx from 'clsx';
import { IconProps } from '@/types/icons';
import { iconPaths } from './iconPaths';
import styles from './Icon.module.css';

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className,
  title,
  'aria-label': ariaLabel,
  role = 'img',
  onClick
}) => {
  const svgSize = sizeMap[size];
  const paths = iconPaths[name];
  
  if (!paths) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      className={clsx(styles.icon, styles[`size-${size}`], className)}
      width={svgSize}
      height={svgSize}
      viewBox="0 0 24 24"
      fill={color}
      role={role}
      aria-label={ariaLabel || title || name}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      {title && <title>{title}</title>}
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
};