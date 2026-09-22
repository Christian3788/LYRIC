import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Play,
  Pause,
  Music,
  Mic2,
  ListMusic,
  Plus,
  Check,
  X,
  Sparkles,
  Clock,
  Compass,
  RefreshCw,
  Video,
  Headphones,
} from 'lucide-react';
import { TRACKS, ARTISTS, ALBUMS, PLAYLISTS, GENRES } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';
import { Track } from '../types';
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
  const [filterType, setFilterType] = useState<'all' | 'audius' | 'doodle' | 'tracks' | 'artists' | 'albums' | 'playlists'>('all');
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);
  const [doodleTracks, setDoodleTracks] = useState<Track[]>([]);
  const [isLoadingDoodle, setIsLoadingDoodle] = useState<boolean>(false);
  const [audiusTracks, setAudiusTracks] = useState<Track[]>([]);
  const [isLoadingAudius, setIsLoadingAudius] = useState<boolean>(false);
  const [selectedAudiusGenre, setSelectedAudiusGenre] = useState<string>('All');
  const [hasManuallyFetched, setHasManuallyFetched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when landing on Search view if empty
  useEffect(() => {
    if (!searchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounced live fetch of Audius tracks and DOODLE video streams
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      if (!hasManuallyFetched) {
        setDoodleTracks([]);
        setAudiusTracks([]);
      }
      return;
    }

    let isMounted = true;
    setIsLoadingDoodle(true);
    setIsLoadingAudius(true);

    const timer = setTimeout(async () => {
      try {
        const [fetchedYT, fetchedAudius] = await Promise.allSettled([
          searchYouTubeMusic(`${trimmed} official video`, 18),
          searchAudius(trimmed, 20),
        ]);

        if (isMounted) {
          if (fetchedYT.status === 'fulfilled') {
            setDoodleTracks(fetchedYT.value);
          }
          if (fetchedAudius.status === 'fulfilled') {
            setAudiusTracks(fetchedAudius.value);
          }
          setIsLoadingDoodle(false);
          setIsLoadingAudius(false);
        }
      } catch (err) {
        console.warn('Live search caught:', err);
        if (isMounted) {
          setIsLoadingDoodle(false);
          setIsLoadingAudius(false);
        }
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, hasManuallyFetched]);

  // Handle manual "Fetch DOODLE Trending" click
  const handleFetchDoodleTrending = async () => {
    setIsLoadingDoodle(true);
    setHasManuallyFetched(true);
    try {
      const ytResults = await fetchTrendingYouTubeMusic(24);
      setDoodleTracks(ytResults);
      if (!searchQuery) {
        onSearchChange('Trending Videos');
      }
    } catch (e) {
      console.warn('Error fetching DOODLE trending:', e);
    } finally {
      setIsLoadingDoodle(false);
    }
  };

  // Handle manual "Fetch Audius Music" click (Step 1)
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
    doodleTracks.length > 0 ||
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
      : filterType === 'doodle'
      ? doodleTracks[0]
      : audiusTracks[0] || doodleTracks[0] || matchingTracks[0];

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
              placeholder="Search songs, artists, albums, DOODLE streams, Audius music..."
              className="w-full bg-[#242424] hover:bg-[#2b2b2b] focus:bg-[#2e2e2e] text-base md:text-lg text-white placeholder-[#7e7e7e] pl-12 pr-11 py-3.5 rounded-full outline-none border border-transparent focus:border-emerald-500/50 shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setDoodleTracks([]);
                  setAudiusTracks([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#383838] hover:bg-[#484848] text-white flex items-center justify-center transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Actions: Audius (Step 1) and DOODLE Streams */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              id="fetch-audius-songs-btn"
              onClick={() => handleFetchAudiusTrending()}
              disabled={isLoadingAudius}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-purple-600/20 active:scale-95 transition-all flex-1 sm:flex-initial whitespace-nowrap"
              title="Fetch trending tracks from Audius decentralized music API"
            >
              <Music className={`w-4 h-4 ${isLoadingAudius ? 'animate-spin' : ''}`} />
              <span>{isLoadingAudius ? 'Fetching Audius...' : 'Step 1 • Audius API'}</span>
            </button>

            <button
              id="fetch-doodle-songs-btn"
              onClick={handleFetchDoodleTrending}
              disabled={isLoadingDoodle}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-600/20 active:scale-95 transition-all flex-1 sm:flex-initial whitespace-nowrap"
              title="Fetch DOODLE video and music streams"
            >
              <Video className={`w-4 h-4 ${isLoadingDoodle ? 'animate-spin' : ''}`} />
              <span>{isLoadingDoodle ? 'Fetching DOODLE...' : 'DOODLE Streams'}</span>
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

      {/* 2. Filter Pills (when query or streams exist) */}
      {(cleanQuery || audiusTracks.length > 0 || doodleTracks.length > 0) && hasResults && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#242424] pt-2">
          {[
            { id: 'all', label: 'All' },
            ...(audiusTracks.length > 0 ? [{ id: 'audius', label: `Audius (${audiusTracks.length})` }] : []),
            ...(doodleTracks.length > 0 ? [{ id: 'doodle', label: `DOODLE Streams (${doodleTracks.length})` }] : []),
            ...(matchingTracks.length > 0 ? [{ id: 'tracks', label: `Songs (${matchingTracks.length})` }] : []),
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
      {cleanQuery || audiusTracks.length > 0 || doodleTracks.length > 0 ? (
        !hasResults && !isLoadingDoodle && !isLoadingAudius ? (
          <div className="py-16 text-center space-y-4 bg-[#161616] rounded-2xl p-8 border border-[#242424]">
            <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center mx-auto text-[#888]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">No results found for "{searchQuery}"</h3>
            <p className="text-sm text-[#a7a7a7] max-w-md mx-auto">
              Explore thousands of tracks on Audius or stream video tracks with DOODLE.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleFetchAudiusTrending()}
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
              >
                Explore Audius Tracks
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
            {(isLoadingDoodle || isLoadingAudius) && (
              <div className="flex items-center gap-2 text-xs text-purple-400 font-medium py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching audio streams and music catalogs...</span>
              </div>
            )}

            {/* Top Result + Songs Section */}
            {(filterType === 'all' || filterType === 'tracks') && topResultTrack && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Top Result Card */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="text-xl font-bold text-white tracking-tight">Top Result</h2>
                  <div
                    onClick={() => playTrack(topResultTrack, matchingTracks.length > 0 ? matchingTracks : audiusTracks)}
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
                          <span className="px-2.5 py-1 rounded-full bg-[#282828] text-[10px] font-bold uppercase tracking-wider text-[#d4d4d4]">
                            {topResultTrack.isAudius ? 'Audius' : topResultTrack.isYouTube ? 'DOODLE' : topResultTrack.genre || 'Music'}
                          </span>
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
                        Full Audio • {formatTime(topResultTrack.durationSeconds)}
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
                            playTrack(topResultTrack, matchingTracks.length > 0 ? matchingTracks : audiusTracks);
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

                {/* Songs List */}
                <div className="lg:col-span-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Songs
                      </h2>
                    </div>
                    <span className="text-xs text-[#888]">
                      {matchingTracks.length} track(s)
                    </span>
                  </div>

                  <div className="space-y-1">
                    {matchingTracks
                      .slice(0, filterType === 'tracks' ? 50 : 6)
                      .map((track, idx) => {
                        const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                        const isThisCurrent = currentTrack?.id === track.id;

                        return (
                          <div
                            key={track.id}
                            onClick={() => playTrack(track, matchingTracks)}
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
                        <span className="px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider border border-purple-400/30">
                          Step 1 • Audius API
                        </span>
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

            {/* DOODLE Streams & Videos Section */}
            {(filterType === 'all' || filterType === 'doodle') && doodleTracks.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#242424]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] tracking-wider">
                          DOODLE
                        </span>
                        <h2 className="text-xl font-bold text-white tracking-tight">DOODLE Streams & Videos</h2>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {doodleTracks.length} VIDEOS
                        </span>
                      </div>
                      <p className="text-xs text-[#a7a7a7]">
                        Stream music videos and listen via the DOODLE media player
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {doodleTracks.map(track => {
                    const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          playTrack(track, doodleTracks);
                          openVideo();
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl bg-[#141a16] hover:bg-[#1e2921] transition-all cursor-pointer border border-[#202b23] hover:border-emerald-500/30 shadow-md"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#1b241e] flex-shrink-0">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              {isThisTrackPlaying ? (
                                <Pause className="w-4 h-4 text-emerald-400 fill-emerald-400" />
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
                              <span className="font-semibold text-sm text-white truncate group-hover:text-emerald-400 transition-colors" title={track.title}>
                                {track.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#a7a7a7]">
                              <span className="truncate">{track.channelName || track.artistName}</span>
                              <span className="px-1 py-0.2 rounded bg-emerald-600/20 text-emerald-400 text-[8px] font-bold">DOODLE</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              playTrack(track, doodleTracks);
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
                              playTrack(track, doodleTracks);
                              openVideo();
                            }}
                            className="p-2 text-[#888] hover:text-white hover:bg-[#203024] rounded-full transition-colors"
                            title="Watch Video"
                          >
                            <Video className="w-4 h-4 text-emerald-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
          {/* Feature Card: Audius Decentralized Music */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#181818] to-[#141414] border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-400/30">
                  Step 1 • Audius API
                </span>
                <span className="text-xs text-[#b8a5cf]">Decentralized Streaming</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Stream Unlimited Tracks with Audius & DOODLE
              </h2>
              <p className="text-xs md:text-sm text-[#a7a7a7] max-w-xl leading-relaxed">
                Discover independent artists, trending tracks, and high quality streaming with Audius integration and DOODLE media playback.
              </p>
            </div>

            <button
              onClick={() => handleFetchAudiusTrending()}
              disabled={isLoadingAudius}
              className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-xl hover:shadow-purple-500/25 active:scale-95 transition-all flex items-center gap-2.5 flex-shrink-0"
            >
              <Music className={`w-4 h-4 fill-current ${isLoadingAudius ? 'animate-bounce' : ''}`} />
              <span>{isLoadingAudius ? 'Loading Audius...' : 'Explore Audius Trending'}</span>
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

