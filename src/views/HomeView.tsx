import React from 'react';
import { Play, Pause, Heart, Radio, Sparkles } from 'lucide-react';
import { TRACKS, PLAYLISTS, ARTISTS, ALBUMS } from '../data/mockCatalog';
import { useAudio } from '../context/AudioContext';
import { formatCompactNumber } from '../utils/formatters';

interface HomeViewProps {
  onNavigatePlaylist: (id: string) => void;
  onNavigateArtist: (id: string) => void;
  onNavigateAlbum: (id: string) => void;
  onOpenParty: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigatePlaylist,
  onNavigateArtist,
  onNavigateAlbum,
  onOpenParty,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();

  // Greeting based on hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quickGridItems = [
    { id: 'liked', title: 'Liked Songs', coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80', isSpecial: true },
    { id: 'playlist_1', title: 'Top Hits 2026', coverUrl: PLAYLISTS[0].coverUrl },
    { id: 'playlist_2', title: 'Deep Focus & Code', coverUrl: PLAYLISTS[1].coverUrl },
    { id: 'playlist_3', title: 'Synthwave Night Run', coverUrl: PLAYLISTS[2].coverUrl },
    { id: 'album_1', title: 'Midnight Overdrive', coverUrl: ALBUMS[0].coverUrl, isAlbum: true },
    { id: 'album_3', title: 'Late Night Coffee', coverUrl: ALBUMS[2].coverUrl, isAlbum: true },
  ];

  return (
    <div id="home-view" className="p-6 md:p-8 space-y-10 pb-20">
      {/* 1. Header & Live Party Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          {greeting}
        </h1>

        <button
          onClick={onOpenParty}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition-all shadow-sm w-fit"
        >
          <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
          <span>Party Room Active • 2+ Listeners Synced</span>
        </button>
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

      {/* 3. Top Picks for You (Tracks with instant play) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Top Picks for You
          </h2>
          <span className="text-xs font-semibold text-[#a7a7a7] hover:underline cursor-pointer">
            Show all
          </span>
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

      {/* 4. Featured Playlists Section */}
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

      {/* 5. Popular Artists */}
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
