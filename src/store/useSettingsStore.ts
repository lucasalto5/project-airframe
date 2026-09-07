// ============================================================================
// PROJECT AIRFRAME - USER SETTINGS & UI PREFERENCES STORE
// ============================================================================

import { create } from 'zustand';

export interface UserSettings {
  theme: 'dark' | 'light' | 'gray' | 'dynamic';
  mapTheme: 'dark' | 'light' | 'gray' | 'dynamic';
  unitSystem: 'metric' | 'imperial';
  trafficDensity: 'all' | 'player_only' | 'low_performance';
  autosaveIntervalMinutes: number;
  devModeUnlocked: boolean;
  soundEnabled: boolean;
  setTheme: (theme: 'dark' | 'light' | 'gray' | 'dynamic') => void;
  setMapTheme: (mapTheme: 'dark' | 'light' | 'gray' | 'dynamic') => void;
  setUnitSystem: (units: 'metric' | 'imperial') => void;
  setTrafficDensity: (density: 'all' | 'player_only' | 'low_performance') => void;
  setDevModeUnlocked: (unlocked: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<UserSettings>((set) => ({
  theme: 'dark',
  mapTheme: 'dark',
  unitSystem: 'metric',
  trafficDensity: 'all',
  autosaveIntervalMinutes: 5,
  devModeUnlocked: false,
  soundEnabled: true,
  setTheme: (theme) => set({ theme }),
  setMapTheme: (mapTheme) => set({ mapTheme }),
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  setTrafficDensity: (trafficDensity) => set({ trafficDensity }),
  setDevModeUnlocked: (devModeUnlocked) => set({ devModeUnlocked }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled })
}));
