import type { DiceRoll } from '../types/game';

export class DiceRollModel implements DiceRoll {
  dice: string;
  result: number;
  breakdown: {
    rolls: number[];
    modifier: number;
  };
  critical?: boolean;
  fumble?: boolean;
  timestamp: string;

  constructor(dice: string) {
    this.dice = dice;
    this.timestamp = new Date().toISOString();
    this.breakdown = { rolls: [], modifier: 0 };
    this.result = this.rollDice(dice);
  }

  private rollDice(diceString: string): number {
    // Parse dice string (e.g., "2d6+3", "1d10-2", "3d6")
    const match = diceString.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    
    if (!match) {
      throw new Error(`Invalid dice format: ${diceString}`);
    }

    const diceCount = parseInt(match[1], 10);
    const diceSize = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;

    // Roll the dice
    let total = 0;
    this.breakdown.rolls = [];
    this.breakdown.modifier = modifier;

    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(Math.random() * diceSize) + 1;
      this.breakdown.rolls.push(roll);
      total += roll;
    }

    // Check for critical/fumble (on d10 rolls)
    if (diceSize === 10 && diceCount === 1) {
      const singleRoll = this.breakdown.rolls[0];
      
      if (singleRoll === 10) {
        this.critical = true;
        
        // Exploding dice - roll again
        const explodeRoll = Math.floor(Math.random() * 10) + 1;
        this.breakdown.rolls.push(explodeRoll);
        total += explodeRoll;
        
        // Keep exploding on 10s
        if (explodeRoll === 10) {
          const secondExplode = Math.floor(Math.random() * 10) + 1;
          this.breakdown.rolls.push(secondExplode);
          total += secondExplode;
        }
      } else if (singleRoll === 1) {
        this.fumble = true;
      }
    }

    // Add modifier
    total += modifier;

    return Math.max(0, total); // Minimum result is 0
  }

  // Static helper methods
  static roll(dice: string): DiceRollModel {
    return new DiceRollModel(dice);
  }

  static rollMultiple(dice: string, count: number): DiceRollModel[] {
    const rolls: DiceRollModel[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(new DiceRollModel(dice));
    }
    return rolls;
  }

  static rollWithAdvantage(dice: string): DiceRollModel {
    const roll1 = new DiceRollModel(dice);
    const roll2 = new DiceRollModel(dice);
    return roll1.result >= roll2.result ? roll1 : roll2;
  }

  static rollWithDisadvantage(dice: string): DiceRollModel {
    const roll1 = new DiceRollModel(dice);
    const roll2 = new DiceRollModel(dice);
    return roll1.result <= roll2.result ? roll1 : roll2;
  }

  // Cyberpunk-specific rolls
  static skillCheck(skill: number, stat: number, difficulty?: number): {
    roll: DiceRollModel;
    total: number;
    success?: boolean;
  } {
    const roll = new DiceRollModel('1d10');
    const total = roll.result + skill + stat;
    
    const result = {
      roll,
      total,
      success: difficulty !== undefined ? total >= difficulty : undefined
    };

    return result;
  }

  static damageRoll(weapon: { damage: string }, isHeadshot: boolean = false): DiceRollModel {
    let damage = weapon.damage;
    
    // Double damage for headshots
    if (isHeadshot) {
      const match = damage.match(/^(\d+)d(\d+)([+-]\d+)?$/);
      if (match) {
        const diceCount = parseInt(match[1], 10);
        const diceSize = match[2];
        const modifier = match[3] || '';
        damage = `${diceCount * 2}d${diceSize}${modifier}`;
      }
    }
    
    return new DiceRollModel(damage);
  }

  static initiativeRoll(reflex: number): DiceRollModel {
    const roll = new DiceRollModel('1d10');
    // In Cyberpunk, initiative doesn't add to the result, it's rolled separately
    // But we'll store the REF value for reference
    roll.breakdown.modifier = reflex;
    return roll;
  }

  static humanityLossRoll(cyberware: { humanityLoss: string }): DiceRollModel {
    return new DiceRollModel(cyberware.humanityLoss);
  }

  // Utility methods
  toString(): string {
    let result = `${this.dice} = ${this.result}`;
    
    if (this.breakdown.rolls.length > 1 || this.breakdown.modifier !== 0) {
      result += ` (${this.breakdown.rolls.join(' + ')}`;
      if (this.breakdown.modifier !== 0) {
        result += ` ${this.breakdown.modifier >= 0 ? '+' : ''}${this.breakdown.modifier}`;
      }
      result += ')';
    }
    
    if (this.critical) result += ' [CRITICAL!]';
    if (this.fumble) result += ' [FUMBLE!]';
    
    return result;
  }

  toJSON(): DiceRoll {
    return {
      dice: this.dice,
      result: this.result,
      breakdown: this.breakdown,
      critical: this.critical,
      fumble: this.fumble,
      timestamp: this.timestamp
    };
  }
}