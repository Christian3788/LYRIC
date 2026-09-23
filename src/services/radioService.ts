import { Track } from '../types';
import { TRACKS } from '../data/mockCatalog';

/**
 * Generates a themed, coherent Track Radio queue based on a seed track.
 * Matches genre, BPM proximity (+-25 BPM), artist affinities, and mood.
 */
export function generateTrackRadio(seedTrack: Track, allTracks: Track[] = TRACKS): Track[] {
  const seedGenre = (seedTrack.genre || '').toLowerCase();
  const seedBpm = seedTrack.bpm || 120;
  const seedArtist = seedTrack.artistName.toLowerCase();

  // Score candidate tracks
  const scored = allTracks
    .filter(t => t.id !== seedTrack.id)
    .map(track => {
      let score = 0;
      const tGenre = (track.genre || '').toLowerCase();
      const tBpm = track.bpm || 120;
      const tArtist = track.artistName.toLowerCase();

      // Same genre match
      if (tGenre === seedGenre) score += 50;
      else if (tGenre.includes(seedGenre) || seedGenre.includes(tGenre)) score += 30;

      // Same artist
      if (tArtist === seedArtist) score += 40;

      // BPM proximity
      const bpmDiff = Math.abs(tBpm - seedBpm);
      if (bpmDiff <= 10) score += 30;
      else if (bpmDiff <= 25) score += 20;
      else if (bpmDiff <= 40) score += 10;

      // Add a small jitter for variety across radio sessions
      score += Math.random() * 15;

      return { track, score };
    });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return seed track first, followed by top radio recommendations
  return [seedTrack, ...scored.map(s => s.track)];
}

/**
 * Generates an Artist Radio queue based on an artist
 */
export function generateArtistRadio(artistName: string, allTracks: Track[] = TRACKS): Track[] {
  const cleanArtist = artistName.toLowerCase();
  const artistTracks = allTracks.filter(t => t.artistName.toLowerCase().includes(cleanArtist));
  const otherTracks = allTracks.filter(t => !t.artistName.toLowerCase().includes(cleanArtist));

  if (artistTracks.length === 0) {
    return allTracks;
  }

  const primarySeed = artistTracks[0];
  const radioFromSeed = generateTrackRadio(primarySeed, otherTracks);

  // Mix in other songs by the same artist with radio recommendations
  const result: Track[] = [];
  const maxLen = Math.max(artistTracks.length, radioFromSeed.length);
  for (let i = 0; i < maxLen; i++) {
    if (artistTracks[i]) result.push(artistTracks[i]);
    if (radioFromSeed[i]) result.push(radioFromSeed[i]);
  }

  // Deduplicate by ID
  const seen = new Set<string>();
  return result.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}
