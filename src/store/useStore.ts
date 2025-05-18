import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSessionSlice, SessionSlice } from './slices/sessionSlice';
import { createDiceSlice, DiceSlice } from './slices/diceSlice';
import { createCharacterSlice, CharacterSlice } from './slices/characterSlice';
import { createCombatSlice, CombatSlice } from './slices/combatSlice';
import { createPreferencesSlice, PreferencesSlice } from './slices/preferencesSlice';
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice';
import { createEncountersSlice, EncountersSlice } from './slices/encountersSlice';

export type StoreState = SessionSlice &
  DiceSlice &
  CharacterSlice &
  CombatSlice &
  PreferencesSlice &
  NotificationSlice &
  EncountersSlice;

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createSessionSlice(set, get, api),
        ...createDiceSlice(set, get, api),
        ...createCharacterSlice(set, get, api),
        ...createCombatSlice(set, get, api),
        ...createPreferencesSlice(set, get, api),
        ...createNotificationSlice(set, get, api),
        ...createEncountersSlice(set, get, api),
      }),
      {
        name: 'cyberpunk-gm-store',
        // Only persist certain slices
        partialize: (state) => ({
          // Session data
          currentSession: state.currentSession,
          sessions: state.sessions,
          // User preferences
          preferences: state.preferences,
          // Characters
          characters: state.characters,
          // Recent dice rolls (limited)
          diceHistory: state.diceHistory.slice(-20),
          // Combat encounters (Initiative Tracker)
          combatEncounters: state.combatEncounters,
          activeCombat: state.activeCombat,
          // Saved encounters (Encounter Builder)
          savedEncounters: state.savedEncounters,
        }),
      }
    ),
    {
      name: 'CyberpunkGMStore',
    }
  )
);