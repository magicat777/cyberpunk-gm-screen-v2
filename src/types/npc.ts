import { Character, RoleType, StatType, SkillType } from './game';

export interface NPCTemplate {
  id: string;
  name: string;
  archetype: NPCArchetype;
  rolePresets: Partial<Record<RoleType, RolePreset>>;
  statRanges: Record<StatType, { min: number; max: number }>;
  skillPriorities: {
    primary: SkillType[];
    secondary: SkillType[];
    minimal: SkillType[];
  };
  equipmentTags: string[];
  cyberwareChance: number;
  humanityRange: { min: number; max: number };
  description: string;
}

export interface RolePreset {
  roleRank: { min: number; max: number };
  specialAbilities?: string[];
  equipment?: string[];
  cyberware?: string[];
}

export type NPCArchetype = 
  | 'ganger'
  | 'corporate'
  | 'lawEnforcement'
  | 'civilian'
  | 'fixer'
  | 'techie'
  | 'media'
  | 'nomad'
  | 'criminal'
  | 'mercenary'
  | 'netrunner'
  | 'medtech'
  | 'exotic';

export interface NPCGeneratorOptions {
  archetype?: NPCArchetype;
  role?: RoleType;
  threat?: 'low' | 'medium' | 'high' | 'elite';
  includeBackground?: boolean;
  includeMotivation?: boolean;
  includeAppearance?: boolean;
  includeCyberware?: boolean;
  includeEquipment?: boolean;
  customName?: string;
}

export interface GeneratedNPC extends Character {
  archetype: NPCArchetype;
  threat: 'low' | 'medium' | 'high' | 'elite';
  appearance?: NPCAppearance;
  motivation?: NPCMotivation;
  mannerisms?: string[];
  relationships?: NPCRelationship[];
  secrets?: string[];
  combatStyle?: string;
  preferredTactics?: string[];
}

export interface NPCAppearance {
  age: string;
  gender: string;
  height: string;
  build: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  distinguishingFeatures: string[];
  clothingStyle: string;
  accessories: string[];
}

export interface NPCMotivation {
  primaryGoal: string;
  fears: string[];
  desires: string[];
  values: string[];
  methods: string[];
}

export interface NPCRelationship {
  type: 'ally' | 'enemy' | 'neutral' | 'family' | 'romantic' | 'business';
  name: string;
  description: string;
  strength: 'weak' | 'moderate' | 'strong';
}

export interface NPCGeneratorData {
  firstNames: {
    male: string[];
    female: string[];
    neutral: string[];
  };
  lastNames: string[];
  nicknames: string[];
  appearances: {
    ages: string[];
    builds: string[];
    hairStyles: string[];
    hairColors: string[];
    eyeColors: string[];
    features: string[];
    clothingStyles: Record<NPCArchetype, string[]>;
    accessories: string[];
  };
  motivations: {
    goals: Record<NPCArchetype, string[]>;
    fears: string[];
    desires: string[];
    values: string[];
    methods: string[];
  };
  mannerisms: string[];
  combatStyles: Record<NPCArchetype, string[]>;
  tactics: string[];
  secrets: Record<NPCArchetype, string[]>;
}