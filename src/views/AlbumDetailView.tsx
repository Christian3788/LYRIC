import React from 'react';
import { Play, Pause, Heart, Clock } from 'lucide-react';
import { ALBUMS, TRACKS } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatTime } from '../utils/formatters';

interface AlbumDetailViewProps {
  albumId: string;
  onNavigateArtist: (id: string) => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  albumId,
  onNavigateArtist,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();

  const album = ALBUMS.find(a => a.id === albumId) || ALBUMS[0];
  const albumTracks = album.trackIds
    .map(id => TRACKS.find(t => t.id === id))
    .filter((t): t is (typeof TRACKS)[0] => !!t);

  const isCurrentAlbumPlaying =
    currentTrack && albumTracks.some(t => t.id === currentTrack.id) && isPlaying;

  const handlePlayAlbum = () => {
    if (albumTracks.length > 0) {
      if (isCurrentAlbumPlaying) {
        togglePlayPause();
      } else {
        playTrack(albumTracks[0], albumTracks);
      }
    }
  };

  return (
    <div id="album-detail-view" className="pb-24">
      {/* 1. Hero Header */}
      <div className="relative p-6 md:p-8 pt-16 bg-gradient-to-b from-teal-900/50 via-[#181818] to-[#121212] flex flex-col md:flex-row items-center md:items-end gap-6 select-none">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg shadow-2xl overflow-hidden flex-shrink-0 bg-[#242424]">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex flex-col gap-2 text-center md:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">
            Album
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {album.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-white font-medium mt-2">
            <span
              className="font-bold hover:underline cursor-pointer"
              onClick={() => onNavigateArtist(album.artistId)}
            >
              {album.artistName}
            </span>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>{albumTracks.length} songs</span>
            <span>•</span>
            <span className="text-emerald-400">{album.genre}</span>
          </div>
        </div>
      </div>

      {/* 2. Play Action */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 select-none">
        <button
          onClick={handlePlayAlbum}
          className="w-14 h-14 rounded-full bg-emerald-500 hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all"
        >
          {isCurrentAlbumPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>
      </div>

      {/* 3. Track Listing */}
      <div className="px-6 md:px-8">
        <div className="border-b border-[#282828] pb-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#a7a7a7] grid grid-cols-12 gap-4 px-4 select-none">
          <div className="col-span-1">#</div>
          <div className="col-span-9 md:col-span-10">Title</div>
          <div className="col-span-2 md:col-span-1 text-right flex items-center justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          {albumTracks.map((track, idx) => {
            const isTrackPlaying = currentTrack?.id === track.id && isPlaying;
            const isSelected = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, albumTracks)}
                className={`group grid grid-cols-12 gap-4 px-4 py-2.5 rounded-md hover:bg-[#242424]/70 items-center cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#242424]/40' : ''
                }`}
              >
                <div className="col-span-1 text-sm font-medium text-[#a7a7a7] group-hover:text-white">
                  <span className="group-hover:hidden">
                    {isTrackPlaying ? <span className="text-emerald-400 font-bold">♪</span> : idx + 1}
                  </span>
                  <span className="hidden group-hover:inline-block">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                  </span>
                </div>

                <div className="col-span-9 md:col-span-10">
                  <div className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {track.title}
                  </div>
                  <div className="text-xs text-[#a7a7a7]">{track.artistName}</div>
                </div>

                <div className="col-span-2 md:col-span-1 text-right text-xs font-mono text-[#a7a7a7]">
                  {formatTime(track.durationSeconds)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
