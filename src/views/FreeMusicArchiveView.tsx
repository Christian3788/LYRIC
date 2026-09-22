import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Download,
  Search,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Plus,
  Check,
  Disc,
  Filter,
  ShieldCheck,
  Radio,
  Music,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Track } from '../types';
import {
  FMA_GENRES,
  FMAGenre,
  searchFMATracks,
  getFMAFeatured,
  downloadFMATrack,
} from '../services/fmaService';
import { formatTime } from '../utils/formatters';

interface FreeMusicArchiveViewProps {
  onNavigateArtist?: (id: string) => void;
  onNavigateAlbum?: (id: string) => void;
}

export const FreeMusicArchiveView: React.FC<FreeMusicArchiveViewProps> = ({
  onNavigateArtist,
  onNavigateAlbum,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue } = useAudio();

  const [selectedGenre, setSelectedGenre] = useState<FMAGenre>(FMA_GENRES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load initial genre and featured tracks
  useEffect(() => {
    loadGenreTracks(FMA_GENRES[0].query);
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const feat = await getFMAFeatured();
      setFeaturedTracks(feat);
    } catch (e) {
      console.warn('Failed loading featured FMA tracks:', e);
    }
  };

  const loadGenreTracks = async (genreQuery: string) => {
    setIsLoading(true);
    try {
      const results = await searchFMATracks(genreQuery, 30);
      setTracks(results);
    } catch (e) {
      console.warn('Failed loading genre tracks:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Search input with debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchFMATracks(trimmed, 30);
        setTracks(results);
      } catch (e) {
        console.warn('Failed searching FMA:', e);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectGenre = (genre: FMAGenre) => {
    setSelectedGenre(genre);
    setSearchQuery('');
    loadGenreTracks(genre.query);
  };

  const handleAddToQueue = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    addToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => setAddedTrackId(null), 1800);
  };

  const handleDownload = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    setDownloadingId(track.id);
    downloadFMATrack(track);
    setTimeout(() => setDownloadingId(null), 2500);
  };

  return (
    <div id="fma-view" className="p-6 md:p-8 space-y-8 pb-32 max-w-7xl mx-auto">
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#1a1815] to-[#121212] border border-amber-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                <Disc className="w-3.5 h-3.5 text-amber-400" />
                Free Music Archive (FMA)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Creative Commons & Full Songs
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Stream & Download Legal Music from Free Music Archive
            </h1>

            <p className="text-sm md:text-base text-[#c7c0b7] leading-relaxed">
              Explore thousands of curated, full-length songs from independent artists,
              curated record labels, and sound artists worldwide. Stream instantly or download high-fidelity MP3s.
            </p>
          </div>

          {/* Quick Stats or Badge */}
          <div className="flex flex-col gap-3 bg-[#181614]/80 backdrop-blur-md p-4 rounded-2xl border border-amber-500/20 min-w-[220px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#999] uppercase font-bold tracking-wider">Audio Quality</div>
                <div className="text-sm font-extrabold text-white">Full Length MP3 Streams</div>
              </div>
            </div>
            <div className="border-t border-[#2e2b26] pt-2 text-xs text-[#a09a90] flex items-center justify-between">
              <span>Source Catalog</span>
              <span className="text-amber-300 font-semibold">freemusicarchive.org</span>
            </div>
          </div>
        </div>

        {/* Search inside FMA */}
        <div className="mt-6 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-300/60" />
          <input
            ref={searchInputRef}
            id="fma-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Free Music Archive (e.g. ambient, piano, electronic, guitar, beats)..."
            className="w-full bg-[#181614] hover:bg-[#201e1b] focus:bg-[#25221e] text-white text-sm md:text-base placeholder-[#807a70] pl-12 pr-10 py-3 rounded-full outline-none border border-amber-500/30 focus:border-amber-400 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                loadGenreTracks(selectedGenre.query);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#999] hover:text-white px-2 py-1 rounded bg-[#2e2a25]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. Genre Selector Carousel / Pills */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Free Music Archive Genres
            </h2>
          </div>
          <span className="text-xs text-[#888]">10 Curated Sound Categories</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FMA_GENRES.map(genre => {
            const isSelected = selectedGenre.id === genre.id && !searchQuery;
            return (
              <button
                key={genre.id}
                onClick={() => handleSelectGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-102 font-bold'
                    : 'bg-[#1c1b1a] text-[#cfc8c0] hover:bg-[#292724] hover:text-white border border-[#2e2a26]'
                }`}
              >
                <span>{genre.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Showcase Strip (if available) */}
      {!searchQuery && featuredTracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                Featured Free Music Archive Gems
              </h2>
            </div>
            <span className="text-xs text-[#888]">Curated independent tracks</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
            {featuredTracks.slice(0, 6).map(track => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, featuredTracks)}
                  className="group p-3 rounded-xl bg-[#181716] hover:bg-[#242220] border border-[#2b2824] hover:border-amber-500/30 transition-all cursor-pointer flex flex-col relative"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2.5 bg-[#201e1c]">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-bold text-amber-300 border border-amber-500/30">
                      FULL SONG
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (currentTrack?.id === track.id) togglePlayPause();
                        else playTrack(track, featuredTracks);
                      }}
                      className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-xl transition-all ${
                        isThisPlaying
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-black" />
                      ) : (
                        <Play className="w-4 h-4 fill-black translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="font-semibold text-xs text-white truncate group-hover:text-amber-400 transition-colors">
                    {track.title}
                  </div>
                  <div className="text-[11px] text-[#9c958c] truncate mt-0.5">
                    {track.artistName}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Active Catalog List & Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242220] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {searchQuery ? `Search Results: "${searchQuery}"` : `${selectedGenre.name} Tracks`}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                {tracks.length} Songs Available
              </span>
            </div>
            {!searchQuery && (
              <p className="text-xs text-[#9c958c] mt-0.5">{selectedGenre.description}</p>
            )}
          </div>

          <button
            onClick={() => loadGenreTracks(searchQuery || selectedGenre.query)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1c1a] hover:bg-[#2a2724] text-xs font-semibold text-[#d4cdc5] hover:text-white border border-[#2e2a26] transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh From FMA</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-[#c0b8ad]">
              Connecting to Free Music Archive & fetching full-length tracks...
            </span>
          </div>
        ) : tracks.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#171615] rounded-2xl border border-[#2a2724] p-8">
            <Disc className="w-10 h-10 text-amber-400/50 mx-auto" />
            <h3 className="text-base font-bold text-white">No tracks found for this query</h3>
            <p className="text-xs text-[#999] max-w-md mx-auto">
              Try selecting one of the genre categories above or search for "electronic", "piano", "jazz", or "guitar".
            </p>
            <button
              onClick={() => handleSelectGenre(FMA_GENRES[0])}
              className="mt-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all"
            >
              Browse Electronic Hits
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {tracks.map((track, idx) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              const isThisCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, tracks)}
                  className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border ${
                    isThisCurrent
                      ? 'bg-[#24211d] border-amber-500/40 shadow-md'
                      : 'bg-[#181716]/60 hover:bg-[#201e1b] border-transparent hover:border-[#2e2a26]'
                  }`}
                >
                  {/* Left: Index, Cover, Title, Artist */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-6 text-center font-mono text-xs text-[#706a62] group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (isThisCurrent) togglePlayPause();
                        else playTrack(track, tracks);
                      }}
                      className="w-6 items-center justify-center hidden group-hover:flex text-amber-400"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </button>

                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#242220] shadow-md">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                      {isThisPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-1 bg-amber-400 animate-pulse h-full" />
                            <span className="w-1 bg-amber-400 animate-pulse h-2" />
                            <span className="w-1 bg-amber-400 animate-pulse h-3" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`text-sm font-bold truncate ${
                            isThisCurrent ? 'text-amber-400' : 'text-white group-hover:text-amber-300'
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase tracking-wider flex-shrink-0 border border-amber-500/30">
                          FMA FULL
                        </span>
                      </div>
                      <div className="text-xs text-[#a0988e] truncate flex items-center gap-2 mt-0.5">
                        <span className="hover:text-white truncate font-medium">
                          {track.artistName}
                        </span>
                        {track.albumTitle && (
                          <>
                            <span className="text-[#555]">•</span>
                            <span className="text-[#807a72] truncate">{track.albumTitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Genre pill (desktop) */}
                  <div className="hidden md:flex items-center gap-2 flex-shrink-0 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#201e1c] text-[#a0988e] text-[11px] font-medium border border-[#2b2723]">
                      {track.genre || selectedGenre.name}
                    </span>
                  </div>

                  {/* Right: Duration & Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-mono text-[#807a72] hidden sm:block mr-1">
                      {formatTime(track.durationSeconds)}
                    </span>

                    {/* Add to Queue */}
                    <button
                      onClick={e => handleAddToQueue(e, track)}
                      className="p-2 rounded-full hover:bg-[#2b2723] text-[#a0988e] hover:text-white transition-colors"
                      title="Add to queue"
                    >
                      {addedTrackId === track.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>

                    {/* Download MP3 */}
                    <button
                      onClick={e => handleDownload(e, track)}
                      className="p-2 rounded-full hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-colors"
                      title="Download full MP3 from Free Music Archive"
                    >
                      <Download
                        className={`w-4 h-4 ${
                          downloadingId === track.id ? 'animate-bounce text-amber-300' : ''
                        }`}
                      />
                    </button>

                    {/* Open on Free Music Archive */}
                    {track.fmaUrl && (
                      <a
                        href={track.fmaUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-2 rounded-full hover:bg-[#2b2723] text-[#706a62] hover:text-amber-300 transition-colors hidden lg:block"
                        title="View track on Free Music Archive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
