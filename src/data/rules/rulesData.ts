export interface RuleSection {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  related?: string[];
  quickRef?: boolean;
  page?: number;
}

export const rulesData: RuleSection[] = [
  // Combat Rules
  {
    id: 'combat-basics',
    title: 'Combat Basics',
    category: 'Combat',
    quickRef: true,
    content: `**Initiative:** REF + 1d10
**Actions per Turn:** 1 Move + 1 Action
**Move:** MOVE stat × 2 meters (walking), × 4 meters (running)
**Attack:** REF + Weapon Skill + 1d10 vs. DV
**Damage:** Weapon damage + Success over DV
**Critical Success:** Roll of 10, roll again and add
**Critical Failure:** Roll of 1, fumble (GM decides)`,
    related: ['combat-actions', 'range-dvs', 'cover']
  },
  {
    id: 'combat-actions',
    title: 'Combat Actions',
    category: 'Combat',
    subcategory: 'Actions',
    content: `**Attack:** Make one attack with ready weapon
**Aim:** +1 to hit per action spent aiming (max +3)
**Grab:** DEX + Brawling vs. defender's DEX + Athletics/Brawling
**Choke:** After successful grab, BODY + Brawling vs. BODY + Resist T/D
**Hold Action:** Delay action until trigger occurs
**Reload:** Reload weapon (varies by weapon)
**Draw/Sheathe:** Ready or put away weapon`,
    related: ['combat-basics', 'special-attacks']
  },
  {
    id: 'range-dvs',
    title: 'Range & DVs',
    category: 'Combat',
    subcategory: 'Ranged Combat',
    quickRef: true,
    content: `**Point Blank (0-1m):** DV 10
**Close (1-10m):** DV 12
**Medium (11-50m):** DV 15
**Long (51-200m):** DV 20
**Extreme (201-800m):** DV 25
**Beyond Extreme:** DV 30`,
    related: ['cover', 'combat-modifiers']
  },
  {
    id: 'cover',
    title: 'Cover',
    category: 'Combat',
    subcategory: 'Defense',
    quickRef: true,
    content: `**No Cover:** No penalty to attacker
**Light Cover (25%):** -2 to attacker
**Medium Cover (50%):** -4 to attacker  
**Heavy Cover (75%):** -6 to attacker
**Full Cover:** Cannot be directly targeted`,
    related: ['range-dvs', 'armor']
  },
  {
    id: 'armor',
    title: 'Armor & SP',
    category: 'Combat',
    subcategory: 'Defense',
    content: `**Stopping Power (SP):** Reduces damage by SP value
**Head:** SP × 1
**Body:** Full SP
**Limbs:** SP × 0.5
**Layering:** +5 SP max from additional layer, -2 DEX
**Ablation:** Every 10 damage reduces SP by 1`,
    related: ['damage-types', 'critical-injuries']
  },
  
  // Skills
  {
    id: 'skill-checks',
    title: 'Skill Checks',
    category: 'Skills',
    quickRef: true,
    content: `**Basic Check:** STAT + Skill + 1d10 vs. DV
**Opposed Check:** STAT + Skill + 1d10 vs. opponent's roll
**Typical DVs:**
- Easy: 9
- Everyday: 12
- Difficult: 15
- Professional: 18
- Heroic: 21
- Incredible: 24`,
    related: ['complementary-skills', 'skill-resolution']
  },
  {
    id: 'complementary-skills',
    title: 'Complementary Skills',
    category: 'Skills',
    subcategory: 'Advanced',
    content: `**Complementary Check:** Roll related skill vs. DV 10
**Success:** +1 to primary skill check
**10+ over DV:** +2 to primary skill check
**Example:** Science (Chemistry) helping Science (Pharmacology)
**Limit:** Maximum +3 from complementary skills`,
    related: ['skill-checks']
  },
  
  // Cyberware
  {
    id: 'cyberware-installation',
    title: 'Cyberware Installation',
    category: 'Cyberware',
    content: `**Installation:** 2x cost of cyberware, minimum 1000 eb
**Surgery Time:** 1 hour per 1d6 Humanity Loss
**Recovery:** 1 day per point of Humanity Loss
**Mall Surgery:** -2 Humanity Loss, takes minutes
**Clinic Surgery:** Standard installation
**Hospital Surgery:** +2 to Surgery roll`,
    related: ['humanity-loss', 'cyberpsychosis']
  },
  {
    id: 'humanity-loss',
    title: 'Humanity Loss',
    category: 'Cyberware',
    subcategory: 'Humanity',
    quickRef: true,
    content: `**Neuralware:** 2d6 HL
**Cyberoptics:** 2d6 HL per pair  
**Cyberaudio:** 2d6 HL per pair
**Cyberarm:** 3d6 HL
**Cyberleg:** 3d6 HL  
**Fashionware:** 1d6 HL
**Humanity:** EMP × 10
**Therapy:** 100 eb/point, limit EMP/week`,
    related: ['cyberware-installation', 'cyberpsychosis']
  },
  {
    id: 'cyberpsychosis',
    title: 'Cyberpsychosis',
    category: 'Cyberware',
    subcategory: 'Humanity',
    content: `**Trigger:** Humanity drops below EMP × 10
**Effects:** 
- Dissociative Disorder at EMP 8-9
- Violent Episodes at EMP 6-7  
- Full Cyberpsychosis at EMP 4-5
- Unplayable at EMP 2 or less
**Treatment:** Therapy reduces symptoms temporarily`,
    related: ['humanity-loss', 'therapy']
  },
  
  // Netrunning
  {
    id: 'netrunning-basics',
    title: 'Netrunning Basics',
    category: 'Netrunning',
    quickRef: true,
    content: `**Cyberdeck Stats:** 7 Hardware, 7 Software slots
**Actions:** Move, Netrun Action, Meat Action
**Speed:** 2 NET levels per Move action
**Attack:** Interface + Program Rank + 1d10 vs. DV
**Defense:** Interface + DEF Program + 1d10 vs. DV
**Range:** 8m per floor to Architecture`,
    related: ['net-architecture', 'programs', 'ice']
  },
  {
    id: 'net-architecture',
    title: 'NET Architecture',
    category: 'Netrunning',
    subcategory: 'Architecture',
    content: `**Lobby:** Floor 1-2, Password DV 8
**Security:** Floor 3-4, Password DV 10, Black ICE
**Grey:** Floor 5-6, Password DV 12, Demons
**Black:** Floor 7+, Password DV 14, All ICE types
**File Types:** Password, File, Control Node, Black ICE
**Each Floor:** 1d6 files/nodes`,
    related: ['netrunning-basics', 'ice']
  },
  {
    id: 'programs',
    title: 'Programs',
    category: 'Netrunning',
    subcategory: 'Software',
    content: `**Anti-Program Programs:** Armor, Shield
**Anti-Personnel Programs:** Banhammer, Blackout
**Anti-ICE Programs:** Sword, Killer
**Booster Programs:** Boost, Speedhack
**Demon Programs:** Imp, Djinn  
**Slots:** Class (ATK) × 2, Others × 1`,
    related: ['netrunning-basics', 'ice']
  },
  {
    id: 'ice',
    title: 'ICE Types',
    category: 'Netrunning',
    subcategory: 'Defenses',
    quickRef: true,
    content: `**Killer:** Deals REZ damage to Netrunner
**Sabotage:** Reduces Program Class by 1
**Defender:** +2 to all ICE stats
**Cloak:** Hides file type  
**Flak:** Creates false files
**Wisp:** Teleports Netrunner away`,
    related: ['net-architecture', 'programs']
  },
  
  // Equipment
  {
    id: 'weapon-types',
    title: 'Weapon Types',
    category: 'Equipment',
    subcategory: 'Weapons',
    content: `**Melee Weapons:**
- Light (1d6): Knife, Baton
- Medium (2d6): Sword, Bat  
- Heavy (3d6): Two-handed sword
**Ranged Weapons:**
- Pistol: 2d6 damage
- Assault Rifle: 3d6 damage
- Shotgun: 3d6 (close) / 2d6 (medium)
- Sniper: 4d6 damage`,
    related: ['combat-basics', 'ammo-types']
  },
  {
    id: 'ammo-types',
    title: 'Ammunition Types',
    category: 'Equipment',
    subcategory: 'Weapons',
    content: `**Basic:** Standard damage
**Armor Piercing:** Halves armor SP, -1 damage
**Incendiary:** +2 damage, may ignite
**Smart:** +1 to hit with smartgun link
**Rubber:** Non-lethal damage
**Specialty:** EMP, Biotoxin, Acid (varies)`,
    related: ['weapon-types']
  },
  
  // Vehicles
  {
    id: 'vehicle-combat',
    title: 'Vehicle Combat',
    category: 'Vehicles',
    content: `**Initiative:** REF + Control Skill + 1d10
**Movement:** MOVE stat × 3 (combat speed)
**Attacks:** Control Skill + REF + 1d10
**Ramming:** BODY + Speed damage to both
**Chase DV:** Based on terrain and speed
**Losing Control:** Failed check = crash`,
    related: ['vehicle-stats', 'chase-rules']
  },
  {
    id: 'vehicle-stats',
    title: 'Vehicle Stats',
    category: 'Vehicles',
    subcategory: 'Stats',
    content: `**SDP:** Structural Damage Points (HP)
**SP:** Armor value
**MOVE:** Top speed in mph/3
**Maneuver:** Handling modifier  
**Passengers:** Crew capacity
**Cost:** Price in Eurobucks`,
    related: ['vehicle-combat']
  }
];

// Category mapping for filtering
export const ruleCategories = [
  'Combat',
  'Skills',
  'Cyberware',
  'Netrunning', 
  'Equipment',
  'Vehicles'
];

// Quick reference sections
export const quickRefSections = rulesData.filter(rule => rule.quickRef);