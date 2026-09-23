import { useState, useEffect, useCallback, useMemo } from 'react';
import { Track } from '../types';

export interface LyricLine {
  time: number;
  text: string;
}

export interface LyricsResult {
  lyrics: LyricLine[];
  isSynced: boolean;
  source: 'embedded' | 'lrclib' | 'cached' | 'fallback';
  isLoading: boolean;
  error: string | null;
}

// In-memory cache for fetched lyrics to eliminate network requests on repeats
const lyricsCache = new Map<string, { lyrics: LyricLine[]; isSynced: boolean; source: 'lrclib' | 'cached' }>();

// Famous full-song synced lyrics database for key top tracks (full duration for YouTube / full tracks)
export const FAMOUS_FULL_SONG_LYRICS: Record<string, LyricLine[]> = {
  'blinding lights': [
    { time: 0, text: "♪ (Synthwave synthesizer intro) ♪" },
    { time: 13, text: "Yeah..." },
    { time: 27, text: "I've been tryna call" },
    { time: 30, text: "I've been on my own for long enough" },
    { time: 33, text: "Maybe you can show me how to love, maybe" },
    { time: 38, text: "I'm going through withdrawals" },
    { time: 41, text: "You don't even have to do too much" },
    { time: 44, text: "You can turn me on with just a touch, baby" },
    { time: 49, text: "I look around and Sin City's cold and empty" },
    { time: 53, text: "No one's around to judge me" },
    { time: 56, text: "I can't see clearly when you're gone" },
    { time: 61, text: "I said, ooh, I'm blinded by the lights!" },
    { time: 67, text: "No, I can't sleep until I feel your touch" },
    { time: 73, text: "I said, ooh, I'm drowning in the night" },
    { time: 79, text: "Oh, when I'm like this, you're the one I trust" },
    { time: 87, text: "♪ (Euphoric synth break) ♪" },
    { time: 96, text: "I'm running out of time" },
    { time: 99, text: "'Cause I can see the sun light up the sky" },
    { time: 104, text: "So I hit the road in overdrive, baby, oh" },
    { time: 109, text: "The city's cold and empty" },
    { time: 113, text: "No one's around to judge me" },
    { time: 118, text: "I can't see clearly when you're gone" },
    { time: 124, text: "I said, ooh, I'm blinded by the lights!" },
    { time: 130, text: "No, I can't sleep until I feel your touch" },
    { time: 136, text: "I said, ooh, I'm drowning in the night" },
    { time: 142, text: "Oh, when I'm like this, you're the one I trust" },
    { time: 151, text: "I'm just walking by to let you know" },
    { time: 156, text: "I could never say it on the phone" },
    { time: 161, text: "Will never let you go this time" },
    { time: 167, text: "I said, ooh, I'm blinded by the lights!" },
    { time: 173, text: "No, I can't sleep until I feel your touch" },
    { time: 182, text: "♪ (Blinding synth outro) ♪" },
  ],
  'cruel summer': [
    { time: 0, text: "♪ (Fever dream synth intro) ♪" },
    { time: 5, text: "Fever dream high in the quiet of the night" },
    { time: 9, text: "You know that I caught it" },
    { time: 13, text: "Bad, bad boy, shiny toy with a price" },
    { time: 17, text: "You know that I bought it" },
    { time: 22, text: "Killing me slow, out the window" },
    { time: 26, text: "I'm always waiting for you to be waiting below" },
    { time: 31, text: "Devils roll the dice, angels roll their eyes" },
    { time: 35, text: "What doesn't kill me makes me want you more" },
    { time: 40, text: "And it's new, the shape of your body" },
    { time: 44, text: "It's blue, the feeling I've got" },
    { time: 49, text: "And it's ooh, whoa-oh" },
    { time: 53, text: "It's a cruel summer" },
    { time: 57, text: "It's cool, that's what I tell 'em" },
    { time: 61, text: "No rules in breakable heaven" },
    { time: 66, text: "But ooh, whoa-oh" },
    { time: 70, text: "It's a cruel summer with you" },
    { time: 76, text: "Hang your head low in the glow of the vending machine" },
    { time: 80, text: "I'm not dying" },
    { time: 84, text: "We say that we'll just screw it up in these trying times" },
    { time: 89, text: "We're not trying" },
    { time: 93, text: "I'm drunk in the back of the car" },
    { time: 97, text: "And I cried like a baby coming home from the bar" },
    { time: 102, text: "Said, 'I'm fine,' but it wasn't true" },
    { time: 106, text: "I don't wanna keep secrets just to keep you" },
    { time: 111, text: "And I snuck in through the garden gate" },
    { time: 115, text: "Every night that summer just to seal my fate" },
    { time: 120, text: "And I screamed for whatever it's worth" },
    { time: 124, text: "'I love you,' ain't that the worst thing you ever heard?" },
    { time: 129, text: "He looks up grinning like a devil!" },
    { time: 134, text: "It's new, the shape of your body" },
    { time: 139, text: "It's blue, the feeling I've got" },
    { time: 144, text: "It's a cruel summer with you!" },
  ],
  'starboy': [
    { time: 0, text: "♪ (Daft Punk bassline kicks in) ♪" },
    { time: 6, text: "I'm tryna put you in the worst mood, ah" },
    { time: 10, text: "P1 cleaner than your church shoes, ah" },
    { time: 14, text: "Milli point two just to hurt you, ah" },
    { time: 18, text: "All red Lamb' just to tease you, ah" },
    { time: 22, text: "None of these toys on lease too, ah" },
    { time: 26, text: "Made your whole year in a week too, yah" },
    { time: 30, text: "Main bitch out your league too, ah" },
    { time: 34, text: "Side bitch out of your league too, ah" },
    { time: 38, text: "Look what you've done" },
    { time: 42, text: "I'm a motherfuckin' starboy" },
    { time: 46, text: "Look what you've done" },
    { time: 50, text: "I'm a motherfuckin' starboy" },
    { time: 54, text: "Every day a nigga try to test me, ah" },
    { time: 58, text: "Every day a nigga try to end me, ah" },
    { time: 62, text: "Pull up in that Roadster SV, ah" },
    { time: 66, text: "Pockets overweight, gettin' hefty, ah" },
    { time: 70, text: "Coming for the king, that's a far cry" },
    { time: 74, text: "I come alive in the fall time, I" },
    { time: 78, text: "No competition, don't hesitate" },
    { time: 82, text: "Let's drown the sorrow in the champagne" },
    { time: 88, text: "Look what you've done" },
    { time: 92, text: "I'm a motherfuckin' starboy!" },
  ],
  'birds of a feather': [
    { time: 0, text: "♪ (Lush indie dream-pop guitars) ♪" },
    { time: 8, text: "I want you to stay" },
    { time: 12, text: "'Til I'm in the grave" },
    { time: 16, text: "'Til I rot away, dead and buried" },
    { time: 21, text: "'Til I'm in the casket you carry" },
    { time: 26, text: "If you go, I'm goin' too, uh" },
    { time: 31, text: "'Cause it was always you, alright" },
    { time: 36, text: "And if I'm turnin' blue, please don't save me" },
    { time: 41, text: "Nothing left to lose without my baby" },
    { time: 47, text: "Birds of a feather, we should stick together, I know" },
    { time: 54, text: "I said I'd never think I wasn't better alone" },
    { time: 61, text: "Can't change the weather, might not be forever" },
    { time: 66, text: "But if it's forever, it's even better!" },
    { time: 73, text: "And I don't know what I'm cryin' for" },
    { time: 78, text: "I don't think I could love you more" },
    { time: 83, text: "It might not be long, but baby, I" },
    { time: 90, text: "I'll love you 'til the day that I die!" },
  ],
  'not like us': [
    { time: 0, text: "Psst, I see dead people..." },
    { time: 5, text: "Mustard on the beat, ho!" },
    { time: 8, text: "Ayy, Mustard on the beat, ho" },
    { time: 11, text: "De-de-demonstrate, they not like us" },
    { time: 15, text: "They not like us, they not like us" },
    { time: 19, text: "You think the Bay gon' let you disrespect Pac, nigga?" },
    { time: 23, text: "I think that Oakland show gon' be your last stop, nigga" },
    { time: 27, text: "Did Cole foul, I don't know why you still pretendin'" },
    { time: 31, text: "What is it, the braids? I hurt your feelings?" },
    { time: 35, text: "Sometimes you gotta pop out and show niggas" },
    { time: 39, text: "Certified Boogeyman, I'm the one that up the score with 'em" },
    { time: 43, text: "Walk him down, whole crew do him cold" },
    { time: 47, text: "Say, Drake, I hear you like 'em young" },
    { time: 51, text: "You better not ever go to cell block one" },
    { time: 55, text: "To any bitch that talk to him and they in love" },
    { time: 59, text: "Just make sure you hide your lil' sister from him" },
    { time: 63, text: "They not like us, they not like us, they not like us!" },
  ],
  'bohemian rhapsody': [
    { time: 0, text: "Is this the real life? Is this just fantasy?" },
    { time: 7, text: "Caught in a landslide, no escape from reality" },
    { time: 14, text: "Open your eyes, look up to the skies and see" },
    { time: 23, text: "I'm just a poor boy, I need no sympathy" },
    { time: 28, text: "Because I'm easy come, easy go, little high, little low" },
    { time: 36, text: "Any way the wind blows doesn't really matter to me, to me" },
    { time: 49, text: "♪ (Freddie Mercury piano ballad begins) ♪" },
    { time: 55, text: "Mama, just killed a man" },
    { time: 61, text: "Put a gun against his head, pulled my trigger, now he's dead" },
    { time: 70, text: "Mama, life had just begun" },
    { time: 76, text: "But now I've gone and thrown it all away" },
    { time: 84, text: "Mama, ooh, didn't mean to make you cry" },
    { time: 94, text: "If I'm not back again this time tomorrow" },
    { time: 99, text: "Carry on, carry on as if nothing really matters" },
    { time: 111, text: "Too late, my time has come" },
    { time: 117, text: "Sends shivers down my spine, body's aching all the time" },
    { time: 125, text: "Goodbye, everybody, I've got to go" },
    { time: 131, text: "Gotta leave you all behind and face the truth" },
    { time: 139, text: "Mama, ooh, I don't wanna die" },
    { time: 148, text: "I sometimes wish I'd never been born at all!" },
  ],
};

/**
 * Clean track title for lyric database lookups.
 */
export function cleanTrackTitle(title: string): string {
  return (title || '')
    .toLowerCase()
    .replace(/\s*[\(\[][^)\)]*(feat|ft|remix|version|deluxe|edit|single|official|explicit|video)[^\)\]]*[\)\]]/gi, '')
    .replace(/-\s*Single.*/i, '')
    .trim();
}

/**
 * Asynchronously fetch synchronized lyrics from backend API (connected to LRCLIB).
 */
export async function fetchOnlineLyrics(
  track: Track,
  signal?: AbortSignal
): Promise<{ lyrics: LyricLine[]; isSynced: boolean }> {
  if (!track || !track.title) {
    return { lyrics: [], isSynced: false };
  }

  const cacheKey = `${cleanTrackTitle(track.title)}_${(track.artistName || '').toLowerCase().trim()}`;
  if (lyricsCache.has(cacheKey)) {
    const cached = lyricsCache.get(cacheKey)!;
    return { lyrics: cached.lyrics, isSynced: cached.isSynced };
  }

  try {
    const params = new URLSearchParams({
      title: track.title,
      artist: track.artistName || '',
      duration: String(track.durationSeconds || 180),
    });

    const res = await fetch(`/api/lyrics?${params.toString()}`, { signal });
    if (!res.ok) {
      throw new Error(`Lyrics API responded with status ${res.status}`);
    }

    const data = await res.json();
    if (data && data.found && Array.isArray(data.lyrics) && data.lyrics.length > 0) {
      lyricsCache.set(cacheKey, {
        lyrics: data.lyrics,
        isSynced: !!data.isSynced,
        source: 'lrclib',
      });
      return { lyrics: data.lyrics, isSynced: !!data.isSynced };
    }

    return { lyrics: [], isSynced: false };
  } catch (err: any) {
    if (err.name === 'AbortError') return { lyrics: [], isSynced: false };
    console.warn('Failed to fetch online lyrics:', err?.message || err);
    return { lyrics: [], isSynced: false };
  }
}

/**
 * Synchronous resolver for track lyrics.
 * Prioritizes:
 * 1. Embedded track.lyrics for standard 30s preview playback.
 * 2. Cached synced lyrics for full-song or searched tracks.
 * 3. Famous full songs if full-song mode is active.
 * 4. Graceful musical interlude indicators.
 */
export function getTrackLyrics(track?: Track | null, isFullSong: boolean = false): LyricLine[] {
  if (!track) return [];

  const cleanTitle = cleanTrackTitle(track.title);
  const cacheKey = `${cleanTitle}_${(track.artistName || '').toLowerCase().trim()}`;

  // If in full song mode (YouTube or long duration), check cache or famous full lyrics first
  if (isFullSong || (track.durationSeconds && track.durationSeconds > 45) || track.isYouTube) {
    if (lyricsCache.has(cacheKey)) {
      return lyricsCache.get(cacheKey)!.lyrics;
    }
    for (const [key, fullLines] of Object.entries(FAMOUS_FULL_SONG_LYRICS)) {
      if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
        return fullLines;
      }
    }
  }

  // Preview Mode: embedded track lyrics specifically match the 30-second audio snippet
  if (track.lyrics && track.lyrics.length >= 3) {
    return track.lyrics;
  }

  // Check cache
  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey)!.lyrics;
  }

  // Check famous full database
  for (const [key, fullLines] of Object.entries(FAMOUS_FULL_SONG_LYRICS)) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return fullLines;
    }
  }

  // Default elegant fallback for tracks without lyrics yet
  const duration = track.durationSeconds || 30;
  return [
    { time: 0, text: `♪ ${track.title} ♪` },
    { time: Math.min(4, duration * 0.1), text: `${track.artistName}` },
    { time: Math.min(10, duration * 0.3), text: `♪ (Playing official audio) ♪` },
    { time: Math.min(18, duration * 0.6), text: `♪ (Musical performance) ♪` },
    { time: Math.min(25, duration * 0.85), text: `♪ (Outro & crescendo) ♪` },
  ];
}

/**
 * React hook to automatically manage synchronized lyrics with online fetching,
 * cache lookups, and manual timing calibration.
 */
export function useTrackLyrics(
  track?: Track | null,
  activeEngine: string = 'audio',
  timingOffset: number = 0,
  forceFullSong: boolean = false
): LyricsResult & { timingOffset: number; reloadLyrics: () => void } {
  const isFullSong = forceFullSong || activeEngine === 'youtube' || (track?.durationSeconds || 0) > 45 || !!track?.isYouTube;

  const [rawLyrics, setRawLyrics] = useState<LyricLine[]>(() => getTrackLyrics(track, isFullSong));
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [source, setSource] = useState<'embedded' | 'lrclib' | 'cached' | 'fallback'>('embedded');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadLyrics = useCallback(async (abortSignal?: AbortSignal) => {
    if (!track) {
      setRawLyrics([]);
      return;
    }

    // 1. Instant local display
    const local = getTrackLyrics(track, isFullSong);
    setRawLyrics(local);
    setSource(track.lyrics && !isFullSong ? 'embedded' : 'cached');

    // If already has comprehensive embedded lyrics for preview, we don't need network fetch unless in full-song mode
    if (!isFullSong && track.lyrics && track.lyrics.length >= 5) {
      setIsSynced(true);
      return;
    }

    // 2. Fetch online synced lyrics from LRCLIB
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchOnlineLyrics(track, abortSignal);
      if (result.lyrics.length > 0) {
        setRawLyrics(result.lyrics);
        setIsSynced(result.isSynced);
        setSource('lrclib');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError('Could not load online synced lyrics');
      }
    } finally {
      setIsLoading(false);
    }
  }, [track, isFullSong]);

  useEffect(() => {
    const controller = new AbortController();
    loadLyrics(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadLyrics]);

  // Apply manual calibration timing offset to all lyric lines
  const calibratedLyrics = useMemo(() => {
    if (timingOffset === 0) return rawLyrics;
    return rawLyrics.map(line => ({
      ...line,
      time: Math.max(0, Math.round((line.time + timingOffset) * 10) / 10),
    }));
  }, [rawLyrics, timingOffset]);

  return {
    lyrics: calibratedLyrics,
    isSynced,
    source,
    isLoading,
    error,
    timingOffset,
    reloadLyrics: () => loadLyrics(),
  };
}
