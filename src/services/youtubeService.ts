import { Track } from '../types';

export interface YouTubeResponse {
  status: string;
  query?: string;
  count: number;
  tracks: Track[];
}

/**
 * Client service to search YouTube for official music tracks / videos
 */
export async function searchYouTubeMusic(query: string, limit: number = 20): Promise<Track[]> {
  try {
    const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`YouTube search failed with status: ${res.status}`);
    }
    const data: YouTubeResponse = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.warn('Could not search YouTube music:', err);
    return [];
  }
}

/**
 * Fetch trending YouTube official music videos
 */
export async function fetchTrendingYouTubeMusic(limit: number = 20): Promise<Track[]> {
  try {
    const res = await fetch(`/api/youtube/trending?limit=${limit}`);
    if (!res.ok) {
      throw new Error(`YouTube trending failed with status: ${res.status}`);
    }
    const data: YouTubeResponse = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.warn('Could not fetch YouTube trending music:', err);
    return [];
  }
}
