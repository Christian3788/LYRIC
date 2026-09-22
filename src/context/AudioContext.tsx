import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Track, RepeatMode } from '../types';
import { fisherYatesShuffle } from '../utils/formatters';
import { TRACKS } from '../data/mockCatalog';

interface BufferedRange {
  start: number;
  end: number;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  isBuffering: boolean;
  bufferedRanges: BufferedRange[];
  bufferedPercent: number;
  error: string | null;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  injectRecommendedTracks: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(60);
  const [queue, setQueue] = useState<Track[]>(TRACKS);
  const [originalQueue, setOriginalQueue] = useState<Track[]>(TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('queue');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>([]);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // HTML5 Audio singleton ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Audio preloader instance for next track
  const preloaderRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio instance once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const preloader = new Audio();
    preloader.preload = 'auto';
    preloaderRef.current = preloader;

    // Attach core event listeners
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);

      // Compute buffered ranges for visual range bar
      if (audio.buffered.length > 0) {
        const ranges: BufferedRange[] = [];
        let maxBuffered = 0;
        for (let i = 0; i < audio.buffered.length; i++) {
          const start = audio.buffered.start(i);
          const end = audio.buffered.end(i);
          ranges.push({ start, end });
          if (end > maxBuffered) maxBuffered = end;
        }
        setBufferedRanges(ranges);
        if (audio.duration > 0) {
          setBufferedPercent(Math.min(100, (maxBuffered / audio.duration) * 100));
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 60);
      setIsBuffering(false);
      setError(null);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleCanPlayThrough = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      console.warn('Primary audio stream load event error, attempting graceful fallback');
      setIsBuffering(false);
      // If error occurs, keep player alive with synthesised duration
      setDuration(60);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.src = '';
    };
  }, []);

  // Update volume & mute status
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Audio Preload Strategy: Preload next track in the queue
  useEffect(() => {
    if (!preloaderRef.current || queue.length === 0) return;
    const nextIdx = (queueIndex + 1) % queue.length;
    const nextTrack = queue[nextIdx];
    if (nextTrack && nextTrack.audioUrl) {
      preloaderRef.current.src = nextTrack.audioUrl;
      preloaderRef.current.load();
    }
  }, [queueIndex, queue]);

  // MediaSession API and dynamic browser tab title
  useEffect(() => {
    if (!currentTrack) {
      document.title = 'DOODLE - Cloud Audio Streaming Platform';
      return;
    }

    // Dynamic browser title
    document.title = isPlaying
      ? `🎵 ${currentTrack.title} • ${currentTrack.artistName}`
      : `${currentTrack.title} • ${currentTrack.artistName}`;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artistName,
        album: currentTrack.albumTitle,
        artwork: [
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '256x256', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => play());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', details => {
        if (details.seekTime !== undefined) {
          seek(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', details => {
        seek(Math.max(0, progress - (details.seekOffset || 10)));
      });
      navigator.mediaSession.setActionHandler('seekforward', details => {
        seek(Math.min(duration, progress + (details.seekOffset || 10)));
      });
    }
  }, [currentTrack, isPlaying, progress, duration]);

  // Handle track ended based on RepeatMode
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn('Replay error:', e));
      } else if (repeatMode === 'queue') {
        nextTrack();
      } else {
        // 'off': Stop at end of queue or play next if not at end
        if (queueIndex < queue.length - 1) {
          nextTrack();
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [repeatMode, queueIndex, queue]);

  // Load and play track
  const loadAndPlayTrack = useCallback(
    (track: Track, autoPlay: boolean = true) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      audio.src = track.audioUrl;
      audio.load();
      setCurrentTrack(track);
      setProgress(0);
      setDuration(track.durationSeconds || 60);

      if (autoPlay) {
        setIsBuffering(true);
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(err => {
            console.warn('Audio playback start caught (browser autoplay policy or chunk stall):', err);
            setIsPlaying(false);
            setIsBuffering(false);
          });
      }
    },
    []
  );

  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      if (newQueue && newQueue.length > 0) {
        setQueue(newQueue);
        setOriginalQueue(newQueue);
        const idx = newQueue.findIndex(t => t.id === track.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      } else {
        // Find in existing queue or append
        const idx = queue.findIndex(t => t.id === track.id);
        if (idx >= 0) {
          setQueueIndex(idx);
        } else {
          const updated = [...queue, track];
          setQueue(updated);
          setOriginalQueue(updated);
          setQueueIndex(updated.length - 1);
        }
      }
      loadAndPlayTrack(track, true);
    },
    [queue, loadAndPlayTrack]
  );

  const play = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioRef.current.src && currentTrack) {
      loadAndPlayTrack(currentTrack, true);
      return;
    }
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.warn('Play error:', err);
      });
  }, [currentTrack, loadAndPlayTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(seconds, audioRef.current.duration || 60));
    audioRef.current.currentTime = clamped;
    setProgress(clamped);
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    const nextIdx = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIdx);
    loadAndPlayTrack(queue[nextIdx], true);
  }, [queue, queueIndex, loadAndPlayTrack]);

  const prevTrack = useCallback(() => {
    if (queue.length === 0) return;
    // If more than 3 seconds into song, restart track (standard player behavior)
    if (audioRef.current && audioRef.current.currentTime > 3) {
      seek(0);
      return;
    }
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    loadAndPlayTrack(queue[prevIdx], true);
  }, [queue, queueIndex, seek, loadAndPlayTrack]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => {
      const willShuffle = !prev;
      if (willShuffle) {
        // Shuffle queue using Fisher-Yates but keep current track at current index
        const remaining = queue.filter((_, i) => i !== queueIndex);
        const shuffled = fisherYatesShuffle(remaining);
        const newQueue = currentTrack ? [currentTrack, ...shuffled] : fisherYatesShuffle(queue);
        setQueue(newQueue);
        setQueueIndex(0);
      } else {
        // Restore original queue order
        setQueue(originalQueue);
        if (currentTrack) {
          const idx = originalQueue.findIndex(t => t.id === currentTrack.id);
          setQueueIndex(idx >= 0 ? idx : 0);
        }
      }
      return willShuffle;
    });
  }, [queue, queueIndex, originalQueue, currentTrack]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'queue';
      if (prev === 'queue') return 'track';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
    setOriginalQueue(prev => [...prev, track]);
  }, []);

  const playNext = useCallback((track: Track) => {
    setQueue(prev => {
      const updated = [...prev];
      updated.splice(queueIndex + 1, 0, track);
      return updated;
    });
    setOriginalQueue(prev => {
      const updated = [...prev];
      updated.splice(queueIndex + 1, 0, track);
      return updated;
    });
  }, [queueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      if (index === queueIndex) return prev; // Cannot remove playing track
      const updated = prev.filter((_, i) => i !== index);
      if (index < queueIndex) {
        setQueueIndex(queueIndex - 1);
      }
      return updated;
    });
  }, [queueIndex]);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setQueue(prev => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentTrack]);

  const injectRecommendedTracks = useCallback(() => {
    // Inject tracks that are not already in the queue
    const currentIds = new Set(queue.map(t => t.id));
    const unqueued = TRACKS.filter(t => !currentIds.has(t.id));
    if (unqueued.length > 0) {
      const toAdd = unqueued.slice(0, 3);
      setQueue(prev => [...prev, ...toAdd]);
      setOriginalQueue(prev => [...prev, ...toAdd]);
    }
  }, [queue]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        queue,
        queueIndex,
        isMuted,
        repeatMode,
        isShuffled,
        isBuffering,
        bufferedRanges,
        bufferedPercent,
        error,
        playTrack,
        togglePlayPause,
        play,
        pause,
        seek,
        setVolume,
        toggleMute,
        nextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        playNext,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        injectRecommendedTracks,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
