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
} from 'lucide-react';
import { TRACKS, ARTISTS, ALBUMS, PLAYLISTS, GENRES } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';
import { Track } from '../types';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
  onNavigatePlaylist: (id: string) => void;
}

const TRENDING_SUGGESTIONS = [
  '🔥 Top Hits',
  'Pop',
  'Hip-Hop',
  'Lo-Fi Beats',
  'Synthwave',
  'R&B',
  'Deep House',
  'Alternative Rock',
  'Afrobeats',
  'Acoustic Indie',
];

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateArtist,
  onNavigateAlbum,
  onNavigatePlaylist,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue } = useAudio();
  const [filterType, setFilterType] = useState<'all' | 'tracks' | 'artists' | 'albums' | 'playlists'>('all');
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when landing on Search view if empty
  useEffect(() => {
    if (!searchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddToQueue = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    addToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => {
      setAddedTrackId(prev => (prev === track.id ? null : prev));
    }, 1800);
  };

  // Smart multi-keyword query parsing
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

      // Direct full query substring match
      if (
        titleLower.includes(cleanQuery) ||
        artistLower.includes(cleanQuery) ||
        albumLower.includes(cleanQuery) ||
        genreLower.includes(cleanQuery) ||
        lyricsJoined.includes(cleanQuery)
      ) {
        return true;
      }

      // Multi-word match: every word in the query must be found in at least one attribute
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
    matchingTracks.length > 0 ||
    matchingArtists.length > 0 ||
    matchingAlbums.length > 0 ||
    matchingPlaylists.length > 0;

  const handleSuggestionClick = (suggestion: string) => {
    const queryTerm = suggestion.replace('🔥 ', '');
    onSearchChange(queryTerm);
  };

  return (
    <div id="search-view" className="p-6 md:p-8 space-y-6 pb-24 max-w-7xl mx-auto">
      {/* 1. Main Search Header & Primary Input Bar */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a7a7a7]" />
          <input
            ref={inputRef}
            id="search-view-input"
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search songs, artists, albums, or lyrics..."
            className="w-full bg-[#242424] hover:bg-[#2b2b2b] focus:bg-[#2e2e2e] text-base md:text-lg text-white placeholder-[#7e7e7e] pl-12 pr-11 py-3.5 rounded-full outline-none border border-transparent focus:border-white/40 shadow-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#383838] hover:bg-[#484848] text-white flex items-center justify-center transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[#888] font-medium flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Try:
          </span>
          {TRENDING_SUGGESTIONS.map(s => {
            const rawTerm = s.replace('🔥 ', '');
            const isActive = cleanQuery === rawTerm.toLowerCase();
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

      {/* 2. Filter Pills (when query exists) */}
      {cleanQuery && hasResults && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#242424] pt-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'tracks', label: `Songs (${matchingTracks.length})` },
            { id: 'artists', label: `Artists (${matchingArtists.length})` },
            { id: 'albums', label: `Albums (${matchingAlbums.length})` },
            { id: 'playlists', label: `Playlists (${matchingPlaylists.length})` },
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
      {cleanQuery ? (
        !hasResults ? (
          <div className="py-16 text-center space-y-4 bg-[#161616] rounded-2xl p-8 border border-[#242424]">
            <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center mx-auto text-[#888]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">No results found for "{searchQuery}"</h3>
            <p className="text-sm text-[#a7a7a7] max-w-md mx-auto">
              Please check your spelling, try fewer keywords, or click any popular genre or trending pill above.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onSearchChange('Pop')}
                className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333] text-xs font-semibold text-white transition-colors"
              >
                Search Pop
              </button>
              <button
                onClick={() => onSearchChange('Lo-Fi Beats')}
                className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333] text-xs font-semibold text-white transition-colors"
              >
                Search Lo-Fi Beats
              </button>
              <button
                onClick={() => onSearchChange('Synthwave')}
                className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333] text-xs font-semibold text-white transition-colors"
              >
                Search Synthwave
              </button>
              <button
                onClick={() => onSearchChange('')}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition-colors"
              >
                Browse All Genres
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Result + Songs Section */}
            {(filterType === 'all' || filterType === 'tracks') && matchingTracks.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Top Result Card */}
                {matchingTracks[0] && (
                  <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-xl font-bold text-white tracking-tight">Top Result</h2>
                    <div
                      onClick={() => playTrack(matchingTracks[0], matchingTracks)}
                      className="group p-5 rounded-2xl bg-[#181818] hover:bg-[#222222] transition-all cursor-pointer relative flex flex-col justify-between h-64 border border-[#242424] shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={matchingTracks[0].coverUrl}
                          alt={matchingTracks[0].title}
                          className="w-24 h-24 rounded-xl object-cover shadow-xl flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="px-2.5 py-1 rounded-full bg-[#282828] text-[10px] font-bold uppercase tracking-wider text-emerald-400 inline-block mb-1.5">
                            {matchingTracks[0].genre || 'Song'}
                          </span>
                          <h3 className="text-2xl font-extrabold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {matchingTracks[0].title}
                          </h3>
                          <div className="text-xs text-[#a7a7a7] mt-1 truncate">
                            By{' '}
                            <span
                              className="text-white hover:underline cursor-pointer"
                              onClick={e => {
                                e.stopPropagation();
                                onNavigateArtist(matchingTracks[0].artistId);
                              }}
                            >
                              {matchingTracks[0].artistName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#242424]/60">
                        <span className="text-xs text-[#888] font-mono">
                          Duration: {formatTime(matchingTracks[0].durationSeconds)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => handleAddToQueue(e, matchingTracks[0])}
                            className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#383838] text-white flex items-center justify-center transition-colors"
                            title="Add to queue"
                          >
                            {addedTrackId === matchingTracks[0].id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              playTrack(matchingTracks[0], matchingTracks);
                            }}
                            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl group-hover:scale-105 active:scale-95 transition-all"
                            title="Play song"
                          >
                            {currentTrack?.id === matchingTracks[0].id && isPlaying ? (
                              <Pause className="w-5 h-5 fill-black" />
                            ) : (
                              <Play className="w-5 h-5 fill-black translate-x-0.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Songs List */}
                <div className={`${matchingTracks[0] ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight">Songs</h2>
                    <span className="text-xs text-[#888]">
                      {matchingTracks.length} song{matchingTracks.length === 1 ? '' : 's'} found
                    </span>
                  </div>

                  <div className="space-y-1">
                    {(filterType === 'tracks' ? matchingTracks : matchingTracks.slice(0, 5)).map(
                      (track, idx) => {
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

                              <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow">
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
                                <div
                                  className={`text-sm font-semibold truncate ${
                                    isThisCurrent ? 'text-emerald-400' : 'text-white'
                                  }`}
                                >
                                  {track.title}
                                </div>
                                <div className="text-xs text-[#a7a7a7] truncate flex items-center gap-1.5 mt-0.5">
                                  <span
                                    className="hover:underline hover:text-white"
                                    onClick={e => {
                                      e.stopPropagation();
                                      onNavigateArtist(track.artistId);
                                    }}
                                  >
                                    {track.artistName}
                                  </span>
                                  {track.albumTitle && (
                                    <>
                                      <span>•</span>
                                      <span
                                        className="hover:underline hover:text-white truncate"
                                        onClick={e => {
                                          e.stopPropagation();
                                          if (track.albumId) onNavigateAlbum(track.albumId);
                                        }}
                                      >
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
                      }
                    )}
                  </div>
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
        /* 4. Browse All Genres / Categories (when search is empty) */
        <div className="space-y-6 pt-2">
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
      )}
    </div>
  );
};
