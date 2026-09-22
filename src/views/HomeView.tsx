import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Radio, Sparkles, Globe, RefreshCw, Music, Disc, Download, ShieldCheck, Video, Headphones } from 'lucide-react';
import { TRACKS, PLAYLISTS, ARTISTS, ALBUMS } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatCompactNumber, formatTime } from '../utils/formatters';
import { fetchRealSongs, fetchTopCharts } from '../services/realSongsService';
import { searchFMATracks, downloadFMATrack } from '../services/fmaService';
import { fetchTrendingYouTubeMusic, searchYouTubeMusic } from '../services/youtubeService';
import { fetchTrendingAudius, AUDIUS_POPULAR_GENRES } from '../services/audiusService';
import { Track } from '../types';

interface HomeViewProps {
  onNavigatePlaylist: (id: string) => void;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
  onOpenParty: () => void;
  onNavigateSearch?: (query?: string) => void;
  onNavigateFMA?: () => void;
}

const REAL_ARTIST_PRESETS = [
  'Top Global Hits',
  'Taylor Swift',
  'The Weeknd',
  'Billie Eilish',
  'Kendrick Lamar',
  'Dua Lipa',
  'Post Malone',
  'Coldplay',
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigatePlaylist,
  onNavigateArtist,
  onNavigateAlbum,
  onOpenParty,
  onNavigateSearch,
  onNavigateFMA,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue, openVideo, closeVideo } = useAudio();
  const [realSongs, setRealSongs] = useState<Track[]>([]);
  const [isLoadingReal, setIsLoadingReal] = useState(false);
  const [selectedArtistPreset, setSelectedArtistPreset] = useState('Top Global Hits');

  // YouTube Music & Video state
  const [youtubeTracks, setYoutubeTracks] = useState<Track[]>([]);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [selectedYTPreset, setSelectedYTPreset] = useState('Trending');

  const YOUTUBE_PRESETS = [
    { label: 'Trending', query: '' },
    { label: 'Taylor Swift', query: 'Taylor Swift' },
    { label: 'The Weeknd', query: 'The Weeknd' },
    { label: 'Billie Eilish', query: 'Billie Eilish' },
    { label: 'Kendrick Lamar', query: 'Kendrick Lamar' },
    { label: 'Dua Lipa', query: 'Dua Lipa' },
    { label: 'Sabrina Carpenter', query: 'Sabrina Carpenter' },
  ];

  const loadYouTubeTracks = async (query: string, label: string) => {
    setIsLoadingYouTube(true);
    setSelectedYTPreset(label);
    try {
      let tracks: Track[] = [];
      if (!query) {
        tracks = await fetchTrendingYouTubeMusic(12);
      } else {
        tracks = await searchYouTubeMusic(`${query} official music video`, 12);
      }
      setYoutubeTracks(tracks);
    } catch (e) {
      console.warn('Failed to load YouTube tracks:', e);
    } finally {
      setIsLoadingYouTube(false);
    }
  };

  // Free Music Archive state
  const [fmaTracks, setFmaTracks] = useState<Track[]>([]);
  const [isLoadingFMA, setIsLoadingFMA] = useState(false);
  const [selectedFMAGenre, setSelectedFMAGenre] = useState('electronic');
  const [downloadingFMAId, setDownloadingFMAId] = useState<string | null>(null);

  const FMA_PRESETS = [
    { label: 'Electronic', query: 'electronic' },
    { label: 'Ambient', query: 'ambient' },
    { label: 'Jazz', query: 'jazz' },
    { label: 'Indie Rock', query: 'rock' },
    { label: 'Hip-Hop', query: 'hip-hop' },
    { label: 'Classical', query: 'classical' },
    { label: 'Lo-Fi Chill', query: 'chill' },
  ];

  const loadFMATracks = async (genre: string) => {
    setIsLoadingFMA(true);
    setSelectedFMAGenre(genre);
    try {
      const tracks = await searchFMATracks(genre, 12);
      setFmaTracks(tracks);
    } catch (e) {
      console.warn('Failed to load FMA tracks:', e);
    } finally {
      setIsLoadingFMA(false);
    }
  };

  // Load real songs, FMA tracks, and YouTube tracks on mount
  useEffect(() => {
    loadRealSongs('Top Global Hits');
    loadFMATracks('electronic');
    loadYouTubeTracks('', 'Trending');
    loadAudiusTracks('All');
  }, []);

  // Audius state
  const [audiusTracks, setAudiusTracks] = useState<Track[]>([]);
  const [isLoadingAudius, setIsLoadingAudius] = useState(false);
  const [selectedAudiusGenre, setSelectedAudiusGenre] = useState('All');

  const loadAudiusTracks = async (genre: string = 'All') => {
    setIsLoadingAudius(true);
    setSelectedAudiusGenre(genre);
    try {
      const tracks = await fetchTrendingAudius(12, genre);
      setAudiusTracks(tracks);
    } catch (e) {
      console.warn('Failed to load Audius tracks:', e);
    } finally {
      setIsLoadingAudius(false);
    }
  };

  const loadRealSongs = async (preset: string) => {
    setIsLoadingReal(true);
    setSelectedArtistPreset(preset);
    try {
      let tracks: Track[] = [];
      if (preset === 'Top Global Hits') {
        tracks = await fetchTopCharts();
        if (tracks.length === 0) {
          tracks = await fetchRealSongs('billboard top hits', 18);
        }
      } else {
        tracks = await fetchRealSongs(preset, 18);
      }
      setRealSongs(tracks.slice(0, 12));
    } catch (e) {
      console.warn('Failed to load real songs:', e);
    } finally {
      setIsLoadingReal(false);
    }
  };

  // Greeting based on hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quickGridItems = [
    { id: 'liked', title: 'Liked Songs', coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80', isSpecial: true },
    { id: 'playlist_1', title: "Today's Top Hits", coverUrl: PLAYLISTS[0]?.coverUrl },
    { id: 'playlist_2', title: 'RapCaviar', coverUrl: PLAYLISTS[1]?.coverUrl },
    { id: 'playlist_3', title: 'Pop Royalty', coverUrl: PLAYLISTS[2]?.coverUrl },
    { id: ALBUMS[0]?.id || 'album_1', title: ALBUMS[0]?.title || 'Featured Album', coverUrl: ALBUMS[0]?.coverUrl, isAlbum: true },
    { id: ALBUMS[1]?.id || 'album_2', title: ALBUMS[1]?.title || 'Trending Album', coverUrl: ALBUMS[1]?.coverUrl, isAlbum: true },
  ];

  return (
    <div id="home-view" className="p-6 md:p-8 space-y-10 pb-20">
      {/* 1. Header & Live Party Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          {greeting}
        </h1>

        <div className="flex items-center gap-3">
          {onNavigateSearch && (
            <button
              onClick={() => onNavigateSearch('top hits')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#202020] hover:bg-[#2b2b2b] text-white text-xs font-semibold border border-[#303030] transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Search Real Music</span>
            </button>
          )}

          <button
            onClick={onOpenParty}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition-all shadow-sm w-fit"
          >
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>Party Room Active • 2+ Listeners Synced</span>
          </button>
        </div>
      </div>

      {/* 2. Quick 6 Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickGridItems.map(item => {
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.isAlbum) onNavigateAlbum(item.id);
                else onNavigatePlaylist(item.id);
              }}
              className="group relative flex items-center bg-[#242424]/70 hover:bg-[#303030] rounded-md overflow-hidden cursor-pointer transition-all duration-200 shadow-md"
            >
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-16 h-16 object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-sm text-white px-4 truncate flex-1">
                {item.title}
              </span>

              {/* Hover Play Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  playTrack(TRACKS[0], TRACKS);
                }}
                className="absolute right-4 w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-200"
                title="Play"
              >
                <Play className="w-5 h-5 fill-black translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 3. REAL SONGS SECTION: Live Worldwide Stream Previews */}
      <section className="space-y-4 bg-gradient-to-b from-[#1b2620]/40 to-transparent p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Real Global Hits
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  LIVE HQ AUDIO
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7]">
                Genuine songs fetched from global music charts with authentic audio playback
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadRealSongs(selectedArtistPreset)}
              disabled={isLoadingReal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#303030] text-[#d4d4d4] hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
              title="Refresh real songs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReal ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Fetch Real Songs</span>
            </button>
          </div>
        </div>

        {/* Real Artist Quick Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {REAL_ARTIST_PRESETS.map(preset => {
            const isSelected = selectedArtistPreset === preset;
            return (
              <button
                key={preset}
                onClick={() => loadRealSongs(preset)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-[#222222] text-[#d4d4d4] hover:bg-[#303030] hover:text-white border border-[#2e2e2e]'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>

        {/* Real Songs Grid */}
        {isLoadingReal ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#a7a7a7] font-medium">
              Fetching real songs & audio streams for {selectedArtistPreset}...
            </span>
          </div>
        ) : realSongs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#888] bg-[#161616] rounded-xl">
            Click "Fetch Real Songs" above to retrieve live songs from the global catalog.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-1">
            {realSongs.map(track => {
              const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, realSongs)}
                  className="group p-3 rounded-lg bg-[#181818] hover:bg-[#242424] transition-all duration-200 cursor-pointer flex flex-col relative border border-transparent hover:border-emerald-500/20"
                >
                  <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2.5 bg-[#282828] shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-bold text-emerald-300">
                      REAL
                    </span>

                    {/* Play trigger button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (currentTrack?.id === track.id) togglePlayPause();
                        else playTrack(track, realSongs);
                      }}
                      className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transition-all duration-200 ${
                        isThisTrackPlaying
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                      }`}
                      title={isThisTrackPlaying ? 'Pause' : 'Play real song'}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-black" />
                      ) : (
                        <Play className="w-4 h-4 fill-black translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <span className="font-semibold text-xs text-white truncate group-hover:text-emerald-400 transition-colors" title={track.title}>
                    {track.title}
                  </span>
                  <span className="text-[11px] text-[#a7a7a7] truncate mt-0.5" title={track.artistName}>
                    {track.artistName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3.5. FREE MUSIC ARCHIVE (FMA) SHELF */}
      <section className="space-y-4 bg-gradient-to-br from-amber-950/30 via-[#191715] to-[#121212] p-5 md:p-6 rounded-2xl border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Disc className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Free Music Archive
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  FULL TRACKS (CC)
                </span>
              </div>
              <p className="text-xs text-[#a09a90]">
                Stream & download full-length Creative Commons music from independent artists
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateFMA && (
              <button
                onClick={onNavigateFMA}
                className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Browse All FMA</span>
              </button>
            )}
            <button
              onClick={() => loadFMATracks(selectedFMAGenre)}
              disabled={isLoadingFMA}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#24211e] hover:bg-[#302c28] text-[#d4cdc5] hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
              title="Refresh FMA tracks"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFMA ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* FMA Genre Quick Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {FMA_PRESETS.map(preset => {
            const isSelected = selectedFMAGenre === preset.query;
            return (
              <button
                key={preset.query}
                onClick={() => loadFMATracks(preset.query)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md font-bold'
                    : 'bg-[#22201e] text-[#d4cdc5] hover:bg-[#302c28] hover:text-white border border-[#302b26]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* FMA Songs Grid */}
        {isLoadingFMA ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#a09a90] font-medium">
              Connecting to Free Music Archive & loading full songs...
            </span>
          </div>
        ) : fmaTracks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#888] bg-[#161514] rounded-xl">
            Click Refresh above to retrieve tracks from Free Music Archive.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-1">
            {fmaTracks.slice(0, 12).map(track => {
              const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, fmaTracks)}
                  className="group p-3 rounded-lg bg-[#191715] hover:bg-[#25221f] transition-all duration-200 cursor-pointer flex flex-col relative border border-transparent hover:border-amber-500/25"
                >
                  <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2.5 bg-[#25221f] shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[8px] font-bold text-amber-300 border border-amber-500/30 uppercase">
                      FULL SONG
                    </span>

                    {/* Play trigger button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (currentTrack?.id === track.id) togglePlayPause();
                        else playTrack(track, fmaTracks);
                      }}
                      className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-xl transition-all duration-200 ${
                        isThisTrackPlaying
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                      }`}
                      title={isThisTrackPlaying ? 'Pause' : 'Play full track'}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-black" />
                      ) : (
                        <Play className="w-4 h-4 fill-black translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-white truncate group-hover:text-amber-400 transition-colors" title={track.title}>
                      {track.title}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setDownloadingFMAId(track.id);
                        downloadFMATrack(track);
                        setTimeout(() => setDownloadingFMAId(null), 2000);
                      }}
                      className="text-[#888] hover:text-amber-400 transition-colors p-1"
                      title="Download MP3"
                    >
                      <Download className={`w-3 h-3 ${downloadingFMAId === track.id ? 'animate-bounce text-amber-300' : ''}`} />
                    </button>
                  </div>
                  <span className="text-[11px] text-[#a09a90] truncate mt-0.5" title={track.artistName}>
                    {track.artistName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* YouTube Music & Official Videos Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] tracking-wider">
                YOUTUBE
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Official YouTube Music & Videos
              </h2>
            </div>
            <p className="text-xs text-[#a7a7a7] mt-0.5">
              Stream official music videos and live tracks with full video player support.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadYouTubeTracks('', selectedYTPreset)}
              disabled={isLoadingYouTube}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#303030] text-xs font-semibold text-white border border-[#333] transition-colors"
              title="Refresh YouTube trending"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingYouTube ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {onNavigateSearch && (
              <button
                onClick={() => onNavigateSearch('YouTube')}
                className="text-xs text-red-400 hover:text-red-300 font-semibold hover:underline"
              >
                Search More
              </button>
            )}
          </div>
        </div>

        {/* YouTube Artist/Trend Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {YOUTUBE_PRESETS.map(preset => {
            const isSelected = selectedYTPreset === preset.label;
            return (
              <button
                key={preset.label}
                onClick={() => loadYouTubeTracks(preset.query, preset.label)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md font-bold'
                    : 'bg-[#201515] text-[#e0cfcf] hover:bg-[#321e1e] hover:text-white border border-[#3c2424]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* YouTube Songs Grid */}
        {isLoadingYouTube ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#a7a7a7] font-medium">
              Fetching YouTube Music videos...
            </span>
          </div>
        ) : youtubeTracks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#888] bg-[#1a1414] rounded-xl border border-[#2e2020]">
            Click Refresh above to load YouTube Music videos.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-1">
            {youtubeTracks.slice(0, 12).map(track => {
              const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    playTrack(track, youtubeTracks);
                    openVideo();
                  }}
                  className="group p-3 rounded-lg bg-[#181212] hover:bg-[#271b1b] transition-all duration-200 cursor-pointer flex flex-col relative border border-transparent hover:border-red-500/30 shadow-md"
                >
                  <div className="relative w-full aspect-video sm:aspect-square rounded-md overflow-hidden mb-2.5 bg-[#251818] shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600/90 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider">
                      VIDEO
                    </span>

                    {/* Play Video as Audio in Background button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        playTrack(track, youtubeTracks);
                        closeVideo();
                      }}
                      className="absolute left-2 bottom-2 w-8 h-8 rounded-full bg-black/80 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
                      title="Play as Audio in Background"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                    </button>

                    {/* Play trigger button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (currentTrack?.id === track.id) {
                          togglePlayPause();
                        } else {
                          playTrack(track, youtubeTracks);
                          openVideo();
                        }
                      }}
                      className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transition-all duration-200 ${
                        isThisTrackPlaying
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                      }`}
                      title={isThisTrackPlaying ? 'Pause' : 'Play YouTube Video'}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <span className="font-semibold text-xs text-white truncate group-hover:text-red-400 transition-colors" title={track.title}>
                    {track.title}
                  </span>
                  <span className="text-[11px] text-[#a7a7a7] truncate mt-0.5" title={track.artistName}>
                    {track.channelName || track.artistName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Audius Decentralized Music (Free Community Streaming API) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Music className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Audius Trending
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                DECENTRALIZED API
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[9px] font-mono border border-purple-800/40">
                FULL SONGS
              </span>
            </div>
            <p className="text-xs text-[#b09ec4] mt-0.5">
              Decentralized audio network streams with community releases, EDM, hip-hop, and indie hits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadAudiusTracks(selectedAudiusGenre)}
              disabled={isLoadingAudius}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#303030] text-xs font-semibold text-white border border-[#333] transition-colors"
              title="Refresh Audius trending tracks"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAudius ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {onNavigateSearch && (
              <button
                onClick={() => onNavigateSearch('Audius')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold hover:underline"
              >
                Search Audius
              </button>
            )}
          </div>
        </div>

        {/* Audius Genre Filter Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {AUDIUS_POPULAR_GENRES.map(genre => {
            const isSelected = selectedAudiusGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => loadAudiusTracks(genre)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md font-bold'
                    : 'bg-[#1b1426] text-[#ccbde3] hover:bg-[#2c1d40] hover:text-white border border-[#392454]'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Audius Tracks Grid */}
        {isLoadingAudius ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#a7a7a7] font-medium">
              Connecting to Audius decentralized nodes...
            </span>
          </div>
        ) : audiusTracks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#888] bg-[#16121f] rounded-xl border border-[#2a1d3b]">
            Click Refresh above to load Audius tracks.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-1">
            {audiusTracks.map(track => {
              const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, audiusTracks)}
                  className="group p-3 rounded-lg bg-[#181222] hover:bg-[#251b36] transition-all duration-200 cursor-pointer flex flex-col relative border border-[#2b1c3d] hover:border-purple-500/40 shadow-sm"
                >
                  <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2.5 bg-[#211533] shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-purple-600/90 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider">
                      AUDIUS
                    </span>

                    {/* Play trigger button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (currentTrack?.id === track.id) {
                          togglePlayPause();
                        } else {
                          playTrack(track, audiusTracks);
                        }
                      }}
                      className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl transition-all duration-200 ${
                        isThisTrackPlaying
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                      }`}
                      title={isThisTrackPlaying ? 'Pause' : 'Play Track'}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <span className="font-semibold text-xs text-white truncate group-hover:text-purple-300 transition-colors" title={track.title}>
                    {track.title}
                  </span>
                  <span className="text-[11px] text-[#b8a6cd] truncate mt-0.5" title={track.artistName}>
                    {track.artistName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Top Picks for You (Tracks with instant play) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Global Top Hits & Anthems
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {TRACKS.slice(0, 6).map(track => {
            const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, TRACKS)}
                className="group p-3.5 rounded-lg bg-[#181818] hover:bg-[#242424] transition-all duration-200 cursor-pointer flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-[#282828] shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Play trigger button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (currentTrack?.id === track.id) togglePlayPause();
                      else playTrack(track, TRACKS);
                    }}
                    className={`absolute right-2 bottom-2 w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transition-all duration-200 ${
                      isThisTrackPlaying
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                    }`}
                  >
                    {isThisTrackPlaying ? (
                      <Pause className="w-4 h-4 fill-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black translate-x-0.5" />
                    )}
                  </button>
                </div>

                <span className="font-semibold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                  {track.title}
                </span>
                <span className="text-xs text-[#a7a7a7] truncate mt-0.5">
                  {track.artistName}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Playlists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Featured Curations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLAYLISTS.map(pl => (
            <div
              key={pl.id}
              onClick={() => onNavigatePlaylist(pl.id)}
              className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3.5 shadow-lg">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="font-bold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                {pl.title}
              </span>
              <p className="text-xs text-[#a7a7a7] line-clamp-2 mt-1 leading-relaxed">
                {pl.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Popular Artists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Popular Artists
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ARTISTS.map(artist => (
            <div
              key={artist.id}
              onClick={() => onNavigateArtist(artist.id)}
              className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3.5 shadow-lg border border-[#282828]">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="font-bold text-sm text-white truncate w-full group-hover:text-emerald-400 transition-colors">
                {artist.name}
              </span>
              <span className="text-xs text-[#a7a7a7] mt-0.5">
                {formatCompactNumber(artist.monthlyListeners)} monthly listeners
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

