import type { SkillCategory, StatType, RoleType } from '../types/game';

export const STATS: Record<StatType, string> = {
  'INT': 'Intelligence',
  'REF': 'Reflexes',
  'DEX': 'Dexterity',
  'TECH': 'Technical Ability',
  'COOL': 'Cool',
  'WILL': 'Willpower',
  'LUCK': 'Luck',
  'MOVE': 'Movement',
  'BODY': 'Body',
  'EMP': 'Empathy'
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Awareness',
  'Body',
  'Control',
  'Fighting',
  'Performance',
  'Ranged Weapon',
  'Education',
  'Social',
  'Technique'
];

export const ROLE_DESCRIPTIONS: Record<RoleType, {
  ability: string;
  description: string;
  keyStats: StatType[];
}> = {
  'Solo': {
    ability: 'Combat Awareness',
    description: 'Combat specialists and mercenaries',
    keyStats: ['REF', 'BODY', 'COOL']
  },
  'Rockerboy': {
    ability: 'Charismatic Impact',
    description: 'Musicians and social influencers',
    keyStats: ['COOL', 'EMP', 'WILL']
  },
  'Netrunner': {
    ability: 'Interface',
    description: 'Hackers and network specialists',
    keyStats: ['INT', 'TECH', 'REF']
  },
  'Tech': {
    ability: 'Maker',
    description: 'Engineers and inventors',
    keyStats: ['TECH', 'INT', 'COOL']
  },
  'Medtech': {
    ability: 'Medicine',
    description: 'Doctors and healers',
    keyStats: ['TECH', 'EMP', 'INT']
  },
  'Media': {
    ability: 'Credibility',
    description: 'Journalists and investigators',
    keyStats: ['INT', 'COOL', 'EMP']
  },
  'Exec': {
    ability: 'Teamwork',
    description: 'Corporate leaders and managers',
    keyStats: ['INT', 'COOL', 'EMP']
  },
  'Lawman': {
    ability: 'Backup',
    description: 'Law enforcement officers',
    keyStats: ['REF', 'COOL', 'INT']
  },
  'Fixer': {
    ability: 'Operator',
    description: 'Deal makers and information brokers',
    keyStats: ['COOL', 'INT', 'EMP']
  },
  'Nomad': {
    ability: 'Moto',
    description: 'Vehicle specialists and family members',
    keyStats: ['REF', 'TECH', 'BODY']
  }
};

export const DIFFICULTY_VALUES: Record<string, number> = {
  'Everyday': 9,
  'Simple': 11,
  'Trained': 13,
  'Professional': 15,
  'Difficult': 17,
  'Complex': 19,
  'Heroic': 21,
  'Incredible': 23,
  'Legendary': 25
};

export const DAMAGE_TYPES = {
  'LIGHT_MELEE': '1d6',
  'MEDIUM_MELEE': '2d6',
  'HEAVY_MELEE': '3d6',
  'VERY_HEAVY_MELEE': '4d6',
  'LIGHT_PISTOL': '1d6',
  'MEDIUM_PISTOL': '2d6',
  'HEAVY_PISTOL': '3d6',
  'VERY_HEAVY_PISTOL': '4d6',
  'SMG': '2d6',
  'ASSAULT_RIFLE': '5d6',
  'SNIPER': '5d6',
  'SHOTGUN': '5d6'
};

export const ARMOR_VALUES = {
  'LIGHT': 4,
  'MEDIUM': 7,
  'HEAVY': 11,
  'VERY_HEAVY': 13,
  'METALGEAR': 15,
  'SHIELD': 10
};

export const CRITICAL_INJURY_TABLE = [
  { roll: [1, 6], name: 'Quick Fix', effect: 'No permanent damage' },
  { roll: [7, 8], name: 'Whiplash', effect: 'Move reduced by 2' },
  { roll: [9, 10], name: 'Foreign Object', effect: 'Extra damage next injury' },
  { roll: [11, 12], name: 'Broken Ribs', effect: '-2 to MOVE' },
  { roll: [13, 14], name: 'Broken Arm/Hand', effect: 'Cannot use arm' },
  { roll: [15, 16], name: 'Broken Leg/Foot', effect: 'MOVE reduced to 2' },
  { roll: [17, 18], name: 'Spine Injury', effect: 'MOVE reduced to 1' },
  { roll: [19, 22], name: 'Crushed Fingers', effect: '-4 to DEX' },
  { roll: [23, 24], name: 'Crushed Arm', effect: 'Lose arm' },
  { roll: [25, 26], name: 'Crushed Leg', effect: 'Lose leg' },
  { roll: [27, 28], name: 'Crushed Organs', effect: 'Death save at -1' },
  { roll: [29, 30], name: 'Multiple Injuries', effect: 'Roll twice' }
];

export const NET_ARCHITECTURE_DIFFICULTIES = {
  'BASIC': 6,
  'STANDARD': 8,
  'ADVANCED': 10,
  'MILITARY': 12,
  'ZAIBATSU': 14
};

export const BLACK_ICE_TYPES = [
  {
    name: 'Skunk',
    per: 2,
    spd: 2,
    atk: 2,
    def: 2,
    damage: '1d6',
    effects: ['Alerts security']
  },
  {
    name: 'Scorpion',
    per: 4,
    spd: 4,
    atk: 4,
    def: 4,
    damage: '1d6',
    effects: ['Trace user']
  },
  {
    name: 'Spider',
    per: 6,
    spd: 6,
    atk: 6,
    def: 6,
    damage: '2d6',
    effects: ['Lock out']
  },
  {
    name: 'Dragon',
    per: 8,
    spd: 8,
    atk: 8,
    def: 8,
    damage: '3d6',
    effects: ['System crash']
  }
];

export const LIFEPATH_TABLES = {
  culturalOrigins: [
    'North American',
    'South/Central American',
    'Western European',
    'Eastern European',
    'Middle Eastern/North African',
    'Sub-Saharan African',
    'South Asian',
    'South East Asian',
    'East Asian',
    'Pacific Islander'
  ],
  personalities: [
    'Shy and secretive',
    'Rebellious, antisocial, and violent',
    'Arrogant, proud, and aloof',
    'Moody, rash, and headstrong',
    'Picky, fussy, and nervous',
    'Stable and serious',
    'Silly and fluffheaded',
    'Sneaky and deceptive',
    'Intellectual and detached',
    'Friendly and outgoing'
  ],
  clothingStyles: [
    'Generic chic',
    'Leisurewear',
    'Urban flash',
    'Businesswear',
    'High fashion',
    'Bohemian',
    'Gangjock',
    'Nomad leathers',
    'Bag lady chic',
    'Asian pop'
  ],
  hairstyles: [
    'Mohawk',
    'Long and ratty',
    'Short and spiked',
    'Wild and all over',
    'Bald',
    'Striped',
    'Wild colors',
    'Neat and short',
    'Long and straight',
    'Short and curly'
  ],
  affectations: [
    'Tattoos',
    'Mirrorshades',
    'Ritual scars',
    'Spiked gloves',
    'Nose rings',
    'Tongue splitting',
    'Earrings',
    'Long fingernails',
    'Spiked boots',
    'Fingerless gloves'
  ]
};