import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sliders,
  RotateCcw,
  Sparkles,
  Zap,
  Volume2,
  Check,
  Headphones,
} from 'lucide-react';
import {
  EQ_FREQUENCIES,
  EQ_PRESETS,
  EqualizerSettings,
  loadEqualizerSettings,
  saveEqualizerSettings,
} from '../services/equalizerService';
import { useAudio } from '../context/AudioContext';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const { isPlaying } = useAudio();
  const [settings, setSettings] = useState<EqualizerSettings>(loadEqualizerSettings);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep settings saved
  const updateSettings = (updater: (prev: EqualizerSettings) => EqualizerSettings) => {
    setSettings(prev => {
      const next = updater(prev);
      saveEqualizerSettings(next);
      return next;
    });
  };

  const handleBandChange = (index: number, val: number) => {
    updateSettings(prev => {
      const newBands = [...prev.bands];
      newBands[index] = val;
      return { ...prev, bands: newBands, preset: 'Custom' };
    });
  };

  const applyPreset = (presetName: string) => {
    const presetBands = EQ_PRESETS[presetName];
    if (presetBands) {
      updateSettings(prev => ({
        ...prev,
        preset: presetName,
        bands: [...presetBands],
      }));
    }
  };

  const resetEQ = () => {
    updateSettings(prev => ({
      ...prev,
      preset: 'Flat',
      bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bassBoost: 0,
      spatial3D: 0,
    }));
  };

  // Animated visualizer curve in canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw 0dB reference line
      const midY = h / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      // Compute curve points based on EQ bands + audio animation jitter if playing
      const points: { x: number; y: number }[] = [];
      const numBands = settings.bands.length;
      const step = w / (numBands + 1);

      for (let i = 0; i < numBands; i++) {
        const x = step * (i + 1);
        const gain = settings.enabled ? settings.bands[i] : 0;
        // Jitter if playing
        const jitter = isPlaying ? Math.sin(phase + i * 0.8) * (2 + settings.bassBoost * 0.05) : 0;
        const normalizedY = midY - (gain / 12) * (h * 0.38) + jitter;
        points.push({ x, y: normalizedY });
      }

      // Draw spline curve
      ctx.beginPath();
      ctx.moveTo(0, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(w, points[points.length - 1].y);

      // Stroke gradient
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#10b981'); // emerald
      grad.addColorStop(0.5, '#06b6d4'); // cyan
      grad.addColorStop(1, '#a855f7'); // purple

      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = settings.enabled ? 12 : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += 0.06;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, settings, isPlaying]);

  if (!isOpen) return null;

  return (
    <div
      id="equalizer-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#141416] border border-[#2a2a2e] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242426] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">Audio Equalizer & DSP</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  10-BAND
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7]">Shape tone, boost low frequencies, and expand spatial acoustics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Master Toggle */}
            <button
              onClick={() => updateSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                settings.enabled
                  ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-md'
                  : 'bg-[#222] text-[#777] border-[#333]'
              }`}
            >
              <span>{settings.enabled ? 'ON' : 'BYPASS'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#222] hover:bg-[#333] text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Frequency Response Graph */}
        <div className="relative rounded-2xl bg-[#0d0d0e] border border-[#222] p-3 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-[#666] font-mono mb-1 px-1">
            <span>+12 dB</span>
            <span className="text-emerald-400 font-bold">Frequency Response Curve</span>
            <span>-12 dB</span>
          </div>
          <canvas ref={canvasRef} width={680} height={110} className="w-full h-28 block rounded-lg" />
        </div>

        {/* Presets Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#888] uppercase tracking-wider">
            <span>Sound Profile Presets</span>
            <button
              onClick={resetEQ}
              className="flex items-center gap-1 text-[11px] text-[#777] hover:text-emerald-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(EQ_PRESETS).map(presetKey => {
              const isSelected = settings.preset === presetKey;
              return (
                <button
                  key={presetKey}
                  onClick={() => applyPreset(presetKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-[#1c1c1f] text-[#bbb] hover:text-white border-[#2c2c30] hover:bg-[#25252a]'
                  }`}
                >
                  {presetKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* 10-Band Sliders Grid */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#888] uppercase tracking-wider">Frequency Bands</div>
          <div className="grid grid-cols-10 gap-1.5 sm:gap-3 bg-[#0d0d0e] p-4 rounded-2xl border border-[#222]">
            {EQ_FREQUENCIES.map((freq, idx) => {
              const gain = settings.bands[idx] ?? 0;
              const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
              return (
                <div key={freq} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold h-4">
                    {gain > 0 ? `+${gain}` : gain}
                  </span>

                  <div className="relative h-36 flex items-center justify-center">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={gain}
                      disabled={!settings.enabled}
                      onChange={e => handleBandChange(idx, parseInt(e.target.value, 10))}
                      className="h-32 w-1.5 accent-emerald-500 cursor-pointer -rotate-90 origin-center bg-[#252528] rounded-full"
                    />
                  </div>

                  <span className="text-[10px] text-[#777] font-mono font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DSP Enhancers: Bass Boost & Spatial 3D Audio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Bass Boost */}
          <div className="bg-[#1c1c1f] border border-[#2a2a2e] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Dynamic Bass Boost</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {settings.bassBoost}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.bassBoost}
              disabled={!settings.enabled}
              onChange={e =>
                updateSettings(prev => ({ ...prev, bassBoost: parseInt(e.target.value, 10) }))
              }
              className="w-full h-2 accent-emerald-500 bg-[#28282d] rounded-full cursor-pointer"
            />
            <p className="text-[11px] text-[#777]">Enhances sub-bass presence and low-end punch without distortion</p>
          </div>

          {/* Spatial 3D Audio */}
          <div className="bg-[#1c1c1f] border border-[#2a2a2e] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold text-white">Spatial 3D Soundstage</span>
              </div>
              <span className="text-xs font-mono font-bold text-teal-400">
                {settings.spatial3D}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.spatial3D}
              disabled={!settings.enabled}
              onChange={e =>
                updateSettings(prev => ({ ...prev, spatial3D: parseInt(e.target.value, 10) }))
              }
              className="w-full h-2 accent-teal-400 bg-[#28282d] rounded-full cursor-pointer"
            />
            <p className="text-[11px] text-[#777]">Widens soundstage width and simulates concert hall acoustic space</p>
          </div>
        </div>
      </div>
    </div>
  );
};
