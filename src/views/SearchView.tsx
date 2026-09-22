import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Music, Mic2, Disc, ListMusic } from 'lucide-react';
import { TRACKS, ARTISTS, ALBUMS, PLAYLISTS, GENRES } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime, formatCompactNumber } from '../utils/formatters';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
  onNavigatePlaylist: (id: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateArtist,
  onNavigateAlbum,
  onNavigatePlaylist,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();
  const [filterType, setFilterType] = useState<'all' | 'tracks' | 'artists' | 'albums' | 'playlists'>('all');

  // Filtered results
  const query = searchQuery.toLowerCase().trim();

  const matchingTracks = useMemo(() => {
    if (!query) return [];
    return TRACKS.filter(
      t =>
        t.title.toLowerCase().includes(query) ||
        t.artistName.toLowerCase().includes(query) ||
        t.genre.toLowerCase().includes(query)
    );
  }, [query]);

  const matchingArtists = useMemo(() => {
    if (!query) return [];
    return ARTISTS.filter(
      a =>
        a.name.toLowerCase().includes(query) ||
        a.genres.some(g => g.toLowerCase().includes(query))
    );
  }, [query]);

  const matchingAlbums = useMemo(() => {
    if (!query) return [];
    return ALBUMS.filter(
      a =>
        a.title.toLowerCase().includes(query) ||
        a.artistName.toLowerCase().includes(query) ||
        a.genre.toLowerCase().includes(query)
    );
  }, [query]);

  const matchingPlaylists = useMemo(() => {
    if (!query) return [];
    return PLAYLISTS.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [query]);

  const hasResults =
    matchingTracks.length > 0 ||
    matchingArtists.length > 0 ||
    matchingAlbums.length > 0 ||
    matchingPlaylists.length > 0;

  return (
    <div id="search-view" className="p-6 md:p-8 space-y-8 pb-20">
      {/* 1. Filter Pills (when query exists) */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['all', 'tracks', 'artists', 'albums', 'playlists'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                filterType === type
                  ? 'bg-white text-black'
                  : 'bg-[#242424] text-white hover:bg-[#303030]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* 2. Search Results View */}
      {query ? (
        !hasResults ? (
          <div className="py-20 text-center space-y-3">
            <h3 className="text-xl font-bold text-white">No results found for "{searchQuery}"</h3>
            <p className="text-sm text-[#a7a7a7]">
              Please check your spelling or try searching for a different keyword, artist, or genre.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Result + Top Tracks Section */}
            {(filterType === 'all' || filterType === 'tracks') && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Top Result Card */}
                {matchingTracks[0] && (
                  <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-xl font-bold text-white">Top Result</h2>
                    <div
                      onClick={() => playTrack(matchingTracks[0], matchingTracks)}
                      className="group p-5 rounded-xl bg-[#181818] hover:bg-[#222] transition-all cursor-pointer relative flex flex-col justify-between h-56"
                    >
                      <img
                        src={matchingTracks[0].coverUrl}
                        alt={matchingTracks[0].title}
                        className="w-24 h-24 rounded-lg object-cover shadow-lg"
                        referrerPolicy="no-referrer"
                      />

                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {matchingTracks[0].title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#a7a7a7] mt-1">
                          <span
                            className="text-white hover:underline"
                            onClick={e => {
                              e.stopPropagation();
                              onNavigateArtist(matchingTracks[0].artistId);
                            }}
                          >
                            {matchingTracks[0].artistName}
                          </span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#242424] text-[10px] font-bold text-white">
                            Song
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          playTrack(matchingTracks[0], matchingTracks);
                        }}
                        className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all"
                      >
                        <Play className="w-5 h-5 fill-black translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tracks List */}
                <div className={`${matchingTracks[0] ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-3`}>
                  <h2 className="text-xl font-bold text-white">Songs</h2>
                  <div className="space-y-1">
                    {matchingTracks.slice(0, 4).map(track => {
                      const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                      return (
                        <div
                          key={track.id}
                          onClick={() => playTrack(track, matchingTracks)}
                          className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#202020] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-4 h-4 fill-white text-white" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div
                                className={`text-sm font-semibold truncate ${
                                  isThisPlaying ? 'text-emerald-400' : 'text-white'
                                }`}
                              >
                                {track.title}
                              </div>
                              <div className="text-xs text-[#a7a7a7] truncate">
                                {track.artistName}
                              </div>
                            </div>
                          </div>

                          <div className="text-xs font-mono text-[#727272]">
                            {formatTime(track.durationSeconds)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Artists Section */}
            {(filterType === 'all' || filterType === 'artists') && matchingArtists.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {matchingArtists.map(artist => (
                    <div
                      key={artist.id}
                      onClick={() => onNavigateArtist(artist.id)}
                      className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer text-center"
                    >
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-3 border border-[#282828] shadow-md">
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
                      <div className="text-xs text-[#a7a7a7] mt-0.5">Artist</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums Section */}
            {(filterType === 'all' || filterType === 'albums') && matchingAlbums.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {matchingAlbums.map(album => (
                    <div
                      key={album.id}
                      onClick={() => onNavigateAlbum(album.id)}
                      className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer"
                    >
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full aspect-square rounded-lg object-cover mb-3 shadow-md group-hover:scale-105 transition-transform"
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
          </div>
        )
      ) : (
        /* 3. Browse All Categories / Genre Cards (default view when search query is empty) */
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Browse All Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {GENRES.map(genre => (
              <div
                key={genre.id}
                onClick={() => onSearchChange(genre.name)}
                className={`group relative h-44 rounded-xl p-4 overflow-hidden cursor-pointer shadow-lg transition-transform hover:scale-102 bg-gradient-to-br ${genre.color}`}
              >
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {genre.name}
                </h3>
                <img
                  src={genre.coverUrl}
                  alt={genre.name}
                  className="absolute right-[-15px] bottom-[-10px] w-24 h-24 object-cover rotate-[25deg] shadow-2xl rounded-md transition-transform group-hover:scale-110"
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
