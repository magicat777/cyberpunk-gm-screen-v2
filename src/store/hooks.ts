import { useStore } from './useStore';

// Session hooks
export const useSession = () => {
  const currentSession = useStore((state) => state.currentSession);
  const sessions = useStore((state) => state.sessions);
  const createSession = useStore((state) => state.createSession);
  const loadSession = useStore((state) => state.loadSession);
  const updateSession = useStore((state) => state.updateSession);
  const deleteSession = useStore((state) => state.deleteSession);
  
  return {
    currentSession,
    sessions,
    createSession,
    loadSession,
    updateSession,
    deleteSession,
  };
};

// Dice hooks
export const useDice = () => {
  const diceHistory = useStore((state) => state.diceHistory);
  const isRolling = useStore((state) => state.isRolling);
  const rollDice = useStore((state) => state.rollDice);
  const clearHistory = useStore((state) => state.clearHistory);
  const removeRoll = useStore((state) => state.removeRoll);
  
  return {
    diceHistory,
    isRolling,
    rollDice,
    clearHistory,
    removeRoll,
  };
};

// Character hooks
export const useCharacters = () => {
  const characters = useStore((state) => state.characters);
  const selectedCharacter = useStore((state) => state.selectedCharacter);
  const addCharacter = useStore((state) => state.addCharacter);
  const updateCharacter = useStore((state) => state.updateCharacter);
  const deleteCharacter = useStore((state) => state.deleteCharacter);
  const selectCharacter = useStore((state) => state.selectCharacter);
  
  return {
    characters,
    selectedCharacter,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    selectCharacter,
  };
};

// Combat hooks
export const useCombat = () => {
  const combatEncounters = useStore((state) => state.combatEncounters);
  const activeCombat = useStore((state) => state.activeCombat);
  const createEncounter = useStore((state) => state.createEncounter);
  const addParticipant = useStore((state) => state.addParticipant);
  const updateParticipant = useStore((state) => state.updateParticipant);
  const removeParticipant = useStore((state) => state.removeParticipant);
  const startCombat = useStore((state) => state.startCombat);
  const endCombat = useStore((state) => state.endCombat);
  const nextTurn = useStore((state) => state.nextTurn);
  const previousTurn = useStore((state) => state.previousTurn);
  const sortByInitiative = useStore((state) => state.sortByInitiative);
  
  return {
    combatEncounters,
    activeCombat,
    createEncounter,
    addParticipant,
    updateParticipant,
    removeParticipant,
    startCombat,
    endCombat,
    nextTurn,
    previousTurn,
    sortByInitiative,
  };
};

// Preferences hooks
export const usePreferences = () => {
  const preferences = useStore((state) => state.preferences);
  const updateTheme = useStore((state) => state.updateTheme);
  const updateFontSize = useStore((state) => state.updateFontSize);
  const toggleAutoSave = useStore((state) => state.toggleAutoSave);
  const toggleSound = useStore((state) => state.toggleSound);
  const toggleReducedMotion = useStore((state) => state.toggleReducedMotion);
  const updateDefaultDiceColor = useStore((state) => state.updateDefaultDiceColor);
  const resetPreferences = useStore((state) => state.resetPreferences);
  
  return {
    preferences,
    updateTheme,
    updateFontSize,
    toggleAutoSave,
    toggleSound,
    toggleReducedMotion,
    updateDefaultDiceColor,
    resetPreferences,
  };
};

// Notification hooks
export const useNotifications = () => {
  const notifications = useStore((state) => state.notifications);
  const addNotification = useStore((state) => state.addNotification);
  const removeNotification = useStore((state) => state.removeNotification);
  const clearNotifications = useStore((state) => state.clearNotifications);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};