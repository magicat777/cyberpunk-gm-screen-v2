import { StateCreator } from 'zustand';
import { Encounter } from '@/types/encounter';

export interface EncountersSlice {
  // State
  savedEncounters: Encounter[];
  
  // Actions
  saveEncounter: (encounter: Encounter) => void;
  updateEncounter: (encounterId: string, updates: Partial<Encounter>) => void;
  deleteEncounter: (encounterId: string) => void;
  setSavedEncounters: (encounters: Encounter[]) => void;
}

export const createEncountersSlice: StateCreator<EncountersSlice> = (set) => ({
  // Initial state
  savedEncounters: [],
  
  // Actions
  saveEncounter: (encounter: Encounter) => {
    set((state) => ({
      savedEncounters: [...state.savedEncounters, encounter],
    }));
  },
  
  updateEncounter: (encounterId: string, updates: Partial<Encounter>) => {
    set((state) => ({
      savedEncounters: state.savedEncounters.map((encounter) =>
        encounter.id === encounterId ? { ...encounter, ...updates } : encounter
      ),
    }));
  },
  
  deleteEncounter: (encounterId: string) => {
    set((state) => ({
      savedEncounters: state.savedEncounters.filter(encounter => encounter.id !== encounterId),
    }));
  },
  
  setSavedEncounters: (encounters: Encounter[]) => {
    set({ savedEncounters: encounters });
  }
});