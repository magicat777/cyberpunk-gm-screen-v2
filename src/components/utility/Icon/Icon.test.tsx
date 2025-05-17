import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon name="dice-d20" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders with default size', () => {
    const { container } = render(<Icon name="dice-d20" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders with specified size', () => {
    const { container } = render(<Icon name="dice-d20" size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('applies custom color', () => {
    const { container } = render(<Icon name="dice-d20" color="red" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'red');
  });

  it('applies custom className', () => {
    const { container } = render(<Icon name="dice-d20" className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
    expect(svg).toHaveClass('icon');
  });

  it('renders title when provided', () => {
    render(<Icon name="dice-d20" title="Roll dice" />);
    expect(screen.getByText('Roll dice')).toBeInTheDocument();
  });

  it('uses aria-label when provided', () => {
    render(<Icon name="dice-d20" aria-label="D20 dice icon" />);
    expect(screen.getByLabelText('D20 dice icon')).toBeInTheDocument();
  });

  it('falls back to title for aria-label', () => {
    render(<Icon name="dice-d20" title="Roll dice" />);
    expect(screen.getByLabelText('Roll dice')).toBeInTheDocument();
  });

  it('falls back to name for aria-label', () => {
    render(<Icon name="dice-d20" />);
    expect(screen.getByLabelText('dice-d20')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Icon name="dice-d20" onClick={handleClick} />);
    const svg = screen.getByRole('img');
    fireEvent.click(svg);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets cursor pointer when onClick is provided', () => {
    const { container } = render(<Icon name="dice-d20" onClick={() => {}} />);
    const svg = container.querySelector('svg');
    expect(svg?.style.cursor).toBe('pointer');
  });

  it('warns when icon name is not found', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Icon name="non-existent-icon" as any />);
    expect(consoleSpy).toHaveBeenCalledWith('Icon "non-existent-icon" not found');
    consoleSpy.mockRestore();
  });

  it('returns null for non-existent icon', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Icon name="non-existent-icon" as any />);
    expect(container.firstChild).toBeNull();
    consoleSpy.mockRestore();
  });

  it('renders multiple paths for complex icons', () => {
    const { container } = render(<Icon name="intelligence" />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(1);
  });
});