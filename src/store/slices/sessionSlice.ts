import { StateCreator } from 'zustand';
import { GameSession } from '../types';

export interface SessionSlice {
  // State
  currentSession: GameSession | null;
  sessions: GameSession[];
  isLoading: boolean;
  
  // Actions
  createSession: (name: string) => void;
  loadSession: (id: string) => void;
  updateSession: (id: string, updates: Partial<GameSession>) => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (session: GameSession | null) => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set, get) => ({
  // Initial state
  currentSession: null,
  sessions: [],
  isLoading: false,
  
  // Actions
  createSession: (name: string) => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      lastUpdated: new Date(),
      notes: '',
      combatEncounters: [],
    };
    
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSession: newSession,
    }));
  },
  
  loadSession: (id: string) => {
    const session = get().sessions.find((s) => s.id === id);
    if (session) {
      set({ currentSession: session });
    }
  },
  
  updateSession: (id: string, updates: Partial<GameSession>) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id
          ? { ...session, ...updates, lastUpdated: new Date() }
          : session
      ),
      currentSession:
        state.currentSession?.id === id
          ? { ...state.currentSession, ...updates, lastUpdated: new Date() }
          : state.currentSession,
    }));
  },
  
  deleteSession: (id: string) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      currentSession: state.currentSession?.id === id ? null : state.currentSession,
    }));
  },
  
  setCurrentSession: (session: GameSession | null) => {
    set({ currentSession: session });
  },
});