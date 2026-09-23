import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Mic2,
  Sparkles,
  Volume2,
  VolumeX,
  Type,
  ArrowDownCircle,
  Music,
  Share2,
  Check,
  Disc3,
  Flame,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { getTrackLyrics, LyricLine } from '../services/lyricsService';
import { TRACKS } from '../data/mockCatalog';

interface LyricsViewProps {
  onNavigateArtist?: (artistId: string) => void;
  onNavigateAlbum?: (albumId: string) => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  onNavigateArtist,
  onNavigateAlbum,
}) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    seek,
    playNext,
    playPrevious,
    playTrack,
    volume,
    setVolume,
  } = useAudio();

  const [textSize, setTextSize] = useState<'normal' | 'large' | 'giant'>('large');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isKaraokeMode, setIsKaraokeMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Get rich timestamped moving lyrics for current track
  const lyrics: LyricLine[] = getTrackLyrics(currentTrack);

  // Determine current active lyric line
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (progress >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  const activeLine = lyrics[activeIndex] || lyrics[0];
  const nextLine = lyrics[activeIndex + 1] || null;

  // Active line time progress percentage (for glowing karaoke fill)
  const currentLineStart = activeLine?.time || 0;
  const nextLineStart = nextLine ? nextLine.time : (duration || currentLineStart + 5);
  const lineDuration = Math.max(1, nextLineStart - currentLineStart);
  const lineProgress = Math.min(100, Math.max(0, ((progress - currentLineStart) / lineDuration) * 100));

  // Auto-scroll to active line
  useEffect(() => {
    if (!autoScroll) return;
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, autoScroll]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShareLyrics = () => {
    if (!activeLine || !currentTrack) return;
    const shareText = `"${activeLine.text}" — ${currentTrack.title} by ${currentTrack.artistName} on DOODLE`;
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If no track is playing, show interactive starter screen
  if (!currentTrack) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#181818] via-[#121212] to-black">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-2xl">
          <Mic2 className="w-10 h-10 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
          Synchronized Moving Lyrics
        </h1>
        <p className="text-sm md:text-base text-[#a7a7a7] max-w-md mb-8">
          Play any track from DOODLE, Audius, or trending hits to watch real-time synced lyrics move alongside the beat.
        </p>

        <div className="w-full max-w-xl bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl text-left">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Try Synced Lyrics with Popular Tracks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRACKS.slice(0, 6).map(track => (
              <div
                key={track.id}
                onClick={() => playTrack(track, TRACKS)}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] cursor-pointer transition-all border border-transparent hover:border-emerald-500/40"
              >
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {track.title}
                  </div>
                  <div className="text-xs text-[#888] truncate">{track.artistName}</div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    playTrack(track, TRACKS);
                  }}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-transform group-hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-black translate-x-0.2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="lyrics-view-canvas"
      className="relative min-h-full flex flex-col bg-gradient-to-b from-[#1b1c20] via-[#121214] to-black select-none overflow-hidden"
    >
      {/* Background Ambient Glow derived from artwork */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none blur-3xl opacity-50" />

      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[#121214]/80 border-b border-[#242424] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative group">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-xl shadow-2xl object-cover border border-[#333]"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur text-[9px] font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                Synced Lyrics
              </span>
              {currentTrack.genre && (
                <span className="text-[10px] text-[#888] font-medium hidden sm:inline">
                  • {currentTrack.genre}
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white truncate hover:underline cursor-pointer"
                onClick={() => onNavigateAlbum && onNavigateAlbum(currentTrack.albumId)}>
              {currentTrack.title}
            </h1>
            <p className="text-xs md:text-sm text-[#a7a7a7] truncate hover:text-white cursor-pointer"
               onClick={() => onNavigateArtist && onNavigateArtist(currentTrack.artistId)}>
              {currentTrack.artistName}
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Karaoke Mode Toggle */}
          <button
            onClick={() => setIsKaraokeMode(!isKaraokeMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isKaraokeMode
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                : 'bg-[#222] text-[#bbb] hover:text-white border-[#333]'
            }`}
            title="Focus Karaoke Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Karaoke</span>
          </button>

          {/* Auto-scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              autoScroll
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#222] text-[#888] hover:text-white border-[#333]'
            }`}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
          >
            <ArrowDownCircle className={`w-3.5 h-3.5 ${autoScroll ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Auto-Scroll</span>
          </button>

          {/* Text Size Switcher */}
          <div className="flex items-center bg-[#202020] rounded-full p-1 border border-[#333]">
            <button
              onClick={() => setTextSize('normal')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                textSize === 'normal' ? 'bg-[#383838] text-white' : 'text-[#888] hover:text-white'
              }`}
              title="Standard text size"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                textSize === 'large' ? 'bg-[#383838] text-white' : 'text-[#888] hover:text-white'
              }`}
              title="Large text size"
            >
              A+
            </button>
            <button
              onClick={() => setTextSize('giant')}
              className={`px-2.5 py-1 rounded-full text-sm font-bold transition-colors ${
                textSize === 'giant' ? 'bg-[#383838] text-white' : 'text-[#888] hover:text-white'
              }`}
              title="Giant sing-along text size"
            >
              A++
            </button>
          </div>

          {/* Share Line */}
          <button
            onClick={handleShareLyrics}
            className="p-2 rounded-full bg-[#202020] hover:bg-[#2e2e2e] text-[#aaa] hover:text-white transition-colors border border-[#333]"
            title="Copy current lyric line"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Main Moving Lyrics Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-16 custom-scrollbar relative"
      >
        <div className="max-w-3xl mx-auto w-full space-y-6 text-left">
          {lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = progress > line.time;

            // Compute font size class based on selection
            let fontClass = 'text-xl sm:text-2xl font-medium';
            if (textSize === 'large') {
              fontClass = isActive ? 'text-3xl sm:text-4xl font-extrabold' : 'text-2xl sm:text-3xl font-medium';
            } else if (textSize === 'giant') {
              fontClass = isActive ? 'text-4xl sm:text-5xl font-black' : 'text-3xl sm:text-4xl font-semibold';
            } else {
              fontClass = isActive ? 'text-2xl sm:text-3xl font-bold' : 'text-xl sm:text-2xl font-normal';
            }

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 transform select-none ${
                  isActive
                    ? 'scale-[1.02] bg-white/[0.07] border border-white/10 shadow-2xl backdrop-blur-sm'
                    : isPassed
                    ? 'opacity-40 hover:opacity-75 hover:bg-white/[0.02]'
                    : 'opacity-25 hover:opacity-60 hover:bg-white/[0.02]'
                }`}
              >
                {/* Active Indicator & Line Duration Progress */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/50" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`${fontClass} transition-colors duration-200 leading-snug tracking-tight ${
                        isActive
                          ? 'text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]'
                          : 'text-[#d0d0d0]'
                      }`}
                    >
                      {line.text}
                    </p>

                    {/* Active Line Fill Visualizer */}
                    {isActive && (
                      <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 transition-all duration-150 ease-linear rounded-full"
                          style={{ width: `${lineProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Timestamp Tag & Jump Indicator */}
                  <div className="flex items-center gap-2 pt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono text-[#888] bg-[#242424] px-2 py-0.5 rounded-md">
                      {formatTime(line.time)}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        seek(line.time);
                      }}
                      className="p-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow transition-transform hover:scale-110"
                      title="Jump to this line"
                    >
                      <Play className="w-3 h-3 fill-black translate-x-0.2" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Karaoke Focus Bar (Floating Sing-Along HUD when karaoke mode active) */}
      {isKaraokeMode && (
        <div className="sticky bottom-0 z-30 bg-black/90 backdrop-blur-xl border-t border-purple-500/30 p-6 shadow-2xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Mic2 className="w-3.5 h-3.5" />
                <span>Now Singing</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white truncate">
                {activeLine.text}
              </div>
              {nextLine && (
                <div className="text-sm sm:text-base text-[#888] truncate mt-1">
                  Next: {nextLine.text}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => seek(Math.max(0, progress - 10))}
                className="p-2.5 rounded-full bg-[#222] hover:bg-[#333] text-white transition-colors"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                )}
              </button>
              <button
                onClick={() => seek(Math.min(duration, progress + 10))}
                className="p-2.5 rounded-full bg-[#222] hover:bg-[#333] text-white transition-colors"
                title="Fast forward 10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sub-footer Status */}
      <footer className="px-6 py-2.5 bg-[#121214]/60 border-t border-[#202020] text-center text-xs text-[#777] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Disc3 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>Synced with live playback engine</span>
        </div>
        <div>Click any lyric line to jump playback directly to that position</div>
        <div className="font-mono text-emerald-400">
          {formatTime(progress)} / {formatTime(duration)}
        </div>
      </footer>
    </div>
  );
};
