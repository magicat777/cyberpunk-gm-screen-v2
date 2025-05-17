export type RoleType = 
  | 'Solo'
  | 'Rockerboy'
  | 'Netrunner'
  | 'Tech'
  | 'Medtech'
  | 'Media'
  | 'Exec'
  | 'Lawman'
  | 'Fixer'
  | 'Nomad';

export type StatType = 
  | 'INT'  // Intelligence
  | 'REF'  // Reflexes
  | 'DEX'  // Dexterity
  | 'TECH' // Technical Ability
  | 'COOL' // Cool
  | 'WILL' // Willpower
  | 'LUCK' // Luck
  | 'MOVE' // Movement
  | 'BODY' // Body
  | 'EMP'; // Empathy

export type SkillCategory = 
  | 'Awareness'
  | 'Body'
  | 'Control'
  | 'Fighting'
  | 'Performance'
  | 'Ranged Weapon'
  | 'Education'
  | 'Social'
  | 'Technique';

export enum SkillType {
  // Awareness Skills
  Concentration = 'Concentration',
  ConcealRevealObject = 'ConcealRevealObject',
  LipReading = 'LipReading',
  Perception = 'Perception',
  Tracking = 'Tracking',
  
  // Body Skills
  Athletics = 'Athletics',
  Contortionist = 'Contortionist',
  Dance = 'Dance',
  Endurance = 'Endurance',
  ResistTortureDrugs = 'ResistTortureDrugs',
  Stealth = 'Stealth',
  
  // Control Skills
  Driving = 'Driving',
  PilotAirVehicle = 'PilotAirVehicle',
  PilotSeaVehicle = 'PilotSeaVehicle',
  Riding = 'Riding',
  
  // Education Skills
  Accounting = 'Accounting',
  Bureaucracy = 'Bureaucracy',
  Business = 'Business',
  Composition = 'Composition',
  Criminology = 'Criminology',
  Cryptography = 'Cryptography',
  Deduction = 'Deduction',
  Education = 'Education',
  Gamble = 'Gamble',
  Language = 'Language',
  LibrarySearch = 'LibrarySearch',
  LocalExpert = 'LocalExpert',
  Science = 'Science',
  Tactics = 'Tactics',
  WildernessSurvival = 'WildernessSurvival',
  
  // Fighting Skills
  Brawling = 'Brawling',
  Evasion = 'Evasion',
  MartialArts = 'MartialArts',
  MeleeWeapon = 'MeleeWeapon',
  
  // Performance Skills
  Acting = 'Acting',
  PlayInstrument = 'PlayInstrument',
  
  // Ranged Weapon Skills
  Archery = 'Archery',
  Handgun = 'Handgun',
  HeavyWeapons = 'HeavyWeapons',
  ShoulderArms = 'ShoulderArms',
  
  // Social Skills
  Bribery = 'Bribery',
  Conversation = 'Conversation',
  HumanPerception = 'HumanPerception',
  Interrogation = 'Interrogation',
  Persuasion = 'Persuasion',
  PersonalGrooming = 'PersonalGrooming',
  Streetwise = 'Streetwise',
  Trading = 'Trading',
  WardrobeStyle = 'WardrobeStyle',
  
  // Technique Skills
  AnimalHandling = 'AnimalHandling',
  Demolitions = 'Demolitions',
  DriveLandVehicle = 'DriveLandVehicle',
  ElectronicsSecurityTech = 'ElectronicsSecurityTech',
  FirstAid = 'FirstAid',
  Forgery = 'Forgery',
  Interface = 'Interface',
  LandVehicleTech = 'LandVehicleTech',
  PaintDrawSculpt = 'PaintDrawSculpt',
  Paramedic = 'Paramedic',
  PhotographyFilm = 'PhotographyFilm',
  PickLock = 'PickLock',
  PickPocket = 'PickPocket',
  SeaVehicleTech = 'SeaVehicleTech',
  WeaponsTech = 'WeaponsTech'
}

export type DamageType = 
  | 'Physical'
  | 'EMP'
  | 'Humanity';

export type WeaponType = 
  | 'Melee'
  | 'Ranged'
  | 'Exotic';

export type ArmorLocation = 
  | 'Head'
  | 'Body'
  | 'Shield';

export type CyberwareType = 
  | 'Cyberoptic'
  | 'Cyberaudio'
  | 'Neural'
  | 'Cyberarm'
  | 'Cyberleg'
  | 'Body'
  | 'Borgware'
  | 'Fashionware';

export type LifepathRole = 
  | 'Sibling'
  | 'Parent'
  | 'Lover'
  | 'Friend'
  | 'Enemy'
  | 'Mentor';

export interface Stat {
  name: StatType;
  value: number;
  base: number;
  modifier: number;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  stat: StatType;
  level: number;
  ip: number; // Improvement Points
  total: number; // stat + level
  isRoleSkill?: boolean;
  specialization?: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  damage: string; // e.g., "2d6+1"
  rof: number; // Rate of Fire
  magazine?: number;
  currentAmmo?: number;
  range?: number;
  hands: 1 | 2;
  concealable: boolean;
  cost: number;
  notes?: string;
}

export interface Armor {
  id: string;
  name: string;
  location: ArmorLocation;
  sp: number; // Stopping Power
  penalty?: number; // REF penalty
  cost: number;
  notes?: string;
}

export interface Cyberware {
  id: string;
  name: string;
  type: CyberwareType;
  humanityLoss: string; // e.g., "2d6"
  cost: number;
  description: string;
  effects?: string[];
  installed: boolean;
}

export interface LifepathPerson {
  name: string;
  role: LifepathRole;
  description: string;
  status: 'alive' | 'dead' | 'missing' | 'enemy';
}

export interface Character {
  id: string;
  name: string;
  handle?: string; // Alias/Street name
  role: RoleType;
  roleRank: number;
  
  // Stats
  stats: Record<StatType, Stat>;
  
  // Derived values
  hitPoints: {
    max: number;
    current: number;
    seriouslyWounded: number;
    deathSave: number;
  };
  
  humanity: {
    max: number;
    current: number;
  };
  
  // Skills
  skills: Skill[];
  
  // Equipment
  weapons: Weapon[];
  armor: Armor[];
  cyberware: Cyberware[];
  gear: Item[];
  
  // Character details
  background: {
    culturalOrigin?: string;
    personality?: string;
    clothingStyle?: string;
    hairstyle?: string;
    valueMost?: string;
    feelAboutPeople?: string;
    valuedPerson?: string;
    valuedPossession?: string;
    family?: string;
  };
  
  lifepath: {
    friends: LifepathPerson[];
    enemies: LifepathPerson[];
    lovers: LifepathPerson[];
    mentors: LifepathPerson[];
  };
  
  // Resources
  eurodollars: number;
  reputation: number;
  ip: number; // Improvement Points
  
  // Notes
  notes: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isNPC: boolean;
}

export interface Item {
  id: string;
  name: string;
  cost: number;
  weight: number;
  quantity: number;
  description?: string;
  category?: string;
}

export interface Encounter {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  location?: string;
  npcs: Character[];
  loot?: Item[];
  notes?: string;
  tags: string[];
  createdAt: string;
}

export interface NetArchitecture {
  id: string;
  name: string;
  difficulty: number;
  layers: NetLayer[];
  blackIce: BlackIce[];
  data: NetData[];
  notes?: string;
}

export interface NetLayer {
  id: string;
  name: string;
  difficulty: number;
  password?: string;
  description: string;
}

export interface BlackIce {
  id: string;
  name: string;
  per: number; // Perception
  spd: number; // Speed
  atk: number; // Attack
  def: number; // Defense
  damage: string;
  effects: string[];
}

export interface NetData {
  id: string;
  name: string;
  value: number; // in eurodollars
  secured: boolean;
  description: string;
}

export interface CombatTurn {
  characterId: string;
  initiative: number;
  hasActed: boolean;
  conditions: StatusCondition[];
}

export interface StatusCondition {
  name: string;
  duration?: number; // in rounds
  effects: string[];
}

export interface DiceRoll {
  dice: string; // e.g., "2d6+3"
  result: number;
  breakdown: {
    rolls: number[];
    modifier: number;
  };
  critical?: boolean;
  fumble?: boolean;
  timestamp: string;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  players: Character[];
  encounters: Encounter[];
  notes: string;
  loot: Item[];
  reputation: {
    characterId: string;
    change: number;
    reason: string;
  }[];
}

export interface Rule {
  id: string;
  name: string;
  category: string;
  description: string;
  examples?: string[];
  pageReference?: string;
}