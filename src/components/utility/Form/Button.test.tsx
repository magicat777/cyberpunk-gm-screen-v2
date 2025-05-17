import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Icon } from '@/components/utility/Icon';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('button-primary');
  });

  it('applies size styles', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('button-lg');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders icon at start position', () => {
    render(
      <Button icon={<Icon name="save" />} iconPosition="start">
        Save
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('icon-start');
  });

  it('renders icon at end position', () => {
    render(
      <Button icon={<Icon name="save" />} iconPosition="end">
        Save
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('icon-end');
  });

  it('renders as icon-only button', () => {
    const { container } = render(<Button icon={<Icon name="save" />} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('iconOnly');
  });

  it('sets button type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('button');
  });

  it('applies aria-label', () => {
    render(<Button aria-label="Save document">Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Save document');
  });

  it('applies title', () => {
    render(<Button title="Save the document">Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Save the document');
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not trigger onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Loading</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});