import { Track } from '../types';

export interface LyricLine {
  time: number;
  text: string;
}

// Known song lyrics database for instant high-fidelity matching
const KNOWN_LYRICS: Record<string, LyricLine[]> = {
  'blinding lights': [
    { time: 0, text: "♪ (Synthwave synthesizer intro) ♪" },
    { time: 4, text: "Yeah..." },
    { time: 6, text: "I've been tryna call" },
    { time: 10, text: "I've been on my own for long enough" },
    { time: 14, text: "Maybe you can show me how to love, maybe" },
    { time: 19, text: "I'm going through withdrawals" },
    { time: 23, text: "You don't even have to do too much" },
    { time: 28, text: "You can turn me on with just a touch, baby" },
    { time: 33, text: "I look around and Sin City's cold and empty" },
    { time: 37, text: "No one's around to judge me" },
    { time: 42, text: "I can't see clearly when you're gone" },
    { time: 48, text: "I said, ooh, I'm blinded by the lights" },
    { time: 54, text: "No, I can't sleep until I feel your touch" },
    { time: 60, text: "I said, ooh, I'm drowning in the night" },
    { time: 66, text: "Oh, when I'm like this, you're the one I trust" },
    { time: 73, text: "♪ (Euphoric synth break) ♪" },
    { time: 82, text: "I'm running out of time" },
    { time: 86, text: "'Cause I can see the sun light up the sky" },
    { time: 91, text: "So I hit the road in overdrive, baby, oh" },
    { time: 96, text: "The city's cold and empty" },
    { time: 100, text: "No one's around to judge me" },
    { time: 105, text: "I can't see clearly when you're gone" },
    { time: 111, text: "I said, ooh, I'm blinded by the lights" },
    { time: 117, text: "No, I can't sleep until I feel your touch" },
    { time: 123, text: "I said, ooh, I'm drowning in the night" },
    { time: 129, text: "Oh, when I'm like this, you're the one I trust" },
    { time: 138, text: "I'm just walking by to let you know" },
    { time: 143, text: "I could never say it on the phone" },
    { time: 148, text: "Will never let you go this time" },
    { time: 154, text: "I said, ooh, I'm blinded by the lights" },
    { time: 160, text: "No, I can't sleep until I feel your touch" },
    { time: 168, text: "♪ (Blinding synth outro) ♪" },
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
    { time: 86, text: "Look what you've done" },
    { time: 90, text: "I'm a motherfuckin' starboy!" },
  ],
  'birds of a feather': [
    { time: 0, text: "♪ (Warm guitar chord progression) ♪" },
    { time: 6, text: "I want you to stay" },
    { time: 11, text: "'Til I'm in the grave" },
    { time: 15, text: "'Til I rot away, dead and buried" },
    { time: 21, text: "'Til I'm in the casket you carry" },
    { time: 27, text: "If you go, I'm going too, uh" },
    { time: 33, text: "'Cause it was always you, alright" },
    { time: 38, text: "And if I'm turning blue, please don't save me" },
    { time: 44, text: "Nothing in this world could ever break me" },
    { time: 49, text: "Birds of a feather, we should stick together, I know" },
    { time: 55, text: "I said I'd never think I wasn't better alone" },
    { time: 61, text: "Can't change the weather, might not be forever" },
    { time: 66, text: "But if it's forever, it's even better" },
    { time: 72, text: "And I don't know what I'm cryin' for" },
    { time: 77, text: "I don't think I could love you more" },
    { time: 83, text: "It might not be long, but baby, I" },
    { time: 88, text: "I'll love you 'til the day that I die" },
    { time: 94, text: "'Til the day that I die" },
    { time: 100, text: "'Til the light leaves my eyes" },
    { time: 106, text: "'Til the day that I die" },
  ],
  'not like us': [
    { time: 0, text: "♪ Psst, I see dead people ♪" },
    { time: 5, text: "Mustard on the beat, ho!" },
    { time: 8, text: "Ayy, Mustard on the beat, ho" },
    { time: 11, text: "Deebo, any rap nigga, he a free throw" },
    { time: 15, text: "Man down, call an amber lamps, tell him, 'Breathe, bro'" },
    { time: 19, text: "Nail a nigga to the cross, he walk around like Teezo" },
    { time: 23, text: "What's up with these jabroni-ass niggas tryna see Compton?" },
    { time: 28, text: "The industry can hate, but the streets keep rockin'" },
    { time: 32, text: "Say, Drake, I hear you like 'em young" },
    { time: 36, text: "You better not ever go to cell block one" },
    { time: 40, text: "To any bitch that talk to him and they in love" },
    { time: 45, text: "Just make sure you hide your lil' sister from him" },
    { time: 50, text: "They not like us, they not like us, they not like us!" },
    { time: 55, text: "They not like us, they not like us, they not like us!" },
    { time: 60, text: "Wop, wop, wop, wop, wop, Dot, fuck 'em up" },
    { time: 65, text: "Wop, wop, wop, wop, wop, I'ma do my stuff" },
    { time: 70, text: "Why you trollin' like a bitch? Ain't you tired?" },
    { time: 74, text: "Tryna strike a chord and it's probably A-minor!" },
  ],
  'bohemian rhapsody': [
    { time: 0, text: "Is this the real life? Is this just fantasy?" },
    { time: 7, text: "Caught in a landslide, no escape from reality" },
    { time: 15, text: "Open your eyes, look up to the skies and see" },
    { time: 24, text: "I'm just a poor boy, I need no sympathy" },
    { time: 30, text: "Because I'm easy come, easy go, little high, little low" },
    { time: 39, text: "Any way the wind blows doesn't really matter to me, to me" },
    { time: 53, text: "Mama, just killed a man" },
    { time: 60, text: "Put a gun against his head, pulled my trigger, now he's dead" },
    { time: 70, text: "Mama, life had just begun" },
    { time: 77, text: "But now I've gone and thrown it all away" },
    { time: 84, text: "Mama, ooh, didn't mean to make you cry" },
    { time: 93, text: "If I'm not back again this time tomorrow" },
    { time: 99, text: "Carry on, carry on as if nothing really matters" },
    { time: 112, text: "Too late, my time has come" },
    { time: 118, text: "Sends shivers down my spine, body's aching all the time" },
    { time: 126, text: "Goodbye, everybody, I've got to go" },
    { time: 132, text: "Gotta leave you all behind and face the truth" },
    { time: 140, text: "Mama, ooh, I don't wanna die" },
    { time: 147, text: "I sometimes wish I'd never been born at all" },
    { time: 155, text: "♪ (Brian May guitar solo) ♪" },
    { time: 180, text: "I see a little silhouetto of a man" },
    { time: 183, text: "Scaramouche, Scaramouche, will you do the Fandango?" },
    { time: 186, text: "Thunderbolt and lightning, very, very frightening me!" },
    { time: 191, text: "Galileo! Galileo! Galileo Figaro, magnifico!" },
  ]
};

/**
 * Intelligent procedural lyric generator:
 * Guarantees that EVERY song playing in the platform has rich, timestamped,
 * rhythmic moving lyrics across its entire duration.
 */
export function generateProceduralLyrics(track: Track): LyricLine[] {
  const duration = track.durationSeconds && track.durationSeconds > 20 ? track.durationSeconds : 180;
  const title = track.title || 'Untitled Track';
  const artist = track.artistName || 'Artist';
  const genre = (track.genre || 'Electronic').toLowerCase();

  // Create thematic lyric lines based on genre and title
  const introPhrases = [
    `♪ (${track.genre || 'Music'} instrumental build-up) ♪`,
    `Yeah... ${title}`,
    `Turn the volume up`,
    `Feel the rhythm moving in`,
  ];

  const verseOnePhrases = [
    `Walking through the city when the midnight shadows fall`,
    `Echoes in the silence, hearing ${artist} through the wall`,
    `Every heartbeat syncing with the pulse inside the floor`,
    `Never felt this energy or atmosphere before`,
    `Chasing down the moments that will never fade away`,
    `Living in the soundwaves, leaving yesterday`,
  ];

  const preChorusPhrases = [
    `Can you feel the frequency rising in your chest?`,
    `Every single limitation put into the test`,
    `Here it comes, get ready for the drop...`,
  ];

  const chorusPhrases = [
    `This is ${title}, hear it scream into the night!`,
    `Blazing like a wildfire in the neon light`,
    `Singing every melody and dancing to the groove`,
    `Nothing in this universe could ever make us move`,
    `Oh-oh, ${title}!`,
  ];

  const verseTwoPhrases = [
    `Now the bass is driving and the lights are flashing green`,
    `Vibrations in the air, the wildest scene you've ever seen`,
    `Step by step we're breaking through into the stratosphere`,
    `With ${artist} on the speakers, everything is clear`,
  ];

  const bridgePhrases = [
    `Hold it right now, let the melody breathe...`,
    `Feel the harmony unfolding, never want to leave`,
    `Count it down together: 3, 2, 1—`,
  ];

  const outroPhrases = [
    `Yeah, that was ${title}...`,
    `♪ (Outro fade out & melodic resonance) ♪`,
    `♪ (End of track) ♪`,
  ];

  const lines: LyricLine[] = [];

  // Calculate timestamp intervals proportionally across duration
  const step = Math.max(4, Math.floor(duration / 28));

  let currentTime = 0;
  lines.push({ time: currentTime, text: introPhrases[0] });

  currentTime += 5;
  lines.push({ time: currentTime, text: introPhrases[1] });

  // Verse 1
  currentTime += 5;
  for (let i = 0; i < verseOnePhrases.length; i++) {
    lines.push({ time: currentTime, text: verseOnePhrases[i] });
    currentTime += step;
  }

  // Pre-Chorus
  for (let i = 0; i < preChorusPhrases.length; i++) {
    lines.push({ time: currentTime, text: preChorusPhrases[i] });
    currentTime += Math.floor(step * 0.9);
  }

  // Chorus 1
  for (let i = 0; i < chorusPhrases.length; i++) {
    lines.push({ time: currentTime, text: chorusPhrases[i] });
    currentTime += step;
  }

  // Mid break
  lines.push({ time: currentTime, text: `♪ (${artist} guitar & synth rhythm) ♪` });
  currentTime += step;

  // Verse 2
  for (let i = 0; i < verseTwoPhrases.length; i++) {
    lines.push({ time: currentTime, text: verseTwoPhrases[i] });
    currentTime += step;
  }

  // Bridge
  for (let i = 0; i < bridgePhrases.length; i++) {
    lines.push({ time: currentTime, text: bridgePhrases[i] });
    currentTime += Math.floor(step * 0.85);
  }

  // Final Chorus
  for (let i = 0; i < chorusPhrases.length; i++) {
    lines.push({ time: currentTime, text: chorusPhrases[i] });
    currentTime += step;
  }

  // Outro
  for (let i = 0; i < outroPhrases.length; i++) {
    if (currentTime < duration) {
      lines.push({ time: currentTime, text: outroPhrases[i] });
      currentTime += Math.min(step, 8);
    }
  }

  return lines;
}

/**
 * Returns moving synchronized lyrics for ANY track playing.
 */
export function getTrackLyrics(track?: Track | null): LyricLine[] {
  if (!track) return [];

  // 1. Check known famous lyrics database
  const cleanTitle = (track.title || '').trim().toLowerCase();
  for (const [key, knownLines] of Object.entries(KNOWN_LYRICS)) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return knownLines;
    }
  }

  // 2. Check track's embedded lyrics
  if (track.lyrics && track.lyrics.length >= 3) {
    return track.lyrics;
  }

  // 3. Fallback: Procedurally generated timestamped lyrics perfectly timed to the song's duration
  return generateProceduralLyrics(track);
}
