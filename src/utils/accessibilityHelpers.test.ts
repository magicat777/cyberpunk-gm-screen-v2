import { describe, it, expect, vi } from 'vitest';
import { handleKeyboardClick } from './accessibilityHelpers';

describe('accessibilityHelpers', () => {
  describe('handleKeyboardClick', () => {
    it('should call onClick when Enter key is pressed', () => {
      const onClick = vi.fn();
      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      handleKeyboardClick(event, onClick);

      expect(onClick).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call onClick when Space key is pressed', () => {
      const onClick = vi.fn();
      const event = {
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      handleKeyboardClick(event, onClick);

      expect(onClick).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not call onClick for other keys', () => {
      const onClick = vi.fn();
      const event = {
        key: 'a',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      handleKeyboardClick(event, onClick);

      expect(onClick).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});