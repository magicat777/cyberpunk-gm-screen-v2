export interface NetArchitecture {
  id: string;
  name: string;
  description: string;
  difficulty: 'basic' | 'standard' | 'uncommon' | 'advanced' | 'legendary';
  floors: NetFloor[];
  security: SecurityLevel;
  owner?: string;
  location?: string; // Map region ID
  tags?: string[];
  customNotes?: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface NetFloor {
  id: string;
  level: number;
  name: string;
  type: FloorType;
  difficulty: number; // DV for checks
  description: string;
  challenges: Challenge[];
  loot: DigitalLoot[];
  connections: FloorConnection[];
  visualStyle?: VisualStyle;
  isCompleted?: boolean;
}

export type FloorType = 
  | 'lobby'
  | 'password'
  | 'file_server'
  | 'control_node'
  | 'ice_layer'
  | 'data_vault'
  | 'system_core'
  | 'backdoor'
  | 'trap'
  | 'custom';

export interface Challenge {
  id: string;
  name: string;
  type: ChallengeType;
  difficulty: number;
  description: string;
  effects?: string[];
  damage?: string; // For Black ICE
  reward?: string;
}

export type ChallengeType = 
  | 'password'
  | 'firewall'
  | 'black_ice'
  | 'watchdog'
  | 'data_mine'
  | 'puzzle'
  | 'daemon'
  | 'virus'
  | 'trap';

export interface DigitalLoot {
  id: string;
  name: string;
  type: LootType;
  value: number; // In eurodollars
  description: string;
  encrypted?: boolean;
  size?: number; // In data units
}

export type LootType = 
  | 'data'
  | 'program'
  | 'credential'
  | 'money'
  | 'blackmail'
  | 'intel'
  | 'malware'
  | 'key';

export interface FloorConnection {
  fromFloor: string;
  toFloor: string;
  type: ConnectionType;
  isLocked?: boolean;
  requiredKey?: string;
}

export type ConnectionType = 
  | 'standard'
  | 'encrypted'
  | 'hidden'
  | 'trapped'
  | 'one_way';

export interface VisualStyle {
  theme: VisualTheme;
  primaryColor: string;
  secondaryColor: string;
  animation?: string;
}

export type VisualTheme = 
  | 'corporate'
  | 'military'
  | 'medical'
  | 'entertainment'
  | 'industrial'
  | 'abstract'
  | 'organic'
  | 'retro'
  | 'custom';

export interface SecurityLevel {
  rating: 1 | 2 | 3 | 4 | 5;
  description: string;
  alertLevel?: AlertLevel;
}

export type AlertLevel = 
  | 'unaware'
  | 'suspicious'
  | 'alerted'
  | 'active'
  | 'lockdown';

export interface NetArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  difficulty: NetArchitecture['difficulty'];
  floors: Partial<NetFloor>[];
  suggestedOwner?: string;
  suggestedLocation?: string;
}

export type TemplateCategory = 
  | 'corporate'
  | 'government'
  | 'criminal'
  | 'personal'
  | 'utility'
  | 'entertainment'
  | 'military';

export interface NetrunSession {
  id: string;
  architectureId: string;
  netrunner: string;
  startTime: Date;
  currentFloor: string;
  completedFloors: string[];
  collectedLoot: string[];
  alertLevel: AlertLevel;
  notes?: string;
}