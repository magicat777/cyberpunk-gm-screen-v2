import { StateStorage } from 'zustand/middleware';

// Custom storage for better error handling
export const customStorageAdapter: StateStorage = {
  getItem: (name: string) => {
    try {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${name}":`, error);
      return null;
    }
  },
  
  setItem: (name: string, value: unknown) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${name}":`, error);
    }
  },
  
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${name}":`, error);
    }
  },
};

// Store version for migration
export const STORE_VERSION = 1;

// Migration function for future store updates
export const migrateStore = (persistedState: any, version: number) => {
  if (version < STORE_VERSION) {
    // Handle migrations here as needed
    console.log(`Migrating store from version ${version} to ${STORE_VERSION}`);
  }
  
  return persistedState;
};