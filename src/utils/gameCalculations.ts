import type { Character, Weapon } from '../types/game';

export function calculateMaxHP(character: Character): number {
  const body = character.stats.BODY.value;
  const will = character.stats.WILL.value;
  return 10 + (5 * Math.ceil((body + will) / 2));
}

export function calculateSeriouslyWoundedThreshold(maxHP: number): number {
  return Math.floor(maxHP / 2);
}

export function calculateDeathSaveThreshold(character: Character): number {
  return character.stats.BODY.value;
}

export function calculateInitiative(character: Character, roll: number): number {
  return character.stats.REF.value + roll;
}

export function calculateDamage(
  weapon: Weapon, // eslint-disable-line @typescript-eslint/no-unused-vars
  rolls: number[],
  modifier: number = 0,
  isHeadshot: boolean = false
): number {
  const baseDamage = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
  return isHeadshot ? baseDamage * 2 : baseDamage;
}

export function calculateArmorPiercing(
  damage: number,
  armorSP: number,
  isPiercing: boolean = false
): number {
  const effectiveSP = isPiercing ? Math.floor(armorSP / 2) : armorSP;
  return Math.max(0, damage - effectiveSP);
}

export function calculateTotalArmorSP(
  character: Character,
  location: 'Head' | 'Body' | 'Shield'
): number {
  return character.armor
    .filter(armor => armor.location === location)
    .reduce((total, armor) => total + armor.sp, 0);
}

export function calculateSkillTotal(
  character: Character,
  skillName: string
): number {
  const skill = character.skills.find(s => s.name === skillName);
  if (!skill) return 0;
  
  const stat = character.stats[skill.stat];
  return skill.level + stat.value;
}

export function calculateRoleAbilityTotal(character: Character): number {
  const roleAbilitySkill = getRoleAbilitySkill(character.role);
  return calculateSkillTotal(character, roleAbilitySkill) + character.roleRank;
}

export function getRoleAbilitySkill(role: string): string {
  const roleAbilities: Record<string, string> = {
    'Solo': 'Combat Awareness',
    'Rockerboy': 'Charismatic Impact',
    'Netrunner': 'Interface',
    'Tech': 'Maker',
    'Medtech': 'Medicine',
    'Media': 'Credibility',
    'Exec': 'Teamwork',
    'Lawman': 'Backup',
    'Fixer': 'Operator',
    'Nomad': 'Moto'
  };
  
  return roleAbilities[role] || '';
}

export function calculateMaxHumanity(character: Character): number {
  return character.stats.EMP.value * 10;
}

export function calculateCyberwareHumanityLoss(
  character: Character
): number {
  return character.cyberware
    .filter(cyber => cyber.installed)
    .reduce((total, cyber) => {
      // Parse humanity loss dice (e.g., "2d6")
      const [diceCount, diceSize] = cyber.humanityLoss.split('d').map(Number);
      // Use average for calculation (not rolled)
      const avgRoll = ((diceSize + 1) / 2) * diceCount;
      return total + avgRoll;
    }, 0);
}

export function calculateMovement(character: Character): {
  walk: number;
  run: number;
  jump: number;
} {
  const move = character.stats.MOVE.value;
  
  return {
    walk: move,
    run: move * 4,
    jump: Math.floor(move / 2)
  };
}

export function calculateCarryCapacity(character: Character): {
  light: number;
  medium: number;
  heavy: number;
} {
  const body = character.stats.BODY.value;
  
  return {
    light: body * 5,   // kg
    medium: body * 10, // kg
    heavy: body * 15   // kg
  };
}

export function calculateNetActions(character: Character): number {
  const netrunnerRank = character.role === 'Netrunner' ? character.roleRank : 0;
  // const interfaceSkill = calculateSkillTotal(character, 'Interface');
  
  // Netrunners get extra NET actions based on rank
  const baseActions = 2;
  const rankBonus = Math.floor(netrunnerRank / 2);
  
  return baseActions + rankBonus;
}

export function calculateSocialStanding(character: Character): string {
  const cool = character.stats.COOL.value;
  const rep = character.reputation || 0;
  const total = cool + rep;
  
  if (total >= 20) return 'Celebrity';
  if (total >= 15) return 'Well-known';
  if (total >= 10) return 'Recognized';
  if (total >= 5) return 'Nobody special';
  return 'Unknown';
}

export function calculateHealingRate(
  character: Character,
  careLevel: 'none' | 'first-aid' | 'medical' | 'hospital'
): number {
  const body = character.stats.BODY.value;
  const baseRate = Math.ceil(body / 2);
  
  const careMultipliers = {
    'none': 0.5,
    'first-aid': 1,
    'medical': 1.5,
    'hospital': 2
  };
  
  return Math.ceil(baseRate * careMultipliers[careLevel]);
}

export function calculateRangeModifier(
  range: number,
  weaponRange: number
): number {
  const rangeCategories = [
    { max: weaponRange * 0.25, modifier: 0 },    // Close
    { max: weaponRange * 0.5, modifier: -2 },    // Medium
    { max: weaponRange * 1, modifier: -4 },      // Long
    { max: weaponRange * 2, modifier: -6 },      // Extreme
    { max: Infinity, modifier: -8 }              // Beyond
  ];
  
  const category = rangeCategories.find(cat => range <= cat.max);
  return category ? category.modifier : -8;
}

export function calculateFumbleResult(roll: number): string {
  const fumbleTable = [
    { max: 5, result: 'Weapon jams or misfires' },
    { max: 8, result: 'Drop weapon' },
    { max: 10, result: 'Hit ally or innocent' },
    { max: 12, result: 'Weapon damaged' },
    { max: 15, result: 'Fall prone' },
    { max: 20, result: 'Injure yourself' }
  ];
  
  const result = fumbleTable.find(entry => roll <= entry.max);
  return result ? result.result : 'Critical system failure';
}

export function calculateUpgradeCost(
  currentLevel: number,
  targetLevel: number
): number {
  let totalCost = 0;
  
  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    totalCost += level * 10; // IP cost per level
  }
  
  return totalCost;
}

export function calculateDrugDuration(
  drugType: string,
  character: Character
): number {
  const body = character.stats.BODY.value;
  
  const baseDurations: Record<string, number> = {
    'Speedheal': 60,      // minutes
    'Endorphins': 10,     // minutes
    'Synthcoke': 30,      // minutes
    'Kereznikov': 5,      // minutes
    'Sandevistan': 1      // minute
  };
  
  const baseDuration = baseDurations[drugType] || 10;
  
  // Higher BODY extends duration
  const bodyModifier = 1 + (body - 5) * 0.1;
  
  return Math.round(baseDuration * bodyModifier);
}

export function calculateAddictionRoll(
  drugType: string,
  character: Character
): number {
  const will = character.stats.WILL.value;
  
  const addictionDVs: Record<string, number> = {
    'Alcohol': 10,
    'Speedheal': 12,
    'Endorphins': 15,
    'Synthcoke': 18,
    'Kereznikov': 20,
    'Sandevistan': 22
  };
  
  const dv = addictionDVs[drugType] || 15;
  
  // Need to roll: 1d10 + WILL vs. DV
  return dv - will; // Chance of addiction (higher = worse)
}

export function isCriticalHit(weapon: Weapon, roll: number): boolean {
  // Standard critical on natural 10
  if (roll === 10) return true;
  
  // Some weapons have improved critical range
  const improvedCriticalWeapons = ['Monoblade', 'Kendachi Monokatana'];
  if (improvedCriticalWeapons.includes(weapon.name) && roll >= 9) {
    return true;
  }
  
  return false;
}