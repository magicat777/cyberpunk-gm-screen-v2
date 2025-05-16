import { StateCreator } from 'zustand';
import { DiceRoll } from '../types';

export interface DiceSlice {
  // State
  diceHistory: DiceRoll[];
  isRolling: boolean;
  
  // Actions
  rollDice: (type: string, count: number, modifier?: number, exploding?: boolean) => DiceRoll;
  clearHistory: () => void;
  removeRoll: (id: string) => void;
}

export const createDiceSlice: StateCreator<DiceSlice> = (set, get) => ({
  // Initial state
  diceHistory: [],
  isRolling: false,
  
  // Actions
  rollDice: (type: string, count: number, modifier = 0, exploding = false) => {
    set({ isRolling: true });
    
    const diceType = parseInt(type.replace('d', ''));
    const rolls: number[] = [];
    let totalRolls = count;
    
    // Roll the dice
    for (let i = 0; i < count; i++) {
      let roll = Math.floor(Math.random() * diceType) + 1;
      rolls.push(roll);
      
      // Handle exploding dice (Cyberpunk Red critical hits)
      if (exploding && roll === diceType) {
        let explodedRoll = Math.floor(Math.random() * diceType) + 1;
        rolls.push(explodedRoll);
        while (explodedRoll === diceType) {
          explodedRoll = Math.floor(Math.random() * diceType) + 1;
          rolls.push(explodedRoll);
        }
      }
    }
    
    const result = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    
    const newRoll: DiceRoll = {
      id: Date.now().toString(),
      type: `${count}d${diceType}${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''}`,
      result,
      rolls,
      modifier,
      timestamp: new Date(),
      exploded: exploding,
    };
    
    set((state) => ({
      diceHistory: [newRoll, ...state.diceHistory].slice(0, 100), // Keep last 100 rolls
      isRolling: false,
    }));
    
    return newRoll;
  },
  
  clearHistory: () => {
    set({ diceHistory: [] });
  },
  
  removeRoll: (id: string) => {
    set((state) => ({
      diceHistory: state.diceHistory.filter((roll) => roll.id !== id),
    }));
  },
});