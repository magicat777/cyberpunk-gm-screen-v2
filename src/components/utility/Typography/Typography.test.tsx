import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders with default props', () => {
    render(<Typography>Test Text</Typography>);
    const element = screen.getByText('Test Text');
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe('p');
  });

  it('renders correct HTML element for each variant', () => {
    const variants = [
      { variant: 'h1', expectedTag: 'h1' },
      { variant: 'h2', expectedTag: 'h2' },
      { variant: 'h3', expectedTag: 'h3' },
      { variant: 'h4', expectedTag: 'h4' },
      { variant: 'h5', expectedTag: 'h5' },
      { variant: 'h6', expectedTag: 'h6' },
      { variant: 'subtitle1', expectedTag: 'h6' },
      { variant: 'subtitle2', expectedTag: 'h6' },
      { variant: 'body1', expectedTag: 'p' },
      { variant: 'body2', expectedTag: 'p' },
      { variant: 'caption', expectedTag: 'span' },
      { variant: 'overline', expectedTag: 'span' },
    ];

    variants.forEach(({ variant, expectedTag }) => {
      const { container } = render(
        <Typography variant={variant as any}>
          {variant} text
        </Typography>
      );
      const element = container.querySelector(expectedTag);
      expect(element).toBeInTheDocument();
      expect(element?.textContent).toBe(`${variant} text`);
    });
  });

  it('applies custom component prop', () => {
    render(
      <Typography component="div" variant="h1">
        Custom Component
      </Typography>
    );
    const element = screen.getByText('Custom Component');
    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('applies weight classes correctly', () => {
    const { container } = render(
      <Typography weight="bold">Bold Text</Typography>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('weight-bold');
  });

  it('applies alignment classes correctly', () => {
    const { container } = render(
      <Typography align="center">Centered Text</Typography>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('align-center');
  });

  it('applies color classes correctly', () => {
    const { container } = render(
      <Typography color="primary">Primary Color</Typography>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('color-primary');
  });

  it('applies utility classes correctly', () => {
    const { container } = render(
      <Typography gutterBottom noWrap>
        Utility Test
      </Typography>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('gutterBottom');
    expect(element).toHaveClass('noWrap');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Typography className="custom-class">Custom Class</Typography>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveClass('typography');
  });

  it('applies inline styles via sx prop', () => {
    const { container } = render(
      <Typography sx={{ marginTop: '10px' }}>Styled Text</Typography>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.marginTop).toBe('10px');
  });

  it('passes through id prop', () => {
    render(<Typography id="test-id">ID Test</Typography>);
    const element = screen.getByText('ID Test');
    expect(element).toHaveAttribute('id', 'test-id');
  });
});