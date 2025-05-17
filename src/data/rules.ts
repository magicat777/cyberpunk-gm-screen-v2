import type { Rule } from '../types/game';

export const GAME_RULES: Rule[] = [
  // Basic Rules
  {
    id: 'basic-roll',
    name: 'Basic Skill Check',
    category: 'Basic Rules',
    description: 'Roll 1d10 + Stat + Skill vs. Difficulty Value (DV)',
    examples: [
      'Athletics check: 1d10 + DEX + Athletics vs. DV',
      'Perception check: 1d10 + INT + Perception vs. DV'
    ],
    pageReference: 'Core Book p.130'
  },
  {
    id: 'critical-success',
    name: 'Critical Success',
    category: 'Basic Rules',
    description: 'Rolling a natural 10 on 1d10 allows you to roll another 1d10 and add it to the total',
    examples: [
      'Roll 10: Roll again, get 7 = 17 + modifiers',
      'Can explode multiple times'
    ],
    pageReference: 'Core Book p.130'
  },
  {
    id: 'critical-failure',
    name: 'Critical Failure',
    category: 'Basic Rules',
    description: 'Rolling a natural 1 on 1d10 results in a critical failure - something bad happens',
    examples: [
      'Weapon jams',
      'Fall prone',
      'Hit ally instead'
    ],
    pageReference: 'Core Book p.130'
  },
  
  // Combat Rules
  {
    id: 'initiative',
    name: 'Initiative',
    category: 'Combat',
    description: 'Roll 1d10 + REF to determine turn order, higher goes first',
    examples: [
      'Solo with REF 8 rolls 6: Initiative 14',
      'Ties act simultaneously'
    ],
    pageReference: 'Core Book p.169'
  },
  {
    id: 'actions-per-turn',
    name: 'Actions Per Turn',
    category: 'Combat',
    description: 'Each turn you get one Move Action and one Action',
    examples: [
      'Move + Attack',
      'Move + Aim',
      'Draw weapon + Attack'
    ],
    pageReference: 'Core Book p.170'
  },
  {
    id: 'ranged-attack',
    name: 'Ranged Attack',
    category: 'Combat',
    description: 'Roll 1d10 + REF + Weapon Skill vs. DV (usually 13)',
    examples: [
      'Single shot: Base DV 13',
      'Autofire: Base DV 15',
      'Aimed shot: +1 to hit'
    ],
    pageReference: 'Core Book p.170'
  },
  {
    id: 'melee-attack',
    name: 'Melee Attack',
    category: 'Combat',
    description: 'Roll 1d10 + DEX + Melee Weapon vs. DV 13',
    examples: [
      'Brawling: 1d10 + DEX + Brawling vs. 13',
      'Martial Arts adds extra damage'
    ],
    pageReference: 'Core Book p.171'
  },
  {
    id: 'damage-calculation',
    name: 'Damage',
    category: 'Combat',
    description: 'Roll weapon damage, subtract armor SP, apply remainder to HP',
    examples: [
      'Heavy Pistol (3d6) rolls 14',
      'Target has SP 7 armor',
      'Target takes 7 damage (14-7)'
    ],
    pageReference: 'Core Book p.172'
  },
  {
    id: 'aimed-shots',
    name: 'Aimed Shots',
    category: 'Combat',
    description: 'Target specific body parts at increased DV',
    examples: [
      'Head: DV +4, damage x2',
      'Arm: DV +1',
      'Leg: DV +1'
    ],
    pageReference: 'Core Book p.171'
  },
  {
    id: 'seriously-wounded',
    name: 'Seriously Wounded',
    category: 'Combat',
    description: 'At half HP or less, all checks at -2, must make Stun Check',
    examples: [
      '40 HP character at 20 HP or less',
      'Stun Check: WILL + 1d10 vs. DV 10'
    ],
    pageReference: 'Core Book p.174'
  },
  {
    id: 'death-saves',
    name: 'Death Saves',
    category: 'Combat',
    description: 'At 0 HP, must roll Death Save each turn: BODY + 1d10 vs. DV 10',
    examples: [
      'Success: Still dying but alive',
      'Failure: Dead',
      'Natural 10: Stabilize at 1 HP'
    ],
    pageReference: 'Core Book p.175'
  },
  
  // Netrunning Rules
  {
    id: 'net-architecture',
    name: 'NET Architecture',
    category: 'Netrunning',
    description: 'Networks consist of layers that must be breached in sequence',
    examples: [
      'Login portal → Security → Data vault',
      'Each layer has its own DV'
    ],
    pageReference: 'Core Book p.201'
  },
  {
    id: 'interface-check',
    name: 'Interface Check',
    category: 'Netrunning',
    description: 'Roll 1d10 + INT + Interface vs. Network DV',
    examples: [
      'Basic Network: DV 10',
      'Corporate Network: DV 15',
      'Military Network: DV 20'
    ],
    pageReference: 'Core Book p.203'
  },
  {
    id: 'black-ice',
    name: 'Black ICE',
    category: 'Netrunning',
    description: 'Defensive programs that attack intruding netrunners',
    examples: [
      'Attack: 1d10 + ATK vs. Netrunner Defense',
      'Can cause physical damage through interface'
    ],
    pageReference: 'Core Book p.205'
  },
  {
    id: 'net-combat',
    name: 'NET Combat',
    category: 'Netrunning',
    description: 'Netrunner vs. Black ICE uses same combat rules but with Interface + INT',
    examples: [
      'Attack: 1d10 + INT + Interface',
      'Defense: 1d10 + INT + Interface'
    ],
    pageReference: 'Core Book p.206'
  },
  
  // Social Rules
  {
    id: 'face-down',
    name: 'Facedown',
    category: 'Social',
    description: 'Contested COOL + 1d10 rolls to intimidate or impress',
    examples: [
      'Intimidate: COOL + 1d10 + Interrogation',
      'Resist: COOL + 1d10 + Resist Torture/Drugs'
    ],
    pageReference: 'Core Book p.184'
  },
  {
    id: 'persuasion',
    name: 'Persuasion',
    category: 'Social',
    description: 'COOL + 1d10 + Persuasion vs. target\'s COOL + 1d10',
    examples: [
      'Basic lie: Normal check',
      'Outrageous lie: +5 to target\'s roll'
    ],
    pageReference: 'Core Book p.185'
  },
  
  // Healing Rules
  {
    id: 'first-aid',
    name: 'First Aid',
    category: 'Healing',
    description: 'TECH + 1d10 + First Aid vs. DV based on injury',
    examples: [
      'Light wounds (1-10 HP): DV 10',
      'Moderate wounds (11-20 HP): DV 15',
      'Severe wounds (21+ HP): DV 20'
    ],
    pageReference: 'Core Book p.176'
  },
  {
    id: 'natural-healing',
    name: 'Natural Healing',
    category: 'Healing',
    description: 'Recover HP based on activity level and medical care',
    examples: [
      'Light activity: 1 HP/day',
      'Full rest: 2 HP/day',
      'Hospital care: 3 HP/day'
    ],
    pageReference: 'Core Book p.177'
  },
  
  // Vehicle Rules
  {
    id: 'vehicle-combat',
    name: 'Vehicle Combat',
    category: 'Vehicles',
    description: 'Use Pilot skill + REF for maneuvers, regular combat for shooting',
    examples: [
      'Chase: Contested Pilot checks',
      'Ram: Pilot check vs. target\'s Pilot'
    ],
    pageReference: 'Core Book p.189'
  },
  {
    id: 'vehicle-damage',
    name: 'Vehicle Damage',
    category: 'Vehicles',
    description: 'Vehicles have SP and SDP (Structural Damage Points)',
    examples: [
      'Damage > SP damages vehicle',
      'At 0 SDP, vehicle is destroyed'
    ],
    pageReference: 'Core Book p.190'
  },
  
  // Cyberware Rules
  {
    id: 'humanity-loss',
    name: 'Humanity Loss',
    category: 'Cyberware',
    description: 'Installing cyberware causes Humanity loss. At 0 Humanity, become cyberpsycho',
    examples: [
      'Roll cyberware\'s HL dice',
      'Lose that much Humanity',
      'Therapy can restore some Humanity'
    ],
    pageReference: 'Core Book p.230'
  },
  {
    id: 'cyberpsychosis',
    name: 'Cyberpsychosis',
    category: 'Cyberware',
    description: 'At 0 Humanity, character becomes NPC cyberpsycho',
    examples: [
      'Loss of empathy',
      'Violent outbursts',
      'Character becomes GM-controlled'
    ],
    pageReference: 'Core Book p.231'
  },
  
  // Economy Rules
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    category: 'Economy',
    description: 'Monthly lifestyle costs based on living conditions',
    examples: [
      'Kibble (lowest): 100eb/month',
      'Low: 500eb/month',
      'Middle: 1000eb/month',
      'High: 5000eb/month'
    ],
    pageReference: 'Core Book p.380'
  },
  {
    id: 'night-market',
    name: 'Night Market',
    category: 'Economy',
    description: 'Black market for illegal goods, prices vary',
    examples: [
      'Availability check using Streetwise',
      'Prices 2x-10x normal',
      'Risk of scams or police'
    ],
    pageReference: 'Core Book p.382'
  }
];

// Categories for filtering
export const RULE_CATEGORIES = [
  'Basic Rules',
  'Combat',
  'Netrunning',
  'Social',
  'Healing',
  'Vehicles',
  'Cyberware',
  'Economy'
];

// Helper functions
export function getRulesByCategory(category: string): Rule[] {
  return GAME_RULES.filter(rule => rule.category === category);
}

export function searchRules(query: string): Rule[] {
  const lowercaseQuery = query.toLowerCase();
  return GAME_RULES.filter(rule => 
    rule.name.toLowerCase().includes(lowercaseQuery) ||
    rule.description.toLowerCase().includes(lowercaseQuery) ||
    rule.examples?.some(ex => ex.toLowerCase().includes(lowercaseQuery))
  );
}

export function getRuleById(id: string): Rule | undefined {
  return GAME_RULES.find(rule => rule.id === id);
}