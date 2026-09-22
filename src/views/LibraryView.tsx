import React, { useState } from 'react';
import { Heart, Plus, Music, User } from 'lucide-react';
import { Playlist, Artist } from '../types';
import { ARTISTS, TRACKS } from '../data/mockCatalog';

interface LibraryViewProps {
  playlists: Playlist[];
  onNavigatePlaylist: (id: string) => void;
  onNavigateArtist: (id: string) => void;
  onCreatePlaylist: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  playlists,
  onNavigatePlaylist,
  onNavigateArtist,
  onCreatePlaylist,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'artists'>('all');

  return (
    <div id="library-view" className="p-6 md:p-8 space-y-6 pb-20">
      {/* 1. Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white tracking-tight">Your Library</h1>
        <button
          onClick={onCreatePlaylist}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2">
        {(['all', 'playlists', 'artists'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              activeFilter === filter
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#303030]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Library Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Liked Songs Special Card */}
        {(activeFilter === 'all' || activeFilter === 'playlists') && (
          <div
            onClick={() => onNavigatePlaylist('liked')}
            className="group p-4 rounded-xl bg-gradient-to-br from-indigo-700 via-purple-800 to-emerald-600 hover:scale-102 transition-all cursor-pointer flex flex-col justify-end h-56 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Liked Songs</h3>
              <p className="text-xs text-white/80 mt-1">5 auto-saved tracks</p>
            </div>
          </div>
        )}

        {/* Custom Playlists */}
        {(activeFilter === 'all' || activeFilter === 'playlists') &&
          playlists.map(playlist => (
            <div
              key={playlist.id}
              onClick={() => onNavigatePlaylist(playlist.id)}
              className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer flex flex-col"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-full aspect-square rounded-lg object-cover mb-3 shadow-md group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-sm text-white truncate group-hover:text-emerald-400">
                {playlist.title}
              </span>
              <span className="text-xs text-[#a7a7a7] mt-0.5">
                Playlist • {playlist.creatorName}
              </span>
            </div>
          ))}

        {/* Followed Artists */}
        {(activeFilter === 'all' || activeFilter === 'artists') &&
          ARTISTS.map(artist => (
            <div
              key={artist.id}
              onClick={() => onNavigateArtist(artist.id)}
              className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border border-[#282828] shadow-md">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-sm text-white truncate w-full group-hover:text-emerald-400">
                {artist.name}
              </span>
              <span className="text-xs text-[#a7a7a7] mt-0.5">Artist</span>
            </div>
          ))}
      </div>
    </div>
  );
};
