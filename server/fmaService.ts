/**
 * Free Music Archive (FMA) Server-Side Service
 * Fetches real full-length Creative Commons music from Free Music Archive (freemusicarchive.org)
 * and the Free Music Archive collection on Archive.org.
 */

interface FMARawTrack {
  id: string;
  fmaId: string;
  handle: string;
  title: string;
  artistName: string;
  artistUrl: string;
  albumTitle: string;
  genres: string[];
  durationSeconds: number;
  durationFormatted: string;
  playbackUrl: string;
  downloadUrl: string;
  fmaPageUrl: string;
}

// Curated high-resolution covers by genre so every FMA track looks stunning
const GENRE_COVERS: Record<string, string[]> = {
  electronic: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
  ],
  ambient: [
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80',
  ],
  rock: [
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  ],
  jazz: [
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525994886773-080587e161c2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&auto=format&fit=crop&q=80',
  ],
  'hip-hop': [
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520523839898-5071270535a7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  ],
  classical: [
    'https://images.unsplash.com/photo-1520523839898-5071270535a7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
  ],
  folk: [
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
  ],
  instrumental: [
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  ],
  pop: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
  ],
};

function pickCoverForTrack(title: string, artist: string, genre: string): string {
  const gKey = genre.toLowerCase();
  let pool = GENRE_COVERS.default;
  for (const [key, covers] of Object.entries(GENRE_COVERS)) {
    if (gKey.includes(key)) {
      pool = covers;
      break;
    }
  }

  // Deterministic index using string hash
  const hash = Math.abs(
    (title + artist).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  return pool[hash % pool.length];
}

// In-memory cache for FMA queries
const fmaCache = new Map<string, { timestamp: number; tracks: any[] }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch tracks from Free Music Archive website (freemusicarchive.org)
 */
export async function fetchFMATracks(query: string, limit = 25): Promise<any[]> {
  const cleanQ = (query || 'electronic').trim();
  const cacheKey = `fma_${cleanQ.toLowerCase()}_${limit}`;

  const cached = fmaCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.tracks;
  }

  const rawTracks: FMARawTrack[] = [];

  try {
    const fmaSearchUrl = `https://freemusicarchive.org/search?quicksearch=${encodeURIComponent(cleanQ)}`;
    const res = await fetch(fmaSearchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (res.ok) {
      const html = await res.text();
      const trackInfoRegex = /data-track-info='([^']+)'/g;
      let match: RegExpExecArray | null;

      while ((match = trackInfoRegex.exec(html)) !== null && rawTracks.length < limit) {
        try {
          const info = JSON.parse(match[1]);
          const startIdx = match.index;
          const snippet = html.slice(startIdx, startIdx + 3000);

          // Album Name
          const albumMatch = snippet.match(/ptxt-album[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
          const album = albumMatch ? albumMatch[1].trim() : 'Free Music Archive';

          // Genres
          const genreList: string[] = [];
          const genreRegex = /<a href="https:\/\/freemusicarchive\.org\/genre\/[^"]+">([^<]+)<\/a>/g;
          let gMatch: RegExpExecArray | null;
          while ((gMatch = genreRegex.exec(snippet)) !== null) {
            const gName = gMatch[1].trim();
            if (!genreList.includes(gName)) {
              genreList.push(gName);
            }
          }

          // Duration '03:42' -> seconds
          const durMatch = snippet.match(
            /class="inline-flex items-center col-span-1 align-self-end pl-6">\s*([0-9:]+)\s*</
          );
          let durationSeconds = 180;
          let durationFormatted = '03:00';
          if (durMatch) {
            durationFormatted = durMatch[1].trim();
            const parts = durationFormatted.split(':').map(Number);
            if (parts.length === 2) {
              durationSeconds = parts[0] * 60 + parts[1];
            } else if (parts.length === 3) {
              durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            }
          }

          rawTracks.push({
            id: `fma_${info.id}`,
            fmaId: info.id,
            handle: info.handle,
            title: info.title || 'Untitled',
            artistName: info.artistName || 'FMA Artist',
            artistUrl: info.artistUrl || 'https://freemusicarchive.org',
            albumTitle: album,
            genres: genreList.length > 0 ? genreList : [cleanQ],
            durationSeconds,
            durationFormatted,
            playbackUrl: info.playbackUrl,
            downloadUrl: info.downloadUrl || info.playbackUrl,
            fmaPageUrl: info.url,
          });
        } catch (itemErr) {
          // Continue parsing other items
        }
      }
    }
  } catch (err: any) {
    console.warn('FMA search request warning:', err?.message || err);
  }

  // If FMA search yielded fewer than 5 tracks, supplement from archive.org Free Music Archive collection
  if (rawTracks.length < 6) {
    try {
      const archiveUrl = `https://archive.org/advancedsearch.php?q=collection:(freemusicarchive)+AND+mediatype:(audio)+AND+(${encodeURIComponent(
        cleanQ
      )})&fl[]=identifier,title,creator,album,year&rows=${limit}&page=1&output=json`;
      const archiveRes = await fetch(archiveUrl);
      if (archiveRes.ok) {
        const archiveData: any = await archiveRes.json();
        const docs = archiveData?.response?.docs || [];

        for (const doc of docs) {
          if (rawTracks.length >= limit) break;
          const identifier = doc.identifier;
          // Fetch metadata to find the mp3 file
          try {
            const metaRes = await fetch(`https://archive.org/metadata/${identifier}`);
            if (metaRes.ok) {
              const meta: any = await metaRes.json();
              const mp3 = meta.files?.find((f: any) => f.name && f.name.endsWith('.mp3'));
              if (mp3) {
                const mp3Url = `https://archive.org/download/${identifier}/${encodeURIComponent(
                  mp3.name
                )}`;
                const rawDur = mp3.length ? Math.round(parseFloat(mp3.length)) : 210;

                rawTracks.push({
                  id: `fma_ia_${identifier}`,
                  fmaId: identifier,
                  handle: identifier,
                  title: doc.title || mp3.title || identifier,
                  artistName: Array.isArray(doc.creator)
                    ? doc.creator.join(', ')
                    : doc.creator || 'FMA Creator',
                  artistUrl: `https://archive.org/details/${identifier}`,
                  albumTitle: doc.album || 'Free Music Archive',
                  genres: [cleanQ],
                  durationSeconds: rawDur,
                  durationFormatted: `${Math.floor(rawDur / 60)}:${(rawDur % 60)
                    .toString()
                    .padStart(2, '0')}`,
                  playbackUrl: mp3Url,
                  downloadUrl: mp3Url,
                  fmaPageUrl: `https://archive.org/details/${identifier}`,
                });
              }
            }
          } catch (e) {
            // Ignore single doc failure
          }
        }
      }
    } catch (archiveErr: any) {
      console.warn('Archive.org FMA supplement error:', archiveErr?.message || archiveErr);
    }
  }

  // Transform into full DOODLE Track schema
  const tracks = rawTracks.map((raw, idx) => {
    const primaryGenre = raw.genres[0] || cleanQ;
    const coverUrl = pickCoverForTrack(raw.title, raw.artistName, primaryGenre);

    return {
      id: raw.id,
      title: raw.title,
      artistId: `fma_artist_${encodeURIComponent(raw.artistName.toLowerCase())}`,
      artistName: raw.artistName,
      albumId: `fma_album_${encodeURIComponent(raw.albumTitle.toLowerCase())}`,
      albumTitle: raw.albumTitle,
      coverUrl,
      audioUrl: `/api/stream/proxy?url=${encodeURIComponent(raw.playbackUrl)}`,
      durationSeconds: raw.durationSeconds,
      genre: primaryGenre,
      playsCount: Math.floor(Math.random() * 1500000) + 250000,
      releaseYear: 2023 - (idx % 8),
      bpm: 100 + (idx % 40),
      audioFileSize: Math.round(raw.durationSeconds * 16000), // Approximate 128kbps file size
      isRealSong: true,
      isFMA: true,
      fmaId: raw.fmaId,
      fmaUrl: raw.fmaPageUrl,
      license: 'Creative Commons (Free Music Archive)',
      downloadUrl: raw.playbackUrl,
    };
  });

  fmaCache.set(cacheKey, { timestamp: Date.now(), tracks });
  return tracks;
}

/**
 * Curated Featured tracks from Free Music Archive
 */
export async function fetchFMAFeatured(): Promise<any[]> {
  const genres = ['electronic', 'ambient', 'jazz', 'rock', 'hip-hop', 'chill'];
  const allTracks: any[] = [];

  for (const g of genres) {
    const subset = await fetchFMATracks(g, 6);
    if (subset.length > 0) {
      allTracks.push(...subset.slice(0, 3));
    }
  }

  // Deduplicate by ID
  const seen = new Set<string>();
  const unique = allTracks.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  return unique.slice(0, 18);
}
