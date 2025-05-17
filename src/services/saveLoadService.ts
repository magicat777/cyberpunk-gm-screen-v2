import { useStore } from '../store/useStore';

export interface SaveFile {
  version: string;
  timestamp: Date;
  metadata: SaveMetadata;
  data: SaveData;
}

export interface SaveMetadata {
  name: string;
  description?: string;
  gameVersion?: string;
  createdAt: Date;
  lastModified: Date;
  tags?: string[];
}

export interface SaveData {
  session?: any;
  dice?: any;
  combat?: any;
  characters?: any;
  preferences?: any;
}

export interface SaveSlot {
  id: string;
  metadata: SaveMetadata;
  isAutoSave: boolean;
  slotNumber?: number;
}

class SaveLoadService {
  private readonly SAVE_PREFIX = 'cyberpunk_gm_save_';
  private readonly AUTOSAVE_KEY = 'cyberpunk_gm_autosave';
  private readonly SAVE_SLOTS_KEY = 'cyberpunk_gm_save_slots';
  private readonly MAX_SAVE_SLOTS = 10;
  private readonly CURRENT_VERSION = '1.0.0';

  // Get all save slots
  getSaveSlots(): SaveSlot[] {
    try {
      const slotsData = localStorage.getItem(this.SAVE_SLOTS_KEY);
      return slotsData ? JSON.parse(slotsData) : [];
    } catch (error) {
      console.error('Error getting save slots:', error);
      return [];
    }
  }

  // Save to a specific slot
  saveToSlot(slotNumber: number, name: string, description?: string): SaveSlot | null {
    try {
      const store = useStore.getState();
      
      const saveData: SaveData = {
        session: store.sessions,
        dice: store.diceHistory,
        combat: {
          encounters: store.combatEncounters,
          activeCombat: store.activeCombat
        },
        characters: store.characters,
        preferences: store.preferences
      };

      const metadata: SaveMetadata = {
        name,
        description,
        gameVersion: this.CURRENT_VERSION,
        createdAt: new Date(),
        lastModified: new Date()
      };

      const saveFile: SaveFile = {
        version: this.CURRENT_VERSION,
        timestamp: new Date(),
        metadata,
        data: saveData
      };

      // Save to localStorage
      const key = `${this.SAVE_PREFIX}${slotNumber}`;
      localStorage.setItem(key, JSON.stringify(saveFile));

      // Update save slots
      const slots = this.getSaveSlots();
      const existingSlotIndex = slots.findIndex(s => s.slotNumber === slotNumber);
      
      const saveSlot: SaveSlot = {
        id: crypto.randomUUID(),
        metadata,
        isAutoSave: false,
        slotNumber
      };

      if (existingSlotIndex >= 0) {
        slots[existingSlotIndex] = saveSlot;
      } else {
        slots.push(saveSlot);
      }

      localStorage.setItem(this.SAVE_SLOTS_KEY, JSON.stringify(slots));
      
      return saveSlot;
    } catch (error) {
      console.error('Error saving to slot:', error);
      return null;
    }
  }

  // Load from a specific slot
  loadFromSlot(slotNumber: number): SaveFile | null {
    try {
      const key = `${this.SAVE_PREFIX}${slotNumber}`;
      const saveData = localStorage.getItem(key);
      
      if (!saveData) return null;
      
      const saveFile: SaveFile = JSON.parse(saveData);
      
      // Validate version
      if (!this.isVersionCompatible(saveFile.version)) {
        console.warn(`Save file version ${saveFile.version} may not be compatible with current version ${this.CURRENT_VERSION}`);
      }

      // Load data into store
      const store = useStore.getState();
      
      if (saveFile.data.session) {
        store.setSessions(saveFile.data.session);
      }
      
      if (saveFile.data.dice) {
        store.setDiceHistory(saveFile.data.dice);
      }
      
      if (saveFile.data.combat) {
        store.setCombatEncounters(saveFile.data.combat.encounters || []);
        store.setActiveCombat(saveFile.data.combat.activeCombat);
      }
      
      if (saveFile.data.characters) {
        store.setCharacters(saveFile.data.characters);
      }
      
      if (saveFile.data.preferences) {
        store.setPreferences(saveFile.data.preferences);
      }

      return saveFile;
    } catch (error) {
      console.error('Error loading from slot:', error);
      return null;
    }
  }

  // Auto-save functionality
  autoSave(): SaveSlot | null {
    try {
      const store = useStore.getState();
      
      const saveData: SaveData = {
        session: store.sessions,
        dice: store.diceHistory,
        combat: {
          encounters: store.combatEncounters,
          activeCombat: store.activeCombat
        },
        characters: store.characters,
        preferences: store.preferences
      };

      const metadata: SaveMetadata = {
        name: 'Autosave',
        description: 'Automatic save',
        gameVersion: this.CURRENT_VERSION,
        createdAt: new Date(),
        lastModified: new Date()
      };

      const saveFile: SaveFile = {
        version: this.CURRENT_VERSION,
        timestamp: new Date(),
        metadata,
        data: saveData
      };

      // Save to localStorage
      localStorage.setItem(this.AUTOSAVE_KEY, JSON.stringify(saveFile));

      // Update save slots
      const slots = this.getSaveSlots();
      const autoSaveIndex = slots.findIndex(s => s.isAutoSave);
      
      const saveSlot: SaveSlot = {
        id: crypto.randomUUID(),
        metadata,
        isAutoSave: true
      };

      if (autoSaveIndex >= 0) {
        slots[autoSaveIndex] = saveSlot;
      } else {
        slots.push(saveSlot);
      }

      localStorage.setItem(this.SAVE_SLOTS_KEY, JSON.stringify(slots));
      
      return saveSlot;
    } catch (error) {
      console.error('Error during autosave:', error);
      return null;
    }
  }

  // Load autosave
  loadAutoSave(): SaveFile | null {
    try {
      const saveData = localStorage.getItem(this.AUTOSAVE_KEY);
      if (!saveData) return null;
      
      const saveFile: SaveFile = JSON.parse(saveData);
      
      // Load data into store
      const store = useStore.getState();
      
      if (saveFile.data.session) {
        store.setSessions(saveFile.data.session);
      }
      
      if (saveFile.data.dice) {
        store.setDiceHistory(saveFile.data.dice);
      }
      
      if (saveFile.data.combat) {
        store.setCombatEncounters(saveFile.data.combat.encounters || []);
        store.setActiveCombat(saveFile.data.combat.activeCombat);
      }
      
      if (saveFile.data.characters) {
        store.setCharacters(saveFile.data.characters);
      }
      
      if (saveFile.data.preferences) {
        store.setPreferences(saveFile.data.preferences);
      }

      return saveFile;
    } catch (error) {
      console.error('Error loading autosave:', error);
      return null;
    }
  }

  // Delete a save slot
  deleteSaveSlot(slotNumber: number): boolean {
    try {
      const key = `${this.SAVE_PREFIX}${slotNumber}`;
      localStorage.removeItem(key);
      
      // Update save slots
      const slots = this.getSaveSlots();
      const updatedSlots = slots.filter(s => s.slotNumber !== slotNumber);
      localStorage.setItem(this.SAVE_SLOTS_KEY, JSON.stringify(updatedSlots));
      
      return true;
    } catch (error) {
      console.error('Error deleting save slot:', error);
      return false;
    }
  }

  // Export save to file
  exportSave(slotNumber?: number): void {
    try {
      let saveFile: SaveFile | null = null;
      
      if (slotNumber !== undefined) {
        const key = `${this.SAVE_PREFIX}${slotNumber}`;
        const saveData = localStorage.getItem(key);
        if (saveData) {
          saveFile = JSON.parse(saveData);
        }
      } else {
        // Export current state
        const store = useStore.getState();
        
        const saveData: SaveData = {
          session: store.sessions,
          dice: store.diceHistory,
          combat: {
            encounters: store.combatEncounters,
            activeCombat: store.activeCombat
          },
          characters: store.characters,
          preferences: store.preferences
        };

        const metadata: SaveMetadata = {
          name: 'Exported Save',
          description: 'Exported game state',
          gameVersion: this.CURRENT_VERSION,
          createdAt: new Date(),
          lastModified: new Date()
        };

        saveFile = {
          version: this.CURRENT_VERSION,
          timestamp: new Date(),
          metadata,
          data: saveData
        };
      }

      if (!saveFile) {
        console.error('No save data to export');
        return;
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(saveFile, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cyberpunk-save-${saveFile.metadata.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting save:', error);
    }
  }

  // Import save from file
  async importSave(file: File): Promise<SaveSlot | null> {
    try {
      const text = await file.text();
      const saveFile: SaveFile = JSON.parse(text);
      
      // Validate save file
      if (!this.validateSaveFile(saveFile)) {
        throw new Error('Invalid save file format');
      }

      // Find an empty slot
      const slots = this.getSaveSlots();
      let availableSlot = 1;
      
      for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
        if (!slots.find(s => s.slotNumber === i)) {
          availableSlot = i;
          break;
        }
      }

      // Save to slot
      const key = `${this.SAVE_PREFIX}${availableSlot}`;
      localStorage.setItem(key, JSON.stringify(saveFile));

      // Update save slots
      const saveSlot: SaveSlot = {
        id: crypto.randomUUID(),
        metadata: saveFile.metadata,
        isAutoSave: false,
        slotNumber: availableSlot
      };

      slots.push(saveSlot);
      localStorage.setItem(this.SAVE_SLOTS_KEY, JSON.stringify(slots));
      
      return saveSlot;
    } catch (error) {
      console.error('Error importing save:', error);
      return null;
    }
  }

  // Utility methods
  private isVersionCompatible(version: string): boolean {
    const [major] = version.split('.');
    const [currentMajor] = this.CURRENT_VERSION.split('.');
    return major === currentMajor;
  }

  private validateSaveFile(saveFile: any): saveFile is SaveFile {
    return (
      saveFile &&
      typeof saveFile.version === 'string' &&
      saveFile.metadata &&
      saveFile.data &&
      typeof saveFile.metadata.name === 'string' &&
      saveFile.metadata.createdAt
    );
  }

  // Clear all saves
  clearAllSaves(): boolean {
    try {
      const slots = this.getSaveSlots();
      
      // Remove all save files
      slots.forEach(slot => {
        if (slot.slotNumber !== undefined) {
          const key = `${this.SAVE_PREFIX}${slot.slotNumber}`;
          localStorage.removeItem(key);
        }
      });
      
      // Clear autosave
      localStorage.removeItem(this.AUTOSAVE_KEY);
      
      // Clear slots list
      localStorage.removeItem(this.SAVE_SLOTS_KEY);
      
      return true;
    } catch (error) {
      console.error('Error clearing saves:', error);
      return false;
    }
  }

  // Get save size estimate
  getSaveSize(slotNumber?: number): number {
    try {
      let saveData = '';
      
      if (slotNumber !== undefined) {
        const key = `${this.SAVE_PREFIX}${slotNumber}`;
        saveData = localStorage.getItem(key) || '';
      } else {
        // Calculate current state size
        const store = useStore.getState();
        const data = {
          session: store.sessions,
          dice: store.diceHistory,
          combat: {
            encounters: store.combatEncounters,
            activeCombat: store.activeCombat
          },
          characters: store.characters,
          preferences: store.preferences
        };
        saveData = JSON.stringify(data);
      }
      
      // Return size in bytes
      return new Blob([saveData]).size;
    } catch (error) {
      console.error('Error calculating save size:', error);
      return 0;
    }
  }
}

export const saveLoadService = new SaveLoadService();