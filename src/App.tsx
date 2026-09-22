import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { PartyProvider } from './context/PartyContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PlayerBar } from './components/PlayerBar';
import { QueueDrawer } from './components/QueueDrawer';
import { LyricsModal } from './components/LyricsModal';
import { PartyRoomModal } from './components/PartyRoomModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { PlaylistDetailView } from './views/PlaylistDetailView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { PLAYLISTS } from './data/mockCatalog';
import { Playlist } from './types';

interface NavState {
  view: string;
  id?: string;
}

function MainApp() {
  // Navigation stack
  const [navHistory, setNavHistory] = useState<NavState[]>([{ view: 'home' }]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const currentNav = navHistory[historyIdx] || { view: 'home' };

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  // Playlists collection
  const [playlists, setPlaylists] = useState<Playlist[]>(PLAYLISTS);

  const navigateTo = (view: string, id?: string) => {
    // Truncate future history and push new state
    const newStack = navHistory.slice(0, historyIdx + 1);
    newStack.push({ view, id });
    setNavHistory(newStack);
    setHistoryIdx(newStack.length - 1);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
    }
  };

  const goForward = () => {
    if (historyIdx < navHistory.length - 1) {
      setHistoryIdx(historyIdx + 1);
    }
  };

  const handleCreatePlaylist = (newPl: Playlist) => {
    setPlaylists(prev => [newPl, ...prev]);
    navigateTo('playlist', newPl.id);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans antialiased select-none">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentView={currentNav.view}
        onNavigate={navigateTo}
        playlists={playlists}
        onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        onOpenArchitecture={() => setIsArchOpen(true)}
        onOpenParty={() => setIsPartyOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#121212] overflow-hidden relative">
        {/* Sticky Top Navbar */}
        <Navbar
          currentView={currentNav.view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenParty={() => setIsPartyOpen(true)}
          onOpenArchitecture={() => setIsArchOpen(true)}
          onGoBack={goBack}
          onGoForward={goForward}
          canGoBack={historyIdx > 0}
          canGoForward={historyIdx < navHistory.length - 1}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentNav.view === 'home' && (
            <HomeView
              onNavigatePlaylist={id => navigateTo('playlist', id)}
              onNavigateArtist={id => navigateTo('artist', id)}
              onNavigateAlbum={id => navigateTo('album', id)}
              onOpenParty={() => setIsPartyOpen(true)}
            />
          )}

          {currentNav.view === 'search' && (
            <SearchView
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onNavigateArtist={id => navigateTo('artist', id)}
              onNavigateAlbum={id => navigateTo('album', id)}
              onNavigatePlaylist={id => navigateTo('playlist', id)}
            />
          )}

          {currentNav.view === 'library' && (
            <LibraryView
              playlists={playlists}
              onNavigatePlaylist={id => navigateTo('playlist', id)}
              onNavigateArtist={id => navigateTo('artist', id)}
              onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            />
          )}

          {currentNav.view === 'playlist' && (
            <PlaylistDetailView
              playlistId={currentNav.id || 'playlist_1'}
              onNavigateArtist={id => navigateTo('artist', id)}
              onNavigateAlbum={id => navigateTo('album', id)}
            />
          )}

          {currentNav.view === 'liked' && (
            <PlaylistDetailView
              playlistId="liked"
              onNavigateArtist={id => navigateTo('artist', id)}
              onNavigateAlbum={id => navigateTo('album', id)}
            />
          )}

          {currentNav.view === 'artist' && (
            <ArtistDetailView
              artistId={currentNav.id || 'artist_1'}
              onNavigateAlbum={id => navigateTo('album', id)}
            />
          )}

          {currentNav.view === 'album' && (
            <AlbumDetailView
              albumId={currentNav.id || 'album_1'}
              onNavigateArtist={id => navigateTo('artist', id)}
            />
          )}
        </main>
      </div>

      {/* 3. Persistent Global Audio Player Bar (never unmounts during route changes) */}
      <PlayerBar
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenParty={() => setIsPartyOpen(true)}
        onNavigateArtist={id => navigateTo('artist', id)}
        onNavigateAlbum={id => navigateTo('album', id)}
      />

      {/* 4. Active Modals & Slide-overs */}
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <LyricsModal isOpen={isLyricsOpen} onClose={() => setIsLyricsOpen(false)} />
      <PartyRoomModal isOpen={isPartyOpen} onClose={() => setIsPartyOpen(false)} />
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <PartyProvider>
        <MainApp />
      </PartyProvider>
    </AudioProvider>
  );
}
