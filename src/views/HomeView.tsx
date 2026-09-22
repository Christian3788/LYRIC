import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Radio, Sparkles, RefreshCw, Music, Video, Headphones } from 'lucide-react';
import { TRACKS, PLAYLISTS, ARTISTS, ALBUMS } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatCompactNumber, formatTime } from '../utils/formatters';
import { fetchTrendingYouTubeMusic, searchYouTubeMusic } from '../services/youtubeService';
import { fetchTrendingAudius, AUDIUS_POPULAR_GENRES } from '../services/audiusService';
import { Track } from '../types';

interface HomeViewProps {
  onNavigatePlaylist: (id: string) => void;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
  onOpenParty: () => void;
  onNavigateSearch?: (query?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigatePlaylist,
  onNavigateArtist,
  onNavigateAlbum,
  onOpenParty,
  onNavigateSearch,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue, openVideo, closeVideo } = useAudio();

  // DOODLE Video Stream state
  const [doodleTracks, setDoodleTracks] = useState<Track[]>([]);
  const [isLoadingDoodle, setIsLoadingDoodle] = useState(false);
  const [selectedDoodlePreset, setSelectedDoodlePreset] = useState('Trending');

  const DOODLE_PRESETS = [
    { label: 'Trending', query: '' },
    { label: 'Taylor Swift', query: 'Taylor Swift' },
    { label: 'The Weeknd', query: 'The Weeknd' },
    { label: 'Billie Eilish', query: 'Billie Eilish' },
    { label: 'Kendrick Lamar', query: 'Kendrick Lamar' },
    { label: 'Dua Lipa', query: 'Dua Lipa' },
    { label: 'Sabrina Carpenter', query: 'Sabrina Carpenter' },
  ];

  const loadDoodleTracks = async (query: string, label: string) => {
    setIsLoadingDoodle(true);
    setSelectedDoodlePreset(label);
    try {
      let tracks: Track[] = [];
      if (!query) {
        tracks = await fetchTrendingYouTubeMusic(12);
      } else {
        tracks = await searchYouTubeMusic(`${query} official music video`, 12);
      }
      setDoodleTracks(tracks);
    } catch (e) {
      console.warn('Failed to load DOODLE tracks:', e);
    } finally {
      setIsLoadingDoodle(false);
    }
  };

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

  // Load DOODLE streams and Audius tracks on mount
  useEffect(() => {
    loadDoodleTracks('', 'Trending');
    loadAudiusTracks('All');
  }, []);

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
              onClick={() => onNavigateSearch()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#202020] hover:bg-[#2b2b2b] text-white text-xs font-semibold border border-[#303030] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Explore Music</span>
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





      {/* Step 1: Audius API Decentralized Music Shelf */}
      <section className="space-y-4 bg-gradient-to-br from-purple-950/25 via-[#16121f] to-[#121212] p-5 md:p-6 rounded-2xl border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center border border-purple-500/40">
                <Music className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-200 text-[10px] font-extrabold tracking-wider border border-purple-400/40 uppercase">
                Step 1 • Audius API
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Audius Music Network
              </h2>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-purple-950/90 text-purple-300 text-[9px] font-mono border border-purple-800/40">
                320kbps MP3
              </span>
            </div>
            <p className="text-xs text-[#c4b3dc] mt-1">
              Decentralized audio network streams with community releases, EDM, hip-hop, and indie hits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadAudiusTracks(selectedAudiusGenre)}
              disabled={isLoadingAudius}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241a30] hover:bg-[#342446] text-xs font-semibold text-purple-200 border border-purple-500/30 transition-colors"
              title="Refresh Audius trending tracks"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAudius ? 'animate-spin text-purple-400' : ''}`} />
              <span>Refresh</span>
            </button>
            {onNavigateSearch && (
              <button
                onClick={() => onNavigateSearch('Audius')}
                className="text-xs text-purple-300 hover:text-white font-semibold hover:underline"
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

      {/* DOODLE Music & Videos Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] tracking-wider">
                DOODLE
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                DOODLE Streams & Videos
              </h2>
            </div>
            <p className="text-xs text-[#a7a7a7] mt-0.5">
              Stream music videos and live tracks with full video player support.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadDoodleTracks('', selectedDoodlePreset)}
              disabled={isLoadingDoodle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#303030] text-xs font-semibold text-white border border-[#333] transition-colors"
              title="Refresh trending videos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDoodle ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {onNavigateSearch && (
              <button
                onClick={() => onNavigateSearch('DOODLE')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                Search More
              </button>
            )}
          </div>
        </div>

        {/* DOODLE Artist/Trend Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {DOODLE_PRESETS.map(preset => {
            const isSelected = selectedDoodlePreset === preset.label;
            return (
              <button
                key={preset.label}
                onClick={() => loadDoodleTracks(preset.query, preset.label)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : 'bg-[#1b221d] text-[#cfded2] hover:bg-[#263329] hover:text-white border border-[#2b382d]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* DOODLE Songs Grid */}
        {isLoadingDoodle ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#a7a7a7] font-medium">
              Fetching video streams...
            </span>
          </div>
        ) : doodleTracks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#888] bg-[#141a16] rounded-xl border border-[#202b23]">
            Click Refresh above to load video streams.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-1">
            {doodleTracks.slice(0, 12).map(track => {
              const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    playTrack(track, doodleTracks);
                    openVideo();
                  }}
                  className="group p-3 rounded-lg bg-[#141a16] hover:bg-[#1e2921] transition-all duration-200 cursor-pointer flex flex-col relative border border-transparent hover:border-emerald-500/30 shadow-md"
                >
                  <div className="relative w-full aspect-video sm:aspect-square rounded-md overflow-hidden mb-2.5 bg-[#1b241e] shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600/90 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider">
                      DOODLE
                    </span>

                    {/* Play Video as Audio in Background button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        playTrack(track, doodleTracks);
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
                          playTrack(track, doodleTracks);
                          openVideo();
                        }
                      }}
                      className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl transition-all duration-200 ${
                        isThisTrackPlaying
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                      }`}
                      title={isThisTrackPlaying ? 'Pause' : 'Play Video'}
                    >
                      {isThisTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <span className="font-semibold text-xs text-white truncate group-hover:text-emerald-400 transition-colors" title={track.title}>
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

      {/* 4. Top Picks for You (Tracks with instant play) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Top Hits & Anthems
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

