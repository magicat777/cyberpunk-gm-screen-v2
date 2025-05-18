import type { Character, Weapon, Armor, Cyberware, Encounter } from '../types/game';
import { CharacterModel } from '../models/Character';
import { EncounterModel } from '../models/Encounter';

// Sample weapon templates
export const WEAPON_TEMPLATES: Record<string, Omit<Weapon, 'id'>> = {
  // Melee weapons
  KNIFE: {
    name: 'Knife',
    type: 'Melee',
    damage: '1d6',
    rof: 1,
    hands: 1,
    concealable: true,
    cost: 20
  },
  SWORD: {
    name: 'Sword',
    type: 'Melee',
    damage: '3d6',
    rof: 1,
    hands: 2,
    concealable: false,
    cost: 200
  },
  MONOBLADE: {
    name: 'Monoblade',
    type: 'Melee',
    damage: '4d6',
    rof: 1,
    hands: 1,
    concealable: false,
    cost: 1000,
    notes: 'Monofilament edge, ignores half armor'
  },
  
  // Pistols
  LIGHT_PISTOL: {
    name: 'Light Pistol',
    type: 'Ranged',
    damage: '1d6',
    rof: 2,
    magazine: 8,
    currentAmmo: 8,
    range: 25,
    hands: 1,
    concealable: true,
    cost: 100
  },
  MEDIUM_PISTOL: {
    name: 'Medium Pistol',
    type: 'Ranged',
    damage: '2d6',
    rof: 2,
    magazine: 12,
    currentAmmo: 12,
    range: 25,
    hands: 1,
    concealable: true,
    cost: 200
  },
  HEAVY_PISTOL: {
    name: 'Heavy Pistol',
    type: 'Ranged',
    damage: '3d6',
    rof: 2,
    magazine: 8,
    currentAmmo: 8,
    range: 25,
    hands: 1,
    concealable: true,
    cost: 500
  },
  
  // Rifles
  ASSAULT_RIFLE: {
    name: 'Assault Rifle',
    type: 'Ranged',
    damage: '5d6',
    rof: 1,
    magazine: 30,
    currentAmmo: 30,
    range: 400,
    hands: 2,
    concealable: false,
    cost: 1000
  },
  SNIPER_RIFLE: {
    name: 'Sniper Rifle',
    type: 'Ranged',
    damage: '5d6',
    rof: 1,
    magazine: 5,
    currentAmmo: 5,
    range: 800,
    hands: 2,
    concealable: false,
    cost: 2000,
    notes: 'Scope included (+2 to hit at long range)'
  },
  
  // Special
  SHOTGUN: {
    name: 'Shotgun',
    type: 'Ranged',
    damage: '5d6',
    rof: 1,
    magazine: 4,
    currentAmmo: 4,
    range: 10,
    hands: 2,
    concealable: false,
    cost: 500,
    notes: 'Damage reduced by 1d6 per range increment'
  },
  GRENADE_LAUNCHER: {
    name: 'Grenade Launcher',
    type: 'Ranged',
    damage: '6d6',
    rof: 1,
    magazine: 6,
    currentAmmo: 6,
    range: 200,
    hands: 2,
    concealable: false,
    cost: 2000,
    notes: 'Area effect weapon'
  }
};

// Sample armor templates
export const ARMOR_TEMPLATES: Record<string, Omit<Armor, 'id'>> = {
  LEATHER_JACKET: {
    name: 'Leather Jacket',
    location: 'Body',
    sp: 4,
    cost: 50
  },
  KEVLAR_VEST: {
    name: 'Kevlar Vest',
    location: 'Body',
    sp: 7,
    cost: 200
  },
  LIGHT_ARMORJACK: {
    name: 'Light Armorjack',
    location: 'Body',
    sp: 11,
    penalty: -1,
    cost: 1000
  },
  HEAVY_ARMORJACK: {
    name: 'Heavy Armorjack',
    location: 'Body',
    sp: 13,
    penalty: -2,
    cost: 2000
  },
  METALGEAR: {
    name: 'MetalGear',
    location: 'Body',
    sp: 15,
    penalty: -3,
    cost: 5000,
    notes: 'Full body armor'
  },
  HELMET: {
    name: 'Helmet',
    location: 'Head',
    sp: 11,
    cost: 100
  },
  RIOT_SHIELD: {
    name: 'Riot Shield',
    location: 'Shield',
    sp: 10,
    cost: 200,
    notes: 'Provides cover'
  }
};

// Sample cyberware templates
export const CYBERWARE_TEMPLATES: Record<string, Omit<Cyberware, 'id' | 'installed'>> = {
  // Cyberoptics
  CYBEROPTIC: {
    name: 'Cyberoptic',
    type: 'Cyberoptic',
    humanityLoss: '2d6',
    cost: 100,
    description: 'Basic cybernetic eye replacement',
    effects: ['Normal vision']
  },
  INFRARED: {
    name: 'Infrared Vision',
    type: 'Cyberoptic',
    humanityLoss: '1d6',
    cost: 500,
    description: 'See heat signatures',
    effects: ['See in darkness', 'Detect warm bodies']
  },
  LOW_LIGHT: {
    name: 'Low Light Vision',
    type: 'Cyberoptic',
    humanityLoss: '1d6',
    cost: 500,
    description: 'Enhanced vision in low light',
    effects: ['See in dim light']
  },
  
  // Cyberaudio
  CYBERAUDIO: {
    name: 'Cyberaudio',
    type: 'Cyberaudio',
    humanityLoss: '2d6',
    cost: 500,
    description: 'Basic cybernetic hearing',
    effects: ['Normal hearing', 'Volume control']
  },
  AMPLIFIED_HEARING: {
    name: 'Amplified Hearing',
    type: 'Cyberaudio',
    humanityLoss: '1d6',
    cost: 500,
    description: 'Enhanced hearing range',
    effects: ['+2 to Perception checks involving hearing']
  },
  
  // Neural
  NEURAL_LINK: {
    name: 'Neural Link',
    type: 'Neural',
    humanityLoss: '2d6',
    cost: 500,
    description: 'Direct neural interface',
    effects: ['Interface with devices', 'Control vehicles']
  },
  INTERFACE_PLUGS: {
    name: 'Interface Plugs',
    type: 'Neural',
    humanityLoss: '1d6',
    cost: 1000,
    description: 'Netrunning interface',
    effects: ['Access NET', 'Required for netrunning']
  },
  SANDEVISTAN: {
    name: 'Sandevistan',
    type: 'Neural',
    humanityLoss: '3d6',
    cost: 10000,
    description: 'Reflex booster',
    effects: ['+2 REF for one turn', '1/day use']
  },
  
  // Cyberarms
  CYBERARM: {
    name: 'Cyberarm',
    type: 'Cyberarm',
    humanityLoss: '2d6',
    cost: 500,
    description: 'Basic cybernetic arm',
    effects: ['12 BODY in arm', '2 option slots']
  },
  RIPPERS: {
    name: 'Rippers',
    type: 'Cyberarm',
    humanityLoss: '1d6',
    cost: 500,
    description: 'Retractable blades',
    effects: ['3d6 melee damage', 'Concealable']
  },
  
  // Body
  MUSCLE_AND_BONE_LACE: {
    name: 'Muscle & Bone Lace',
    type: 'Body',
    humanityLoss: '2d6',
    cost: 2000,
    description: 'Reinforced muscles and bones',
    effects: ['+2 BODY', '+2 to melee damage']
  },
  SKIN_WEAVE: {
    name: 'Skin Weave',
    type: 'Body',
    humanityLoss: '2d6',
    cost: 2000,
    description: 'Armored skin',
    effects: ['SP 7 armor', 'Stacks with worn armor']
  }
};

// Sample character templates
export const CHARACTER_TEMPLATES: Record<string, Partial<Character>> = {
  STREET_SOLO: {
    name: 'Street Solo',
    role: 'Solo',
    roleRank: 4,
    stats: {
      INT: { name: 'INT', value: 5, base: 5, modifier: 0 },
      REF: { name: 'REF', value: 8, base: 8, modifier: 0 },
      DEX: { name: 'DEX', value: 7, base: 7, modifier: 0 },
      TECH: { name: 'TECH', value: 4, base: 4, modifier: 0 },
      COOL: { name: 'COOL', value: 7, base: 7, modifier: 0 },
      WILL: { name: 'WILL', value: 6, base: 6, modifier: 0 },
      LUCK: { name: 'LUCK', value: 5, base: 5, modifier: 0 },
      MOVE: { name: 'MOVE', value: 6, base: 6, modifier: 0 },
      BODY: { name: 'BODY', value: 7, base: 7, modifier: 0 },
      EMP: { name: 'EMP', value: 5, base: 5, modifier: 0 }
    }
  },
  CORPORATE_NETRUNNER: {
    name: 'Corporate Netrunner',
    role: 'Netrunner',
    roleRank: 4,
    stats: {
      INT: { name: 'INT', value: 8, base: 8, modifier: 0 },
      REF: { name: 'REF', value: 7, base: 7, modifier: 0 },
      DEX: { name: 'DEX', value: 5, base: 5, modifier: 0 },
      TECH: { name: 'TECH', value: 8, base: 8, modifier: 0 },
      COOL: { name: 'COOL', value: 6, base: 6, modifier: 0 },
      WILL: { name: 'WILL', value: 6, base: 6, modifier: 0 },
      LUCK: { name: 'LUCK', value: 5, base: 5, modifier: 0 },
      MOVE: { name: 'MOVE', value: 5, base: 5, modifier: 0 },
      BODY: { name: 'BODY', value: 4, base: 4, modifier: 0 },
      EMP: { name: 'EMP', value: 5, base: 5, modifier: 0 }
    }
  },
  STREET_FIXER: {
    name: 'Street Fixer',
    role: 'Fixer',
    roleRank: 4,
    stats: {
      INT: { name: 'INT', value: 7, base: 7, modifier: 0 },
      REF: { name: 'REF', value: 5, base: 5, modifier: 0 },
      DEX: { name: 'DEX', value: 5, base: 5, modifier: 0 },
      TECH: { name: 'TECH', value: 5, base: 5, modifier: 0 },
      COOL: { name: 'COOL', value: 8, base: 8, modifier: 0 },
      WILL: { name: 'WILL', value: 6, base: 6, modifier: 0 },
      LUCK: { name: 'LUCK', value: 6, base: 6, modifier: 0 },
      MOVE: { name: 'MOVE', value: 5, base: 5, modifier: 0 },
      BODY: { name: 'BODY', value: 5, base: 5, modifier: 0 },
      EMP: { name: 'EMP', value: 7, base: 7, modifier: 0 }
    }
  }
};

// Sample encounter templates
export const ENCOUNTER_TEMPLATES: Record<string, Partial<Encounter>> = {
  STREET_FIGHT: {
    name: 'Street Fight',
    description: 'A random street encounter with local gangers',
    difficulty: 'Easy',
    location: 'Night City Street',
    tags: ['combat', 'urban', 'random']
  },
  CORPORATE_EXTRACTION: {
    name: 'Corporate Extraction',
    description: 'Extract a corporate executive from a secure facility',
    difficulty: 'Hard',
    location: 'Corporate Tower',
    tags: ['stealth', 'combat', 'corporate', 'mission']
  },
  NET_DIVE: {
    name: 'Data Heist',
    description: 'Penetrate a secure network to steal valuable data',
    difficulty: 'Medium',
    location: 'NET',
    tags: ['netrunning', 'stealth', 'data']
  },
  NOMAD_CONVOY: {
    name: 'Convoy Ambush',
    description: 'Ambush or defend a Nomad convoy',
    difficulty: 'Medium',
    location: 'Badlands Highway',
    tags: ['combat', 'vehicles', 'nomad']
  }
};

// Factory functions
export function createCharacterFromTemplate(
  templateKey: keyof typeof CHARACTER_TEMPLATES,
  overrides: Partial<Character> = {}
): CharacterModel {
  const template = CHARACTER_TEMPLATES[templateKey];
  return new CharacterModel({ ...template, ...overrides });
}

export function createEncounterFromTemplate(
  templateKey: keyof typeof ENCOUNTER_TEMPLATES,
  overrides: Partial<Encounter> = {}
): EncounterModel {
  const template = ENCOUNTER_TEMPLATES[templateKey];
  return new EncounterModel({ ...template, ...overrides });
}

export function createWeaponFromTemplate(
  templateKey: keyof typeof WEAPON_TEMPLATES
): Weapon {
  const template = WEAPON_TEMPLATES[templateKey];
  return {
    ...template,
    id: crypto.randomUUID()
  };
}

export function createArmorFromTemplate(
  templateKey: keyof typeof ARMOR_TEMPLATES
): Armor {
  const template = ARMOR_TEMPLATES[templateKey];
  return {
    ...template,
    id: crypto.randomUUID()
  };
}

export function createCyberwareFromTemplate(
  templateKey: keyof typeof CYBERWARE_TEMPLATES
): Cyberware {
  const template = CYBERWARE_TEMPLATES[templateKey];
  return {
    ...template,
    id: crypto.randomUUID(),
    installed: false
  };
}

export const templates = {
  weapons: WEAPON_TEMPLATES,
  armor: ARMOR_TEMPLATES,
  cyberware: CYBERWARE_TEMPLATES,
  characters: CHARACTER_TEMPLATES,
  encounters: ENCOUNTER_TEMPLATES
};