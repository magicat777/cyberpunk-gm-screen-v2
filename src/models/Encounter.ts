import type { Encounter, Character, Item, CombatTurn } from '../types/game';
import { CharacterModel } from './Character';

export class EncounterModel implements Encounter {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  location?: string;
  npcs: Character[];
  loot?: Item[];
  notes?: string;
  tags: string[];
  createdAt: string;
  
  // Combat tracking
  private combatTurns: CombatTurn[] = [];
  private currentTurn: number = 0;
  private round: number = 1;

  constructor(data: Partial<Encounter> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'Unknown Encounter';
    this.description = data.description || '';
    this.difficulty = data.difficulty || 'Medium';
    this.location = data.location;
    this.npcs = data.npcs || [];
    this.loot = data.loot || [];
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Encounter management
  addNPC(npc: Character): void {
    this.npcs.push(npc);
  }

  removeNPC(npcId: string): void {
    this.npcs = this.npcs.filter(npc => npc.id !== npcId);
  }

  addLoot(item: Item): void {
    if (!this.loot) this.loot = [];
    this.loot.push(item);
  }

  // Combat management
  startCombat(playerCharacters: Character[]): void {
    const allCombatants = [...playerCharacters, ...this.npcs];
    
    // Roll initiative for all combatants
    this.combatTurns = allCombatants.map(character => ({
      characterId: character.id,
      initiative: this.rollInitiative(character),
      hasActed: false,
      conditions: []
    }));
    
    // Sort by initiative (descending)
    this.combatTurns.sort((a, b) => b.initiative - a.initiative);
    
    this.currentTurn = 0;
    this.round = 1;
  }

  private rollInitiative(character: Character): number {
    // In Cyberpunk, initiative is typically REF + 1d10
    const ref = character.stats.REF.value;
    const roll = Math.floor(Math.random() * 10) + 1;
    return ref + roll;
  }

  getCurrentTurn(): CombatTurn | null {
    if (this.combatTurns.length === 0) return null;
    return this.combatTurns[this.currentTurn];
  }

  nextTurn(): void {
    if (this.combatTurns.length === 0) return;
    
    // Mark current turn as acted
    this.combatTurns[this.currentTurn].hasActed = true;
    
    // Move to next turn
    this.currentTurn++;
    
    // If we've gone through all turns, start new round
    if (this.currentTurn >= this.combatTurns.length) {
      this.currentTurn = 0;
      this.round++;
      
      // Reset hasActed for all combatants
      this.combatTurns.forEach(turn => turn.hasActed = false);
      
      // Tick down condition durations
      this.combatTurns.forEach(turn => {
        turn.conditions = turn.conditions
          .map(condition => {
            if (condition.duration !== undefined) {
              condition.duration--;
            }
            return condition;
          })
          .filter(condition => condition.duration === undefined || condition.duration > 0);
      });
    }
  }

  addCondition(characterId: string, condition: {name: string, duration?: number, effects: string[]}): void {
    const turn = this.combatTurns.find(t => t.characterId === characterId);
    if (turn) {
      turn.conditions.push(condition);
    }
  }

  removeCondition(characterId: string, conditionName: string): void {
    const turn = this.combatTurns.find(t => t.characterId === characterId);
    if (turn) {
      turn.conditions = turn.conditions.filter(c => c.name !== conditionName);
    }
  }

  endCombat(): void {
    this.combatTurns = [];
    this.currentTurn = 0;
    this.round = 1;
  }

  // Utility methods
  getTotalChallengeRating(): number {
    // Calculate based on NPC stats and equipment
    let totalCR = 0;
    
    for (const npc of this.npcs) {
      // Average of combat-relevant stats
      const combatStats = (
        npc.stats.REF.value +
        npc.stats.DEX.value +
        npc.stats.BODY.value +
        npc.stats.WILL.value
      ) / 4;
      
      // Factor in weapons and armor
      const weaponBonus = npc.weapons.length * 2;
      const armorBonus = npc.armor.reduce((sum, armor) => sum + armor.sp, 0) / 2;
      
      totalCR += combatStats + weaponBonus + armorBonus;
    }
    
    return Math.round(totalCR);
  }

  getSuggestedPartySize(): number {
    const cr = this.getTotalChallengeRating();
    const difficultyMultiplier = {
      'Easy': 0.5,
      'Medium': 1,
      'Hard': 1.5,
      'Deadly': 2
    };
    
    return Math.max(1, Math.round(cr / (10 * difficultyMultiplier[this.difficulty])));
  }

  getLootValue(): number {
    if (!this.loot) return 0;
    return this.loot.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  }

  toJSON(): Encounter {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      difficulty: this.difficulty,
      location: this.location,
      npcs: this.npcs,
      loot: this.loot,
      notes: this.notes,
      tags: this.tags,
      createdAt: this.createdAt
    };
  }
}