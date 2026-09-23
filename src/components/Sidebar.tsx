import React from 'react';
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  Terminal,
  Compass,
  Music2,
  Radio,
  Mic2,
} from 'lucide-react';
import { Playlist } from '../types';
import { useAudio } from '../context/AudioContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string, id?: string) => void;
  playlists: Playlist[];
  onCreatePlaylist: () => void;
  onOpenArchitecture: () => void;
  onOpenParty: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  playlists,
  onCreatePlaylist,
  onOpenArchitecture,
  onOpenParty,
}) => {
  const { currentTrack, isPlaying } = useAudio();
  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-black flex flex-col h-full border-r border-[#1f1f1f] text-[#b3b3b3] select-none p-3 gap-2"
    >
      {/* 1. Main Navigation Block */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        {/* Brand Header */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-white font-bold text-lg cursor-pointer group px-1"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 fill-black" />
          </div>
          <span className="tracking-tight text-xl font-bold bg-gradient-to-r from-white to-[#d4d4d4] bg-clip-text text-transparent">
            DOODLE
          </span>
        </div>

        <nav className="flex flex-col gap-1 pt-1">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'home' ? 'text-white bg-[#282828]' : 'hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            id="nav-search-btn"
            onClick={() => onNavigate('search')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'search' ? 'text-white bg-[#282828]' : 'hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>

          <button
            id="nav-lyrics-btn"
            onClick={() => onNavigate('lyrics')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'lyrics' ? 'text-white bg-[#282828]' : 'hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <Mic2 className={`w-5 h-5 ${currentView === 'lyrics' ? 'text-emerald-400' : ''}`} />
              <span>Lyrics</span>
            </div>
            {currentTrack && isPlaying && (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SYNC
              </span>
            )}
          </button>

          <button
            id="nav-party-btn"
            onClick={onOpenParty}
            className="flex items-center justify-between px-3 py-2.5 rounded-md font-semibold text-sm transition-colors text-emerald-400 hover:text-emerald-300 hover:bg-[#1a2e22]/50"
          >
            <div className="flex items-center gap-4">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>Party Room</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
              LIVE
            </span>
          </button>
        </nav>
      </div>

      {/* 2. Library & Playlists Block */}
      <div className="bg-[#121212] rounded-lg p-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <button
            id="nav-library-btn"
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-3 font-semibold text-sm transition-colors ${
              currentView === 'library' ? 'text-white' : 'hover:text-white'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </button>

          <button
            id="create-playlist-btn"
            onClick={onCreatePlaylist}
            className="p-1 rounded-full hover:bg-[#282828] text-[#b3b3b3] hover:text-white transition-colors"
            title="Create Playlist"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Links: Liked Songs */}
        <div className="flex flex-col gap-1 pb-3 border-b border-[#282828]">
          <button
            id="nav-liked-songs-btn"
            onClick={() => onNavigate('liked')}
            className={`flex items-center gap-3 px-2 py-2 rounded-md font-medium text-sm transition-colors ${
              currentView === 'liked' ? 'text-white bg-[#282828]' : 'hover:text-white'
            }`}
          >
            <div className="w-7 h-7 rounded bg-gradient-to-br from-indigo-600 to-emerald-400 flex items-center justify-center text-white flex-shrink-0">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="truncate">Liked Songs</span>
          </button>
        </div>

        {/* Playlist List (Scrollable) */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-1 custom-scrollbar">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[#727272] px-2 py-1">
            Playlists
          </div>
          {playlists.map(pl => (
            <button
              key={pl.id}
              onClick={() => onNavigate('playlist', pl.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm truncate block transition-colors ${
                currentView === 'playlist' ? 'text-white hover:bg-[#282828]' : 'text-[#a7a7a7] hover:text-white'
              }`}
            >
              {pl.title}
            </button>
          ))}
        </div>

        {/* 3. Bottom Architecture & System Specs Inspector Trigger */}
        <div className="pt-3 border-t border-[#282828] mt-2">
          <button
            id="open-architecture-btn"
            onClick={onOpenArchitecture}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#1c221e] to-[#171f26] border border-emerald-500/30 hover:border-emerald-500/60 text-white text-xs font-semibold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-white leading-tight">System Blueprint</span>
              <span className="text-[10px] text-emerald-400 font-mono">Postgres • Go 206 • Docker</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};
