import { NPCGeneratorData, NPCTemplate, NPCArchetype } from '../types/npc';
import { RoleType, StatType, SkillType } from '../types/game';

export const npcGeneratorData: NPCGeneratorData = {
  firstNames: {
    male: [
      'Johnny', 'David', 'Viktor', 'Jackie', 'Takeshi', 'Marcus', 'Diego', 'Yuki',
      'Morgan', 'Rogue', 'Dexter', 'River', 'Kerry', 'Goro', 'Saul', 'Brick',
      'Royce', 'Placide', 'Ozob', 'Dum Dum', 'Sebastian', 'Anders', 'Klaus',
      'Mateo', 'Rico', 'Dante', 'Xavier', 'Leon', 'Mikhail', 'Chen'
    ],
    female: [
      'V', 'Panam', 'Judy', 'Evelyn', 'Rogue', 'Alt', 'Misty', 'Claire',
      'Meredith', 'Hanako', 'Brigitte', 'Nancy', 'Sandra', 'Lizzy', 'Rita',
      'Sasquatch', 'Maiko', 'Wakako', 'Dakota', 'Regina', 'Patricia', 'Ana',
      'Maria', 'Sofia', 'Elena', 'Yuki', 'Mei', 'Katya', 'Luna', 'Nova'
    ],
    neutral: [
      'River', 'Morgan', 'Dakota', 'Sage', 'Phoenix', 'Echo', 'Zero', 'Hex',
      'Binary', 'Chrome', 'Neon', 'Pixel', 'Vector', 'Matrix', 'Cipher',
      'Ghost', 'Razor', 'Wire', 'Socket', 'Byte', 'Cache', 'Debug', 'Glitch'
    ]
  },
  lastNames: [
    'Silverhand', 'Palmer', 'Alvarez', 'Ward', 'Jones', 'Harris', 'Chen',
    'Martinez', 'Thompson', 'White', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'Nguyen', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Walker', 'Young', 'King',
    'Wright', 'Scott', 'Torres', 'Adams', 'Nelson', 'Mitchell', 'Roberts', 'Carter',
    'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart',
    'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy'
  ],
  nicknames: [
    'Chrome', 'Razor', 'Ghost', 'Neon', 'Wire', 'Frost', 'Shadow', 'Blaze',
    'Storm', 'Viper', 'Phoenix', 'Reaper', 'Havoc', 'Nova', 'Hex', 'Binary',
    'Glitch', 'Socket', 'Turbo', 'Diesel', 'Mercury', 'Titan', 'Phantom',
    'Cipher', 'Zero', 'Echo', 'Pulse', 'Byte', 'Cache', 'Vector', 'Matrix',
    'Synth', 'Nuke', 'Crash', 'Burn', 'Spike', 'Edge', 'Blade', 'Hammer',
    'Iron', 'Steel', 'Copper', 'Silver', 'Gold', 'Diamond', 'Ruby', 'Jade'
  ],
  appearances: {
    ages: ['Early 20s', 'Mid 20s', 'Late 20s', 'Early 30s', 'Mid 30s', 'Late 30s', 
           'Early 40s', 'Mid 40s', 'Late 40s', '50s', '60s', 'Indeterminate'],
    builds: ['Skinny', 'Lean', 'Athletic', 'Average', 'Muscular', 'Stocky', 
             'Heavy', 'Lithe', 'Wiry', 'Imposing'],
    hairStyles: ['Shaved', 'Mohawk', 'Long', 'Short', 'Braided', 'Dreadlocks', 
                 'Undercut', 'Ponytail', 'Buzz Cut', 'Messy', 'Styled', 'Bald',
                 'Cyberhair', 'LED Strands', 'Holographic', 'Color-shifting'],
    hairColors: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Blue', 
                 'Green', 'Purple', 'Pink', 'Multicolored', 'Neon', 'Chrome'],
    eyeColors: ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Black', 'Red', 
                'Yellow', 'Purple', 'Silver', 'Cybernetic', 'Heterochromatic'],
    features: [
      'Facial scar', 'Cybernetic arm', 'Cybernetic eye', 'Tattoos', 'Piercings',
      'Missing limb', 'Birthmark', 'Cybernetic jaw', 'Burn scars', 'Gang markings',
      'Corporate logo tattoo', 'Subdermal armor', 'LED implants', 'Neural ports',
      'Exotic skin color', 'Modified teeth', 'Cybernetic hand', 'Facial implants'
    ],
    clothingStyles: {
      ganger: ['Leather jacket', 'Gang colors', 'Studded gear', 'Combat boots', 'Torn jeans'],
      corporate: ['Business suit', 'Designer wear', 'Expensive accessories', 'Clean cut'],
      lawEnforcement: ['Tactical gear', 'Badge visible', 'Body armor', 'Uniform'],
      civilian: ['Casual wear', 'Work clothes', 'Simple outfit', 'Practical clothing'],
      fixer: ['Stylish suit', 'Expensive coat', 'Designer sunglasses', 'Professional'],
      techie: ['Work overalls', 'Tool belt', 'Protective goggles', 'Practical gear'],
      media: ['Trendy outfit', 'Recording equipment', 'Stylish accessories', 'Camera'],
      nomad: ['Road leathers', 'Dusty clothes', 'Practical gear', 'Weather-worn'],
      criminal: ['Concealing coat', 'Dark clothes', 'Nondescript', 'Hidden weapons'],
      mercenary: ['Military surplus', 'Tactical vest', 'Combat gear', 'Weapon holsters'],
      netrunner: ['Tech wear', 'Cable accessories', 'Interface plugs visible', 'Minimal'],
      medtech: ['Medical coat', 'Scrubs', 'Equipment pouches', 'Clean appearance'],
      exotic: ['Unusual fashion', 'Exotic materials', 'Unique style', 'Eye-catching']
    },
    accessories: [
      'Sunglasses', 'Jewelry', 'Holster', 'Backpack', 'Messenger bag', 'Smartwatch',
      'Headphones', 'Scarf', 'Hat', 'Gloves', 'Belt', 'Chains', 'Pins', 'Patches'
    ]
  },
  motivations: {
    goals: {
      ganger: ['Control territory', 'Gain respect', 'Make money', 'Protect the gang'],
      corporate: ['Climb the ladder', 'Increase profits', 'Eliminate competition'],
      lawEnforcement: ['Keep the peace', 'Bust criminals', 'Protect citizens'],
      civilian: ['Survive', 'Provide for family', 'Find better life', 'Stay safe'],
      fixer: ['Make connections', 'Profit from deals', 'Build reputation'],
      techie: ['Create innovations', 'Fix problems', 'Make breakthrough'],
      media: ['Expose truth', 'Get the story', 'Build audience', 'Fame'],
      nomad: ['Protect the clan', 'Find new routes', 'Maintain vehicles'],
      criminal: ['Make big score', 'Avoid capture', 'Build empire', 'Get revenge'],
      mercenary: ['Complete missions', 'Get paid', 'Build reputation', 'Survive'],
      netrunner: ['Hack systems', 'Steal data', 'Build rep', 'Stay ghost'],
      medtech: ['Save lives', 'Research cures', 'Help patients', 'Make money'],
      exotic: ['Be unique', 'Express self', 'Shock others', 'Transcend humanity']
    },
    fears: [
      'Death', 'Cyberpsychosis', 'Poverty', 'Betrayal', 'Discovery', 'Failure',
      'Loss of control', 'Abandonment', 'Corporate retaliation', 'Gang warfare',
      'Police attention', 'Memory loss', 'Identity theft', 'Blackmail', 'Torture'
    ],
    desires: [
      'Power', 'Wealth', 'Recognition', 'Safety', 'Love', 'Revenge', 'Freedom',
      'Knowledge', 'Immortality', 'Family', 'Respect', 'Adventure', 'Peace',
      'Control', 'Innovation', 'Fame', 'Justice', 'Pleasure', 'Belonging'
    ],
    values: [
      'Loyalty', 'Honor', 'Family', 'Money', 'Power', 'Freedom', 'Truth',
      'Justice', 'Survival', 'Reputation', 'Knowledge', 'Independence',
      'Tradition', 'Innovation', 'Strength', 'Cunning', 'Compassion'
    ],
    methods: [
      'Violence', 'Negotiation', 'Manipulation', 'Stealth', 'Technology',
      'Intimidation', 'Bribery', 'Blackmail', 'Diplomacy', 'Deception',
      'Seduction', 'Infiltration', 'Sabotage', 'Assassination', 'Theft'
    ]
  },
  mannerisms: [
    'Constantly checks surroundings', 'Fidgets with weapon', 'Chain smokes',
    'Cracks knuckles', 'Adjusts clothing frequently', 'Speaks in whispers',
    'Loud talker', 'Never makes eye contact', 'Stares intensely', 'Laughs nervously',
    'Taps fingers rhythmically', 'Chews gum constantly', 'Cleans weapon obsessively',
    'Checks phone frequently', 'Scratches cybernetic implants', 'Drinks heavily',
    'Quotes old movies', 'Uses outdated slang', 'Speaks multiple languages',
    'Stutters when nervous', 'Always armed', 'Paranoid about surveillance'
  ],
  combatStyles: {
    ganger: ['Aggressive melee', 'Overwhelming firepower', 'Ambush tactics'],
    corporate: ['Calculated strikes', 'Superior equipment', 'Defensive positioning'],
    lawEnforcement: ['By the book', 'Non-lethal takedowns', 'Tactical formations'],
    civilian: ['Desperate defense', 'Flee if possible', 'Improvised weapons'],
    fixer: ['Avoid combat', 'Talk way out', 'Hired muscle'],
    techie: ['Gadgets and traps', 'Environmental advantages', 'Tech weapons'],
    media: ['Document everything', 'Expose wrongdoing', 'Call for backup'],
    nomad: ['Vehicle combat', 'Hit and run', 'Group tactics'],
    criminal: ['Dirty tricks', 'Escape routes', 'Ambush preference'],
    mercenary: ['Professional tactics', 'Combined arms', 'Objective focused'],
    netrunner: ['Hack defenses', 'System control', 'Remote attacks'],
    medtech: ['Defensive only', 'Protect patients', 'Chemical weapons'],
    exotic: ['Unpredictable', 'Unique abilities', 'Psychological warfare']
  },
  tactics: [
    'Flanking maneuvers', 'Suppressing fire', 'Grenade spam', 'Sniper support',
    'Close quarters combat', 'Breach and clear', 'Ambush points', 'Defensive positions',
    'Hit and run', 'Psychological warfare', 'Electronic warfare', 'Chemical weapons',
    'Distraction techniques', 'Feigned retreat', 'Pincer movement', 'Smoke and mirrors'
  ],
  secrets: {
    ganger: ['Police informant', 'Planning coup', 'Secret stash', 'Double agent'],
    corporate: ['Embezzling funds', 'Selling secrets', 'Illegal experiments'],
    lawEnforcement: ['Taking bribes', 'Vigilante justice', 'Gang connections'],
    civilian: ['Criminal past', 'Hidden wealth', 'Witness protection', 'Secret identity'],
    fixer: ['Double dealing', 'Blackmail material', 'Hidden agenda', 'Corporate spy'],
    techie: ['Illegal tech', 'Corporate theft', 'Underground connections'],
    media: ['Fabricated stories', 'Corporate payoffs', 'Hidden sources'],
    nomad: ['Smuggling operation', 'Corporate deal', 'Betrayed clan', 'Secret route'],
    criminal: ['Police informant', 'Hidden identity', 'Bigger heist planned'],
    mercenary: ['War crimes', 'Double agent', 'Personal vendetta', 'Hidden employer'],
    netrunner: ['AI contact', 'Stolen identities', 'Corporate backdoor', 'Dark secret'],
    medtech: ['Illegal procedures', 'Organ harvesting', 'Experimental drugs'],
    exotic: ['True identity', 'Alien origin', 'Government experiment', 'Mental instability']
  }
};

export const npcTemplates: NPCTemplate[] = [
  {
    id: 'ganger-low',
    name: 'Street Ganger',
    archetype: 'ganger',
    rolePresets: {
      Solo: { roleRank: { min: 1, max: 3 } },
      Lawman: { roleRank: { min: 1, max: 2 } }
    },
    statRanges: {
      INT: { min: 3, max: 6 },
      REF: { min: 4, max: 7 },
      DEX: { min: 4, max: 7 },
      TECH: { min: 2, max: 5 },
      COOL: { min: 3, max: 6 },
      WILL: { min: 3, max: 6 },
      LUCK: { min: 3, max: 6 },
      MOVE: { min: 4, max: 7 },
      BODY: { min: 4, max: 7 },
      EMP: { min: 2, max: 5 }
    },
    skillPriorities: {
      primary: [SkillType.Handgun, SkillType.Brawling, SkillType.Streetwise],
      secondary: [SkillType.Intimidation, SkillType.Athletics, SkillType.Perception],
      minimal: [SkillType.Education, SkillType.Science, SkillType.Business]
    },
    equipmentTags: ['cheap weapons', 'gang colors', 'basic armor'],
    cyberwareChance: 0.3,
    humanityRange: { min: 30, max: 50 },
    description: 'Low-level gang member, street thug'
  },
  {
    id: 'corporate-exec',
    name: 'Corporate Executive',
    archetype: 'corporate',
    rolePresets: {
      Exec: { roleRank: { min: 4, max: 7 } },
      Fixer: { roleRank: { min: 3, max: 6 } }
    },
    statRanges: {
      INT: { min: 6, max: 9 },
      REF: { min: 3, max: 6 },
      DEX: { min: 3, max: 6 },
      TECH: { min: 4, max: 7 },
      COOL: { min: 6, max: 9 },
      WILL: { min: 5, max: 8 },
      LUCK: { min: 4, max: 7 },
      MOVE: { min: 3, max: 6 },
      BODY: { min: 3, max: 6 },
      EMP: { min: 4, max: 7 }
    },
    skillPriorities: {
      primary: [SkillType.Business, SkillType.Persuasion, SkillType.Trading],
      secondary: [SkillType.Education, SkillType.HumanPerception, SkillType.Bribery],
      minimal: [SkillType.Brawling, SkillType.MeleeWeapon, SkillType.Endurance]
    },
    equipmentTags: ['expensive clothes', 'executive protection', 'corporate tech'],
    cyberwareChance: 0.8,
    humanityRange: { min: 40, max: 70 },
    description: 'High-level corporate executive with resources'
  },
  {
    id: 'netrunner-pro',
    name: 'Professional Netrunner',
    archetype: 'netrunner',
    rolePresets: {
      Netrunner: { roleRank: { min: 4, max: 8 } }
    },
    statRanges: {
      INT: { min: 7, max: 10 },
      REF: { min: 4, max: 7 },
      DEX: { min: 4, max: 7 },
      TECH: { min: 6, max: 9 },
      COOL: { min: 4, max: 7 },
      WILL: { min: 5, max: 8 },
      LUCK: { min: 4, max: 7 },
      MOVE: { min: 3, max: 6 },
      BODY: { min: 3, max: 6 },
      EMP: { min: 3, max: 6 }
    },
    skillPriorities: {
      primary: [SkillType.Interface, SkillType.ElectronicsSecurityTech, SkillType.ElectronicsSecurityTech],
      secondary: [SkillType.Education, SkillType.Science, SkillType.LocalExpert],
      minimal: [SkillType.Brawling, SkillType.Athletics, SkillType.Endurance]
    },
    equipmentTags: ['cyberdeck', 'interface cables', 'tech gear'],
    cyberwareChance: 0.9,
    humanityRange: { min: 20, max: 50 },
    description: 'Elite hacker and data thief'
  }
];