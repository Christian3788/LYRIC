import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { getOrCreateTrackBuffer } from './server/audioGenerator.js';
import { fetchFMATracks, fetchFMAFeatured } from './server/fmaService.js';

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
      message: 'This track is an absolute masterpiece 🔥',
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

// -------------------------------------------------------------
// REAL SONGS API & AUDIO STREAM PROXY
// -------------------------------------------------------------

// Helper to transform iTunes song result into DOODLE Track schema
function mapItunesTrackToSchema(item: any) {
  const highResCover = (item.artworkUrl100 || '')
    .replace('100x100bb.jpg', '600x600bb.jpg')
    .replace('100x100bb', '600x600bb');

  const rawDuration = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 30;
  // Previews are 30 seconds
  const previewDuration = Math.min(rawDuration, 30);

  return {
    id: `real_${item.trackId}`,
    title: item.trackName || 'Unknown Title',
    artistId: `real_artist_${item.artistId || encodeURIComponent(item.artistName || 'unknown')}`,
    artistName: item.artistName || 'Unknown Artist',
    albumId: `real_album_${item.collectionId || 'single'}`,
    albumTitle: item.collectionName || item.trackName || 'Single',
    coverUrl: highResCover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: `/api/stream/proxy?url=${encodeURIComponent(item.previewUrl)}`,
    previewUrl: item.previewUrl,
    durationSeconds: previewDuration,
    genre: item.primaryGenreName || 'Pop',
    playsCount: Math.floor(Math.random() * 40000000 + 10000000),
    releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 2024,
    bpm: 120,
    audioFileSize: 1048576, // ~1MB AAC/M4A preview
    isRealSong: true,
  };
}

// 1. Audio stream proxy with HTTP 206 Partial Content range forwarding
app.get('/api/stream/proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl || (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://'))) {
    res.status(400).send('Valid HTTP/HTTPS audio URL required');
    return;
  }

  try {
    const fetchHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    if (req.headers.range) {
      fetchHeaders['Range'] = String(req.headers.range);
    }

    const upstream = await fetch(targetUrl, { headers: fetchHeaders });

    res.status(upstream.status);

    // Forward crucial range & content headers
    const forwardHeaders = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'last-modified',
      'etag',
    ];

    forwardHeaders.forEach(h => {
      const val = upstream.headers.get(h);
      if (val) res.setHeader(h, val);
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    if (!upstream.body) {
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (err: any) {
    console.error('Audio stream proxy error:', err?.message || err);
    if (!res.headersSent) {
      res.status(502).send('Error streaming real audio');
    } else {
      res.end();
    }
  }
});

// Cache for search results & charts
const searchCache = new Map<string, { timestamp: number; tracks: any[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// 2. Real Songs Search endpoint: fetches genuine songs from Apple Music / iTunes
app.get('/api/songs/search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '25'), 10)));

  const searchTerm = query || 'top hits billboard';
  const cacheKey = `${searchTerm.toLowerCase()}_${limit}`;

  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    res.json({
      status: 'ok',
      query: searchTerm,
      count: cached.tracks.length,
      tracks: cached.tracks,
      cached: true,
    });
    return;
  }

  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      searchTerm
    )}&media=music&entity=song&limit=${limit}`;

    const itunesRes = await fetch(itunesUrl);
    if (!itunesRes.ok) {
      throw new Error(`iTunes API responded with status ${itunesRes.status}`);
    }

    const data: any = await itunesRes.json();
    const rawResults = data.results || [];

    // Filter out items without an audio preview
    const validTracks = rawResults
      .filter((item: any) => item.previewUrl && item.trackName)
      .map(mapItunesTrackToSchema);

    searchCache.set(cacheKey, { timestamp: Date.now(), tracks: validTracks });

    res.json({
      status: 'ok',
      query: searchTerm,
      count: validTracks.length,
      tracks: validTracks,
    });
  } catch (err: any) {
    console.error('Failed to fetch real songs from iTunes:', err?.message || err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch real songs',
      error: err?.message || 'Network error',
      tracks: [],
    });
  }
});

// 3. Real Songs Top Global Hits endpoint
let topChartsCache: { timestamp: number; tracks: any[] } | null = null;

app.get('/api/songs/charts', async (req, res) => {
  if (topChartsCache && Date.now() - topChartsCache.timestamp < CACHE_TTL_MS) {
    res.json({
      status: 'ok',
      count: topChartsCache.tracks.length,
      tracks: topChartsCache.tracks,
      cached: true,
    });
    return;
  }

  try {
    // Search for global chart leaders
    const chartTerms = ['billboard hot 100', 'the weeknd', 'taylor swift', 'billie eilish', 'kendrick lamar'];
    const chosenTerm = chartTerms[Math.floor(Math.random() * chartTerms.length)];

    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      'top hits 2024'
    )}&media=music&entity=song&limit=30`;

    const itunesRes = await fetch(itunesUrl);
    const data: any = await itunesRes.json();
    const rawResults = data.results || [];

    const tracks = rawResults
      .filter((item: any) => item.previewUrl && item.trackName)
      .map(mapItunesTrackToSchema);

    topChartsCache = { timestamp: Date.now(), tracks };

    res.json({
      status: 'ok',
      count: tracks.length,
      tracks,
    });
  } catch (err: any) {
    console.error('Failed to fetch top charts:', err?.message || err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch charts',
      tracks: [],
    });
  }
});

// -------------------------------------------------------------
// FREE MUSIC ARCHIVE (FMA) ENDPOINTS
// -------------------------------------------------------------

// 1. Search Free Music Archive tracks (full-length Creative Commons music)
app.get('/api/fma/search', async (req, res) => {
  const query = String(req.query.q || '').trim() || 'electronic';
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '25'), 10)));

  try {
    const tracks = await fetchFMATracks(query, limit);
    res.json({
      status: 'ok',
      source: 'Free Music Archive (freemusicarchive.org)',
      query,
      count: tracks.length,
      tracks,
    });
  } catch (err: any) {
    console.error('FMA search error:', err?.message || err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search Free Music Archive',
      tracks: [],
    });
  }
});

// 2. Curated Featured Free Music Archive tracks across popular genres
app.get('/api/fma/featured', async (req, res) => {
  try {
    const tracks = await fetchFMAFeatured();
    res.json({
      status: 'ok',
      source: 'Free Music Archive (freemusicarchive.org)',
      count: tracks.length,
      tracks,
    });
  } catch (err: any) {
    console.error('FMA featured error:', err?.message || err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured Free Music Archive tracks',
      tracks: [],
    });
  }
});

// 3. Direct MP3 Download for Free Music Archive tracks
app.get('/api/fma/download', async (req, res) => {
  const targetUrl = req.query.url as string;
  const title = String(req.query.title || 'fma-track').replace(/[^a-zA-Z0-9_-]/g, '_');

  if (!targetUrl || (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://'))) {
    res.status(400).send('Valid audio URL required');
    return;
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      res.status(upstream.status).send('Unable to download track from source');
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
    const len = upstream.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (err: any) {
    console.error('FMA download proxy error:', err?.message || err);
    if (!res.headersSent) res.status(502).send('Error downloading track');
    else res.end();
  }
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
