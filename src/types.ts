export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  coverUrl: string;
  audioUrl: string;
  durationSeconds: number;
  genre: string;
  playsCount: number;
  releaseYear: number;
  bpm?: number;
  audioFileSize?: number;
  lyrics?: { time: number; text: string }[];
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  monthlyListeners: number;
  isVerified: boolean;
  genres: string[];
  popularTrackIds: string[];
  albumIds: string[];
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  trackIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  creatorId: string;
  creatorName: string;
  isPublic: boolean;
  trackIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  likedTrackIds: string[];
  followedArtistIds: string[];
  playlistIds: string[];
}

export interface PlaybackHistory {
  id: string;
  userId: string;
  trackId: string;
  playedAt: string;
  completionPercentage: number;
}

export type RepeatMode = 'off' | 'track' | 'queue';

export interface PartyMember {
  id: string;
  name: string;
  avatarUrl: string;
  isHost: boolean;
  latencyMs: number;
  joinedAt: number;
}

export interface PartyChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
  isReaction?: boolean;
}

export interface PartyRoom {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  currentTrackId: string | null;
  currentPosition: number;
  isPlaying: boolean;
  lastUpdatedTimestamp: number;
  members: PartyMember[];
  messages: PartyChatMessage[];
}
