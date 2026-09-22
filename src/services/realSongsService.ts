import { Track } from '../types';

export interface RealSongSearchResponse {
  status: string;
  query: string;
  count: number;
  tracks: Track[];
}

/**
 * Service to fetch real songs from the backend API (powered by global music catalog previews)
 */
export async function fetchRealSongs(query: string, limit: number = 30): Promise<Track[]> {
  try {
    const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Real songs search failed: ${res.status}`);
    }
    const data: RealSongSearchResponse = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.warn('Could not fetch real songs from server:', err);
    return [];
  }
}

/**
 * Service to fetch top trending real world chart-topping songs
 */
export async function fetchTopCharts(): Promise<Track[]> {
  try {
    const res = await fetch('/api/songs/charts');
    if (!res.ok) {
      throw new Error(`Real songs charts failed: ${res.status}`);
    }
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.warn('Could not fetch top charts:', err);
    return [];
  }
}
