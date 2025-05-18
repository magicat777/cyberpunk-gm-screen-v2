import { NetArchitectureTemplate, Challenge, DigitalLoot, VisualTheme } from '../types/netarchitecture';

export const challengeTemplates: Record<string, Challenge[]> = {
  password: [
    {
      id: 'pwd1',
      name: 'Basic Password Gate',
      type: 'password',
      difficulty: 10,
      description: 'Standard corporate password protection'
    },
    {
      id: 'pwd2',
      name: 'Encrypted Access',
      type: 'password',
      difficulty: 15,
      description: 'Military-grade encryption requiring decryption'
    }
  ],
  firewall: [
    {
      id: 'fw1',
      name: 'Corporate Firewall',
      type: 'firewall',
      difficulty: 12,
      description: 'Standard security firewall blocking access'
    },
    {
      id: 'fw2',
      name: 'Adaptive Firewall',
      type: 'firewall',
      difficulty: 18,
      description: 'AI-driven firewall that learns from attempts'
    }
  ],
  black_ice: [
    {
      id: 'ice1',
      name: 'Hellhound',
      type: 'black_ice',
      difficulty: 15,
      description: 'Attack program that targets intruders',
      damage: '2d6',
      effects: ['Traces connection', 'Alerts security']
    },
    {
      id: 'ice2',
      name: 'Kraken',
      type: 'black_ice',
      difficulty: 20,
      description: 'Lethal ICE that can cause physical damage',
      damage: '3d6',
      effects: ['Locks out netrunner', 'Causes feedback damage']
    }
  ],
  daemon: [
    {
      id: 'daemon1',
      name: 'Watchdog Protocol',
      type: 'daemon',
      difficulty: 14,
      description: 'Monitors for unauthorized access'
    },
    {
      id: 'daemon2',
      name: 'Hunter-Killer',
      type: 'daemon',
      difficulty: 18,
      description: 'Actively hunts intruders in the system',
      effects: ['Pursues across floors', 'Increases alert level']
    }
  ]
};

export const lootTemplates: Record<string, DigitalLoot[]> = {
  data: [
    {
      id: 'data1',
      name: 'Corporate Emails',
      type: 'data',
      value: 500,
      description: 'Internal communications that could be valuable',
      size: 10
    },
    {
      id: 'data2',
      name: 'Financial Records',
      type: 'data',
      value: 2000,
      description: 'Detailed financial transactions and accounts',
      encrypted: true,
      size: 50
    }
  ],
  program: [
    {
      id: 'prog1',
      name: 'Armor Program',
      type: 'program',
      value: 1000,
      description: 'Defensive program that reduces damage',
      size: 5
    },
    {
      id: 'prog2',
      name: 'Speedy Gonzalvez',
      type: 'program',
      value: 1500,
      description: 'Increases netrunning speed',
      size: 8
    }
  ],
  credential: [
    {
      id: 'cred1',
      name: 'Admin Access',
      type: 'credential',
      value: 3000,
      description: 'Administrator credentials for the system'
    },
    {
      id: 'cred2',
      name: 'Security Badge',
      type: 'credential',
      value: 1000,
      description: 'Digital security clearance'
    }
  ],
  money: [
    {
      id: 'money1',
      name: 'Cryptocurrency Wallet',
      type: 'money',
      value: 5000,
      description: 'Digital currency ready for transfer'
    },
    {
      id: 'money2',
      name: 'Bank Account Access',
      type: 'money',
      value: 10000,
      description: 'Direct access to corporate accounts',
      encrypted: true
    }
  ]
};

export const architectureTemplates: NetArchitectureTemplate[] = [
  {
    id: 'corp_basic',
    name: 'Corporate Server',
    description: 'Standard corporate data fortress',
    category: 'corporate',
    difficulty: 'standard',
    floors: [
      {
        level: 1,
        name: 'Lobby',
        type: 'lobby',
        difficulty: 10,
        description: 'Public-facing interface with basic security',
        challenges: [challengeTemplates.password[0]],
        loot: []
      },
      {
        level: 2,
        name: 'Employee Portal',
        type: 'password',
        difficulty: 12,
        description: 'Internal employee access point',
        challenges: [challengeTemplates.firewall[0]],
        loot: [lootTemplates.data[0]]
      },
      {
        level: 3,
        name: 'Data Storage',
        type: 'file_server',
        difficulty: 15,
        description: 'Main file repository',
        challenges: [challengeTemplates.black_ice[0]],
        loot: [lootTemplates.data[1], lootTemplates.credential[0]]
      }
    ]
  },
  {
    id: 'gang_hideout',
    name: 'Gang Data Cache',
    description: 'Illegal data storage used by gangs',
    category: 'criminal',
    difficulty: 'uncommon',
    floors: [
      {
        level: 1,
        name: 'Backdoor Entry',
        type: 'backdoor',
        difficulty: 8,
        description: 'Hidden entrance with minimal security',
        challenges: [],
        loot: []
      },
      {
        level: 2,
        name: 'Contraband Storage',
        type: 'data_vault',
        difficulty: 14,
        description: 'Encrypted storage of illegal data',
        challenges: [challengeTemplates.daemon[0]],
        loot: [lootTemplates.money[0], lootTemplates.program[0]]
      },
      {
        level: 3,
        name: 'Black Market',
        type: 'custom',
        difficulty: 16,
        description: 'Digital black market interface',
        challenges: [challengeTemplates.black_ice[0], challengeTemplates.firewall[0]],
        loot: [lootTemplates.program[1], lootTemplates.money[1]]
      }
    ]
  },
  {
    id: 'military_fort',
    name: 'Military Datafort',
    description: 'High-security military installation',
    category: 'military',
    difficulty: 'advanced',
    floors: [
      {
        level: 1,
        name: 'Perimeter Defense',
        type: 'ice_layer',
        difficulty: 18,
        description: 'Outer defensive layer',
        challenges: [challengeTemplates.black_ice[1]],
        loot: []
      },
      {
        level: 2,
        name: 'Authentication Node',
        type: 'password',
        difficulty: 20,
        description: 'Multi-factor authentication system',
        challenges: [challengeTemplates.password[1], challengeTemplates.daemon[1]],
        loot: [lootTemplates.credential[1]]
      },
      {
        level: 3,
        name: 'Command Center',
        type: 'control_node',
        difficulty: 22,
        description: 'Central command and control',
        challenges: [challengeTemplates.black_ice[1], challengeTemplates.firewall[1]],
        loot: [lootTemplates.data[1], lootTemplates.credential[0]]
      },
      {
        level: 4,
        name: 'Black Site',
        type: 'system_core',
        difficulty: 25,
        description: 'Classified data core',
        challenges: [challengeTemplates.black_ice[1], challengeTemplates.daemon[1]],
        loot: [lootTemplates.money[1], lootTemplates.program[1]]
      }
    ]
  }
];

export const visualThemes: Record<VisualTheme, { primaryColor: string; secondaryColor: string; description: string }> = {
  corporate: {
    primaryColor: '#0080ff',
    secondaryColor: '#004080',
    description: 'Clean lines and professional appearance'
  },
  military: {
    primaryColor: '#00ff00',
    secondaryColor: '#008000',
    description: 'Tactical displays and warning systems'
  },
  entertainment: {
    primaryColor: '#ff00ff',
    secondaryColor: '#8000ff',
    description: 'Bright colors and flashy animations'
  },
  medical: {
    primaryColor: '#00ffff',
    secondaryColor: '#0080ff',
    description: 'Clinical and sterile appearance'
  },
  abstract: {
    primaryColor: '#ffffff',
    secondaryColor: '#808080',
    description: 'Geometric shapes and patterns'
  },
  industrial: {
    primaryColor: '#ff8000',
    secondaryColor: '#804000',
    description: 'Rugged and mechanical aesthetic'
  },
  organic: {
    primaryColor: '#80ff00',
    secondaryColor: '#408000',
    description: 'Fluid and natural patterns'
  },
  retro: {
    primaryColor: '#ff00ff',
    secondaryColor: '#ff0080',
    description: 'Vintage cyberpunk style'
  },
  custom: {
    primaryColor: '#808080',
    secondaryColor: '#404040',
    description: 'User-defined styling'
  }
};