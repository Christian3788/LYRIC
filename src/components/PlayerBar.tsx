import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  Mic2,
  Users,
  Heart,
  Maximize2,
  Radio,
  Download,
  Video,
  Loader2,
  Headphones,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useParty } from '../context/PartyContext';
import { formatTime } from '../utils/formatters';
import { downloadFMATrack } from '../services/fmaService';

interface PlayerBarProps {
  onOpenQueue: () => void;
  onOpenLyrics: () => void;
  onOpenParty: () => void;
  onNavigateArtist?: (artistId: string) => void;
  onNavigateAlbum?: (albumId: string) => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  onOpenQueue,
  onOpenLyrics,
  onOpenParty,
  onNavigateArtist,
  onNavigateAlbum,
}) => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    progress,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    nextTrack,
    prevTrack,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isBuffering,
    bufferedPercent,
    activeEngine,
    isVideoOpen,
    toggleVideo,
    openVideo,
    closeVideo,
    switchToYouTubeVideo,
    playAsBackgroundAudio,
    isSearchingYouTube,
  } = useAudio();

  const { isInParty, isHost, room } = useParty();
  const [isLiked, setIsLiked] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverSeekPos(e.clientX - rect.left);
    setHoverSeekTime(pos * duration);
  };

  const handleSeekMouseLeave = () => {
    setHoverSeekTime(null);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pos * duration);
  };

  return (
    <footer
      id="player-bar"
      className="fixed bottom-0 left-0 right-0 h-24 bg-[#121212] border-t border-[#282828] px-4 flex items-center justify-between z-50 select-none shadow-2xl"
    >
      {/* 1. Left Section: Now Playing Metadata */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
        <div className="relative group cursor-pointer w-14 h-14 rounded-md overflow-hidden bg-[#242424] flex-shrink-0 shadow-md">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onClick={() => onNavigateAlbum && onNavigateAlbum(currentTrack.albumId)}
          />
          {isBuffering && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className="text-sm font-semibold text-white truncate hover:underline cursor-pointer"
              onClick={() => onNavigateAlbum && onNavigateAlbum(currentTrack.albumId)}
            >
              {currentTrack.title}
            </span>
            {currentTrack.youtubeId || currentTrack.isYouTube ? (
              <span
                className="px-1.5 py-0.2 rounded bg-red-600/25 text-red-400 text-[9px] font-bold border border-red-500/40 uppercase tracking-wider flex-shrink-0"
                title="Official YouTube Music Track"
              >
                YOUTUBE
              </span>
            ) : currentTrack.isFMA ? (
              <span
                className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40 uppercase tracking-wider flex-shrink-0"
                title="Free Music Archive (Full Length Track)"
              >
                FMA
              </span>
            ) : currentTrack.isRealSong ? (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40 uppercase tracking-wider flex-shrink-0">
                REAL
              </span>
            ) : null}
          </div>
          <span
            className="text-xs text-[#a7a7a7] truncate hover:text-white hover:underline cursor-pointer"
            onClick={() => onNavigateArtist && onNavigateArtist(currentTrack.artistId)}
          >
            {currentTrack.artistName}
          </span>
        </div>

        <button
          id="player-like-btn"
          onClick={() => setIsLiked(!isLiked)}
          className={`p-1.5 transition-transform active:scale-90 ${
            isLiked ? 'text-emerald-500' : 'text-[#b3b3b3] hover:text-white'
          }`}
          title={isLiked ? 'Remove from Your Library' : 'Save to Your Library'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {currentTrack.isFMA && (
          <button
            id="player-fma-download-btn"
            onClick={() => downloadFMATrack(currentTrack)}
            className="p-1.5 text-amber-400 hover:text-amber-300 transition-transform active:scale-90"
            title="Download full-length MP3 from Free Music Archive"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {isInParty && (
          <div
            onClick={onOpenParty}
            className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-medium border border-emerald-500/30 cursor-pointer animate-pulse"
          >
            <Radio className="w-3 h-3" />
            <span>{isHost ? 'Broadcasting' : 'Synced'}</span>
          </div>
        )}
      </div>

      {/* 2. Middle Section: Playback Controls & Range Scrub Bar */}
      <div className="flex flex-col items-center max-w-[680px] w-2/4 px-4">
        {/* Playback Control Buttons */}
        <div className="flex items-center gap-5 mb-1.5">
          <button
            id="player-shuffle-btn"
            onClick={toggleShuffle}
            className={`transition-colors ${
              isShuffled ? 'text-emerald-500 hover:text-emerald-400' : 'text-[#a7a7a7] hover:text-white'
            }`}
            title={isShuffled ? 'Disable Shuffle' : 'Enable Fisher-Yates Shuffle'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            id="player-prev-btn"
            onClick={prevTrack}
            className="text-[#b3b3b3] hover:text-white transition-transform active:scale-95"
            title="Previous (or Restart Track)"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            id="player-play-pause-btn"
            onClick={togglePlayPause}
            className="w-9 h-9 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black text-black" />
            ) : (
              <Play className="w-4 h-4 fill-black text-black translate-x-0.5" />
            )}
          </button>

          <button
            id="player-next-btn"
            onClick={nextTrack}
            className="text-[#b3b3b3] hover:text-white transition-transform active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            id="player-repeat-btn"
            onClick={toggleRepeat}
            className={`transition-colors relative ${
              repeatMode !== 'off' ? 'text-emerald-500 hover:text-emerald-400' : 'text-[#a7a7a7] hover:text-white'
            }`}
            title={`Repeat: ${repeatMode.toUpperCase()}`}
          >
            {repeatMode === 'track' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Scrub Bar with Buffer & Timestamp Preview */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-[#a7a7a7] w-10 text-right">
            {formatTime(progress)}
          </span>

          <div
            ref={progressBarRef}
            onClick={handleSeekClick}
            onMouseMove={handleSeekMouseMove}
            onMouseLeave={handleSeekMouseLeave}
            className="relative flex-1 h-1 hover:h-2 rounded-full bg-[#4d4d4d] cursor-pointer group transition-all duration-150"
          >
            {/* HTTP 206 Buffered Content Range Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#6d6d6d] rounded-full transition-all duration-300"
              style={{ width: `${bufferedPercent}%` }}
              title={`HTTP 206 Buffered: ${Math.round(bufferedPercent)}%`}
            />

            {/* Active Playback Progress Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-white group-hover:bg-emerald-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Scrub Handle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Hover timestamp tooltip */}
            {hoverSeekTime !== null && (
              <div
                className="absolute -top-7 -translate-x-1/2 bg-[#282828] text-white text-[10px] font-mono py-0.5 px-1.5 rounded shadow border border-[#3e3e3e] pointer-events-none"
                style={{ left: `${hoverSeekPos}px` }}
              >
                {formatTime(hoverSeekTime)}
              </div>
            )}
          </div>

          <span className="text-[11px] font-mono text-[#a7a7a7] w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right Section: Secondary Controls (Queue, Lyrics, Party, Volume) */}
      <div className="flex items-center justify-end gap-3.5 w-1/4 min-w-[200px]">
        {/* Stream 206 badge */}
        <span
          className="hidden 2xl:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#282828] text-emerald-400 border border-[#3e3e3e]"
          title="Streaming high-fidelity stereo via HTTP 206 Partial Content"
        >
          206 CHUNK
        </span>

        {/* YouTube Video / Background Audio Controls */}
        {isVideoOpen ? (
          /* When video window is open: offer explicit button to play video as audio in the background! */
          <button
            id="player-bg-audio-action-btn"
            onClick={closeVideo}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Play video as audio in background (hides video window, keeps audio playing)"
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Play as Audio</span>
            <span className="sm:hidden">Audio</span>
          </button>
        ) : activeEngine === 'youtube' ? (
          /* When currently playing YouTube video as background audio */
          <div className="flex items-center gap-1">
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[11px] font-mono select-none"
              title="Currently playing YouTube video as background audio"
            >
              <Headphones className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Background Audio</span>
            </span>
            <button
              id="player-show-video-btn"
              onClick={openVideo}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-red-400 hover:text-white hover:bg-red-500/20 font-medium transition-colors"
              title="Show Video Window"
            >
              <Video className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden xl:inline">Show Video</span>
            </button>
          </div>
        ) : (
          /* When playing standard audio: allow one-click to play video or play video as background audio */
          <div className="flex items-center gap-1">
            <button
              id="player-play-as-bg-audio-btn"
              onClick={() => playAsBackgroundAudio()}
              disabled={isSearchingYouTube}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#a7a7a7] hover:text-emerald-400 hover:bg-[#282828] font-medium transition-colors"
              title="Play official video as background audio"
            >
              {isSearchingYouTube ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Headphones className="w-3.5 h-3.5" />
              )}
              <span className="hidden xl:inline">Play as Audio</span>
            </button>
            <button
              id="player-video-btn"
              onClick={() => switchToYouTubeVideo()}
              disabled={isSearchingYouTube}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#a7a7a7] hover:text-red-400 hover:bg-[#282828] font-medium transition-colors"
              title="Watch Official Video"
            >
              <Video className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden xl:inline">Video</span>
            </button>
          </div>
        )}

        {/* Synced Lyrics Toggle */}
        <button
          id="player-lyrics-btn"
          onClick={onOpenLyrics}
          className="text-[#a7a7a7] hover:text-white transition-colors"
          title="Synced Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Active Queue Drawer Toggle */}
        <button
          id="player-queue-btn"
          onClick={onOpenQueue}
          className="text-[#a7a7a7] hover:text-white transition-colors"
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Listen Along Party Room Toggle */}
        <button
          id="player-party-btn"
          onClick={onOpenParty}
          className={`transition-colors relative ${
            isInParty ? 'text-emerald-500' : 'text-[#a7a7a7] hover:text-white'
          }`}
          title="Listen Along (Party Mode)"
        >
          <Users className="w-4 h-4" />
          {isInParty && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          )}
        </button>

        {/* Volume Slider & Mute Toggle */}
        <div className="flex items-center gap-2 group w-28">
          <button
            id="player-volume-btn"
            onClick={toggleMute}
            className="text-[#a7a7a7] hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            id="player-volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#4d4d4d] accent-white group-hover:accent-emerald-500 rounded-lg cursor-pointer"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
    </footer>
  );
};
