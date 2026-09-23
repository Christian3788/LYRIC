import React from 'react';
import {
  X,
  Trash2,
  Sparkles,
  Play,
  ArrowUp,
  ArrowDown,
  Music,
  GripVertical,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    playTrack,
    jumpToQueueIndex,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    injectRecommendedTracks,
  } = useAudio();

  if (!isOpen) return null;

  const upcomingTracks = queue.slice(queueIndex + 1);

  const moveTrack = (fromQueueIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? fromQueueIdx - 1 : fromQueueIdx + 1;
    if (targetIdx <= queueIndex || targetIdx >= queue.length) return;
    reorderQueue(fromQueueIdx, targetIdx);
  };

  return (
    <div
      id="queue-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        id="queue-drawer"
        className="w-full max-w-md bg-[#121212] border-l border-[#282828] h-full flex flex-col shadow-2xl p-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#282828]">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Play Queue</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#242424] text-[#a7a7a7]">
              {queue.length} tracks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearQueue}
              className="p-1.5 rounded-full hover:bg-[#282828] text-[#a7a7a7] hover:text-white transition-colors"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#282828] text-[#a7a7a7] hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Queue Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar pr-1">
          {/* Now Playing Block */}
          {currentTrack && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a7a7a7]">
                Now Playing
              </span>
              <div className="flex items-center gap-3.5 p-2.5 rounded-lg bg-[#242424] border border-emerald-500/30">
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                      <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce" />
                      <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-emerald-400 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-xs text-[#b3b3b3] truncate">
                    {currentTrack.artistName}
                  </div>
                </div>
                <div className="text-xs font-mono text-[#a7a7a7]">
                  {formatTime(currentTrack.durationSeconds)}
                </div>
              </div>
            </div>
          )}

          {/* Next From Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a7a7a7]">
                Next in Queue ({upcomingTracks.length})
              </span>
              <button
                onClick={injectRecommendedTracks}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                title="Inject 3 smart track suggestions"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add Smart Picks</span>
              </button>
            </div>

            {upcomingTracks.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#727272] border border-dashed border-[#282828] rounded-lg">
                Your queue is empty. Click "Add Smart Picks" or browse tracks to queue them!
              </div>
            ) : (
              <div className="space-y-1.5">
                {upcomingTracks.map((track, relativeIdx) => {
                  const actualIdx = queueIndex + 1 + relativeIdx;
                  return (
                    <div
                      key={`${track.id}_${actualIdx}`}
                      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-[#202020] transition-colors"
                    >
                      <div className="flex items-center gap-1 text-[#727272] group-hover:text-white">
                        <GripVertical className="w-4 h-4 cursor-grab" />
                      </div>

                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                          {track.title}
                        </div>
                        <div className="text-xs text-[#a7a7a7] truncate">
                          {track.artistName}
                        </div>
                      </div>

                      {/* Controls: Move Up/Down, Play Immediately, Remove */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {relativeIdx > 0 && (
                          <button
                            onClick={() => moveTrack(actualIdx, 'up')}
                            className="p-1 hover:bg-[#2e2e2e] rounded text-[#a7a7a7] hover:text-white"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {relativeIdx < upcomingTracks.length - 1 && (
                          <button
                            onClick={() => moveTrack(actualIdx, 'down')}
                            className="p-1 hover:bg-[#2e2e2e] rounded text-[#a7a7a7] hover:text-white"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => jumpToQueueIndex(actualIdx)}
                          className="p-1 hover:bg-[#2e2e2e] rounded text-[#a7a7a7] hover:text-white"
                          title="Play Now"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromQueue(actualIdx)}
                          className="p-1 hover:bg-[#2e2e2e] rounded text-[#a7a7a7] hover:text-rose-400"
                          title="Remove from Queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-mono text-[#727272] w-8 text-right">
                        {formatTime(track.durationSeconds)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
