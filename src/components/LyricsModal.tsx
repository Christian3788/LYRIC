import React, { useEffect, useRef } from 'react';
import { X, Mic2, Disc3 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useTrackLyrics } from '../services/lyricsService';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({ isOpen, onClose }) => {
  const { currentTrack, progress, seek, activeEngine } = useAudio();
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const { lyrics, isSynced, source } = useTrackLyrics(currentTrack, activeEngine);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [Math.floor(progress)]);

  if (!isOpen || !currentTrack) return null;

  // Find active line index
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (progress >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  return (
    <div
      id="lyrics-modal"
      className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-xl flex flex-col p-8 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full pb-6 border-b border-[#282828]">
        <div className="flex items-center gap-4">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-lg shadow-lg object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">{currentTrack.title}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                {source === 'lrclib' ? 'LRCLIB Synced' : 'Synced'}
              </span>
            </div>
            <p className="text-sm text-[#a7a7a7]">{currentTrack.artistName} • Synchronized Moving Lyrics</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-[#242424] hover:bg-[#343434] text-white transition-colors"
          title="Close Lyrics"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full overflow-y-auto py-16 space-y-6 custom-scrollbar text-center">
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = progress > line.time;

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => seek(line.time)}
              className={`py-3 px-6 rounded-xl cursor-pointer transition-all duration-300 transform ${
                isActive
                  ? 'text-white text-3xl font-extrabold scale-105 bg-white/5 drop-shadow-md'
                  : isPassed
                  ? 'text-[#636363] text-2xl font-medium hover:text-[#9e9e9e]'
                  : 'text-[#404040] text-2xl font-normal hover:text-[#707070]'
              }`}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-[#727272] py-2 flex items-center justify-center gap-2">
        <Disc3 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
        <span>Click any lyric line to jump playback directly to that position.</span>
      </div>
    </div>
  );
};
