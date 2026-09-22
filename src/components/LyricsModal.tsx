import React, { useEffect, useRef } from 'react';
import { X, Mic2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({ isOpen, onClose }) => {
  const { currentTrack, progress, seek } = useAudio();
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [Math.floor(progress)]);

  if (!isOpen || !currentTrack) return null;

  const lyrics = currentTrack.lyrics || [
    { time: 0, text: `♪ Instrumental vibes for ${currentTrack.title} ♪` },
    { time: 15, text: `Feel the rhythm and frequency wave...` },
    { time: 30, text: `High-fidelity 44.1kHz stereo audio stream` },
    { time: 45, text: `♪ (Solo & Outro) ♪` },
  ];

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
            <h2 className="text-2xl font-bold text-white tracking-tight">{currentTrack.title}</h2>
            <p className="text-sm text-[#a7a7a7]">{currentTrack.artistName} • Synced Lyrics</p>
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

      <div className="text-center text-xs text-[#727272] py-2">
        Tip: Click any lyric line to jump playback directly to that position.
      </div>
    </div>
  );
};
