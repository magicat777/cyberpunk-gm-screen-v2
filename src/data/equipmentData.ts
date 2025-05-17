import { 
  Weapon, 
  Armor, 
  Cyberware, 
  Gear, 
  Fashion, 
  Drug, 
  Service, 
  Vehicle 
} from '../types/equipment';

export const weapons: Weapon[] = [
  // Melee Weapons
  {
    id: 'knife',
    name: 'Knife',
    category: 'weapons',
    type: 'melee',
    cost: 50,
    weight: 0.5,
    availability: 'E',
    description: 'A basic combat knife',
    damage: '1d6',
    range: 'Melee',
    rof: 2,
    hands: 1,
    concealability: 'P',
    tags: ['melee', 'concealable']
  },
  {
    id: 'sword',
    name: 'Sword',
    category: 'weapons',
    type: 'melee',
    cost: 200,
    weight: 2,
    availability: 'C',
    description: 'A modern tactical sword',
    damage: '2d6',
    range: 'Melee',
    rof: 2,
    hands: 1,
    concealability: 'N',
    tags: ['melee', 'blade']
  },
  // Pistols
  {
    id: 'medium_pistol',
    name: 'Medium Pistol',
    category: 'weapons',
    type: 'pistol',
    cost: 500,
    weight: 1,
    availability: 'E',
    description: 'Standard 9mm pistol',
    damage: '2d6',
    range: '50m',
    rof: 2,
    hands: 1,
    magazine: 14,
    concealability: 'J',
    tags: ['ranged', 'pistol', 'concealable']
  },
  {
    id: 'heavy_pistol',
    name: 'Heavy Pistol',
    category: 'weapons',
    type: 'pistol',
    cost: 750,
    weight: 1.5,
    availability: 'E',
    description: '.45 caliber heavy pistol',
    damage: '3d6',
    range: '50m',
    rof: 2,
    hands: 1,
    magazine: 8,
    concealability: 'J',
    tags: ['ranged', 'pistol', 'heavy']
  },
  // SMGs
  {
    id: 'medium_smg',
    name: 'Medium SMG',
    category: 'weapons',
    type: 'smg',
    cost: 1500,
    weight: 3,
    availability: 'P',
    description: 'Compact submachine gun',
    damage: '2d6',
    range: '100m',
    rof: 1,
    hands: 2,
    magazine: 30,
    concealability: 'L',
    attachments: ['Drum Magazine', 'Sling'],
    tags: ['ranged', 'automatic', 'smg']
  },
  // Rifles
  {
    id: 'assault_rifle',
    name: 'Assault Rifle',
    category: 'weapons',
    type: 'rifle',
    cost: 2000,
    weight: 4,
    availability: 'V',
    description: 'Military-grade assault rifle',
    damage: '5d6',
    range: '400m',
    rof: 1,
    hands: 2,
    magazine: 30,
    concealability: 'N',
    attachments: ['Grenade Launcher', 'Scope'],
    tags: ['ranged', 'automatic', 'rifle', 'military']
  },
  {
    id: 'sniper_rifle',
    name: 'Sniper Rifle',
    category: 'weapons',
    type: 'rifle',
    cost: 3000,
    weight: 5,
    availability: 'V',
    description: 'Precision long-range rifle',
    damage: '5d6',
    range: '800m',
    rof: 1,
    hands: 2,
    magazine: 6,
    concealability: 'N',
    attachments: ['Telescopic Scope', 'Bipod'],
    specialRules: ['Aimed shots only'],
    tags: ['ranged', 'rifle', 'sniper', 'precision']
  }
];

export const armors: Armor[] = [
  {
    id: 'leather_jacket',
    name: 'Leather Jacket',
    category: 'armor',
    type: 'leathers',
    cost: 100,
    weight: 2,
    availability: 'E',
    description: 'Classic protection with style',
    stoppingPower: 4,
    armorPenalty: 0,
    locations: ['body', 'arms'],
    tags: ['light', 'stylish']
  },
  {
    id: 'kevlar_vest',
    name: 'Kevlar Vest',
    category: 'armor',
    type: 'kevlar',
    cost: 500,
    weight: 2,
    availability: 'C',
    description: 'Standard bulletproof vest',
    stoppingPower: 12,
    armorPenalty: 0,
    locations: ['body'],
    tags: ['bulletproof', 'concealable']
  },
  {
    id: 'flak_armor',
    name: 'Flak Armor',
    category: 'armor',
    type: 'flak',
    cost: 2000,
    weight: 10,
    availability: 'P',
    description: 'Military-grade body armor',
    stoppingPower: 15,
    armorPenalty: -2,
    locations: ['body'],
    tags: ['military', 'heavy']
  },
  {
    id: 'helmet',
    name: 'Combat Helmet',
    category: 'armor',
    type: 'metalgear',
    cost: 500,
    weight: 1,
    availability: 'C',
    description: 'Military helmet with face shield',
    stoppingPower: 13,
    armorPenalty: 0,
    locations: ['head'],
    tags: ['head_protection']
  }
];

export const cyberware: Cyberware[] = [
  // Neural
  {
    id: 'neural_link',
    name: 'Neural Link',
    category: 'cyberware',
    type: 'neuralware',
    cost: 500,
    availability: 'C',
    description: 'Basic interface for smartguns and vehicles',
    humanityLoss: '2d6',
    surgery: 'M',
    location: 'Neuralware',
    tags: ['interface', 'basic']
  },
  {
    id: 'sandevistan',
    name: 'Sandevistan',
    category: 'cyberware',
    type: 'neuralware',
    cost: 15000,
    availability: 'V',
    description: 'Reflex booster that slows perception of time',
    humanityLoss: '4d6',
    surgery: 'CR',
    location: 'Neuralware',
    specialRules: ['Allows extra actions in combat'],
    tags: ['combat', 'reflex', 'military']
  },
  // Optics
  {
    id: 'cybereye',
    name: 'Cybereye',
    category: 'cyberware',
    type: 'cyberoptics',
    cost: 500,
    availability: 'C',
    description: 'Basic cybernetic eye replacement',
    humanityLoss: '1d6',
    surgery: 'M',
    location: 'Eye',
    options: [
      { name: 'Low Light', cost: 200, humanityLoss: '0', description: 'See in low light conditions' },
      { name: 'Infrared', cost: 200, humanityLoss: '0', description: 'See heat signatures' },
      { name: 'Camera', cost: 300, humanityLoss: '0', description: 'Record what you see' }
    ],
    tags: ['optics', 'vision']
  },
  // Limbs
  {
    id: 'cyberarm',
    name: 'Cyberarm',
    category: 'cyberware',
    type: 'cyberlimb',
    cost: 3000,
    availability: 'P',
    description: 'Cybernetic arm replacement',
    humanityLoss: '2d6',
    surgery: 'CR',
    location: 'Arm',
    options: [
      { name: 'Superchrome', cost: 1000, humanityLoss: '0', description: 'Shiny chrome finish' },
      { name: 'RealSkinn', cost: 500, humanityLoss: '-1d6', description: 'Realistic skin covering' },
      { name: 'Tool Hand', cost: 500, humanityLoss: '0', description: 'Built-in tools' }
    ],
    tags: ['limb', 'strength']
  }
];

export const gear: Gear[] = [
  // Tech Gear
  {
    id: 'cyberdeck',
    name: 'Cyberdeck',
    category: 'gear',
    type: 'netrunning',
    cost: 5000,
    weight: 1,
    availability: 'P',
    description: 'Portable computer for netrunning',
    properties: {
      speed: 5,
      dataWalls: 2,
      programs: 5
    },
    tags: ['netrunning', 'hacking', 'tech']
  },
  {
    id: 'techscanner',
    name: 'Tech Scanner',
    category: 'gear',
    type: 'tech',
    cost: 1000,
    weight: 0.5,
    availability: 'C',
    description: 'Detects electronic devices and signals',
    tags: ['scanner', 'detection', 'tech']
  },
  // Medical
  {
    id: 'medtech_bag',
    name: 'Medtech Bag',
    category: 'gear',
    type: 'medical',
    cost: 1000,
    weight: 2,
    availability: 'C',
    description: 'Complete medical kit',
    properties: {
      uses: 10,
      bonus: '+2 to First Aid/Paramedic'
    },
    tags: ['medical', 'healing']
  },
  {
    id: 'trauma_team_card',
    name: 'Trauma Team Card',
    category: 'gear',
    type: 'medical',
    cost: 100,
    weight: 0,
    availability: 'E',
    description: 'Emergency medical extraction service',
    properties: {
      responseTime: '3d6 minutes',
      coverage: 'Basic'
    },
    tags: ['medical', 'service', 'emergency']
  },
  // Communication
  {
    id: 'agent',
    name: 'Agent',
    category: 'gear',
    type: 'communication',
    cost: 500,
    weight: 0.1,
    availability: 'E',
    description: 'Smartphone/personal computer',
    tags: ['communication', 'computer', 'everyday']
  }
];

export const fashion: Fashion[] = [
  {
    id: 'streetwear',
    name: 'Streetwear Set',
    category: 'fashion',
    type: 'clothes',
    cost: 100,
    availability: 'E',
    description: 'Generic urban clothing',
    style: 'Urban',
    quality: 'generic',
    tags: ['clothing', 'everyday']
  },
  {
    id: 'corporate_suit',
    name: 'Corporate Suit',
    category: 'fashion',
    type: 'clothes',
    cost: 800,
    availability: 'C',
    description: 'Professional business attire',
    style: 'Corporate',
    quality: 'branded',
    tags: ['clothing', 'professional', 'corporate']
  },
  {
    id: 'designer_outfit',
    name: 'Designer Outfit',
    category: 'fashion',
    type: 'clothes',
    cost: 5000,
    availability: 'V',
    description: 'High-end luxury fashion',
    style: 'High Fashion',
    quality: 'luxury',
    tags: ['clothing', 'luxury', 'status']
  }
];

export const drugs: Drug[] = [
  {
    id: 'stim',
    name: 'Stim',
    category: 'drugs',
    type: 'combat',
    cost: 200,
    availability: 'C',
    description: 'Combat stimulant',
    strength: '+2 REF for 1 hour',
    duration: '1 hour',
    sideEffects: ['-2 INT for 2 hours after'],
    addiction: 'Low',
    legal: false,
    tags: ['combat', 'enhancement', 'illegal']
  },
  {
    id: 'trauma_suppress',
    name: 'Trauma Suppress',
    category: 'drugs',
    type: 'medical',
    cost: 500,
    availability: 'P',
    description: 'Emergency trauma medication',
    strength: 'Ignore wound penalties',
    duration: '10 minutes',
    sideEffects: ['Crash after duration'],
    legal: true,
    tags: ['medical', 'emergency', 'legal']
  },
  {
    id: 'glitter',
    name: 'Glitter',
    category: 'drugs',
    type: 'recreational',
    cost: 100,
    availability: 'E',
    description: 'Popular party drug',
    strength: 'Euphoria',
    duration: '4 hours',
    sideEffects: ['Hangover', 'Memory loss'],
    addiction: 'Moderate',
    legal: false,
    tags: ['recreational', 'illegal', 'party']
  }
];

export const services: Service[] = [
  {
    id: 'medtech_service',
    name: 'Medtech Service',
    category: 'services',
    type: 'medical',
    cost: 500,
    availability: 'C',
    description: 'Professional medical treatment',
    duration: '1 hour',
    tags: ['medical', 'professional']
  },
  {
    id: 'techhie_repair',
    name: 'Techie Repair',
    category: 'services',
    type: 'technical',
    cost: 300,
    availability: 'E',
    description: 'Equipment repair service',
    duration: 'Varies',
    tags: ['repair', 'technical']
  },
  {
    id: 'fixer_contact',
    name: 'Fixer Contact',
    category: 'services',
    type: 'information',
    cost: 1000,
    availability: 'C',
    description: 'Information and connection service',
    requirements: ['Reputation rank 3+'],
    tags: ['information', 'contacts', 'fixer']
  }
];

export const vehicles: Vehicle[] = [
  {
    id: 'compact_groundcar',
    name: 'Compact Groundcar',
    category: 'vehicles',
    type: 'groundcar',
    cost: 20000,
    availability: 'C',
    description: 'Basic city transportation',
    speed: 100,
    handling: 0,
    armor: 10,
    seats: 4,
    cargo: 'Small trunk',
    tags: ['transportation', 'everyday']
  },
  {
    id: 'sports_bike',
    name: 'Sports Bike',
    category: 'vehicles',
    type: 'bike',
    cost: 15000,
    availability: 'C',
    description: 'High-performance motorcycle',
    speed: 150,
    handling: 2,
    armor: 5,
    seats: 2,
    tags: ['transportation', 'fast', 'sporty']
  },
  {
    id: 'armored_suv',
    name: 'Armored SUV',
    category: 'vehicles',
    type: 'groundcar',
    cost: 80000,
    availability: 'V',
    description: 'Corporate security vehicle',
    speed: 80,
    handling: -1,
    armor: 25,
    seats: 6,
    cargo: 'Large trunk',
    specialSystems: ['Bulletproof glass', 'Run-flat tires'],
    tags: ['transportation', 'armored', 'security']
  },
  {
    id: 'aerodyne',
    name: 'AV-4 Aerodyne',
    category: 'vehicles',
    type: 'aerodyne',
    cost: 250000,
    availability: 'L',
    description: 'Flying vehicle',
    speed: 200,
    handling: 1,
    armor: 15,
    seats: 4,
    cargo: 'Small compartment',
    specialSystems: ['VTOL', 'Autopilot'],
    tags: ['transportation', 'flying', 'luxury']
  }
];

// Combine all equipment into one array
export const allEquipment = [
  ...weapons,
  ...armors,
  ...cyberware,
  ...gear,
  ...fashion,
  ...drugs,
  ...services,
  ...vehicles
];