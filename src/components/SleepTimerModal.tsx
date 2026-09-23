import React from 'react';
import { X, Moon, Clock, Check, VolumeX, Sparkles } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTimerMinutes: number | null; // null if none, -1 if end of track
  remainingSeconds: number | null;
  onSetTimer: (minutes: number | null, isEndOfTrack?: boolean) => void;
  smoothFade: boolean;
  onToggleSmoothFade: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeTimerMinutes,
  remainingSeconds,
  onSetTimer,
  smoothFade,
  onToggleSmoothFade,
}) => {
  if (!isOpen) return null;

  const timerOptions = [
    { label: '5 minutes', minutes: 5 },
    { label: '15 minutes', minutes: 15 },
    { label: '30 minutes', minutes: 30 },
    { label: '45 minutes', minutes: 45 },
    { label: '1 hour', minutes: 60 },
    { label: 'End of current track', minutes: -1, isEndOfTrack: true },
  ];

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      id="sleep-timer-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#161618] border border-[#2a2a2e] rounded-3xl p-6 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242426] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Moon className="w-5 h-5 fill-indigo-400/20" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Sleep Timer</h2>
              <p className="text-xs text-[#a7a7a7]">Fall asleep peacefully with auto-stop and gentle fade</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#222] hover:bg-[#333] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Timer Indicator */}
        {remainingSeconds !== null && remainingSeconds > 0 && (
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  Timer Running
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatRemaining(remainingSeconds)}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSetTimer(null)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-1.5">
          {timerOptions.map(opt => {
            const isSelected =
              opt.isEndOfTrack
                ? activeTimerMinutes === -1
                : activeTimerMinutes === opt.minutes;

            return (
              <button
                key={opt.label}
                onClick={() => {
                  onSetTimer(opt.minutes, opt.isEndOfTrack);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-sm transition-all border ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-bold'
                    : 'bg-[#1e1e22] text-[#ccc] hover:text-white border-transparent hover:border-[#333]'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            );
          })}
        </div>

        {/* Smooth Fade Toggle */}
        <div
          onClick={onToggleSmoothFade}
          className="flex items-center justify-between p-3 rounded-2xl bg-[#1e1e22] border border-[#2a2a2e] cursor-pointer hover:bg-[#25252a] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-xs font-bold text-white">Smooth Volume Fade-Out</div>
              <div className="text-[11px] text-[#777]">Gently lowers volume over the last 30s before pause</div>
            </div>
          </div>

          <div
            className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              smoothFade ? 'bg-indigo-500' : 'bg-[#333]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                smoothFade ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
