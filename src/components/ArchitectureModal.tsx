import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  Terminal,
  Server,
  Play,
  CheckCircle2,
  Copy,
  ExternalLink,
  Code2,
  FileCode,
  Box,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'postgres' | 'prisma' | 'go' | 'audiostate' | 'docker' | 'testlab'>('postgres');
  const [copied, setCopied] = useState(false);

  // Test Lab state for live HTTP 206 execution
  const [testTrackId, setTestTrackId] = useState('track_1');
  const [testRangeHeader, setTestRangeHeader] = useState('bytes=0-1048575');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    bytesReceived: number;
    timeMs: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runLiveRangeTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const res = await fetch(`/api/stream/${testTrackId}`, {
        headers: {
          Range: testRangeHeader,
        },
      });

      const buffer = await res.arrayBuffer();
      const endTime = performance.now();

      const headers: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headers[key] = val;
      });

      setTestResult({
        status: res.status,
        statusText: res.statusText || (res.status === 206 ? 'Partial Content' : 'OK'),
        headers,
        bytesReceived: buffer.byteLength,
        timeMs: Math.round(endTime - startTime),
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        statusText: 'Network / Test Execution Error: ' + err.message,
        headers: {},
        bytesReceived: 0,
        timeMs: 0,
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div
      id="architecture-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none"
      onClick={onClose}
    >
      <div
        id="architecture-modal-content"
        className="relative w-full max-w-6xl bg-[#121212] border border-[#282828] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#17221b] via-[#121212] to-[#141b22] border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  System Architecture & Production Blueprints
                </h2>
                <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                  Principal Architect Review
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7] mt-0.5">
                Full-stack specifications: PostgreSQL DDL • Prisma • Go 206 Engine • Global Audio State • Docker Compose
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#282828] text-[#a7a7a7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-[#181818] border-b border-[#282828] overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('postgres')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'postgres'
                ? 'border-emerald-500 text-white bg-[#202020]'
                : 'border-transparent text-[#a7a7a7] hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>1. PostgreSQL DDL (schema.sql)</span>
          </button>

          <button
            onClick={() => setActiveTab('prisma')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'prisma'
                ? 'border-emerald-500 text-white bg-[#202020]'
                : 'border-transparent text-[#a7a7a7] hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>2. Prisma Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('go')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'go'
                ? 'border-emerald-500 text-white bg-[#202020]'
                : 'border-transparent text-[#a7a7a7] hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>3. Go 206 Streaming Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('audiostate')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audiostate'
                ? 'border-emerald-500 text-white bg-[#202020]'
                : 'border-transparent text-[#a7a7a7] hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>4. React AudioContext Hook</span>
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'docker'
                ? 'border-emerald-500 text-white bg-[#202020]'
                : 'border-transparent text-[#a7a7a7] hover:text-white'
            }`}
          >
            <Box className="w-4 h-4 text-blue-400" />
            <span>5. Docker Compose & Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('testlab')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'testlab'
                ? 'border-emerald-500 text-emerald-400 bg-[#202020]'
                : 'border-transparent text-[#a7a7a7] hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-rose-400" />
            <span>6. Live 206 HTTP Test Lab</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0f0f0f]">
          {/* TAB 1: PostgreSQL DDL */}
          {activeTab === 'postgres' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Normalized PostgreSQL Schema with GIN Full-Text Indexing
                  </h3>
                  <p className="text-xs text-[#a7a7a7]">
                    Includes UUID primary keys, foreign keys with ON DELETE CASCADE / SET NULL, trigram indexes (pg_trgm), and generated tsvector for instant search.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(POSTGRES_DDL_SNIPPET)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242424] hover:bg-[#333] text-xs text-white border border-[#3e3e3e]"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#161616] border border-[#282828] text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {POSTGRES_DDL_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 2: Prisma Schema */}
          {activeTab === 'prisma' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Prisma Multi-Tenant Schema</h3>
                  <p className="text-xs text-[#a7a7a7]">
                    Model definitions for User, Artist, Album, Track, Playlist, PlaylistTrack, Like, and PlaybackHistory.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(PRISMA_SNIPPET)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242424] hover:bg-[#333] text-xs text-white border border-[#3e3e3e]"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Prisma'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#161616] border border-[#282828] text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {PRISMA_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 3: Go 206 Streaming Engine */}
          {activeTab === 'go' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    High-Throughput Go (Golang) Audio Streaming Engine (RFC 7233)
                  </h3>
                  <p className="text-xs text-[#a7a7a7]">
                    Handles HTTP 206 Partial Content, byte-range parsing, boundary clamping, 416 Range Not Satisfiable, and S3/MinIO chunk streaming.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(GO_WORKER_SNIPPET)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242424] hover:bg-[#333] text-xs text-white border border-[#3e3e3e]"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copy Go Code' : 'Copy Go Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#161616] border border-[#282828] text-amber-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {GO_WORKER_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 4: React AudioContext Hook */}
          {activeTab === 'audiostate' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Global Audio State & MediaSession Architecture</h3>
                <p className="text-xs text-[#a7a7a7]">
                  HTML5 Audio singleton, MediaSession API integration, Fisher-Yates shuffle, audio preloader for zero-gap playback, and range buffering events.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Core State Interface
                  </span>
                  <pre className="text-[11px] font-mono text-purple-300 overflow-x-auto">
{`interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number; // 0.0 - 1.0
  progress: number; // current time in seconds
  duration: number; // total track duration
  queue: Track[]; // active playlist order
  queueIndex: number; // pointer to current item
  repeatMode: 'off' | 'track' | 'queue';
  isShuffled: boolean; // Fisher-Yates state
  isBuffering: boolean; // onWaiting / onCanPlayThrough
  bufferedRanges: { start: number; end: number }[];
  bufferedPercent: number;
}`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Resilience & Edge Handling
                  </span>
                  <ul className="text-xs text-[#b3b3b3] space-y-2 list-disc pl-4">
                    <li><strong className="text-white">Next Track Preloader:</strong> Silently prefetches upcoming track into secondary Audio element before current track finishes.</li>
                    <li><strong className="text-white">Bandwidth Optimization:</strong> HTTP 206 ensures only requested ranges are fetched, eliminating redownload overhead.</li>
                    <li><strong className="text-white">Media Session API:</strong> Controls native OS lock screen, media keys, and dynamic tab titles.</li>
                    <li><strong className="text-white">Drift Tolerance:</strong> Party mode continuously computes clock drift and performs seamless micro-seeks when &gt; 180ms.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Docker Compose */}
          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Production Local & Cloud Deployment via Docker Compose
                  </h3>
                  <p className="text-xs text-[#a7a7a7]">
                    Multi-container orchestration for PostgreSQL 16, Redis 7, MinIO S3 Object Storage, Go 206 Streaming Service, and Next.js / Vite Web App.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(DOCKER_COMPOSE_SNIPPET)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242424] hover:bg-[#333] text-xs text-white border border-[#3e3e3e]"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Docker Compose'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-3">
                <span className="text-xs font-bold text-emerald-400">Quickstart CLI Command:</span>
                <div className="p-3 bg-black rounded-lg font-mono text-xs text-white flex items-center justify-between">
                  <code>docker-compose up -d --build</code>
                  <button
                    onClick={() => handleCopy('docker-compose up -d --build')}
                    className="text-xs text-[#a7a7a7] hover:text-white"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-[#161616] border border-[#282828] text-blue-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {DOCKER_COMPOSE_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 6: Live 206 HTTP Test Lab */}
          {activeTab === 'testlab' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Live HTTP 206 Range Request Inspector</h3>
                <p className="text-xs text-[#a7a7a7]">
                  Directly dispatch custom byte Range requests against our active streaming engine and observe the HTTP 206 Partial Content headers and chunk payloads.
                </p>
              </div>

              {/* Controls */}
              <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a7a7a7] mb-1">
                      Track Endpoint
                    </label>
                    <select
                      value={testTrackId}
                      onChange={e => setTestTrackId(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg px-3.5 py-2 text-xs text-white outline-none font-mono"
                    >
                      <option value="track_1">/api/stream/track_1 (Cyber Gridline - Synthwave)</option>
                      <option value="track_4">/api/stream/track_4 (Autumn Rain - Acoustic)</option>
                      <option value="track_7">/api/stream/track_7 (Midnight Lo-Fi Study)</option>
                      <option value="track_10">/api/stream/track_10 (Berlin Warehouse - Deep House)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#a7a7a7] mb-1">
                      Range Header Payload
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testRangeHeader}
                        onChange={e => setTestRangeHeader(e.target.value)}
                        placeholder="bytes=0-1048575"
                        className="flex-1 bg-[#121212] border border-[#333] rounded-lg px-3.5 py-2 text-xs text-white outline-none font-mono"
                      />
                      <button
                        onClick={runLiveRangeTest}
                        disabled={testLoading}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>{testLoading ? 'Testing...' : 'Send 206 Request'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset test buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-[#727272]">Quick Presets:</span>
                  <button
                    onClick={() => setTestRangeHeader('bytes=0-524287')}
                    className="px-2 py-1 rounded bg-[#242424] hover:bg-[#333] text-[11px] text-white font-mono"
                  >
                    512KB Chunk (bytes=0-524287)
                  </button>
                  <button
                    onClick={() => setTestRangeHeader('bytes=1048576-2097151')}
                    className="px-2 py-1 rounded bg-[#242424] hover:bg-[#333] text-[11px] text-white font-mono"
                  >
                    1MB Middle Chunk (Seek Test)
                  </button>
                  <button
                    onClick={() => setTestRangeHeader('bytes=999999999-')}
                    className="px-2 py-1 rounded bg-[#242424] hover:bg-[#333] text-[11px] text-rose-300 font-mono"
                  >
                    Edge Case 416 (Invalid Range)
                  </button>
                </div>
              </div>

              {/* Test Results Output */}
              {testResult && (
                <div className="p-5 rounded-xl bg-[#181818] border border-[#282828] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                          testResult.status === 206
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : testResult.status === 416
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        HTTP {testResult.status} {testResult.statusText}
                      </span>
                      <span className="text-xs text-[#a7a7a7]">
                        Latency: <strong className="text-white font-mono">{testResult.timeMs} ms</strong>
                      </span>
                      <span className="text-xs text-[#a7a7a7]">
                        Payload Size: <strong className="text-white font-mono">{(testResult.bytesReceived / 1024).toFixed(1)} KB</strong> ({testResult.bytesReceived} bytes)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white">Response Headers:</span>
                    <div className="p-3 bg-black rounded-lg font-mono text-xs text-emerald-300 space-y-1">
                      {Object.entries(testResult.headers).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-[#a7a7a7]">{key}:</span> {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const POSTGRES_DDL_SNIPPET = `-- DOODLE CLOUD MUSIC STREAMING PLATFORM
-- Production PostgreSQL DDL Schema with Full-Text Search, GIN, and Trigrams

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. TRACKS TABLE (with generated Full-Text Search tsvector)
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    duration_seconds INT NOT NULL,
    audio_url TEXT NOT NULL,
    audio_file_key VARCHAR(500) NOT NULL,
    audio_file_size BIGINT NOT NULL,
    codec VARCHAR(50) NOT NULL DEFAULT 'MP3_320',
    genre VARCHAR(50) NOT NULL,
    plays_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(genre, '')), 'B')
    ) STORED
);

CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_tracks_search_vector ON tracks USING gin(search_vector);
CREATE INDEX idx_tracks_title_trgm ON tracks USING gin(title gin_trgm_ops);`;

const PRISMA_SNIPPET = `model Track {
  id              String            @id @default(uuid()) @db.Uuid
  artistId        String            @map("artist_id") @db.Uuid
  albumId         String?           @map("album_id") @db.Uuid
  title           String            @db.VarChar(200)
  durationSeconds Int               @map("duration_seconds")
  audioUrl        String            @map("audio_url") @db.Text
  audioFileKey    String            @map("audio_file_key") @db.VarChar(500)
  audioFileSize   BigInt            @map("audio_file_size")
  codec           AudioCodec        @default(MP3_320)
  genre           String            @db.VarChar(50)
  playsCount      BigInt            @default(0) @map("plays_count")
  createdAt       DateTime          @default(now()) @map("created_at")

  artist          Artist            @relation(fields: [artistId], references: [id], onDelete: Cascade)
  album           Album?            @relation(fields: [albumId], references: [id], onDelete: SetNull)
  playlistTracks  PlaylistTrack[]
  likes           Like[]
  playbackHistory PlaybackHistory[]

  @@index([artistId])
  @@index([albumId])
  @@index([genre])
  @@map("tracks")
}`;

const GO_WORKER_SNIPPET = `// Go HTTP 206 Partial Content Range Handler
func (w *StreamWorker) StreamAudioHandler(rw http.ResponseWriter, req *http.Request) {
    trackKey := strings.TrimPrefix(req.URL.Path, "/stream/tracks/")
    stat, err := w.s3Client.StatObject(req.Context(), w.bucketName, trackKey, minio.StatObjectOptions{})
    if err != nil {
        http.Error(rw, "not found", http.StatusNotFound)
        return
    }

    rangeHeader := req.Header.Get("Range")
    if rangeHeader == "" {
        rw.Header().Set("Content-Length", strconv.FormatInt(stat.Size, 10))
        rw.Header().Set("Accept-Ranges", "bytes")
        rw.WriteHeader(http.StatusOK)
        obj, _ := w.s3Client.GetObject(req.Context(), w.bucketName, trackKey, minio.GetObjectOptions{})
        defer obj.Close()
        io.Copy(rw, obj)
        return
    }

    start, end, err := parseRange(rangeHeader, stat.Size)
    if err != nil {
        rw.Header().Set("Content-Range", fmt.Sprintf("bytes */%d", stat.Size))
        http.Error(rw, "Requested Range Not Satisfiable", http.StatusRequestedRangeNotSatisfiable)
        return
    }

    contentLength := end - start + 1
    rw.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, stat.Size))
    rw.Header().Set("Accept-Ranges", "bytes")
    rw.Header().Set("Content-Length", strconv.FormatInt(contentLength, 10))
    rw.WriteHeader(http.StatusPartialContent)

    opts := minio.GetObjectOptions{}
    opts.SetRange(start, end)
    obj, _ := w.s3Client.GetObject(req.Context(), w.bucketName, trackKey, opts)
    defer obj.Close()
    io.Copy(rw, obj)
}`;

const DOCKER_COMPOSE_SNIPPET = `version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: doodle_db
      POSTGRES_USER: doodle_user
      POSTGRES_PASSWORD: doodle_secure_password
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  minio:
    image: minio/minio:RELEASE.2024-01-16T16-07-38Z
    command: server /data --console-address ":9001"
    ports: ["9000:9000", "9001:9001"]

  stream-worker:
    build: { context: ., dockerfile: Dockerfile.worker }
    ports: ["8080:8080"]

  web:
    build: { context: ., dockerfile: Dockerfile.web }
    ports: ["3000:3000"]`;
