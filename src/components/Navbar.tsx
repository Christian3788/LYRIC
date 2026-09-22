import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Radio,
  Cpu,
  User as UserIcon,
} from 'lucide-react';
import { useParty } from '../context/PartyContext';

interface NavbarProps {
  currentView: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenParty: () => void;
  onOpenArchitecture: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onOpenParty,
  onOpenArchitecture,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
}) => {
  const { isInParty, room, isHost } = useParty();

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 h-16 bg-[#121212]/90 backdrop-blur-md px-6 flex items-center justify-between border-b border-[#282828]/50"
    >
      {/* 1. Left: Navigation History (Back / Forward) */}
      <div className="flex items-center gap-2">
        <button
          id="nav-back-btn"
          onClick={onGoBack}
          disabled={!canGoBack}
          className={`w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white transition-opacity ${
            canGoBack ? 'hover:bg-black cursor-pointer' : 'opacity-40 cursor-not-allowed'
          }`}
          title="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          id="nav-forward-btn"
          onClick={onGoForward}
          disabled={!canGoForward}
          className={`w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white transition-opacity ${
            canGoForward ? 'hover:bg-black cursor-pointer' : 'opacity-40 cursor-not-allowed'
          }`}
          title="Go forward"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 2. Middle-Left: Instant Search Bar (shown when on Search or always available) */}
        {currentView === 'search' && (
          <div className="relative ml-3 w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a7a7a7]" />
            <input
              id="navbar-search-input"
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm text-white placeholder-[#727272] pl-10 pr-9 py-2 rounded-full outline-none border border-transparent focus:border-white/30 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a7a7a7] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Right: Quick Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Listen Along Status Pill */}
        {isInParty ? (
          <button
            id="navbar-party-active-btn"
            onClick={onOpenParty}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Room: {room?.name || 'Party'}</span>
            <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {room?.members.length || 1} online
            </span>
          </button>
        ) : (
          <button
            id="navbar-party-join-btn"
            onClick={onOpenParty}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#2f2f2f] text-white text-xs font-semibold transition-colors border border-[#3e3e3e]"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Party Mode</span>
          </button>
        )}

        {/* Architecture Specs Blueprint Button */}
        <button
          id="navbar-arch-btn"
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>System Blueprint</span>
        </button>

        {/* Profile Avatar */}
        <div
          id="navbar-profile-btn"
          className="w-8 h-8 rounded-full bg-[#282828] hover:bg-[#383838] border border-[#3e3e3e] flex items-center justify-center text-white cursor-pointer shadow transition-colors"
          title="Account Settings"
        >
          <UserIcon className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
