import { Track } from '../types';

const DB_NAME = 'doodle_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_tracks';

interface OfflineRecord {
  id: string;
  track: Track;
  audioBlob: Blob;
  downloadedAt: number;
  fileSizeBytes: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported in this browser'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Downloads audio file blob and saves track into IndexedDB
 */
export async function downloadTrackOffline(track: Track): Promise<boolean> {
  try {
    const url = track.audioUrl || track.previewUrl;
    if (!url) return false;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const audioBlob = await res.blob();

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: OfflineRecord = {
        id: track.id,
        track,
        audioBlob,
        downloadedAt: Date.now(),
        fileSizeBytes: audioBlob.size,
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to cache track offline:', err);
    return false;
  }
}

/**
 * Removes track from offline storage
 */
export async function removeTrackOffline(trackId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(trackId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete offline track:', err);
    return false;
  }
}

/**
 * Checks if a track is downloaded offline
 */
export async function isTrackOffline(trackId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(trackId);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieves all offline downloaded tracks
 */
export async function getOfflineTracks(): Promise<Track[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: OfflineRecord[] = req.result || [];
        resolve(records.map(r => ({ ...r.track, isOffline: true })));
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Retrieves object URL for playing offline blob
 */
export async function getOfflineAudioUrl(trackId: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(trackId);
      req.onsuccess = () => {
        if (req.result?.audioBlob) {
          const blobUrl = URL.createObjectURL(req.result.audioBlob);
          resolve(blobUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
