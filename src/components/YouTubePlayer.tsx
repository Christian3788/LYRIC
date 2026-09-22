import React, { useState } from 'react';
import {
  Minimize2,
  Maximize2,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const YouTubePlayer: React.FC = () => {
  const { currentTrack, activeEngine, isVideoOpen, closeVideo, toggleVideo } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasYouTubeVideo = Boolean(currentTrack?.youtubeId || currentTrack?.isYouTube);

  // We keep the IFrame mounted in DOM so audio never stops and player instance stays alive
  return (
    <div
      id="youtube-player-container"
      className={`fixed transition-all duration-300 z-40 select-none ${
        // When video is active and open:
        isVideoOpen && hasYouTubeVideo
          ? isExpanded
            ? 'inset-4 md:inset-12 bg-black/95 rounded-2xl shadow-2xl flex flex-col p-4 border border-[#333]'
            : 'bottom-28 right-6 w-[340px] sm:w-[400px] h-[260px] sm:h-[285px] bg-[#141414] rounded-xl shadow-2xl flex flex-col border border-red-500/30 overflow-hidden'
          : hasYouTubeVideo && activeEngine === 'youtube'
          ? 'bottom-28 right-6 w-[200px] h-[40px] opacity-0 pointer-events-none' // invisible keep-alive when playing audio in background
          : 'hidden'
      }`}
    >
      {/* Header bar when visible */}
      {isVideoOpen && hasYouTubeVideo && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-[#282828] text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] tracking-wider">
              YOUTUBE
            </span>
            <span className="text-white font-semibold truncate max-w-[180px] sm:max-w-[240px]">
              {currentTrack?.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#a7a7a7]">
            {currentTrack?.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-white transition-colors"
                title="Open on YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:text-white transition-colors"
              title={isExpanded ? 'Restore' : 'Expand Video'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={closeVideo}
              className="p-1 hover:text-white hover:bg-red-500/20 rounded transition-colors"
              title="Close Video Window"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Official YouTube IFrame Mount Target */}
      <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <div id="youtube-player-mount" className="w-full h-full" />
      </div>

      {/* Mini footer status when visible in window */}
      {isVideoOpen && hasYouTubeVideo && !isExpanded && (
        <div className="px-3 py-1.5 bg-[#121212] border-t border-[#222] flex items-center justify-between text-[11px] text-[#888]">
          <span className="truncate">
            {currentTrack?.channelName || currentTrack?.artistName}
          </span>
          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> Official Stream
          </span>
        </div>
      )}
    </div>
  );
};
