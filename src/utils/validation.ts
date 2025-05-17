import type { Character, Weapon, Skill, StatType } from '../types/game';

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateCharacter(character: Partial<Character>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!character.name || character.name.trim().length === 0) {
    errors.push(new ValidationError('name', 'Character name is required'));
  }

  if (!character.role) {
    errors.push(new ValidationError('role', 'Character role is required'));
  }

  // Stats validation
  if (character.stats) {
    const statTypes: StatType[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
    
    for (const statType of statTypes) {
      const stat = character.stats[statType];
      if (!stat) {
        errors.push(new ValidationError(`stats.${statType}`, `Stat ${statType} is missing`));
      } else if (stat.value < 1 || stat.value > 10) {
        errors.push(new ValidationError(`stats.${statType}`, `Stat ${statType} must be between 1 and 10`));
      }
    }
  }

  // Role rank validation
  if (character.roleRank !== undefined) {
    if (character.roleRank < 1 || character.roleRank > 10) {
      errors.push(new ValidationError('roleRank', 'Role rank must be between 1 and 10'));
    }
  }

  // Skills validation
  if (character.skills) {
    for (const skill of character.skills) {
      if (skill.level < 0 || skill.level > 10) {
        errors.push(new ValidationError(`skills.${skill.name}`, `Skill level must be between 0 and 10`));
      }
    }
  }

  // Hit points validation
  if (character.hitPoints) {
    if (character.hitPoints.current > character.hitPoints.max) {
      errors.push(new ValidationError('hitPoints.current', 'Current HP cannot exceed max HP'));
    }
    if (character.hitPoints.current < 0) {
      errors.push(new ValidationError('hitPoints.current', 'Current HP cannot be negative'));
    }
  }

  // Humanity validation
  if (character.humanity) {
    if (character.humanity.current > character.humanity.max) {
      errors.push(new ValidationError('humanity.current', 'Current humanity cannot exceed max humanity'));
    }
    if (character.humanity.current < 0) {
      errors.push(new ValidationError('humanity.current', 'Character has gone cyberpsycho (humanity < 0)'));
    }
  }

  return errors;
}

export function validateWeapon(weapon: Partial<Weapon>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!weapon.name || weapon.name.trim().length === 0) {
    errors.push(new ValidationError('name', 'Weapon name is required'));
  }

  if (!weapon.type) {
    errors.push(new ValidationError('type', 'Weapon type is required'));
  }

  if (!weapon.damage || !/^\d+d\d+([+-]\d+)?$/.test(weapon.damage)) {
    errors.push(new ValidationError('damage', 'Invalid damage format (expected format: 2d6+1)'));
  }

  if (weapon.rof !== undefined && weapon.rof < 1) {
    errors.push(new ValidationError('rof', 'Rate of fire must be at least 1'));
  }

  if (weapon.magazine !== undefined && weapon.magazine < 1) {
    errors.push(new ValidationError('magazine', 'Magazine size must be at least 1'));
  }

  if (weapon.currentAmmo !== undefined) {
    if (weapon.currentAmmo < 0) {
      errors.push(new ValidationError('currentAmmo', 'Current ammo cannot be negative'));
    }
    if (weapon.magazine !== undefined && weapon.currentAmmo > weapon.magazine) {
      errors.push(new ValidationError('currentAmmo', 'Current ammo cannot exceed magazine size'));
    }
  }

  if (weapon.hands !== undefined && weapon.hands !== 1 && weapon.hands !== 2) {
    errors.push(new ValidationError('hands', 'Weapon must require 1 or 2 hands'));
  }

  return errors;
}

export function validateSkill(skill: Partial<Skill>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!skill.name || skill.name.trim().length === 0) {
    errors.push(new ValidationError('name', 'Skill name is required'));
  }

  if (!skill.category) {
    errors.push(new ValidationError('category', 'Skill category is required'));
  }

  if (!skill.stat) {
    errors.push(new ValidationError('stat', 'Skill stat is required'));
  }

  if (skill.level !== undefined) {
    if (skill.level < 0 || skill.level > 10) {
      errors.push(new ValidationError('level', 'Skill level must be between 0 and 10'));
    }
  }

  if (skill.ip !== undefined && skill.ip < 0) {
    errors.push(new ValidationError('ip', 'Improvement points cannot be negative'));
  }

  return errors;
}

export function validateDiceRoll(diceString: string): boolean {
  return /^\d+d\d+([+-]\d+)?$/.test(diceString);
}

export function validateNetDifficulty(difficulty: number): boolean {
  return difficulty >= 1 && difficulty <= 20;
}

export function validateEurodollars(amount: number): boolean {
  return amount >= 0 && Number.isInteger(amount);
}

// Helper validation functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function sanitizeString(input: string): string {
  // Remove potential XSS vectors while preserving safe characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function roundToDecimal(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}