// Store types for the Cyberpunk GM Screen application

export interface DiceRoll {
  id: string;
  type: string;
  result: number;
  rolls: number[];
  modifier: number;
  timestamp: Date;
  exploded?: boolean;
}

export interface GameSession {
  id: string;
  name: string;
  createdAt: Date;
  lastUpdated: Date;
  notes: string;
  combatEncounters: CombatEncounter[];
}

export interface CombatEncounter {
  id: string;
  name: string;
  participants: CombatParticipant[];
  currentTurn: number;
  round: number;
  isActive: boolean;
}

export interface CombatParticipant {
  id: string;
  name: string;
  initiative: number;
  hitPoints: number;
  maxHitPoints: number;
  isNPC: boolean;
  notes?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  stats: CharacterStats;
  skills: CharacterSkills;
  cyberware: Cyberware[];
  weapons: Weapon[];
  armor: Armor[];
  gear: GearItem[];
}

export interface CharacterStats {
  intelligence: number;
  reflexes: number;
  dexterity: number;
  technology: number;
  cool: number;
  will: number;
  luck: number;
  move: number;
  body: number;
  empathy: number;
}

export interface CharacterSkills {
  [key: string]: number;
}

export interface Cyberware {
  id: string;
  name: string;
  type: string;
  description: string;
  humanityLoss: number;
  installed: boolean;
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: string;
  rateOfFire: number;
  magazine: number;
  currentAmmo: number;
  concealability: string;
  availability: string;
  cost: number;
}

export interface Armor {
  id: string;
  name: string;
  stoppingPower: number;
  encumbrance: number;
  locations: string[];
  cost: number;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  weight: number;
  cost: number;
  quantity: number;
}

export interface RulesReference {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  bookmarked: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'cyberpunk' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  defaultDiceColor: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  duration?: number;
}