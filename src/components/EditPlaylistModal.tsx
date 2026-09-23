import React, { useState } from 'react';
import { X, Image as ImageIcon, Palette, Check, Sparkles } from 'lucide-react';
import { Playlist } from '../types';

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
  onSave: (updated: Playlist) => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
];

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlist,
  onSave,
}) => {
  if (!isOpen || !playlist) return null;

  const [title, setTitle] = useState(playlist.title);
  const [description, setDescription] = useState(playlist.description || '');
  const [coverUrl, setCoverUrl] = useState(playlist.coverUrl);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...playlist,
      title: title.trim(),
      description: description.trim(),
      coverUrl,
    });
    onClose();
  };

  return (
    <div
      id="edit-playlist-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#161619] border border-[#2a2a2e] rounded-3xl p-6 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242426] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Edit Playlist Details</h2>
              <p className="text-xs text-[#a7a7a7]">Customize cover artwork, name, and description</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#222] hover:bg-[#333] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex gap-4 items-start">
            {/* Current Cover Preview */}
            <div className="relative group flex-shrink-0">
              <img
                src={coverUrl}
                alt="Cover Preview"
                className="w-28 h-28 rounded-2xl object-cover shadow-xl border border-[#333]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="My Playlist"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#202024] border border-[#333] text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add an optional description..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#202024] border border-[#333] text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Select Preset Cover Art */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-[#888] uppercase tracking-wider">
              Choose Preset Artwork
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COVERS.map((url, i) => {
                const isSelected = coverUrl === url;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverUrl(url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-transform hover:scale-105 ${
                      isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Image URL */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#888] uppercase tracking-wider">
              Or Custom Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={e => setCustomUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#202024] border border-[#333] text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUrlInput.trim()) {
                    setCoverUrl(customUrlInput.trim());
                    setCustomUrlInput('');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-[#28282e] hover:bg-[#34343d] text-white text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Save & Cancel */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#242426]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#888] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
