import { Track } from '../types';

export const AUDIUS_POPULAR_GENRES = [
  'All',
  'Electronic',
  'Hip-Hop/Rap',
  'Pop',
  'Lo-Fi',
  'Ambient',
  'Rock',
  'R&B/Soul',
  'Deep House',
  'Trap',
] as const;

export type AudiusGenre = typeof AUDIUS_POPULAR_GENRES[number];

/**
 * Fetches trending tracks from Audius API
 */
export async function fetchTrendingAudius(limit: number = 20, genre?: string): Promise<Track[]> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
    });
    if (genre && genre !== 'All') {
      params.set('genre', genre);
    }

    const res = await fetch(`/api/audius/trending?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Audius trending request failed with status: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data.tracks) ? data.tracks : [];
  } catch (err) {
    console.warn('Failed to fetch Audius trending tracks:', err);
    return [];
  }
}

/**
 * Searches Audius for tracks by song title, artist, or tag
 */
export async function searchAudius(query: string, limit: number = 20): Promise<Track[]> {
  if (!query.trim()) return [];

  try {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: String(limit),
    });

    const res = await fetch(`/api/audius/search?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Audius search request failed with status: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data.tracks) ? data.tracks : [];
  } catch (err) {
    console.warn('Failed to search Audius tracks:', err);
    return [];
  }
}
