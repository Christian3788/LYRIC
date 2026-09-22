import fs from 'fs';
import path from 'path';

// Generate valid PCM 16-bit 44.1kHz Stereo WAV buffer for streaming tests and playback
export function generateSyntheticTrack(
  durationSec: number = 60,
  style: 'lofi' | 'synthwave' | 'ambient' | 'chill' | 'acoustic' = 'synthwave'
): Buffer {
  const sampleRate = 44100;
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const numSamples = sampleRate * durationSec;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Musical parameters based on style
  let baseFreq = 220; // A3
  let tempo = 100; // BPM
  let chordProgression = [220, 174.61, 261.63, 196.0]; // Am, F, C, G

  if (style === 'lofi') {
    tempo = 78;
    chordProgression = [196, 220, 246.94, 164.81]; // G, Am, Bm, Em
    baseFreq = 164.81;
  } else if (style === 'ambient') {
    tempo = 55;
    chordProgression = [130.81, 164.81, 174.61, 196.0]; // C, E, F, G
    baseFreq = 130.81;
  } else if (style === 'chill') {
    tempo = 90;
    chordProgression = [261.63, 329.63, 349.23, 392.0]; // C, E, F, G
    baseFreq = 261.63;
  }

  const beatDurationSec = 60 / tempo;
  const barDurationSec = beatDurationSec * 4;

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const currentBar = Math.floor(t / barDurationSec);
    const chordIndex = currentBar % chordProgression.length;
    const rootFreq = chordProgression[chordIndex];

    // Harmony pad (smooth sine mix)
    const pad1 = Math.sin(2 * Math.PI * rootFreq * t) * 0.2;
    const pad2 = Math.sin(2 * Math.PI * (rootFreq * 1.25) * t) * 0.15; // major third or fifth
    const pad3 = Math.sin(2 * Math.PI * (rootFreq * 1.5) * t) * 0.15; // fifth

    // Bassline (octave down with slight saturation)
    const bassNote = rootFreq / 2;
    const bass = Math.sin(2 * Math.PI * bassNote * t) * 0.3;

    // Arpeggio / Lead
    const beatPos = (t % beatDurationSec) / beatDurationSec;
    const arpSteps = [1, 1.25, 1.5, 1.875];
    const stepIdx = Math.floor((t / (beatDurationSec / 2)) % arpSteps.length);
    const leadFreq = rootFreq * 2 * arpSteps[stepIdx];
    const env = Math.max(0, 1 - (beatPos * 2 % 1));
    const lead = Math.sin(2 * Math.PI * leadFreq * t) * env * 0.15;

    // Subtle rhythmic percussion
    const beatInBar = (t % barDurationSec) / beatDurationSec;
    let kick = 0;
    if (beatInBar < 0.15 || (beatInBar >= 2 && beatInBar < 2.15)) {
      const kickT = (t % (beatDurationSec * 2));
      kick = Math.sin(2 * Math.PI * (120 - kickT * 200) * kickT) * Math.max(0, 1 - kickT * 10) * 0.3;
    }

    let snare = 0;
    if ((beatInBar >= 1 && beatInBar < 1.2) || (beatInBar >= 3 && beatInBar < 3.2)) {
      snare = (Math.random() * 2 - 1) * 0.12 * Math.max(0, 1 - (t % beatDurationSec) * 8);
    }

    // Mix channels
    const leftMix = (pad1 + pad3 + bass * 0.9 + lead * 0.7 + kick + snare) * 0.6;
    const rightMix = (pad2 + pad3 + bass * 0.9 + lead * 0.9 + kick + snare) * 0.6;

    // Clamp to 16-bit PCM range [-32768, 32767]
    const left16 = Math.max(-32768, Math.min(32767, Math.floor(leftMix * 32767)));
    const right16 = Math.max(-32768, Math.min(32767, Math.floor(rightMix * 32767)));

    buffer.writeInt16LE(left16, offset);
    buffer.writeInt16LE(right16, offset + 2);
    offset += 4;
  }

  return buffer;
}

// In-memory cache for synthesized track buffers
const audioCache = new Map<string, Buffer>();

export function getOrCreateTrackBuffer(trackId: string, style: 'lofi' | 'synthwave' | 'ambient' | 'chill' | 'acoustic' = 'synthwave'): Buffer {
  if (audioCache.has(trackId)) {
    return audioCache.get(trackId)!;
  }

  // 60-second high-fidelity stereo WAV track ~ 10.5 MB of data
  // Perfect for real HTTP 206 range chunk requests
  const buffer = generateSyntheticTrack(60, style);
  audioCache.set(trackId, buffer);
  return buffer;
}
