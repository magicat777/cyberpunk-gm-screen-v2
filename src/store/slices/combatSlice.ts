import { StateCreator } from 'zustand';
import { CombatEncounter, CombatParticipant } from '../types';

export interface CombatSlice {
  // State
  combatEncounters: CombatEncounter[];
  activeCombat: CombatEncounter | null;
  
  // Actions
  createEncounter: (name: string) => void;
  addParticipant: (encounterId: string, participant: CombatParticipant) => void;
  updateParticipant: (encounterId: string, participantId: string, updates: Partial<CombatParticipant>) => void;
  removeParticipant: (encounterId: string, participantId: string) => void;
  startCombat: (encounterId: string) => void;
  endCombat: (encounterId: string) => void;
  nextTurn: (encounterId: string) => void;
  previousTurn: (encounterId: string) => void;
  sortByInitiative: (encounterId: string) => void;
}

export const createCombatSlice: StateCreator<CombatSlice> = (set, get) => ({
  // Initial state
  combatEncounters: [],
  activeCombat: null,
  
  // Actions
  createEncounter: (name: string) => {
    const newEncounter: CombatEncounter = {
      id: Date.now().toString(),
      name,
      participants: [],
      currentTurn: 0,
      round: 1,
      isActive: false,
    };
    
    set((state) => ({
      combatEncounters: [...state.combatEncounters, newEncounter],
    }));
  },
  
  addParticipant: (encounterId: string, participant: CombatParticipant) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, participants: [...encounter.participants, participant] }
          : encounter
      ),
    }));
  },
  
  updateParticipant: (encounterId: string, participantId: string, updates: Partial<CombatParticipant>) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: encounter.participants.map((p) =>
                p.id === participantId ? { ...p, ...updates } : p
              ),
            }
          : encounter
      ),
      activeCombat:
        state.activeCombat?.id === encounterId
          ? {
              ...state.activeCombat,
              participants: state.activeCombat.participants.map((p) =>
                p.id === participantId ? { ...p, ...updates } : p
              ),
            }
          : state.activeCombat,
    }));
  },
  
  removeParticipant: (encounterId: string, participantId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: encounter.participants.filter((p) => p.id !== participantId),
            }
          : encounter
      ),
    }));
  },
  
  startCombat: (encounterId: string) => {
    const encounter = get().combatEncounters.find((e) => e.id === encounterId);
    if (encounter) {
      const activeEncounter = {
        ...encounter,
        isActive: true,
        currentTurn: 0,
        round: 1,
      };
      
      set((state) => ({
        combatEncounters: state.combatEncounters.map((e) =>
          e.id === encounterId ? activeEncounter : e
        ),
        activeCombat: activeEncounter,
      }));
    }
  },
  
  endCombat: (encounterId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, isActive: false }
          : encounter
      ),
      activeCombat: state.activeCombat?.id === encounterId ? null : state.activeCombat,
    }));
  },
  
  nextTurn: (encounterId: string) => {
    set((state) => {
      const encounter = state.combatEncounters.find((e) => e.id === encounterId);
      if (!encounter) return state;
      
      const nextTurn = encounter.currentTurn + 1;
      const isNewRound = nextTurn >= encounter.participants.length;
      const currentTurn = isNewRound ? 0 : nextTurn;
      const round = isNewRound ? encounter.round + 1 : encounter.round;
      
      const updatedEncounter = {
        ...encounter,
        currentTurn,
        round,
      };
      
      return {
        combatEncounters: state.combatEncounters.map((e) =>
          e.id === encounterId ? updatedEncounter : e
        ),
        activeCombat: state.activeCombat?.id === encounterId ? updatedEncounter : state.activeCombat,
      };
    });
  },
  
  previousTurn: (encounterId: string) => {
    set((state) => {
      const encounter = state.combatEncounters.find((e) => e.id === encounterId);
      if (!encounter) return state;
      
      const previousTurn = encounter.currentTurn - 1;
      const isPreviousRound = previousTurn < 0;
      const currentTurn = isPreviousRound
        ? encounter.participants.length - 1
        : previousTurn;
      const round = isPreviousRound
        ? Math.max(1, encounter.round - 1)
        : encounter.round;
      
      const updatedEncounter = {
        ...encounter,
        currentTurn,
        round,
      };
      
      return {
        combatEncounters: state.combatEncounters.map((e) =>
          e.id === encounterId ? updatedEncounter : e
        ),
        activeCombat: state.activeCombat?.id === encounterId ? updatedEncounter : state.activeCombat,
      };
    });
  },
  
  sortByInitiative: (encounterId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: [...encounter.participants].sort(
                (a, b) => b.initiative - a.initiative
              ),
            }
          : encounter
      ),
      activeCombat:
        state.activeCombat?.id === encounterId
          ? {
              ...state.activeCombat,
              participants: [...state.activeCombat.participants].sort(
                (a, b) => b.initiative - a.initiative
              ),
            }
          : state.activeCombat,
    }));
  },
});