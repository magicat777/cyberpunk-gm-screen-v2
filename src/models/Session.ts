import type { Session, Character, Encounter, Item } from '../types/game';

export class SessionModel implements Session {
  id: string;
  name: string;
  date: string;
  players: Character[];
  encounters: Encounter[];
  notes: string;
  loot: Item[];
  reputation: {
    characterId: string;
    change: number;
    reason: string;
  }[];
  
  // Runtime tracking
  private sessionLog: SessionEvent[] = [];
  private activeEncounterId?: string;
  private sessionDuration: number = 0;
  private startTime?: Date;

  constructor(data: Partial<Session> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || `Session ${new Date().toLocaleDateString()}`;
    this.date = data.date || new Date().toISOString();
    this.players = data.players || [];
    this.encounters = data.encounters || [];
    this.notes = data.notes || '';
    this.loot = data.loot || [];
    this.reputation = data.reputation || [];
  }

  // Session management
  startSession(): void {
    this.startTime = new Date();
    this.addLog('session_start', `Session "${this.name}" started`);
  }

  endSession(): void {
    if (this.startTime) {
      this.sessionDuration = Date.now() - this.startTime.getTime();
      this.addLog('session_end', `Session ended after ${this.formatDuration(this.sessionDuration)}`);
    }
  }

  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  // Player management
  addPlayer(character: Character): void {
    if (!this.players.find(p => p.id === character.id)) {
      this.players.push(character);
      this.addLog('player_joined', `${character.name} joined the session`);
    }
  }

  removePlayer(characterId: string): void {
    const player = this.players.find(p => p.id === characterId);
    if (player) {
      this.players = this.players.filter(p => p.id !== characterId);
      this.addLog('player_left', `${player.name} left the session`);
    }
  }

  // Encounter management
  startEncounter(encounter: Encounter): void {
    this.encounters.push(encounter);
    this.activeEncounterId = encounter.id;
    this.addLog('encounter_start', `Started encounter: ${encounter.name}`);
  }

  endEncounter(): void {
    if (this.activeEncounterId) {
      const encounter = this.encounters.find(e => e.id === this.activeEncounterId);
      if (encounter) {
        this.addLog('encounter_end', `Ended encounter: ${encounter.name}`);
      }
      this.activeEncounterId = undefined;
    }
  }

  getCurrentEncounter(): Encounter | undefined {
    if (!this.activeEncounterId) return undefined;
    return this.encounters.find(e => e.id === this.activeEncounterId);
  }

  // Loot management
  addLoot(item: Item, distributedTo?: string): void {
    this.loot.push(item);
    
    let logMessage = `Found loot: ${item.name} (${item.cost}eb)`;
    if (distributedTo) {
      const character = this.players.find(p => p.id === distributedTo);
      if (character) {
        logMessage += ` - given to ${character.name}`;
      }
    }
    
    this.addLog('loot_found', logMessage);
  }

  distributeLoot(itemId: string, characterId: string): void {
    const item = this.loot.find(i => i.id === itemId);
    const character = this.players.find(p => p.id === characterId);
    
    if (item && character) {
      this.addLog('loot_distributed', `${item.name} given to ${character.name}`);
    }
  }

  // Reputation tracking
  changeReputation(characterId: string, change: number, reason: string): void {
    const character = this.players.find(p => p.id === characterId);
    if (!character) return;
    
    this.reputation.push({ characterId, change, reason });
    
    const direction = change > 0 ? 'gained' : 'lost';
    this.addLog('reputation_change', 
      `${character.name} ${direction} ${Math.abs(change)} reputation: ${reason}`
    );
  }

  // Notes and logging
  addNote(note: string): void {
    this.notes += `\n[${new Date().toLocaleTimeString()}] ${note}`;
  }

  private addLog(type: string, message: string): void {
    this.sessionLog.push({
      timestamp: new Date().toISOString(),
      type,
      message
    });
  }

  // Analytics
  getSessionStats(): SessionStats {
    return {
      duration: this.sessionDuration,
      encounterCount: this.encounters.length,
      totalLootValue: this.loot.reduce((sum, item) => sum + (item.cost * item.quantity), 0),
      reputationChanges: this.reputation.reduce((sum, rep) => sum + rep.change, 0),
      playerCount: this.players.length,
      combatTime: this.calculateCombatTime(),
      roleplayTime: this.calculateRoleplayTime()
    };
  }

  private calculateCombatTime(): number {
    // Simplified calculation based on encounter count
    return this.encounters.filter(e => e.npcs.length > 0).length * 30 * 60 * 1000; // 30 min per combat
  }

  private calculateRoleplayTime(): number {
    // Remaining time after combat
    return Math.max(0, this.sessionDuration - this.calculateCombatTime());
  }

  // Export and summary
  generateSummary(): string {
    const stats = this.getSessionStats();
    
    let summary = `# Session Summary: ${this.name}\n`;
    summary += `Date: ${new Date(this.date).toLocaleDateString()}\n`;
    summary += `Duration: ${this.formatDuration(stats.duration)}\n\n`;
    
    summary += `## Players (${this.players.length})\n`;
    this.players.forEach(p => {
      summary += `- ${p.name} (${p.role})\n`;
    });
    
    summary += `\n## Encounters (${this.encounters.length})\n`;
    this.encounters.forEach(e => {
      summary += `- ${e.name} (${e.difficulty})\n`;
    });
    
    summary += `\n## Loot\n`;
    summary += `Total Value: ${stats.totalLootValue}eb\n`;
    this.loot.forEach(item => {
      summary += `- ${item.name} x${item.quantity} (${item.cost}eb each)\n`;
    });
    
    summary += `\n## Reputation Changes\n`;
    this.reputation.forEach(rep => {
      const character = this.players.find(p => p.id === rep.characterId);
      const direction = rep.change > 0 ? '+' : '';
      summary += `- ${character?.name}: ${direction}${rep.change} (${rep.reason})\n`;
    });
    
    if (this.notes) {
      summary += `\n## Notes\n${this.notes}\n`;
    }
    
    return summary;
  }

  getSessionLog(): SessionEvent[] {
    return [...this.sessionLog];
  }

  toJSON(): Session {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      players: this.players,
      encounters: this.encounters,
      notes: this.notes,
      loot: this.loot,
      reputation: this.reputation
    };
  }
}

interface SessionEvent {
  timestamp: string;
  type: string;
  message: string;
}

interface SessionStats {
  duration: number;
  encounterCount: number;
  totalLootValue: number;
  reputationChanges: number;
  playerCount: number;
  combatTime: number;
  roleplayTime: number;
}