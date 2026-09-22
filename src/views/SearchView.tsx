import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Play,
  Pause,
  Music,
  Mic2,
  Disc,
  ListMusic,
  Plus,
  Check,
  X,
  Sparkles,
  Clock,
  Compass,
  Globe,
  RefreshCw,
  Zap,
  Download,
  Video,
  Headphones,
} from 'lucide-react';
import { TRACKS, ARTISTS, ALBUMS, PLAYLISTS, GENRES } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';
import { Track } from '../types';
import { fetchRealSongs, fetchTopCharts } from '../services/realSongsService';
import { searchFMATracks, downloadFMATrack } from '../services/fmaService';
import { searchYouTubeMusic, fetchTrendingYouTubeMusic } from '../services/youtubeService';
import { searchAudius, fetchTrendingAudius, AUDIUS_POPULAR_GENRES } from '../services/audiusService';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
  onNavigatePlaylist: (id: string) => void;
}

const TRENDING_SUGGESTIONS = [
  'Taylor Swift',
  'The Weeknd',
  'Billie Eilish',
  'Kendrick Lamar',
  'Dua Lipa',
  'Drake',
  'Coldplay',
  'Post Malone',
  'Queen',
  'Sabrina Carpenter',
  'Pop',
  'Hip-Hop',
  'Synthwave',
];

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateArtist,
  onNavigateAlbum,
  onNavigatePlaylist,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue, openVideo, closeVideo } = useAudio();
  const [filterType, setFilterType] = useState<'all' | 'audius' | 'youtube' | 'fma' | 'real' | 'tracks' | 'artists' | 'albums' | 'playlists'>('all');
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);
  const [realTracks, setRealTracks] = useState<Track[]>([]);
  const [isLoadingReal, setIsLoadingReal] = useState<boolean>(false);
  const [fmaTracks, setFmaTracks] = useState<Track[]>([]);
  const [isLoadingFMA, setIsLoadingFMA] = useState<boolean>(false);
  const [youtubeTracks, setYoutubeTracks] = useState<Track[]>([]);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState<boolean>(false);
  const [audiusTracks, setAudiusTracks] = useState<Track[]>([]);
  const [isLoadingAudius, setIsLoadingAudius] = useState<boolean>(false);
  const [selectedAudiusGenre, setSelectedAudiusGenre] = useState<string>('All');
  const [downloadingFMAId, setDownloadingFMAId] = useState<string | null>(null);
  const [hasManuallyFetched, setHasManuallyFetched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when landing on Search view if empty
  useEffect(() => {
    if (!searchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounced live fetch of real songs, FMA tracks, YouTube videos, and Audius tracks
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      if (!hasManuallyFetched) {
        setRealTracks([]);
        setFmaTracks([]);
        setYoutubeTracks([]);
        setAudiusTracks([]);
      }
      return;
    }

    let isMounted = true;
    setIsLoadingReal(true);
    setIsLoadingFMA(true);
    setIsLoadingYouTube(true);
    setIsLoadingAudius(true);

    const timer = setTimeout(async () => {
      try {
        const [fetchedReal, fetchedFMA, fetchedYT, fetchedAudius] = await Promise.allSettled([
          fetchRealSongs(trimmed, 25),
          searchFMATracks(trimmed, 20),
          searchYouTubeMusic(`${trimmed} official video`, 18),
          searchAudius(trimmed, 20),
        ]);

        if (isMounted) {
          if (fetchedReal.status === 'fulfilled') {
            setRealTracks(fetchedReal.value);
          }
          if (fetchedFMA.status === 'fulfilled') {
            setFmaTracks(fetchedFMA.value);
          }
          if (fetchedYT.status === 'fulfilled') {
            setYoutubeTracks(fetchedYT.value);
          }
          if (fetchedAudius.status === 'fulfilled') {
            setAudiusTracks(fetchedAudius.value);
          }
          setIsLoadingReal(false);
          setIsLoadingFMA(false);
          setIsLoadingYouTube(false);
          setIsLoadingAudius(false);
        }
      } catch (err) {
        console.warn('Live search caught:', err);
        if (isMounted) {
          setIsLoadingReal(false);
          setIsLoadingFMA(false);
          setIsLoadingYouTube(false);
          setIsLoadingAudius(false);
        }
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, hasManuallyFetched]);

  // Handle manual "Fetch Real Songs" click
  const handleFetchTopRealHits = async () => {
    setIsLoadingReal(true);
    setHasManuallyFetched(true);
    try {
      const topHits = await fetchTopCharts();
      setRealTracks(topHits);
      if (!searchQuery) {
        onSearchChange('Top Hits');
      }
    } catch (e) {
      console.warn('Error fetching top hits:', e);
    } finally {
      setIsLoadingReal(false);
    }
  };

  // Handle manual "Fetch FMA Music" click
  const handleFetchFMATracks = async () => {
    setIsLoadingFMA(true);
    setHasManuallyFetched(true);
    try {
      const fmaResults = await searchFMATracks(searchQuery.trim() || 'electronic', 24);
      setFmaTracks(fmaResults);
      if (!searchQuery) {
        onSearchChange('electronic');
      }
    } catch (e) {
      console.warn('Error fetching FMA tracks:', e);
    } finally {
      setIsLoadingFMA(false);
    }
  };

  // Handle manual "Fetch YouTube Trending" click
  const handleFetchYouTubeTrending = async () => {
    setIsLoadingYouTube(true);
    setHasManuallyFetched(true);
    try {
      const ytResults = await fetchTrendingYouTubeMusic(24);
      setYoutubeTracks(ytResults);
      if (!searchQuery) {
        onSearchChange('Trending Videos');
      }
    } catch (e) {
      console.warn('Error fetching YouTube trending:', e);
    } finally {
      setIsLoadingYouTube(false);
    }
  };

  // Handle manual "Fetch Audius Music" click
  const handleFetchAudiusTrending = async (genre?: string) => {
    setIsLoadingAudius(true);
    setHasManuallyFetched(true);
    try {
      const audiusResults = await fetchTrendingAudius(24, genre);
      setAudiusTracks(audiusResults);
      if (!searchQuery) {
        onSearchChange(genre && genre !== 'All' ? `Audius ${genre}` : 'Audius Trending');
      }
    } catch (e) {
      console.warn('Error fetching Audius trending:', e);
    } finally {
      setIsLoadingAudius(false);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    addToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => {
      setAddedTrackId(prev => (prev === track.id ? null : prev));
    }, 1800);
  };

  // Smart multi-keyword query parsing for local catalog
  const cleanQuery = searchQuery.trim().toLowerCase();
  const queryWords = useMemo(
    () => cleanQuery.split(/\s+/).filter(w => w.length > 0),
    [cleanQuery]
  );

  const matchingTracks = useMemo(() => {
    if (!cleanQuery) return [];
    return TRACKS.filter(t => {
      const titleLower = t.title.toLowerCase();
      const artistLower = t.artistName.toLowerCase();
      const albumLower = (t.albumTitle || '').toLowerCase();
      const genreLower = (t.genre || '').toLowerCase();
      const lyricsJoined = (t.lyrics || []).map(l => l.text.toLowerCase()).join(' ');

      if (
        titleLower.includes(cleanQuery) ||
        artistLower.includes(cleanQuery) ||
        albumLower.includes(cleanQuery) ||
        genreLower.includes(cleanQuery) ||
        lyricsJoined.includes(cleanQuery)
      ) {
        return true;
      }

      return queryWords.every(
        word =>
          titleLower.includes(word) ||
          artistLower.includes(word) ||
          albumLower.includes(word) ||
          genreLower.includes(word) ||
          lyricsJoined.includes(word)
      );
    });
  }, [cleanQuery, queryWords]);

  const matchingArtists = useMemo(() => {
    if (!cleanQuery) return [];
    return ARTISTS.filter(a => {
      const nameLower = a.name.toLowerCase();
      const genresJoined = a.genres.join(' ').toLowerCase();

      if (nameLower.includes(cleanQuery) || genresJoined.includes(cleanQuery)) {
        return true;
      }

      return queryWords.every(
        word => nameLower.includes(word) || genresJoined.includes(word)
      );
    });
  }, [cleanQuery, queryWords]);

  const matchingAlbums = useMemo(() => {
    if (!cleanQuery) return [];
    return ALBUMS.filter(a => {
      const titleLower = a.title.toLowerCase();
      const artistLower = a.artistName.toLowerCase();
      const genreLower = a.genre.toLowerCase();

      if (
        titleLower.includes(cleanQuery) ||
        artistLower.includes(cleanQuery) ||
        genreLower.includes(cleanQuery)
      ) {
        return true;
      }

      return queryWords.every(
        word =>
          titleLower.includes(word) ||
          artistLower.includes(word) ||
          genreLower.includes(word)
      );
    });
  }, [cleanQuery, queryWords]);

  const matchingPlaylists = useMemo(() => {
    if (!cleanQuery) return [];
    return PLAYLISTS.filter(p => {
      const titleLower = p.title.toLowerCase();
      const descLower = p.description.toLowerCase();

      if (titleLower.includes(cleanQuery) || descLower.includes(cleanQuery)) {
        return true;
      }

      return queryWords.every(
        word => titleLower.includes(word) || descLower.includes(word)
      );
    });
  }, [cleanQuery, queryWords]);

  const hasResults =
    audiusTracks.length > 0 ||
    youtubeTracks.length > 0 ||
    fmaTracks.length > 0 ||
    realTracks.length > 0 ||
    matchingTracks.length > 0 ||
    matchingArtists.length > 0 ||
    matchingAlbums.length > 0 ||
    matchingPlaylists.length > 0;

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
  };

  // Determine top highlight track
  const topResultTrack =
    filterType === 'audius'
      ? audiusTracks[0]
      : filterType === 'youtube'
      ? youtubeTracks[0]
      : filterType === 'fma'
      ? fmaTracks[0]
      : audiusTracks[0] || youtubeTracks[0] || fmaTracks[0] || realTracks[0] || matchingTracks[0];

  return (
    <div id="search-view" className="p-6 md:p-8 space-y-6 pb-24 max-w-7xl mx-auto">
      {/* 1. Main Search Header & Primary Input Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a7a7a7]" />
            <input
              ref={inputRef}
              id="search-view-input"
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search YouTube videos, songs, Free Music Archive, artists (e.g. Taylor Swift, electronic, jazz)..."
              className="w-full bg-[#242424] hover:bg-[#2b2b2b] focus:bg-[#2e2e2e] text-base md:text-lg text-white placeholder-[#7e7e7e] pl-12 pr-11 py-3.5 rounded-full outline-none border border-transparent focus:border-emerald-500/50 shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setRealTracks([]);
                  setFmaTracks([]);
                  setYoutubeTracks([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#383838] hover:bg-[#484848] text-white flex items-center justify-center transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Actions: Audius, YouTube Music, Free Music Archive, Real Songs */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              id="fetch-audius-songs-btn"
              onClick={() => handleFetchAudiusTrending()}
              disabled={isLoadingAudius}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-purple-600/20 active:scale-95 transition-all flex-1 sm:flex-initial whitespace-nowrap"
              title="Fetch trending tracks from Audius decentralized music API"
            >
              <Music className={`w-4 h-4 ${isLoadingAudius ? 'animate-spin' : ''}`} />
              <span>{isLoadingAudius ? 'Fetching Audius...' : 'Audius API'}</span>
            </button>

            <button
              id="fetch-youtube-songs-btn"
              onClick={handleFetchYouTubeTrending}
              disabled={isLoadingYouTube}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-red-600/20 active:scale-95 transition-all flex-1 sm:flex-initial whitespace-nowrap"
            >
              <Video className={`w-4 h-4 ${isLoadingYouTube ? 'animate-spin' : ''}`} />
              <span>{isLoadingYouTube ? 'Fetching YouTube...' : 'YouTube Videos'}</span>
            </button>

            <button
              id="fetch-fma-songs-btn"
              onClick={handleFetchFMATracks}
              disabled={isLoadingFMA}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all flex-1 sm:flex-initial whitespace-nowrap"
            >
              <Disc className={`w-4 h-4 ${isLoadingFMA ? 'animate-spin' : ''}`} />
              <span>{isLoadingFMA ? 'Fetching FMA...' : 'Free Music Archive'}</span>
            </button>

            <button
              id="fetch-real-songs-btn"
              onClick={handleFetchTopRealHits}
              disabled={isLoadingReal}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex-1 sm:flex-initial whitespace-nowrap"
            >
              <Globe className={`w-4 h-4 ${isLoadingReal ? 'animate-spin' : ''}`} />
              <span>{isLoadingReal ? 'Fetching Songs...' : 'Fetch Global Hits'}</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[#888] font-medium flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Try:
          </span>
          {TRENDING_SUGGESTIONS.map(s => {
            const isActive = cleanQuery === s.toLowerCase();
            return (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className={`px-3 py-1.5 rounded-full font-medium flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'bg-[#1f1f1f] hover:bg-[#2d2d2d] text-[#d4d4d4] hover:text-white border border-[#2e2e2e]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filter Pills (when query or real songs exist) */}
      {(cleanQuery || audiusTracks.length > 0 || youtubeTracks.length > 0 || realTracks.length > 0 || fmaTracks.length > 0) && hasResults && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#242424] pt-2">
          {[
            { id: 'all', label: 'All' },
            ...(audiusTracks.length > 0 ? [{ id: 'audius', label: `Audius (${audiusTracks.length})` }] : []),
            ...(youtubeTracks.length > 0 ? [{ id: 'youtube', label: `YouTube Videos (${youtubeTracks.length})` }] : []),
            ...(fmaTracks.length > 0 ? [{ id: 'fma', label: `Free Music Archive (${fmaTracks.length})` }] : []),
            ...(realTracks.length > 0 ? [{ id: 'real', label: `Global Hits (${realTracks.length})` }] : []),
            ...(matchingTracks.length > 0 ? [{ id: 'tracks', label: `Hits & Anthems (${matchingTracks.length})` }] : []),
            ...(matchingArtists.length > 0 ? [{ id: 'artists', label: `Artists (${matchingArtists.length})` }] : []),
            ...(matchingAlbums.length > 0 ? [{ id: 'albums', label: `Albums (${matchingAlbums.length})` }] : []),
            ...(matchingPlaylists.length > 0 ? [{ id: 'playlists', label: `Playlists (${matchingPlaylists.length})` }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-white text-black'
                  : 'bg-[#222222] text-[#d4d4d4] hover:bg-[#303030] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 3. Search Results */}
      {cleanQuery || realTracks.length > 0 ? (
        !hasResults && !isLoadingReal ? (
          <div className="py-16 text-center space-y-4 bg-[#161616] rounded-2xl p-8 border border-[#242424]">
            <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center mx-auto text-[#888]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">No songs found for "{searchQuery}"</h3>
            <p className="text-sm text-[#a7a7a7] max-w-md mx-auto">
              Click the "Fetch Real Songs" button below to pull genuine recordings from the global music catalog.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleFetchTopRealHits}
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition-colors"
              >
                Fetch Real Global Hits
              </button>
              <button
                onClick={() => onSearchChange('Taylor Swift')}
                className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333] text-xs font-semibold text-white transition-colors"
              >
                Search Taylor Swift
              </button>
              <button
                onClick={() => onSearchChange('The Weeknd')}
                className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333] text-xs font-semibold text-white transition-colors"
              >
                Search The Weeknd
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Loading Indicator */}
            {isLoadingReal && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching global music database for real audio streams...</span>
              </div>
            )}

            {/* Top Result + Songs Section */}
            {(filterType === 'all' || filterType === 'real' || filterType === 'tracks') && topResultTrack && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Top Result Card */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="text-xl font-bold text-white tracking-tight">Top Result</h2>
                  <div
                    onClick={() => playTrack(topResultTrack, realTracks.length > 0 ? realTracks : matchingTracks)}
                    className="group p-5 rounded-2xl bg-[#181818] hover:bg-[#222222] transition-all cursor-pointer relative flex flex-col justify-between h-64 border border-[#242424] shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={topResultTrack.coverUrl}
                        alt={topResultTrack.title}
                        className="w-24 h-24 rounded-xl object-cover shadow-xl flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          {topResultTrack.isRealSong ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/40">
                              Real Song
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-[#282828] text-[10px] font-bold uppercase tracking-wider text-[#d4d4d4]">
                              {topResultTrack.genre || 'Original'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-extrabold text-white truncate group-hover:text-emerald-400 transition-colors">
                          {topResultTrack.title}
                        </h3>
                        <div className="text-xs text-[#a7a7a7] mt-1 truncate">
                          By <span className="text-white">{topResultTrack.artistName}</span>
                        </div>
                        {topResultTrack.albumTitle && (
                          <div className="text-[11px] text-[#777] truncate mt-0.5">
                            {topResultTrack.albumTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#242424]/60">
                      <span className="text-xs text-[#888] font-mono">
                        {topResultTrack.isRealSong ? 'Audio Preview' : 'Full Audio'} • {formatTime(topResultTrack.durationSeconds)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => handleAddToQueue(e, topResultTrack)}
                          className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#383838] text-white flex items-center justify-center transition-colors"
                          title="Add to queue"
                        >
                          {addedTrackId === topResultTrack.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            playTrack(topResultTrack, realTracks.length > 0 ? realTracks : matchingTracks);
                          }}
                          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl group-hover:scale-105 active:scale-95 transition-all"
                          title="Play song"
                        >
                          {currentTrack?.id === topResultTrack.id && isPlaying ? (
                            <Pause className="w-5 h-5 fill-black" />
                          ) : (
                            <Play className="w-5 h-5 fill-black translate-x-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Songs List */}
                <div className="lg:col-span-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {realTracks.length > 0 ? 'Real Songs' : 'Songs'}
                      </h2>
                      {realTracks.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          HQ AUDIO
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#888]">
                      {(realTracks.length > 0 ? realTracks : matchingTracks).length} track(s)
                    </span>
                  </div>

                  <div className="space-y-1">
                    {(realTracks.length > 0 ? realTracks : matchingTracks)
                      .slice(0, filterType === 'real' || filterType === 'tracks' ? 50 : 6)
                      .map((track, idx) => {
                        const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                        const isThisCurrent = currentTrack?.id === track.id;
                        const activeList = realTracks.length > 0 ? realTracks : matchingTracks;

                        return (
                          <div
                            key={track.id}
                            onClick={() => playTrack(track, activeList)}
                            className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#202020] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <span className="w-5 text-center text-xs font-mono text-[#777] group-hover:hidden">
                                {idx + 1}
                              </span>
                              <div className="w-5 hidden group-hover:flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
                              </div>

                              <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow bg-[#222]">
                                <img
                                  src={track.coverUrl}
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {isThisPlaying && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div className="flex items-end gap-0.5 h-3">
                                      <span className="w-0.5 bg-emerald-400 animate-bounce h-full" />
                                      <span className="w-0.5 bg-emerald-400 animate-bounce delay-75 h-2" />
                                      <span className="w-0.5 bg-emerald-400 animate-bounce delay-150 h-3" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1 pr-2">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className={`text-sm font-semibold truncate ${
                                      isThisCurrent ? 'text-emerald-400' : 'text-white'
                                    }`}
                                  >
                                    {track.title}
                                  </span>
                                  {track.isRealSong && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
                                      REAL
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#a7a7a7] truncate flex items-center gap-1.5 mt-0.5">
                                  <span className="hover:text-white truncate">
                                    {track.artistName}
                                  </span>
                                  {track.albumTitle && (
                                    <>
                                      <span>•</span>
                                      <span className="hover:text-white truncate text-[#777]">
                                        {track.albumTitle}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={e => handleAddToQueue(e, track)}
                                className="w-7 h-7 rounded-full hover:bg-[#333] flex items-center justify-center text-[#888] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Add to queue"
                              >
                                {addedTrackId === track.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <div className="text-xs font-mono text-[#727272] w-12 text-right">
                                {formatTime(track.durationSeconds)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Audius Decentralized Music Section */}
            {(filterType === 'all' || filterType === 'audius') && audiusTracks.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#242424]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Audius Decentralized Music</h2>
                        <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {audiusTracks.length} FULL TRACKS
                        </span>
                        <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[9px] font-mono border border-purple-800/40">
                          320kbps MP3
                        </span>
                      </div>
                      <p className="text-xs text-[#b8a5cf]">
                        Decentralized, open-source streaming powered by Audius • Full songs, no audio cutoffs
                      </p>
                    </div>
                  </div>

                  {/* Genre Quick Filter */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {AUDIUS_POPULAR_GENRES.slice(0, 5).map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          setSelectedAudiusGenre(g);
                          handleFetchAudiusTrending(g);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          selectedAudiusGenre === g
                            ? 'bg-purple-600 text-white font-bold shadow-sm'
                            : 'bg-[#21162d] text-[#c9b3e6] hover:bg-[#312044] border border-[#3e2659]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {audiusTracks.map(track => {
                    const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track, audiusTracks)}
                        className="group flex items-center justify-between p-3 rounded-xl bg-[#171120] hover:bg-[#251b34] transition-all cursor-pointer border border-[#2d1e3d] hover:border-purple-500/40 shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#241535] flex-shrink-0 shadow-md">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              {isThisTrackPlaying ? (
                                <Pause className="w-4 h-4 text-purple-300 fill-purple-300" />
                              ) : (
                                <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-semibold text-sm text-white truncate group-hover:text-purple-300 transition-colors"
                                title={track.title}
                              >
                                {track.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#a7a7a7]">
                              <span className="truncate text-[#c4b5d4]">{track.artistName}</span>
                              <span className="px-1 py-0.2 rounded bg-purple-600/30 text-purple-300 text-[8px] font-bold">
                                {track.genre || 'AUDIUS'}
                              </span>
                              {track.mood && (
                                <span className="text-[10px] text-[#8e7a9e] truncate hidden sm:inline">
                                  • {track.mood}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => handleAddToQueue(e, track)}
                            className="w-7 h-7 rounded-full hover:bg-[#322047] flex items-center justify-center text-[#888] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Add to queue"
                          >
                            {addedTrackId === track.id ? (
                              <Check className="w-3.5 h-3.5 text-purple-400" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="text-xs font-mono text-[#8a7a99] w-10 text-right">
                            {formatTime(track.durationSeconds)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* YouTube Music & Official Videos Section */}
            {(filterType === 'all' || filterType === 'youtube') && youtubeTracks.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#242424]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">YouTube Music & Videos</h2>
                        <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                          {youtubeTracks.length} VIDEOS
                        </span>
                      </div>
                      <p className="text-xs text-[#a7a7a7]">
                        Stream official music videos and listen via the official YouTube IFrame player
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {youtubeTracks.map(track => {
                    const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          playTrack(track, youtubeTracks);
                          openVideo();
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl bg-[#1a1212] hover:bg-[#281c1c] transition-all cursor-pointer border border-[#2d1e1e] hover:border-red-500/30"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#241717] flex-shrink-0">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              {isThisTrackPlaying ? (
                                <Pause className="w-4 h-4 text-red-400 fill-red-400" />
                              ) : (
                                <Play className="w-4 h-4 text-white fill-white translate-x-0.2" />
                              )}
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-bold text-white">
                              {formatTime(track.durationSeconds)}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1 pr-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-white truncate group-hover:text-red-400 transition-colors" title={track.title}>
                                {track.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#a7a7a7]">
                              <span className="truncate">{track.channelName || track.artistName}</span>
                              <span className="px-1 py-0.2 rounded bg-red-600/20 text-red-400 text-[8px] font-bold">YT</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              playTrack(track, youtubeTracks);
                              closeVideo();
                            }}
                            className="p-2 text-[#888] hover:text-emerald-400 hover:bg-[#1a2d1f] rounded-full transition-colors"
                            title="Play as Audio in Background (no video window)"
                          >
                            <Headphones className="w-4 h-4" />
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              playTrack(track, youtubeTracks);
                              openVideo();
                            }}
                            className="p-2 text-[#888] hover:text-white hover:bg-[#382323] rounded-full transition-colors"
                            title="Watch Official Video"
                          >
                            <Video className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Free Music Archive Section */}
            {(filterType === 'all' || filterType === 'fma') && fmaTracks.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#242424]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <Disc className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Free Music Archive</h2>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          {fmaTracks.length} FULL TRACKS
                        </span>
                      </div>
                      <p className="text-xs text-[#a09a90]">
                        Full-length downloadable songs with Creative Commons licensing
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fmaTracks.map(track => {
                    const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track, fmaTracks)}
                        className="group flex items-center justify-between p-3 rounded-xl bg-[#191715] hover:bg-[#25221f] transition-all cursor-pointer border border-[#2b2621] hover:border-amber-500/30"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#24201c] flex-shrink-0">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              {isThisTrackPlaying ? (
                                <Pause className="w-4 h-4 text-amber-400 fill-amber-400" />
                              ) : (
                                <Play className="w-4 h-4 text-white fill-white translate-x-0.2" />
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 pr-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                                {track.title}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold uppercase tracking-wider flex-shrink-0">
                                FMA
                              </span>
                            </div>
                            <div className="text-xs text-[#a09a90] truncate mt-0.5">
                              {track.artistName}
                            </div>
                            {track.license && (
                              <div className="text-[10px] text-amber-400/70 font-mono truncate">
                                {track.license}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setDownloadingFMAId(track.id);
                              downloadFMATrack(track);
                              setTimeout(() => setDownloadingFMAId(null), 2000);
                            }}
                            className="p-1.5 text-[#888] hover:text-amber-400 transition-colors"
                            title="Download full MP3"
                          >
                            <Download className={`w-4 h-4 ${downloadingFMAId === track.id ? 'animate-bounce text-amber-300' : ''}`} />
                          </button>
                          <button
                            onClick={e => handleAddToQueue(e, track)}
                            className="p-1.5 text-[#888] hover:text-white transition-colors"
                            title="Add to queue"
                          >
                            {addedTrackId === track.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Curated Hits Section (if real songs were shown first) */}
            {(filterType === 'all' || filterType === 'tracks') && realTracks.length > 0 && matchingTracks.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#242424]">
                <h2 className="text-xl font-bold text-white tracking-tight">Iconic Hits & Anthems</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matchingTracks.map(track => (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, matchingTracks)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#181818] hover:bg-[#222] cursor-pointer transition-colors"
                    >
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-white truncate">{track.title}</div>
                        <div className="text-xs text-[#a7a7a7] truncate">{track.artistName}</div>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          playTrack(track, matchingTracks);
                        }}
                        className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-emerald-500 hover:text-black flex items-center justify-center text-white transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artists Section */}
            {(filterType === 'all' || filterType === 'artists') && matchingArtists.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {matchingArtists.map(artist => (
                    <div
                      key={artist.id}
                      onClick={() => onNavigateArtist(artist.id)}
                      className="group p-4 rounded-2xl bg-[#181818] hover:bg-[#222222] border border-[#242424] transition-all cursor-pointer text-center"
                    >
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-3 border-2 border-[#282828] shadow-md group-hover:border-emerald-500/50 transition-colors">
                        <img
                          src={artist.avatarUrl}
                          alt={artist.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="font-bold text-sm text-white truncate group-hover:text-emerald-400">
                        {artist.name}
                      </div>
                      <div className="text-xs text-[#a7a7a7] mt-0.5 capitalize">
                        {artist.genres[0] || 'Artist'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums Section */}
            {(filterType === 'all' || filterType === 'albums') && matchingAlbums.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {matchingAlbums.map(album => (
                    <div
                      key={album.id}
                      onClick={() => onNavigateAlbum(album.id)}
                      className="group p-4 rounded-2xl bg-[#181818] hover:bg-[#222222] border border-[#242424] transition-all cursor-pointer"
                    >
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full aspect-square rounded-xl object-cover mb-3 shadow-md group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="font-bold text-sm text-white truncate group-hover:text-emerald-400">
                        {album.title}
                      </div>
                      <div className="text-xs text-[#a7a7a7] mt-0.5 truncate">
                        {album.artistName} • {album.releaseYear}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists Section */}
            {(filterType === 'all' || filterType === 'playlists') && matchingPlaylists.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {matchingPlaylists.map(playlist => (
                    <div
                      key={playlist.id}
                      onClick={() => onNavigatePlaylist(playlist.id)}
                      className="group p-4 rounded-2xl bg-[#181818] hover:bg-[#222222] border border-[#242424] transition-all cursor-pointer"
                    >
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.title}
                        className="w-full aspect-square rounded-xl object-cover mb-3 shadow-md group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="font-bold text-sm text-white truncate group-hover:text-emerald-400">
                        {playlist.title}
                      </div>
                      <div className="text-xs text-[#a7a7a7] mt-0.5 line-clamp-2">
                        {playlist.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* 4. Browse Section (when search is empty) */
        <div className="space-y-8 pt-2">
          {/* Feature Card: Global Real Music Fetch */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#181818] to-[#141414] border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Global Music Previews
                </span>
                <span className="text-xs text-[#888]">Direct Audio Streaming</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Stream Real Songs from World Artists
              </h2>
              <p className="text-xs md:text-sm text-[#a7a7a7] max-w-xl leading-relaxed">
                Fetch and listen to genuine recordings by Taylor Swift, The Weeknd, Billie Eilish, Drake, Kendrick Lamar, Queen, and more with instant HTTP 206 range audio playback.
              </p>
            </div>

            <button
              onClick={handleFetchTopRealHits}
              disabled={isLoadingReal}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-xl hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2.5 flex-shrink-0"
            >
              <Zap className={`w-4 h-4 fill-black ${isLoadingReal ? 'animate-bounce' : ''}`} />
              <span>{isLoadingReal ? 'Loading Top Hits...' : 'Fetch Top 30 Hits'}</span>
            </button>
          </div>

          {/* Browse All Genres */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Browse All Genres</h2>
              <span className="text-xs text-[#888]">Click any category to filter</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {GENRES.map(genre => (
                <div
                  key={genre.id}
                  onClick={() => onSearchChange(genre.name)}
                  className={`group relative h-44 rounded-2xl p-4 overflow-hidden cursor-pointer shadow-lg transition-transform hover:scale-103 bg-gradient-to-br ${genre.color}`}
                >
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {genre.name}
                  </h3>
                  <img
                    src={genre.coverUrl}
                    alt={genre.name}
                    className="absolute right-[-15px] bottom-[-10px] w-24 h-24 object-cover rotate-[25deg] shadow-2xl rounded-lg transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

