import React, { useState } from 'react';
import {
  Play,
  Pause,
  BadgeCheck,
  Heart,
  MoreHorizontal,
  Clock,
  Music,
} from 'lucide-react';
import { ARTISTS, TRACKS, ALBUMS } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime, formatCompactNumber } from '../utils/formatters';

interface ArtistDetailViewProps {
  artistId: string;
  onNavigateAlbum: (albumId: string) => void;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artistId,
  onNavigateAlbum,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = ARTISTS.find(a => a.id === artistId) || ARTISTS[0];

  // Popular tracks by this artist
  const artistTracks = TRACKS.filter(t => t.artistId === artist.id);
  // Albums by this artist
  const artistAlbums = ALBUMS.filter(a => a.artistId === artist.id);

  const isCurrentArtistPlaying =
    currentTrack && currentTrack.artistId === artist.id && isPlaying;

  const handlePlayArtist = () => {
    if (artistTracks.length > 0) {
      if (isCurrentArtistPlaying) {
        togglePlayPause();
      } else {
        playTrack(artistTracks[0], artistTracks);
      }
    }
  };

  return (
    <div id="artist-detail-view" className="pb-24">
      {/* 1. Artist Hero Banner */}
      <div className="relative h-80 md:h-96 w-full flex items-end p-6 md:p-8 select-none overflow-hidden">
        <img
          src={artist.bannerUrl}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

        <div className="relative z-10 flex flex-col gap-2">
          {artist.isVerified && (
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
              <BadgeCheck className="w-4 h-4 fill-sky-400 text-black" />
              <span>Verified Artist</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
            {artist.name}
          </h1>
          <p className="text-sm font-semibold text-white/90">
            {formatCompactNumber(artist.monthlyListeners)} monthly listeners
          </p>
        </div>
      </div>

      {/* 2. Action Bar */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 select-none">
        <button
          onClick={handlePlayArtist}
          className="w-14 h-14 rounded-full bg-emerald-500 hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all"
        >
          {isCurrentArtistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
            isFollowing
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-[#727272] text-white hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button className="text-[#a7a7a7] hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* 3. Popular Tracks */}
      <div className="px-6 md:px-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Popular</h2>

        <div className="space-y-1">
          {artistTracks.map((track, idx) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            const isSelected = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, artistTracks)}
                className={`group grid grid-cols-12 gap-4 px-4 py-2.5 rounded-md hover:bg-[#242424]/70 items-center cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#242424]/40' : ''
                }`}
              >
                <div className="col-span-1 text-sm font-medium text-[#a7a7a7] group-hover:text-white">
                  <span className="group-hover:hidden">
                    {isPlayingThis ? <span className="text-emerald-400 font-bold">♪</span> : idx + 1}
                  </span>
                  <span className="hidden group-hover:inline-block">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                  </span>
                </div>

                <div className="col-span-7 md:col-span-6 flex items-center gap-3 min-w-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold truncate ${
                        isSelected ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {track.title}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block col-span-3 text-xs font-mono text-[#a7a7a7]">
                  {formatCompactNumber(track.playsCount)} plays
                </div>

                <div className="col-span-4 md:col-span-2 text-right text-xs font-mono text-[#a7a7a7]">
                  {formatTime(track.durationSeconds)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Discography (Albums) */}
      <div className="px-6 md:px-8 mt-10 space-y-4">
        <h2 className="text-xl font-bold text-white">Discography</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artistAlbums.map(album => (
            <div
              key={album.id}
              onClick={() => onNavigateAlbum(album.id)}
              className="group p-3.5 rounded-xl bg-[#181818] hover:bg-[#242424] transition-all cursor-pointer flex flex-col"
            >
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full aspect-square rounded-lg object-cover mb-3 shadow-md group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-sm text-white truncate group-hover:text-emerald-400">
                {album.title}
              </span>
              <span className="text-xs text-[#a7a7a7] mt-0.5">
                {album.releaseYear} • Album
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Artist Bio */}
      <div className="px-6 md:px-8 mt-10 space-y-3">
        <h2 className="text-xl font-bold text-white">About</h2>
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] max-w-2xl space-y-3">
          <p className="text-sm text-[#b3b3b3] leading-relaxed">
            {artist.bio}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {artist.genres.map(g => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-[#282828] text-xs text-white"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
