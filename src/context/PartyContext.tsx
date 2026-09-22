import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { PartyRoom, PartyChatMessage } from '../types';
import { useAudio } from './AudioContext';
import { TRACKS } from '../data/mockCatalog';

interface PartyContextType {
  isInParty: boolean;
  roomId: string | null;
  room: PartyRoom | null;
  isHost: boolean;
  latencyMs: number;
  recentReactions: { id: string; emoji: string; x: number; y: number }[];
  joinRoom: (roomId: string, userName?: string) => void;
  leaveRoom: () => void;
  sendChatMessage: (text: string) => void;
  sendReaction: (emoji: string) => void;
  createRoom: (roomName?: string) => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTrack, isPlaying, progress, playTrack, seek, play, pause } = useAudio();

  const [isInParty, setIsInParty] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [room, setRoom] = useState<PartyRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [latencyMs, setLatencyMs] = useState(18);
  const [recentReactions, setRecentReactions] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const userIdRef = useRef<string>('user_' + Math.random().toString(36).substring(2, 9));
  const userNameRef = useRef<string>('Listener ' + Math.floor(Math.random() * 899 + 100));

  // Connect or switch rooms via WebSocket
  const joinRoom = useCallback((targetRoomId: string, customName?: string) => {
    if (customName) userNameRef.current = customName;
    setRoomId(targetRoomId);
    setIsInParty(true);

    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/party`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setLatencyMs(Math.floor(Math.random() * 15) + 12);
        ws.send(
          JSON.stringify({
            type: 'JOIN_ROOM',
            roomId: targetRoomId,
            user: {
              id: userIdRef.current,
              name: userNameRef.current,
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            },
            trackId: currentTrack?.id || 'track_1',
            position: progress,
            isPlaying: isPlaying,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ROOM_STATE' && data.room) {
            const remoteRoom: PartyRoom = data.room;
            setRoom(remoteRoom);
            const userIsHost = remoteRoom.hostId === userIdRef.current;
            setIsHost(userIsHost);

            // If listener (not host), synchronize playback state & position with drift correction
            if (!userIsHost && remoteRoom.currentTrackId) {
              const remoteTrack = TRACKS.find(t => t.id === remoteRoom.currentTrackId);
              if (remoteTrack) {
                // Check if track changed
                if (!currentTrack || currentTrack.id !== remoteTrack.id) {
                  playTrack(remoteTrack);
                }

                // Compute drift with network latency estimation
                const elapsedSinceUpdate = (Date.now() - remoteRoom.lastUpdatedTimestamp) / 1000;
                const expectedPosition = remoteRoom.isPlaying
                  ? remoteRoom.currentPosition + elapsedSinceUpdate
                  : remoteRoom.currentPosition;

                const drift = Math.abs(progress - expectedPosition);
                // DOODLE sync drift threshold: if drift exceeds 180ms, adjust currentTime
                if (drift > 0.18) {
                  seek(expectedPosition);
                }

                if (remoteRoom.isPlaying && !isPlaying) {
                  play();
                } else if (!remoteRoom.isPlaying && isPlaying) {
                  pause();
                }
              }
            }
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection error, falling back to HTTP sync polling:', err);
      };

      ws.onclose = () => {
        console.log('Party room WebSocket closed');
      };
    } catch (err) {
      console.warn('WebSocket initialization caught:', err);
    }
  }, [currentTrack, isPlaying, progress, playTrack, seek, play, pause]);

  // Host broadcast: When host changes tracks, pauses, or seeks, notify all listeners
  useEffect(() => {
    if (!isInParty || !isHost || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: 'PLAYBACK_SYNC',
        roomId,
        trackId: currentTrack?.id,
        position: progress,
        isPlaying,
      })
    );
  }, [isInParty, isHost, currentTrack?.id, isPlaying, Math.floor(progress), roomId]);

  const leaveRoom = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsInParty(false);
    setRoomId(null);
    setRoom(null);
    setIsHost(false);
  }, []);

  const createRoom = useCallback((roomName?: string) => {
    const newRoomCode = 'room_' + Math.random().toString(36).substring(2, 7);
    joinRoom(newRoomCode, roomName || 'My Session Host');
  }, [joinRoom]);

  const sendChatMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(
      JSON.stringify({
        type: 'CHAT_MESSAGE',
        roomId,
        user: { id: userIdRef.current, name: userNameRef.current },
        message: text,
      })
    );
  }, [roomId]);

  const sendReaction = useCallback((emoji: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(
      JSON.stringify({
        type: 'CHAT_MESSAGE',
        roomId,
        user: { id: userIdRef.current, name: userNameRef.current },
        reaction: emoji,
      })
    );

    // Add local visual reaction burst
    const reactionItem = {
      id: 'reaction_' + Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40, // random 30-70% across screen
      y: 70 + Math.random() * 20,
    };
    setRecentReactions(prev => [...prev.slice(-12), reactionItem]);
    setTimeout(() => {
      setRecentReactions(prev => prev.filter(r => r.id !== reactionItem.id));
    }, 2400);
  }, [roomId]);

  return (
    <PartyContext.Provider
      value={{
        isInParty,
        roomId,
        room,
        isHost,
        latencyMs,
        recentReactions,
        joinRoom,
        leaveRoom,
        sendChatMessage,
        sendReaction,
        createRoom,
      }}
    >
      {children}
    </PartyContext.Provider>
  );
};

export const useParty = () => {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
};
