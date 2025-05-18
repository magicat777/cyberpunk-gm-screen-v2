import { StateCreator } from 'zustand';
import { UserPreferences } from '../types';

export interface PreferencesSlice {
  // State
  preferences: UserPreferences;
  
  // Actions
  updateTheme: (theme: UserPreferences['theme']) => void;
  updateFontSize: (fontSize: UserPreferences['fontSize']) => void;
  toggleAutoSave: () => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  updateDefaultDiceColor: (color: string) => void;
  resetPreferences: () => void;
  setPreferences: (preferences: UserPreferences) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'cyberpunk',
  fontSize: 'medium',
  autoSave: true,
  soundEnabled: true,
  reducedMotion: false,
  defaultDiceColor: '#00ff41',
};

export const createPreferencesSlice: StateCreator<PreferencesSlice> = (set, get) => ({
  // Initial state
  preferences: defaultPreferences,
  
  // Actions
  updateTheme: (theme: UserPreferences['theme']) => {
    set((state) => ({
      preferences: { ...state.preferences, theme },
    }));
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  },
  
  updateFontSize: (fontSize: UserPreferences['fontSize']) => {
    set((state) => ({
      preferences: { ...state.preferences, fontSize },
    }));
    
    // Apply font size to document
    document.documentElement.setAttribute('data-font-size', fontSize);
  },
  
  toggleAutoSave: () => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        autoSave: !state.preferences.autoSave,
      },
    }));
  },
  
  toggleSound: () => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        soundEnabled: !state.preferences.soundEnabled,
      },
    }));
  },
  
  toggleReducedMotion: () => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        reducedMotion: !state.preferences.reducedMotion,
      },
    }));
    
    // Get the current state from the store
    const currentState = get();
    
    // Apply reduced motion preference
    document.documentElement.setAttribute(
      'data-reduced-motion',
      (!currentState.preferences.reducedMotion).toString()
    );
  },
  
  updateDefaultDiceColor: (color: string) => {
    set((state) => ({
      preferences: { ...state.preferences, defaultDiceColor: color },
    }));
  },
  
  resetPreferences: () => {
    set({ preferences: defaultPreferences });
    
    // Reset document attributes
    document.documentElement.setAttribute('data-theme', defaultPreferences.theme);
    document.documentElement.setAttribute('data-font-size', defaultPreferences.fontSize);
    document.documentElement.setAttribute('data-reduced-motion', defaultPreferences.reducedMotion.toString());
  },
  
  setPreferences: (preferences: UserPreferences) => {
    set({ preferences });
    
    // Apply all preferences to document
    document.documentElement.setAttribute('data-theme', preferences.theme);
    document.documentElement.setAttribute('data-font-size', preferences.fontSize);
    document.documentElement.setAttribute('data-reduced-motion', preferences.reducedMotion.toString());
  },
});