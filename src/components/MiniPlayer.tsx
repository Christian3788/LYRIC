import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';

interface MiniPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ isOpen, onClose, onExpand }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    nextTrack,
    prevTrack,
    progress,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useAudio();

  if (!isOpen || !currentTrack) return null;

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      id="floating-mini-player"
      className="fixed bottom-24 right-6 z-50 w-80 bg-[#16161a]/95 backdrop-blur-xl border border-[#2e2e34] rounded-3xl p-4 shadow-2xl space-y-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-[#888]">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mini Player</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onExpand}
            className="p-1 rounded-full hover:bg-[#28282e] text-[#aaa] hover:text-white transition-colors"
            title="Expand into main view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#28282e] text-[#aaa] hover:text-white transition-colors"
            title="Close mini player"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Track Info with Album Art */}
      <div className="flex items-center gap-3">
        <div className="relative group flex-shrink-0">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-14 h-14 rounded-2xl object-cover shadow-lg border border-[#333] ${
              isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
            }`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-2xl bg-black/20 pointer-events-none" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
          <div className="text-xs text-[#888] truncate">{currentTrack.artistName}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
            <span>{formatTime(progress)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1.5 bg-[#25252a] rounded-full overflow-hidden cursor-pointer group"
           onClick={e => {
             const rect = e.currentTarget.getBoundingClientRect();
             const clickX = e.clientX - rect.left;
             const newRatio = clickX / rect.width;
             seek(newRatio * duration);
           }}>
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={toggleMute}
          className="p-1.5 text-[#888] hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={prevTrack}
            className="p-2 text-[#aaa] hover:text-white transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/30"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-[#aaa] hover:text-white transition-colors"
            title="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="w-16">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 accent-emerald-500 bg-[#333] rounded-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
