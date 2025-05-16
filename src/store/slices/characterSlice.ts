import { StateCreator } from 'zustand';
import { Character } from '../types';

export interface CharacterSlice {
  // State
  characters: Character[];
  selectedCharacter: Character | null;
  
  // Actions
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  selectCharacter: (id: string | null) => void;
  importCharacter: (characterData: string) => void;
  exportCharacter: (id: string) => string;
}

export const createCharacterSlice: StateCreator<CharacterSlice> = (set, get) => ({
  // Initial state
  characters: [],
  selectedCharacter: null,
  
  // Actions
  addCharacter: (character: Character) => {
    set((state) => ({
      characters: [...state.characters, character],
    }));
  },
  
  updateCharacter: (id: string, updates: Partial<Character>) => {
    set((state) => ({
      characters: state.characters.map((character) =>
        character.id === id ? { ...character, ...updates } : character
      ),
      selectedCharacter:
        state.selectedCharacter?.id === id
          ? { ...state.selectedCharacter, ...updates }
          : state.selectedCharacter,
    }));
  },
  
  deleteCharacter: (id: string) => {
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
      selectedCharacter:
        state.selectedCharacter?.id === id ? null : state.selectedCharacter,
    }));
  },
  
  selectCharacter: (id: string | null) => {
    if (id === null) {
      set({ selectedCharacter: null });
      return;
    }
    
    const character = get().characters.find((c) => c.id === id);
    if (character) {
      set({ selectedCharacter: character });
    }
  },
  
  importCharacter: (characterData: string) => {
    try {
      const character: Character = JSON.parse(characterData);
      // Ensure the character has a unique ID
      character.id = Date.now().toString();
      get().addCharacter(character);
    } catch (error) {
      console.error('Failed to import character:', error);
    }
  },
  
  exportCharacter: (id: string) => {
    const character = get().characters.find((c) => c.id === id);
    if (character) {
      return JSON.stringify(character, null, 2);
    }
    return '';
  },
});