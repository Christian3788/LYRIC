/**
 * Audius API Service (Decentralized Community Music Streaming)
 * Free public REST API for full-length streaming tracks, search, trending, and artist metadata.
 * Documentation: https://docs.audius.org
 */

const APP_NAME = 'DOODLE_MUSIC';
const FALLBACK_DISCOVERY_NODES = [
  'https://api.audius.co',
  'https://discoveryprovider.audius.co',
  'https://audius-discovery-1.cultur3stake.com',
  'https://audius-dp.amsterdam.creatorseed.com',
];

let cachedHost = 'https://api.audius.co';
let lastHostCheck = 0;

/**
 * Resolves a healthy Audius discovery provider host
 */
export async function getHealthyAudiusHost(): Promise<string> {
  const now = Date.now();
  // Refresh host every 30 minutes
  if (now - lastHostCheck < 1800000 && cachedHost) {
    return cachedHost;
  }

  try {
    const res = await fetch('https://api.audius.co', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        cachedHost = data.data[0];
        lastHostCheck = now;
        return cachedHost;
      }
    }
  } catch (err) {
    console.warn('Failed to resolve dynamic Audius host, using fallback:', err);
  }

  // Pick working fallback
  for (const node of FALLBACK_DISCOVERY_NODES) {
    try {
      const res = await fetch(`${node}/v1/tracks/trending?app_name=${APP_NAME}&limit=1`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        cachedHost = node;
        lastHostCheck = now;
        return node;
      }
    } catch {
      // Continue to next node
    }
  }

  cachedHost = 'https://api.audius.co';
  return cachedHost;
}

/**
 * Maps an Audius track JSON into the DOODLE Track schema
 */
export function mapAudiusTrackToSchema(item: any, host: string): any {
  const trackId = item.id || String(item.track_id);
  const artwork =
    item.artwork?.['480x480'] ||
    item.artwork?.['1000x1000'] ||
    item.artwork?.['150x150'] ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

  return {
    id: `audius_${trackId}`,
    title: item.title || 'Untitled Track',
    artistId: `artist_audius_${item.user?.handle || item.user?.id || 'creator'}`,
    artistName: item.user?.name || item.user?.handle || 'Audius Artist',
    albumId: `album_audius_${trackId}`,
    albumTitle: item.genre ? `${item.genre} Edition` : 'Audius Decentralized Audio',
    coverUrl: artwork,
    // Audius stream endpoint (returns 302 directly to the 320kbps MP3 on validator node)
    audioUrl: `${host}/v1/tracks/${trackId}/stream?app_name=${APP_NAME}`,
    durationSeconds: Math.max(30, Math.round(Number(item.duration) || 180)),
    genre: item.genre || 'Electronic',
    playsCount: item.play_count || item.favorite_count || 1250,
    releaseYear: item.release_date ? new Date(item.release_date).getFullYear() : 2024,
    bpm: item.bpm ? Number(item.bpm) : undefined,
    sourceType: 'audius',
    isAudius: true,
    audiusId: trackId,
    audiusHandle: item.user?.handle,
    mood: item.mood || undefined,
  };
}

/**
 * Fetches trending tracks from Audius with optional genre filter
 */
export async function getTrendingAudiusTracks(limit = 20, genre?: string): Promise<any[]> {
  const host = await getHealthyAudiusHost();
  const params = new URLSearchParams({
    app_name: APP_NAME,
    limit: String(Math.min(50, Math.max(1, limit))),
  });

  if (genre && genre.toLowerCase() !== 'all') {
    params.set('genre', genre);
  }

  const url = `${host}/v1/tracks/trending?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`Audius API returned status ${res.status}`);
  }

  const json: any = await res.json();
  const rawList = Array.isArray(json.data) ? json.data : [];

  return rawList
    .filter((item: any) => item && (item.id || item.track_id) && item.title)
    .map((item: any) => mapAudiusTrackToSchema(item, host));
}

/**
 * Searches Audius for tracks matching user query
 */
export async function searchAudiusTracks(query: string, limit = 20): Promise<any[]> {
  const host = await getHealthyAudiusHost();
  const params = new URLSearchParams({
    app_name: APP_NAME,
    query: query.trim(),
    limit: String(Math.min(50, Math.max(1, limit))),
  });

  const url = `${host}/v1/tracks/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`Audius search returned status ${res.status}`);
  }

  const json: any = await res.json();
  const rawList = Array.isArray(json.data) ? json.data : [];

  return rawList
    .filter((item: any) => item && (item.id || item.track_id) && item.title)
    .map((item: any) => mapAudiusTrackToSchema(item, host));
}
