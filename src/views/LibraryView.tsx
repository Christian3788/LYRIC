import React, { useState, useEffect } from 'react';
import { Heart, Plus, Music, User, DownloadCloud, Play, Trash2, Edit3, Palette } from 'lucide-react';
import { Playlist, Artist, Track } from '../types';
import { ARTISTS, TRACKS } from '../data/mockCatalog';
import { getOfflineTracks, removeTrackOffline } from '../services/offlineStorageService';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';
import { useLikedTrackIds } from '../services/favoritesService';

interface LibraryViewProps {
  playlists: Playlist[];
  onNavigatePlaylist: (id: string) => void;
  onNavigateArtist: (id: string) => void;
  onCreatePlaylist: () => void;
  onEditPlaylist?: (playlist: Playlist) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  playlists,
  onNavigatePlaylist,
  onNavigateArtist,
  onCreatePlaylist,
  onEditPlaylist,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'artists' | 'downloaded'>('all');
  const [offlineTracks, setOfflineTracks] = useState<Track[]>([]);
  const likedTrackIds = useLikedTrackIds();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const loadOffline = async () => {
    const list = await getOfflineTracks();
    setOfflineTracks(list);
  };

  useEffect(() => {
    loadOffline();
  }, [activeFilter]);

  const handleRemoveOffline = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    await removeTrackOffline(trackId);
    loadOffline();
  };

  return (
    <div id="library-view" className="p-6 md:p-8 space-y-6 pb-20">
      {/* 1. Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Your Library</h1>
          <p className="text-xs text-[#888] mt-0.5">Playlists, saved artists, and offline downloaded music</p>
        </div>
        <button
          onClick={onCreatePlaylist}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'playlists', 'artists', 'downloaded'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === filter
                ? 'bg-white text-black shadow-md font-bold'
                : 'bg-[#242424] text-white hover:bg-[#303030]'
            }`}
          >
            {filter === 'downloaded' && <DownloadCloud className="w-3.5 h-3.5 text-emerald-500" />}
            <span>{filter === 'downloaded' ? 'Offline Cache' : filter}</span>
            {filter === 'downloaded' && offlineTracks.length > 0 && (
              <span className="ml-1 text-[10px] bg-emerald-500 text-black px-1.5 py-0.2 rounded-full font-bold">
                {offlineTracks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Offline Tracks Section (when downloaded filter is selected) */}
      {activeFilter === 'downloaded' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Offline Music Storage (IndexedDB)</h3>
                <p className="text-xs text-emerald-300/80">
                  {offlineTracks.length} tracks cached in your browser for zero-bandwidth playback
                </p>
              </div>
            </div>
          </div>

          {offlineTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#161619] rounded-2xl border border-[#242428] space-y-3">
              <DownloadCloud className="w-12 h-12 text-[#444] mx-auto" />
              <div className="text-sm font-bold text-white">No tracks downloaded yet</div>
              <p className="text-xs text-[#777] max-w-sm mx-auto">
                Click the download icon on any song in the player bar or track lists to save it for offline listening.
              </p>
            </div>
          ) : (
            <div className="bg-[#141416] rounded-2xl border border-[#222] divide-y divide-[#222] overflow-hidden">
              {offlineTracks.map((track, i) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, offlineTracks)}
                    className="p-3.5 flex items-center justify-between hover:bg-[#1f1f24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-xs text-[#666] font-mono text-center">{i + 1}</span>
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-semibold truncate ${
                            isCurrent ? 'text-emerald-400' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </div>
                        <div className="text-xs text-[#777] truncate">{track.artistName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#666] font-mono">
                        {formatTime(track.durationSeconds || 60)}
                      </span>
                      <button
                        onClick={e => handleRemoveOffline(e, track.id)}
                        className="p-1.5 rounded-full hover:bg-red-500/20 text-[#666] hover:text-red-400 transition-colors"
                        title="Remove from offline storage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Library Grid (Playlists & Artists) */}
      {activeFilter !== 'downloaded' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Liked Songs Special Card */}
          {(activeFilter === 'all' || activeFilter === 'playlists') && (
            <div
              onClick={() => onNavigatePlaylist('liked')}
              className="group p-4 rounded-xl bg-gradient-to-br from-indigo-700 via-purple-800 to-emerald-600 hover:scale-102 transition-all cursor-pointer flex flex-col justify-end h-56 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Liked Songs</h3>
                <p className="text-xs text-white/80 mt-1">
                  {likedTrackIds.length} saved {likedTrackIds.length === 1 ? 'track' : 'tracks'}
                </p>
              </div>
            </div>
          )}

          {/* Custom Playlists */}
          {(activeFilter === 'all' || activeFilter === 'playlists') &&
            playlists.map(playlist => (
              <div
                key={playlist.id}
                onClick={() => onNavigatePlaylist(playlist.id)}
                className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer flex flex-col relative"
              >
                <div className="relative mb-3 overflow-hidden rounded-lg">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.title}
                    className="w-full aspect-square rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {onEditPlaylist && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onEditPlaylist(playlist);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow"
                      title="Edit playlist artwork & details"
                    >
                      <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  )}
                </div>
                <span className="font-bold text-sm text-white truncate group-hover:text-emerald-400">
                  {playlist.title}
                </span>
                <span className="text-xs text-[#a7a7a7] mt-0.5">
                  Playlist • {playlist.creatorName}
                </span>
              </div>
            ))}

          {/* Followed Artists */}
          {(activeFilter === 'all' || activeFilter === 'artists') &&
            ARTISTS.map(artist => (
              <div
                key={artist.id}
                onClick={() => onNavigateArtist(artist.id)}
                className="group p-4 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border border-[#282828] shadow-md">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-bold text-sm text-white truncate w-full group-hover:text-emerald-400">
                  {artist.name}
                </span>
                <span className="text-xs text-[#a7a7a7] mt-0.5">Artist</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
