import type { NetArchitecture, NetLayer, BlackIce, NetData } from '../types/game';

export class NetArchitectureModel implements NetArchitecture {
  id: string;
  name: string;
  difficulty: number;
  layers: NetLayer[];
  blackIce: BlackIce[];
  data: NetData[];
  notes?: string;
  
  // Runtime state
  private breachedLayers: Set<string> = new Set();
  private defeatedIce: Set<string> = new Set();
  private extractedData: Set<string> = new Set();

  constructor(data: Partial<NetArchitecture> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'Unknown System';
    this.difficulty = data.difficulty || 6;
    this.layers = data.layers || this.generateDefaultLayers();
    this.blackIce = data.blackIce || [];
    this.data = data.data || [];
    this.notes = data.notes;
  }

  private generateDefaultLayers(): NetLayer[] {
    return [
      {
        id: crypto.randomUUID(),
        name: 'Login Portal',
        difficulty: this.difficulty,
        description: 'System entry point',
        password: this.generatePassword()
      },
      {
        id: crypto.randomUUID(),
        name: 'Security Layer',
        difficulty: this.difficulty + 2,
        description: 'Basic security protocols'
      },
      {
        id: crypto.randomUUID(),
        name: 'Data Vault',
        difficulty: this.difficulty + 4,
        description: 'Protected data storage'
      }
    ];
  }

  private generatePassword(): string {
    const words = ['cyber', 'neon', 'chrome', 'ghost', 'matrix', 'blade', 'runner', 'punk'];
    const numbers = Math.floor(Math.random() * 9999);
    return words[Math.floor(Math.random() * words.length)] + numbers;
  }

  // Architecture management
  addLayer(layer: Omit<NetLayer, 'id'>): void {
    this.layers.push({
      ...layer,
      id: crypto.randomUUID()
    });
  }

  addBlackIce(ice: Omit<BlackIce, 'id'>): void {
    this.blackIce.push({
      ...ice,
      id: crypto.randomUUID()
    });
  }

  addData(data: Omit<NetData, 'id'>): void {
    this.data.push({
      ...data,
      id: crypto.randomUUID()
    });
  }

  // Netrunning actions
  attemptBreach(layerId: string, netrunnerInterface: number): {
    success: boolean;
    roll: number;
    difficulty: number;
    consequences?: string[];
  } {
    const layer = this.layers.find(l => l.id === layerId);
    if (!layer) {
      return { success: false, roll: 0, difficulty: 0, consequences: ['Layer not found'] };
    }

    // Roll 1d10 + Interface skill
    const roll = Math.floor(Math.random() * 10) + 1 + netrunnerInterface;
    const success = roll >= layer.difficulty;

    const result = {
      success,
      roll,
      difficulty: layer.difficulty,
      consequences: [] as string[]
    };

    if (success) {
      this.breachedLayers.add(layerId);
      result.consequences.push(`Successfully breached ${layer.name}`);
    } else {
      // Failed breach triggers consequences
      const margin = layer.difficulty - roll;
      if (margin >= 5) {
        // Critical failure
        result.consequences.push('Critical failure: System alert raised');
        this.triggerSystemAlert();
      } else {
        result.consequences.push('Access denied');
      }
    }

    return result;
  }

  combatBlackIce(iceId: string, attackValue: number): {
    success: boolean;
    damage: number;
    iceDefeated: boolean;
    counterAttack?: number;
  } {
    const ice = this.blackIce.find(i => i.id === iceId);
    if (!ice) {
      return { success: false, damage: 0, iceDefeated: false };
    }

    // Netrunner attacks Black ICE
    const attackRoll = Math.floor(Math.random() * 10) + 1 + attackValue;
    const defenseRoll = Math.floor(Math.random() * 10) + 1 + ice.def;
    
    const success = attackRoll > defenseRoll;
    let damage = 0;
    
    if (success) {
      // Parse damage dice (e.g., "1d6")
      const [diceCount, diceSize] = ice.damage.split('d').map(Number);
      for (let i = 0; i < diceCount; i++) {
        damage += Math.floor(Math.random() * diceSize) + 1;
      }
    }

    // Check if ICE is defeated (simplified - would need HP tracking)
    const iceDefeated = success && Math.random() < 0.3; // 30% chance per hit
    if (iceDefeated) {
      this.defeatedIce.add(iceId);
    }

    // Black ICE counter-attacks
    let counterAttack = undefined;
    if (!iceDefeated) {
      const iceAttackRoll = Math.floor(Math.random() * 10) + 1 + ice.atk;
      counterAttack = iceAttackRoll;
    }

    return { success, damage, iceDefeated, counterAttack };
  }

  extractData(dataId: string): {
    success: boolean;
    value?: number;
    secured: boolean;
  } {
    const data = this.data.find(d => d.id === dataId);
    if (!data) {
      return { success: false, secured: false };
    }

    // Check if data is in a breached layer
    // Simplified - would need to track which layer contains which data
    const canAccess = this.breachedLayers.size > 0;
    
    if (!canAccess) {
      return { success: false, secured: data.secured };
    }

    if (data.secured && !this.extractedData.has(dataId)) {
      // Need additional check for secured data
      const securityCheck = Math.floor(Math.random() * 10) + 1;
      if (securityCheck < 6) {
        return { success: false, secured: true };
      }
    }

    this.extractedData.add(dataId);
    return { success: true, value: data.value, secured: data.secured };
  }

  private triggerSystemAlert(): void {
    // Add additional Black ICE or increase difficulty
    this.addBlackIce({
      name: 'Alert Response ICE',
      per: 8,
      spd: 8,
      atk: 10,
      def: 8,
      damage: '2d6',
      effects: ['Trace', 'Lock-out']
    });
  }

  // Status queries
  isLayerBreached(layerId: string): boolean {
    return this.breachedLayers.has(layerId);
  }

  isIceDefeated(iceId: string): boolean {
    return this.defeatedIce.has(iceId);
  }

  isDataExtracted(dataId: string): boolean {
    return this.extractedData.has(dataId);
  }

  getTotalDataValue(): number {
    return this.data.reduce((sum, d) => sum + d.value, 0);
  }

  getExtractedDataValue(): number {
    return this.data
      .filter(d => this.extractedData.has(d.id))
      .reduce((sum, d) => sum + d.value, 0);
  }

  getActiveBlackIce(): BlackIce[] {
    return this.blackIce.filter(ice => !this.defeatedIce.has(ice.id));
  }

  reset(): void {
    this.breachedLayers.clear();
    this.defeatedIce.clear();
    this.extractedData.clear();
  }

  toJSON(): NetArchitecture {
    return {
      id: this.id,
      name: this.name,
      difficulty: this.difficulty,
      layers: this.layers,
      blackIce: this.blackIce,
      data: this.data,
      notes: this.notes
    };
  }
}