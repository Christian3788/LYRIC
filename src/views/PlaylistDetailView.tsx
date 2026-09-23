import React, { useState } from 'react';
import {
  Play,
  Pause,
  Shuffle,
  Heart,
  Clock,
  MoreHorizontal,
  Music,
  Radio,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Playlist, Track } from '../types';
import { TRACKS, PLAYLISTS, ALBUMS } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime, formatCompactNumber } from '../utils/formatters';
import { downloadTrackOffline } from '../services/offlineStorageService';

interface PlaylistDetailViewProps {
  playlistId: string;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlistId,
  onNavigateArtist,
  onNavigateAlbum,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle, startRadio } = useAudio();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  const handleDownload = async (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    setDownloadingId(track.id);
    const ok = await downloadTrackOffline(track);
    setDownloadingId(null);
    if (ok) {
      setDownloadedIds(prev => new Set([...prev, track.id]));
    }
  };

  // Find playlist or fallback to Liked Songs
  const isLikedView = playlistId === 'liked';
  let playlist: Playlist | undefined;

  if (isLikedView) {
    playlist = {
      id: 'liked',
      title: 'Liked Songs',
      description: 'Your personal collection of saved and favorite songs.',
      coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
      creatorId: 'user_1',
      creatorName: 'You',
      isPublic: false,
      trackIds: ['track_1', 'track_4', 'track_7', 'track_10', 'track_2'],
      createdAt: '2026-01-01',
    };
  } else {
    playlist = PLAYLISTS.find(p => p.id === playlistId) || PLAYLISTS[0];
  }

  // Resolve tracks in this playlist
  const playlistTracks: Track[] = playlist.trackIds
    .map(id => TRACKS.find(t => t.id === id))
    .filter((t): t is Track => !!t);

  const totalDurationSeconds = playlistTracks.reduce((acc, t) => acc + t.durationSeconds, 0);
  const isCurrentlyPlayingThis =
    currentTrack && playlistTracks.some(t => t.id === currentTrack.id) && isPlaying;

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      if (isCurrentlyPlayingThis) {
        togglePlayPause();
      } else {
        playTrack(playlistTracks[0], playlistTracks);
      }
    }
  };

  return (
    <div id="playlist-detail-view" className="pb-24">
      {/* 1. Hero Gradient Header */}
      <div className="relative p-6 md:p-8 pt-16 bg-gradient-to-b from-indigo-900/60 via-[#181818] to-[#121212] flex flex-col md:flex-row items-center md:items-end gap-6 select-none">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg shadow-2xl overflow-hidden flex-shrink-0 bg-[#242424]">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex flex-col gap-2 text-center md:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">
            {isLikedView ? 'Collection' : 'Public Playlist'}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight line-clamp-2">
            {playlist.title}
          </h1>
          <p className="text-xs md:text-sm text-[#b3b3b3] mt-1 max-w-xl">
            {playlist.description}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-white font-medium mt-2">
            <span className="font-bold">{playlist.creatorName}</span>
            <span>•</span>
            <span>{playlistTracks.length} songs</span>
            <span>•</span>
            <span className="text-[#a7a7a7]">{formatTime(totalDurationSeconds)}</span>
          </div>
        </div>
      </div>

      {/* 2. Action Bar (Play All, Shuffle, Like, More) */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 select-none">
        <button
          id="playlist-play-all-btn"
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-emerald-500 hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all"
          title="Play Playlist"
        >
          {isCurrentlyPlayingThis ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          onClick={() => {
            toggleShuffle();
            handlePlayAll();
          }}
          className="text-[#a7a7a7] hover:text-white transition-colors"
          title="Shuffle Play"
        >
          <Shuffle className="w-6 h-6" />
        </button>

        <button
          className="text-[#a7a7a7] hover:text-white transition-colors"
          title="Save to Library"
        >
          <Heart className="w-6 h-6" />
        </button>

        {playlistTracks.length > 0 && (
          <button
            onClick={() => startRadio(playlistTracks[0])}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#323232] text-white text-xs font-bold border border-[#383838] transition-all hover:scale-105"
            title="Start Smart Radio based on this playlist"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Playlist Radio</span>
          </button>
        )}

        <button className="text-[#a7a7a7] hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* 3. Tracks Table */}
      <div className="px-6 md:px-8">
        <div className="border-b border-[#282828] pb-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#a7a7a7] grid grid-cols-12 gap-4 px-4 select-none">
          <div className="col-span-1">#</div>
          <div className="col-span-6 md:col-span-5">Title</div>
          <div className="hidden md:block col-span-3">Album</div>
          <div className="hidden lg:block col-span-2">Plays</div>
          <div className="col-span-5 md:col-span-3 lg:col-span-1 text-right flex items-center justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          {playlistTracks.map((track, idx) => {
            const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
            const isCurrentTrackSelected = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, playlistTracks)}
                className={`group grid grid-cols-12 gap-4 px-4 py-2.5 rounded-md hover:bg-[#242424]/70 items-center cursor-pointer transition-colors ${
                  isCurrentTrackSelected ? 'bg-[#242424]/40' : ''
                }`}
              >
                {/* Number or Play indicator */}
                <div className="col-span-1 text-sm font-medium text-[#a7a7a7] group-hover:text-white">
                  <span className="group-hover:hidden">
                    {isThisTrackPlaying ? (
                      <span className="text-emerald-400 font-bold">♪</span>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="hidden group-hover:inline-block">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                  </span>
                </div>

                {/* Title & Artist */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold truncate ${
                        isCurrentTrackSelected ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {track.title}
                    </div>
                    <div
                      className="text-xs text-[#a7a7a7] hover:underline hover:text-white truncate cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        onNavigateArtist(track.artistId);
                      }}
                    >
                      {track.artistName}
                    </div>
                  </div>
                </div>

                {/* Album */}
                <div
                  className="hidden md:block col-span-3 text-xs text-[#a7a7a7] hover:text-white truncate cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    onNavigateAlbum(track.albumId);
                  }}
                >
                  {track.albumTitle}
                </div>

                {/* Plays */}
                <div className="hidden lg:block col-span-2 text-xs font-mono text-[#a7a7a7]">
                  {formatCompactNumber(track.playsCount)}
                </div>

                {/* Duration & Hover Quick Actions */}
                <div className="col-span-5 md:col-span-3 lg:col-span-1 flex items-center justify-end gap-2 text-xs font-mono text-[#a7a7a7]">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      startRadio(track);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-emerald-400 transition-opacity"
                    title="Start Track Radio"
                  >
                    <Radio className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={e => handleDownload(e, track)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-emerald-400 transition-opacity"
                    title="Download Track Offline"
                  >
                    {downloadedIds.has(track.id) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span>{formatTime(track.durationSeconds)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
