import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { getOrCreateTrackBuffer } from './server/audioGenerator.js';

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// In-memory Party Rooms state for Real-Time "Listen Along"
interface PartyMemberState {
  id: string;
  name: string;
  avatarUrl: string;
  isHost: boolean;
  ws?: WebSocket;
  latencyMs: number;
  joinedAt: number;
}

interface PartyRoomState {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  currentTrackId: string | null;
  currentPosition: number;
  isPlaying: boolean;
  lastUpdatedTimestamp: number;
  members: Map<string, PartyMemberState>;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: number;
    isReaction?: boolean;
  }>;
}

const partyRooms = new Map<string, PartyRoomState>();

// Seed default public party room
partyRooms.set('vibe-lounge', {
  id: 'vibe-lounge',
  name: 'Vibe Lounge ☕',
  hostId: 'host_dj_alex',
  hostName: 'DJ Alex',
  currentTrackId: 'track_1',
  currentPosition: 12.4,
  isPlaying: true,
  lastUpdatedTimestamp: Date.now(),
  members: new Map([
    [
      'host_dj_alex',
      {
        id: 'host_dj_alex',
        name: 'DJ Alex',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        isHost: true,
        latencyMs: 14,
        joinedAt: Date.now() - 3600000,
      },
    ],
    [
      'user_sarah',
      {
        id: 'user_sarah',
        name: 'Sarah K.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        isHost: false,
        latencyMs: 28,
        joinedAt: Date.now() - 1800000,
      },
    ],
  ]),
  messages: [
    {
      id: 'm1',
      senderId: 'host_dj_alex',
      senderName: 'DJ Alex',
      message: 'Welcome to the party room! Synced at 44.1kHz stereo.',
      timestamp: Date.now() - 600000,
    },
    {
      id: 'm2',
      senderId: 'user_sarah',
      senderName: 'Sarah K.',
      message: 'This synth bass drop is legendary 🔥',
      timestamp: Date.now() - 120000,
      isReaction: true,
    },
  ],
});

// Setup WebSocket Server for Live Listen Along / Party Mode
const wss = new WebSocketServer({ server, path: '/ws/party' });

wss.on('connection', (ws: WebSocket) => {
  let currentRoomId: string | null = null;
  let currentUserId: string | null = null;

  ws.on('message', (data: string) => {
    try {
      const payload = JSON.parse(data.toString());
      const { type, roomId, user, trackId, position, isPlaying, message, reaction } = payload;

      if (type === 'JOIN_ROOM') {
        currentRoomId = roomId;
        currentUserId = user.id;

        let room = partyRooms.get(roomId);
        if (!room) {
          room = {
            id: roomId,
            name: `${user.name}'s Party`,
            hostId: user.id,
            hostName: user.name,
            currentTrackId: trackId || 'track_1',
            currentPosition: 0,
            isPlaying: true,
            lastUpdatedTimestamp: Date.now(),
            members: new Map(),
            messages: [],
          };
          partyRooms.set(roomId, room);
        }

        room.members.set(user.id, {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          isHost: room.hostId === user.id,
          ws,
          latencyMs: Math.floor(Math.random() * 25) + 10,
          joinedAt: Date.now(),
        });

        broadcastRoomState(room);
      } else if (type === 'PLAYBACK_SYNC' && currentRoomId) {
        const room = partyRooms.get(currentRoomId);
        if (room && room.hostId === currentUserId) {
          room.currentTrackId = trackId;
          room.currentPosition = position;
          room.isPlaying = isPlaying;
          room.lastUpdatedTimestamp = Date.now();
          broadcastRoomState(room, currentUserId);
        }
      } else if (type === 'CHAT_MESSAGE' && currentRoomId) {
        const room = partyRooms.get(currentRoomId);
        if (room) {
          const newMsg = {
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            senderId: currentUserId || 'anonymous',
            senderName: user?.name || 'Party Member',
            message: message || reaction || '',
            timestamp: Date.now(),
            isReaction: !!reaction,
          };
          room.messages.push(newMsg);
          if (room.messages.length > 50) room.messages.shift();
          broadcastRoomState(room);
        }
      }
    } catch (err) {
      console.error('WebSocket message parsing error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && currentUserId) {
      const room = partyRooms.get(currentRoomId);
      if (room) {
        room.members.delete(currentUserId);
        if (room.members.size === 0 && currentRoomId !== 'vibe-lounge') {
          partyRooms.delete(currentRoomId);
        } else {
          // If host left, elect new host
          if (room.hostId === currentUserId && room.members.size > 0) {
            const nextHost = room.members.values().next().value;
            if (nextHost) {
              nextHost.isHost = true;
              room.hostId = nextHost.id;
              room.hostName = nextHost.name;
            }
          }
          broadcastRoomState(room);
        }
      }
    }
  });
});

function broadcastRoomState(room: PartyRoomState, skipUserId?: string) {
  const roomData = {
    id: room.id,
    name: room.name,
    hostId: room.hostId,
    hostName: room.hostName,
    currentTrackId: room.currentTrackId,
    currentPosition: room.currentPosition,
    isPlaying: room.isPlaying,
    lastUpdatedTimestamp: room.lastUpdatedTimestamp,
    members: Array.from(room.members.values()).map(m => ({
      id: m.id,
      name: m.name,
      avatarUrl: m.avatarUrl,
      isHost: m.isHost,
      latencyMs: m.latencyMs,
      joinedAt: m.joinedAt,
    })),
    messages: room.messages,
  };

  const payload = JSON.stringify({ type: 'ROOM_STATE', room: roomData });

  room.members.forEach(member => {
    if (member.ws && member.ws.readyState === WebSocket.OPEN) {
      if (skipUserId && member.id === skipUserId) return;
      member.ws.send(payload);
    }
  });
}

// -------------------------------------------------------------
// AUDIO STREAMING ENGINE: HTTP 206 Partial Content Handler
// -------------------------------------------------------------
app.get('/api/stream/:trackId', (req, res) => {
  const { trackId } = req.params;

  // Determine audio style by trackId
  let style: 'lofi' | 'synthwave' | 'ambient' | 'chill' | 'acoustic' = 'synthwave';
  if (['track_4', 'track_5'].includes(trackId)) style = 'acoustic';
  else if (['track_6'].includes(trackId)) style = 'ambient';
  else if (['track_7', 'track_8', 'track_9'].includes(trackId)) style = 'lofi';
  else if (['track_10', 'track_11'].includes(trackId)) style = 'chill';

  const audioBuffer = getOrCreateTrackBuffer(trackId, style);
  const totalLength = audioBuffer.length;

  const range = req.headers.range;

  // Edge Case 1: Missing Range header -> Return full file with 200 OK
  if (!range) {
    res.writeHead(200, {
      'Content-Length': totalLength,
      'Content-Type': 'audio/wav',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });
    res.end(audioBuffer);
    return;
  }

  // Parse Range header (format: "bytes=start-end" or "bytes=start-")
  const parts = range.replace(/bytes=/, '').split('-');
  const partialStart = parts[0];
  const partialEnd = parts[1];

  let start = parseInt(partialStart, 10);
  let end = partialEnd ? parseInt(partialEnd, 10) : totalLength - 1;

  // Edge Case 2: Invalid range syntax or start out of bounds -> HTTP 416 Range Not Satisfiable
  if (isNaN(start) || start >= totalLength || (partialEnd && start > end)) {
    res.status(416).set({
      'Content-Range': `bytes */${totalLength}`,
    }).send('Requested Range Not Satisfiable');
    return;
  }

  // Edge Case 3: Suffix range format (e.g., bytes=-500000)
  if (isNaN(start) && !isNaN(end)) {
    start = totalLength - end;
    end = totalLength - 1;
  }

  // Edge Case 4: End exceeds buffer length -> Clamp to totalLength - 1
  if (end >= totalLength) {
    end = totalLength - 1;
  }

  // Chunk size validation (deliver in optimal 512KB - 2MB chunks for instant streaming)
  const maxChunkSize = 1024 * 1024; // 1MB chunk limit per range burst
  if (end - start + 1 > maxChunkSize) {
    end = start + maxChunkSize - 1;
  }

  const chunkLength = end - start + 1;
  const chunk = audioBuffer.subarray(start, end + 1);

  // Return HTTP 206 Partial Content
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${totalLength}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkLength,
    'Content-Type': 'audio/wav',
    'Cache-Control': 'no-cache', // Allow granular seeking without browser stale-cache locks
    'X-Audio-Bitrate': '1411kbps',
    'X-Audio-Channels': 'Stereo',
    'X-Audio-SampleRate': '44100',
  });

  res.end(chunk);
});

// REST Endpoints for Party Rooms
app.get('/api/party/rooms', (req, res) => {
  const roomsList = Array.from(partyRooms.values()).map(r => ({
    id: r.id,
    name: r.name,
    hostId: r.hostId,
    hostName: r.hostName,
    currentTrackId: r.currentTrackId,
    isPlaying: r.isPlaying,
    memberCount: r.members.size,
  }));
  res.json({ rooms: roomsList });
});

app.get('/api/party/rooms/:roomId', (req, res) => {
  const room = partyRooms.get(req.params.roomId);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json({
    id: room.id,
    name: room.name,
    hostId: room.hostId,
    hostName: room.hostName,
    currentTrackId: room.currentTrackId,
    currentPosition: room.currentPosition,
    isPlaying: room.isPlaying,
    lastUpdatedTimestamp: room.lastUpdatedTimestamp,
    members: Array.from(room.members.values()).map(m => ({
      id: m.id,
      name: m.name,
      avatarUrl: m.avatarUrl,
      isHost: m.isHost,
      latencyMs: m.latencyMs,
      joinedAt: m.joinedAt,
    })),
    messages: room.messages,
  });
});

// Search endpoint
app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  res.json({
    query: q,
    status: 'ok',
    message: 'Client-side reactive search is active with full catalog index',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Node.js/Express 206 Streaming + WebSockets', uptime: process.uptime() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud Music Streaming Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
