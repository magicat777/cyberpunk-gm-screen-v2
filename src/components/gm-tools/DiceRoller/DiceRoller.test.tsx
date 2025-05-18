import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiceRoller } from './DiceRoller';
import * as store from '@/store';
import * as sound from '@/utils/sound';

// Mock the store
vi.mock('@/store', () => ({
  useDice: vi.fn(),
}));

// Mock the sound utils
vi.mock('@/utils/sound', () => ({
  useSound: vi.fn(),
}));

describe('DiceRoller', () => {
  const mockRollDice = vi.fn();
  const mockClearHistory = vi.fn();
  const mockRemoveRoll = vi.fn();
  const mockPlayDiceRoll = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (store.useDice as any).mockReturnValue({
      rollDice: mockRollDice,
      diceHistory: [],
      clearHistory: mockClearHistory,
      removeRoll: mockRemoveRoll,
      isRolling: false,
    });

    (sound.useSound as any).mockReturnValue({
      playDiceRoll: mockPlayDiceRoll,
    });
  });

  it('should render dice roller component', () => {
    render(<DiceRoller />);
    
    expect(screen.getByText('Dice Roller')).toBeInTheDocument();
    expect(screen.getByText('Quick Roll')).toBeInTheDocument();
    expect(screen.getByText('Custom Roll')).toBeInTheDocument();
  });

  it('should handle quick roll button clicks', () => {
    mockRollDice.mockReturnValue({ result: 10 });
    render(<DiceRoller />);
    
    const d6Button = screen.getByLabelText('Quick roll d6');
    fireEvent.click(d6Button);
    
    expect(mockRollDice).toHaveBeenCalledWith('d6', 1, 0, false);
    expect(mockPlayDiceRoll).toHaveBeenCalledWith(10, 6);
  });

  it('should handle custom roll with modifiers', () => {
    mockRollDice.mockReturnValue({ result: 15 });
    render(<DiceRoller />);
    
    const rollButton = screen.getByText(/Roll 1d6/);
    fireEvent.click(rollButton);
    
    expect(mockRollDice).toHaveBeenCalledWith('d6', 1, 0, false);
  });

  it('should display roll history when available', () => {
    const mockHistory = [{
      id: '1',
      type: 'd6',
      result: 4,
      rolls: [4],
      modifier: 0,
      timestamp: Date.now(),
      exploded: false,
    }];

    (store.useDice as any).mockReturnValue({
      rollDice: mockRollDice,
      diceHistory: mockHistory,
      clearHistory: mockClearHistory,
      removeRoll: mockRemoveRoll,
      isRolling: false,
    });

    render(<DiceRoller />);
    
    expect(screen.getByText('Last Roll')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});