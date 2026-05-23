import { create } from 'zustand';

/**
 * Pet Store using Zustand
 * Manages global pet state including XP, level, pet mood, and stats
 */
export const usePetStore = create((set) => ({
  // Pet data
  pet: {
    id: '1',
    name: 'Whiskers',
    mood: 'happy',
    hunger: 50,
    energy: 80,
  },

  // Experience & Level
  xp: 0,
  level: 1,
  totalXp: 0,

  // Stats
  stats: {
    missionsCompleted: 0,
    codeRuns: 0,
    achievements: 0,
  },

  // Actions
  setPet: (pet) => set({ pet }),
  
  addXp: (amount) => set((state) => ({
    xp: state.xp + amount,
    totalXp: state.totalXp + amount,
    // Level up every 100 XP
    level: Math.floor((state.totalXp + amount) / 100) + 1,
  })),

  setMood: (mood) => set((state) => ({
    pet: { ...state.pet, mood },
  })),

  setHunger: (hunger) => set((state) => ({
    pet: { ...state.pet, hunger: Math.min(100, Math.max(0, hunger)) },
  })),

  setEnergy: (energy) => set((state) => ({
    pet: { ...state.pet, energy: Math.min(100, Math.max(0, energy)) },
  })),

  updateStats: (newStats) => set((state) => ({
    stats: { ...state.stats, ...newStats },
  })),

  incrementMissionsCompleted: () => set((state) => ({
    stats: { ...state.stats, missionsCompleted: state.stats.missionsCompleted + 1 },
  })),

  incrementCodeRuns: () => set((state) => ({
    stats: { ...state.stats, codeRuns: state.stats.codeRuns + 1 },
  })),

  incrementAchievements: () => set((state) => ({
    stats: { ...state.stats, achievements: state.stats.achievements + 1 },
  })),

  // Reset store (for testing)
  reset: () => set({
    pet: {
      id: '1',
      name: 'Whiskers',
      mood: 'happy',
      hunger: 50,
      energy: 80,
    },
    xp: 0,
    level: 1,
    totalXp: 0,
    stats: {
      missionsCompleted: 0,
      codeRuns: 0,
      achievements: 0,
    },
  }),
}));
