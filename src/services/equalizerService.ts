export interface EqualizerSettings {
  enabled: boolean;
  preset: string;
  bands: number[]; // 10 bands gains in dB (-12 to +12)
  bassBoost: number; // 0 to 100
  spatial3D: number; // 0 to 100
}

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS: Record<string, number[]> = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Bass Boost': [9, 8, 6, 3, 0, 0, 0, 0, 0, 0],
  'Hip-Hop': [8, 6, 3, 1, -1, -1, 1, 3, 4, 3],
  Electronic: [7, 6, 2, 0, -2, 2, 1, 4, 6, 7],
  Rock: [6, 4, -1, -3, -1, 2, 4, 6, 6, 6],
  Acoustic: [4, 3, 2, 1, 2, 3, 3, 4, 3, 2],
  'Vocal Clarity': [-3, -2, 0, 2, 5, 6, 5, 2, 0, -1],
  Club: [5, 4, 2, 0, 0, 0, 2, 3, 4, 5],
  Jazz: [3, 2, 1, 2, -1, -1, 0, 1, 3, 4],
};

const STORAGE_KEY = 'doodle_equalizer_settings';

export function loadEqualizerSettings(): EqualizerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {
    enabled: true,
    preset: 'Flat',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bassBoost: 20,
    spatial3D: 15,
  };
}

export function saveEqualizerSettings(settings: EqualizerSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
