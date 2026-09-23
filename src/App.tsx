import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { PartyProvider } from './context/PartyContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PlayerBar } from './components/PlayerBar';
import { YouTubePlayer } from './components/YouTubePlayer';
import { QueueDrawer } from './components/QueueDrawer';
import { LyricsModal } from './components/LyricsModal';
import { PartyRoomModal } from './components/PartyRoomModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { EqualizerModal } from './components/EqualizerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { MiniPlayer } from './components/MiniPlayer';
import { EditPlaylistModal } from './components/EditPlaylistModal';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { PlaylistDetailView } from './views/PlaylistDetailView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { LyricsView } from './views/LyricsView';
import { PLAYLISTS } from './data/mockCatalog';
import { Playlist } from './types';
import { useAudio } from './context/AudioContext';

interface NavState {
  view: string;
  id?: string;
}

function MainApp() {
  const {
    sleepTimerRemaining,
    activeSleepTimerMinutes,
    setSleepTimer,
    smoothFade,
    toggleSmoothFade,
  } = useAudio();

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
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [isMiniPlayerOpen, setIsMiniPlayerOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  // Playlists collection
  const [playlists, setPlaylists] = useState<Playlist[]>(PLAYLISTS);

  const handleSavePlaylist = (updated: Playlist) => {
    setPlaylists(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

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
          onSearchChange={q => {
            setSearchQuery(q);
            if (currentNav.view !== 'search') {
              navigateTo('search');
            }
          }}
          onNavigateToSearch={() => {
            if (currentNav.view !== 'search') {
              navigateTo('search');
            }
          }}
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
              onNavigateSearch={(term?: string) => {
                if (term) setSearchQuery(term);
                navigateTo('search');
              }}
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
              onEditPlaylist={p => setEditingPlaylist(p)}
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

          {currentNav.view === 'lyrics' && (
            <LyricsView
              onNavigateArtist={id => navigateTo('artist', id)}
              onNavigateAlbum={id => navigateTo('album', id)}
            />
          )}
        </main>
      </div>

      {/* 3. Persistent Global Audio Player Bar (never unmounts during route changes) */}
      <YouTubePlayer />
      <PlayerBar
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenLyrics={() => {
          if (currentNav.view === 'lyrics') {
            goBack();
          } else {
            navigateTo('lyrics');
          }
        }}
        isLyricsActive={currentNav.view === 'lyrics'}
        onOpenParty={() => setIsPartyOpen(true)}
        onOpenEqualizer={() => setIsEqualizerOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        onToggleMiniPlayer={() => setIsMiniPlayerOpen(prev => !prev)}
        isMiniPlayerOpen={isMiniPlayerOpen}
        onNavigateArtist={id => navigateTo('artist', id)}
        onNavigateAlbum={id => navigateTo('album', id)}
      />

      {/* 4. Active Modals & Floating Overlays */}
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <LyricsModal isOpen={isLyricsOpen} onClose={() => setIsLyricsOpen(false)} />
      <PartyRoomModal isOpen={isPartyOpen} onClose={() => setIsPartyOpen(false)} />
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />
      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
      />
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        activeTimerMinutes={activeSleepTimerMinutes}
        remainingSeconds={sleepTimerRemaining}
        onSetTimer={setSleepTimer}
        smoothFade={smoothFade}
        onToggleSmoothFade={toggleSmoothFade}
      />
      <MiniPlayer
        isOpen={isMiniPlayerOpen}
        onClose={() => setIsMiniPlayerOpen(false)}
        onExpand={() => {
          setIsMiniPlayerOpen(false);
          navigateTo('lyrics');
        }}
      />
      <EditPlaylistModal
        isOpen={!!editingPlaylist}
        playlist={editingPlaylist}
        onClose={() => setEditingPlaylist(null)}
        onSave={handleSavePlaylist}
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
