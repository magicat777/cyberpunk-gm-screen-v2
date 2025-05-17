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
  players: string[];
  tags: string[];
  status: 'planning' | 'active' | 'completed' | 'archived';
  synopsis?: string;
  npcs: string[];
  loot: LootItem[];
  experienceAwarded: number;
  reputationChanges: ReputationChange[];
  sessionNumber?: number;
  campaignId?: string;
}

export interface LootItem {
  id: string;
  name: string;
  description: string;
  value: number;
  quantity: number;
  receivedBy?: string;
}

export interface ReputationChange {
  id: string;
  character: string;
  amount: number;
  reason: string;
}

export interface CombatEncounter {
  id: string;
  name: string;
  participants: CombatParticipant[];
  currentTurn: number;
  round: number;
  isActive: boolean;
  isPaused: boolean;
  combatLog: CombatLogEntry[];
  environmentalFactors?: string[];
  startTime?: Date;
  endTime?: Date;
}

export interface CombatLogEntry {
  id: string;
  timestamp: Date;
  round: number;
  participantId?: string;
  action: string;
  details?: string;
  damage?: number;
  type: 'action' | 'damage' | 'status' | 'system';
}

export interface CombatParticipant {
  id: string;
  name: string;
  initiative: number;
  initiativeRoll?: number;
  reflexes?: number;
  hitPoints: number;
  maxHitPoints: number;
  seriouslyWounded: boolean;
  deathSave: number;
  isNPC: boolean;
  conditions: StatusCondition[];
  hasActed: boolean;
  delayedTurn: boolean;
  notes?: string;
  color?: string;
  characterId?: string;
}

export interface StatusCondition {
  id: string;
  name: string;
  duration?: number;
  isPersistent: boolean;
  effects: string[];
  icon?: string;
}

export interface InitiativeModifier {
  id: string;
  source: string;
  value: number;
  description: string;
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