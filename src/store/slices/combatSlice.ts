import { StateCreator } from 'zustand';
import { CombatEncounter, CombatParticipant, CombatLogEntry, StatusCondition } from '../types';

export interface CombatSlice {
  // State
  combatEncounters: CombatEncounter[];
  activeCombat: CombatEncounter | null;
  
  // Actions
  createEncounter: (name: string) => void;
  deleteEncounter: (encounterId: string) => void;
  addParticipant: (encounterId: string, participant: CombatParticipant) => void;
  updateParticipant: (encounterId: string, participantId: string, updates: Partial<CombatParticipant>) => void;
  removeParticipant: (encounterId: string, participantId: string) => void;
  startCombat: (encounterId: string) => void;
  endCombat: (encounterId: string) => void;
  pauseCombat: (encounterId: string) => void;
  resumeCombat: (encounterId: string) => void;
  nextTurn: (encounterId: string) => void;
  previousTurn: (encounterId: string) => void;
  sortByInitiative: (encounterId: string) => void;
  addCondition: (encounterId: string, participantId: string, condition: StatusCondition) => void;
  removeCondition: (encounterId: string, participantId: string, conditionId: string) => void;
  updateCondition: (encounterId: string, participantId: string, conditionId: string, updates: Partial<StatusCondition>) => void;
  addLogEntry: (encounterId: string, entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => void;
  clearLog: (encounterId: string) => void;
  setEnvironmentalFactors: (encounterId: string, factors: string[]) => void;
  setCombatEncounters: (encounters: CombatEncounter[]) => void;
  setActiveCombat: (combat: CombatEncounter | null) => void;
}

export const createCombatSlice: StateCreator<CombatSlice> = (set, get) => ({
  // Initial state
  combatEncounters: [],
  activeCombat: null,
  
  // Actions
  createEncounter: (name: string) => {
    const newEncounter: CombatEncounter = {
      id: crypto.randomUUID(),
      name,
      participants: [],
      currentTurn: 0,
      round: 1,
      isActive: false,
      isPaused: false,
      combatLog: []
    };
    
    set((state) => ({
      combatEncounters: [...state.combatEncounters, newEncounter],
    }));
    
    get().addLogEntry(newEncounter.id, {
      action: 'Encounter created',
      type: 'system',
      round: 0
    });
  },
  
  deleteEncounter: (encounterId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.filter(e => e.id !== encounterId),
      activeCombat: state.activeCombat?.id === encounterId ? null : state.activeCombat
    }));
  },
  
  addParticipant: (encounterId: string, participant: CombatParticipant) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, participants: [...encounter.participants, participant] }
          : encounter
      ),
      activeCombat: state.activeCombat?.id === encounterId
        ? { ...state.activeCombat, participants: [...state.activeCombat.participants, participant] }
        : state.activeCombat
    }));
    
    get().addLogEntry(encounterId, {
      action: `${participant.name} joined combat`,
      participantId: participant.id,
      type: 'system',
      round: get().combatEncounters.find(e => e.id === encounterId)?.round || 1
    });
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
    const participant = get().combatEncounters
      .find(e => e.id === encounterId)
      ?.participants.find(p => p.id === participantId);
    
    if (participant) {
      get().addLogEntry(encounterId, {
        action: `${participant.name} removed from combat`,
        participantId: participant.id,
        type: 'system',
        round: get().combatEncounters.find(e => e.id === encounterId)?.round || 1
      });
    }
    
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: encounter.participants.filter((p) => p.id !== participantId),
            }
          : encounter
      ),
      activeCombat: state.activeCombat?.id === encounterId
        ? {
            ...state.activeCombat,
            participants: state.activeCombat.participants.filter((p) => p.id !== participantId),
          }
        : state.activeCombat
    }));
  },
  
  startCombat: (encounterId: string) => {
    const encounter = get().combatEncounters.find((e) => e.id === encounterId);
    if (encounter) {
      const activeEncounter = {
        ...encounter,
        isActive: true,
        isPaused: false,
        currentTurn: 0,
        round: 1,
        startTime: new Date()
      };
      
      set((state) => ({
        combatEncounters: state.combatEncounters.map((e) =>
          e.id === encounterId ? activeEncounter : e
        ),
        activeCombat: activeEncounter,
      }));
      
      get().addLogEntry(encounterId, {
        action: 'Combat started',
        type: 'system',
        round: 1
      });
    }
  },
  
  endCombat: (encounterId: string) => {
    get().addLogEntry(encounterId, {
      action: 'Combat ended',
      type: 'system',
      round: get().combatEncounters.find(e => e.id === encounterId)?.round || 1
    });
    
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, isActive: false, endTime: new Date() }
          : encounter
      ),
      activeCombat: state.activeCombat?.id === encounterId ? null : state.activeCombat,
    }));
  },
  
  pauseCombat: (encounterId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, isPaused: true }
          : encounter
      ),
      activeCombat: state.activeCombat?.id === encounterId
        ? { ...state.activeCombat, isPaused: true }
        : state.activeCombat
    }));
  },
  
  resumeCombat: (encounterId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, isPaused: false }
          : encounter
      ),
      activeCombat: state.activeCombat?.id === encounterId
        ? { ...state.activeCombat, isPaused: false }
        : state.activeCombat
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
      
      // Update participant hasActed status
      const participants = encounter.participants.map((p, index) => ({
        ...p,
        hasActed: index === encounter.currentTurn ? true : (isNewRound ? false : p.hasActed)
      }));
      
      const updatedEncounter = {
        ...encounter,
        currentTurn,
        round,
        participants
      };
      
      // Add log entry for new round
      if (isNewRound) {
        get().addLogEntry(encounterId, {
          action: `Round ${round} started`,
          type: 'system',
          round
        });
      }
      
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
  
  addCondition: (encounterId: string, participantId: string, condition: StatusCondition) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: encounter.participants.map((p) =>
                p.id === participantId
                  ? { ...p, conditions: [...p.conditions, condition] }
                  : p
              ),
            }
          : encounter
      ),
    }));
    
    const participant = get().combatEncounters
      .find(e => e.id === encounterId)
      ?.participants.find(p => p.id === participantId);
    
    if (participant) {
      get().addLogEntry(encounterId, {
        action: `${participant.name} gained condition: ${condition.name}`,
        participantId,
        type: 'status',
        round: get().combatEncounters.find(e => e.id === encounterId)?.round || 1
      });
    }
  },
  
  removeCondition: (encounterId: string, participantId: string, conditionId: string) => {
    const participant = get().combatEncounters
      .find(e => e.id === encounterId)
      ?.participants.find(p => p.id === participantId);
    
    const condition = participant?.conditions.find(c => c.id === conditionId);
    
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: encounter.participants.map((p) =>
                p.id === participantId
                  ? {
                      ...p,
                      conditions: p.conditions.filter((c) => c.id !== conditionId),
                    }
                  : p
              ),
            }
          : encounter
      ),
    }));
    
    if (participant && condition) {
      get().addLogEntry(encounterId, {
        action: `${participant.name} lost condition: ${condition.name}`,
        participantId,
        type: 'status',
        round: get().combatEncounters.find(e => e.id === encounterId)?.round || 1
      });
    }
  },
  
  updateCondition: (encounterId: string, participantId: string, conditionId: string, updates: Partial<StatusCondition>) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              participants: encounter.participants.map((p) =>
                p.id === participantId
                  ? {
                      ...p,
                      conditions: p.conditions.map((c) =>
                        c.id === conditionId ? { ...c, ...updates } : c
                      ),
                    }
                  : p
              ),
            }
          : encounter
      ),
    }));
  },
  
  addLogEntry: (encounterId: string, entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => {
    const logEntry: CombatLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? {
              ...encounter,
              combatLog: [...encounter.combatLog, logEntry],
            }
          : encounter
      ),
    }));
  },
  
  clearLog: (encounterId: string) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, combatLog: [] }
          : encounter
      ),
    }));
  },
  
  setEnvironmentalFactors: (encounterId: string, factors: string[]) => {
    set((state) => ({
      combatEncounters: state.combatEncounters.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, environmentalFactors: factors }
          : encounter
      ),
    }));
  },
  
  setCombatEncounters: (encounters: CombatEncounter[]) => {
    set({ combatEncounters: encounters });
  },
  
  setActiveCombat: (combat: CombatEncounter | null) => {
    set({ activeCombat: combat });
  }
});