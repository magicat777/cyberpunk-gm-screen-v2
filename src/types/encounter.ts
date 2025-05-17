import { Character } from './game';

export interface Encounter {
  id: string;
  name: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  location?: string;
  participants: EncounterParticipant[];
  environment?: EnvironmentConditions;
  objectives?: string[];
  rewards?: EncounterReward[];
  notes?: string;
  tags?: string[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface EncounterParticipant {
  id: string;
  characterId?: string;
  character?: Character;
  name: string;
  type: 'player' | 'npc' | 'enemy';
  faction?: string;
  quantity: number;
  initiative?: number;
  hp?: {
    current: number;
    max: number;
  };
  combatRole?: 'melee' | 'ranged' | 'support' | 'tank' | 'hybrid';
  threat?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface EnvironmentConditions {
  lighting: 'bright' | 'normal' | 'dim' | 'dark';
  weather?: 'clear' | 'rain' | 'fog' | 'storm' | 'snow';
  terrain?: 'urban' | 'indoor' | 'badlands' | 'highway' | 'rooftop';
  cover?: 'none' | 'light' | 'moderate' | 'heavy';
  hazards?: string[];
  specialConditions?: string[];
}

export interface EncounterReward {
  id: string;
  type: 'eurodollars' | 'item' | 'cyberware' | 'information' | 'reputation';
  name: string;
  value?: number;
  quantity?: number;
  description?: string;
}

export interface EncounterTemplate {
  id: string;
  name: string;
  category: 'combat' | 'social' | 'stealth' | 'chase' | 'investigation' | 'mixed';
  description: string;
  suggestedParticipants: {
    type: string;
    minQuantity: number;
    maxQuantity: number;
    threat: 'low' | 'medium' | 'high';
  }[];
  suggestedEnvironment?: Partial<EnvironmentConditions>;
  suggestedObjectives: string[];
  suggestedRewards: Omit<EncounterReward, 'id'>[];
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  partySize: {
    min: number;
    max: number;
  };
}

export interface EncounterFilters {
  difficulty?: 'easy' | 'medium' | 'hard' | 'deadly';
  category?: string;
  location?: string;
  faction?: string;
  searchTerm?: string;
}