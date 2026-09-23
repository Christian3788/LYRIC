import { useState, useEffect, useCallback } from 'react';
import { Track } from '../types';

const LIKED_TRACKS_KEY = 'doodle_liked_track_ids';
const DEFAULT_LIKED_IDS = ['track_1', 'track_4', 'track_7', 'track_10', 'track_2'];

export function getLikedTrackIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_TRACKS_KEY);
    if (!raw) {
      localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(DEFAULT_LIKED_IDS));
      return DEFAULT_LIKED_IDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_LIKED_IDS;
  } catch (e) {
    return DEFAULT_LIKED_IDS;
  }
}

export function isTrackLiked(trackId: string): boolean {
  if (!trackId) return false;
  const list = getLikedTrackIds();
  return list.includes(trackId);
}

export function toggleLikeTrack(trackId: string): boolean {
  if (!trackId) return false;
  const current = getLikedTrackIds();
  let updated: string[];
  const exists = current.includes(trackId);

  if (exists) {
    updated = current.filter(id => id !== trackId);
  } else {
    updated = [trackId, ...current];
  }

  try {
    localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(updated));
  } catch (e) {}

  window.dispatchEvent(new CustomEvent('liked-tracks-changed', { detail: { trackId, liked: !exists, updated } }));
  return !exists;
}

export function useLikedTrackIds(): string[] {
  const [likedIds, setLikedIds] = useState<string[]>(getLikedTrackIds);

  useEffect(() => {
    const handleUpdate = () => {
      setLikedIds(getLikedTrackIds());
    };

    window.addEventListener('liked-tracks-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('liked-tracks-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return likedIds;
}

export function useIsTrackLiked(trackId?: string): [boolean, () => void] {
  const [liked, setLiked] = useState<boolean>(() => (trackId ? isTrackLiked(trackId) : false));

  useEffect(() => {
    if (!trackId) {
      setLiked(false);
      return;
    }
    setLiked(isTrackLiked(trackId));

    const handleUpdate = () => {
      setLiked(isTrackLiked(trackId));
    };

    window.addEventListener('liked-tracks-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('liked-tracks-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [trackId]);

  const toggle = useCallback(() => {
    if (!trackId) return;
    const nextState = toggleLikeTrack(trackId);
    setLiked(nextState);
  }, [trackId]);

  return [liked, toggle];
}
