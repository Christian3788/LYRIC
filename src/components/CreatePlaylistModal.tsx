import React, { useState } from 'react';
import { X, Music2 } from 'lucide-react';
import { Playlist } from '../types';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newPlaylist: Playlist) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPl: Playlist = {
      id: 'pl_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'My custom cloud playlist',
      coverUrl:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      creatorId: 'user_1',
      creatorName: 'You',
      isPublic: true,
      trackIds: ['track_1', 'track_2'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreate(newPl);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
          <h2 className="text-lg font-bold text-white">Create New Playlist</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#282828] text-[#a7a7a7] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a7a7a7] mb-1">
              Playlist Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="My Awesome Mix #1"
              required
              className="w-full bg-[#121212] border border-[#333] rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a7a7a7] mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Give your playlist a catchy description..."
              rows={3}
              className="w-full bg-[#121212] border border-[#333] rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#b3b3b3] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow"
            >
              Save Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
