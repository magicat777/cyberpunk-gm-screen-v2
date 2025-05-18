import { StateCreator } from 'zustand';
import { GameSession, LootItem, ReputationChange, SessionPlayer, SessionNPC } from '../types';

export interface SessionSlice {
  // State
  currentSession: GameSession | null;
  sessions: GameSession[];
  campaigns: Campaign[];
  isLoading: boolean;
  
  // Actions
  createSession: (title: string, campaignId?: string, description?: string) => void;
  loadSession: (id: string) => void;
  updateSession: (id: string, updates: Partial<GameSession>) => void;
  deleteSession: (id: string) => void;
  endSession: (id: string) => void;
  setCurrentSession: (session: GameSession | null) => void;
  setSessions: (sessions: GameSession[]) => void;
  addPlayer: (sessionId: string, player: SessionPlayer) => void;
  removePlayer: (sessionId: string, playerId: string) => void;
  addNPC: (sessionId: string, npc: SessionNPC) => void;
  removeNPC: (sessionId: string, npcId: string) => void;
  addLoot: (sessionId: string, loot: LootItem) => void;
  updateLoot: (sessionId: string, lootId: string, updates: Partial<LootItem>) => void;
  addReputationChange: (sessionId: string, change: ReputationChange) => void;
  updateSessionStatus: (sessionId: string, status: GameSession['status']) => void;
  createCampaign: (name: string, description?: string, gmNotes?: string) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  gmNotes?: string;
  createdAt: Date;
  lastUpdated: Date;
  sessions: string[];
  players: string[];
  tags: string[];
  status: 'active' | 'completed' | 'hiatus';
}

export const createSessionSlice: StateCreator<SessionSlice> = (set, get) => ({
  // Initial state
  currentSession: null,
  sessions: [],
  campaigns: [],
  isLoading: false,
  
  // Actions
  createSession: (title: string, campaignId?: string, description?: string) => {
    const campaign = campaignId ? get().campaigns.find(c => c.id === campaignId) : null;
    const sessionNumber = campaign 
      ? get().sessions.filter(s => s.campaignId === campaignId).length + 1
      : undefined;
    
    const newSession: GameSession = {
      id: crypto.randomUUID(),
      name: title,
      title,
      createdAt: new Date(),
      lastUpdated: new Date(),
      startTime: new Date(),
      notes: '',
      description,
      combatEncounters: [],
      players: [],
      tags: [],
      status: 'active',
      npcs: [],
      loot: [],
      experienceAwarded: 0,
      reputationChanges: [],
      sessionNumber,
      campaignId
    };
    
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSession: newSession,
    }));
    
    if (campaign) {
      get().updateCampaign(campaignId!, { 
        sessions: [...campaign.sessions, newSession.id],
        lastUpdated: new Date()
      });
    }
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
  
  endSession: (id: string) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id
          ? { ...session, status: 'completed' as const, endTime: new Date(), lastUpdated: new Date() }
          : session
      ),
      currentSession: state.currentSession?.id === id ? null : state.currentSession,
    }));
  },
  
  setCurrentSession: (session: GameSession | null) => {
    set({ currentSession: session });
  },
  
  setSessions: (sessions: GameSession[]) => {
    set({ sessions });
  },
  
  addPlayer: (sessionId: string, player: SessionPlayer) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              players: [...session.players, player],
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              players: [...state.currentSession.players, player],
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  removePlayer: (sessionId: string, playerId: string) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              players: session.players.filter(p => p.id !== playerId),
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              players: state.currentSession.players.filter(p => p.id !== playerId),
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  addNPC: (sessionId: string, npc: SessionNPC) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              npcs: [...session.npcs, npc],
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              npcs: [...state.currentSession.npcs, npc],
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  removeNPC: (sessionId: string, npcId: string) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              npcs: session.npcs.filter(n => n.id !== npcId),
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              npcs: state.currentSession.npcs.filter(n => n.id !== npcId),
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  addLoot: (sessionId: string, loot: LootItem) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              loot: [...session.loot, loot],
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              loot: [...state.currentSession.loot, loot],
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  updateLoot: (sessionId: string, lootId: string, updates: Partial<LootItem>) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              loot: session.loot.map(l => 
                l.id === lootId ? { ...l, ...updates } : l
              ),
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              loot: state.currentSession.loot.map(l => 
                l.id === lootId ? { ...l, ...updates } : l
              ),
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  addReputationChange: (sessionId: string, change: ReputationChange) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              reputationChanges: [...session.reputationChanges, change],
              lastUpdated: new Date()
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { 
              ...state.currentSession, 
              reputationChanges: [...state.currentSession.reputationChanges, change],
              lastUpdated: new Date()
            }
          : state.currentSession,
    }));
  },
  
  updateSessionStatus: (sessionId: string, status: GameSession['status']) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, status, lastUpdated: new Date() }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { ...state.currentSession, status, lastUpdated: new Date() }
          : state.currentSession,
    }));
  },
  
  createCampaign: (name: string, description?: string, gmNotes?: string) => {
    const newCampaign: Campaign = {
      id: crypto.randomUUID(),
      name,
      description,
      gmNotes,
      createdAt: new Date(),
      lastUpdated: new Date(),
      sessions: [],
      players: [],
      tags: [],
      status: 'active'
    };
    
    set((state) => ({
      campaigns: [...state.campaigns, newCampaign]
    }));
  },
  
  updateCampaign: (id: string, updates: Partial<Campaign>) => {
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id
          ? { ...campaign, ...updates, lastUpdated: new Date() }
          : campaign
      ),
    }));
  },
  
  deleteCampaign: (id: string) => {
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
      // Also remove campaignId from sessions
      sessions: state.sessions.map((session) =>
        session.campaignId === id
          ? { ...session, campaignId: undefined }
          : session
      ),
    }));
  },
});