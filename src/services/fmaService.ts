import { Track } from '../types';

export interface FMAGenre {
  id: string;
  name: string;
  query: string;
  description: string;
  color: string;
}

export const FMA_GENRES: FMAGenre[] = [
  {
    id: 'electronic',
    name: 'Electronic',
    query: 'electronic',
    description: 'Synth, IDM, Techno & Electro-acoustic',
    color: 'from-emerald-600 to-teal-900',
  },
  {
    id: 'ambient',
    name: 'Ambient & Drone',
    query: 'ambient',
    description: 'Atmospheric textures & contemplative soundscapes',
    color: 'from-indigo-600 to-slate-900',
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop & Beats',
    query: 'hip-hop',
    description: 'Boom-bap, instrumental lo-fi & underground cyphers',
    color: 'from-amber-600 to-stone-900',
  },
  {
    id: 'jazz',
    name: 'Jazz & Improv',
    query: 'jazz',
    description: 'Bebop, modal, free-jazz & brass ensembles',
    color: 'from-orange-600 to-amber-950',
  },
  {
    id: 'rock',
    name: 'Indie & Post-Rock',
    query: 'rock',
    description: 'Garage, psychedelic, noise-rock & indie guitars',
    color: 'from-rose-600 to-red-950',
  },
  {
    id: 'classical',
    name: 'Classical & Contemporary',
    query: 'classical',
    description: 'Modern piano, strings & orchestral compositions',
    color: 'from-purple-600 to-indigo-950',
  },
  {
    id: 'folk',
    name: 'Folk & Acoustic',
    query: 'folk',
    description: 'Acoustic fingerpicking, bluegrass & roots',
    color: 'from-yellow-600 to-stone-900',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi & Chillout',
    query: 'chill',
    description: 'Relaxed grooves, tape saturation & cozy vibes',
    color: 'from-cyan-600 to-blue-950',
  },
  {
    id: 'blues',
    name: 'Blues & Soul',
    query: 'blues',
    description: 'Delta slides, electric harmonica & vintage warmth',
    color: 'from-blue-700 to-slate-950',
  },
  {
    id: 'soundtrack',
    name: 'Soundtrack & Cinematic',
    query: 'soundtrack',
    description: 'Film scores, video game cues & drama themes',
    color: 'from-violet-700 to-fuchsia-950',
  },
];

/**
 * Search Free Music Archive tracks
 */
export async function searchFMATracks(query: string, limit = 25): Promise<Track[]> {
  try {
    const res = await fetch(`/api/fma/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.warn('Failed to search Free Music Archive:', err);
    return [];
  }
}

/**
 * Fetch featured/trending Free Music Archive tracks across multiple genres
 */
export async function getFMAFeatured(): Promise<Track[]> {
  try {
    const res = await fetch('/api/fma/featured');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.warn('Failed to fetch FMA featured tracks:', err);
    return [];
  }
}

/**
 * Trigger browser file download of full-length Free Music Archive MP3
 */
export function downloadFMATrack(track: Track): void {
  const downloadUrl = track.downloadUrl || track.audioUrl;
  if (!downloadUrl) return;

  // Use the server download proxy which forces attachment headers
  const directLink = `/api/fma/download?url=${encodeURIComponent(downloadUrl)}&title=${encodeURIComponent(
    `${track.artistName} - ${track.title}`
  )}`;

  const a = document.createElement('a');
  a.href = directLink;
  a.download = `${track.artistName} - ${track.title}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
