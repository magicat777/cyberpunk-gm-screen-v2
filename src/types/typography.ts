export type TypographyVariant = 
  | 'h1'
  | 'h2' 
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

export type TypographyWeight = 
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold' 
  | 'bold'
  | 'extrabold'
  | 'black';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyColor = 
  | 'primary'
  | 'secondary' 
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'text-primary'
  | 'text-secondary' 
  | 'text-disabled'
  | 'inherit';

export interface TypographyProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  color?: TypographyColor;
  gutterBottom?: boolean;
  noWrap?: boolean;
  className?: string;
  children: React.ReactNode;
  component?: keyof JSX.IntrinsicElements;
  id?: string;
  sx?: React.CSSProperties;
}
