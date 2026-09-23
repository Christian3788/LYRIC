# DOODLE 🎵 — Cloud Audio Streaming Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%99%A5-blue.svg)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)

A modern, open-source, high-performance music streaming platform inspired by Spotify, architected with scalable audio delivery, HTTP 206 Partial Content range requests, persistent global playback state, and real-time synchronized listening sessions.

---

## 🌐 Live URLs

- **Public Production (Shared App):** [https://ais-pre-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app](https://ais-pre-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app)
- **Development Preview:** [https://ais-dev-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app](https://ais-dev-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app)

---

## 🌟 Highlights & Complete Feature Suite

### 1. 🎛️ 10-Band Graphic Equalizer & Spatial DSP
- **10 Independent Frequency Bands**: Precision sliders across `32Hz`, `64Hz`, `125Hz`, `250Hz`, `500Hz`, `1kHz`, `2kHz`, `4kHz`, `8kHz`, and `16kHz` with ±12dB gain range.
- **Instant Audio Presets**: Quick-select presets including *Flat*, *Bass Boost*, *Vocal Enhancer*, *Treble Boost*, *Electronic/Club*, *Rock/Live*, *Acoustic*, and *Chill*.
- **Real-Time Frequency Response Visualizer**: Live HTML5 Canvas rendering of the EQ curve with interactive control points and frequency labels.
- **Bass Boost & Spatial Audio Stereo Widener**: Dynamic sound enhancements with persistent user preferences saved to `localStorage`.

### 2. 📻 Infinite Track & Artist Radio
- **Algorithmic Smart Queue**: Generates an endless, cohesive queue of related tracks from any seed track, artist, or playlist.
- **Acoustic Similarity Scoring**: Multi-factor scoring matching genre classification (+50 pts), artist affinity (+40 pts), and BPM tempo proximity (10–30 pts).
- **One-Click Radio Trigger**: Available on every track row, the player bar, and playlist headers.

### 3. 🌙 Sleep Timer with Smooth Fade-Out
- **Flexible Timer Durations**: Presets for 15, 30, 45, 60 minutes, or stop at the *End of Current Track*.
- **30-Second Gentle Fade-Out**: Automatically attenuates master volume smoothly over the final 30 seconds before pausing playback to ensure a peaceful rest.
- **Active Countdown Pill**: Displays live minute-and-second countdown directly on the player bar icon.

### 4. 🪟 Floating Mini-Player (Picture-in-Picture)
- **Detached Compact Player**: Floating overlay docked in the corner of your screen showing high-resolution album artwork, track title, artist name, and playback progress.
- **Instant Controls**: Play/pause, next/previous track, and direct maximize button to jump straight into the full-screen moving lyrics view.

### 5. 🎨 Custom Playlist Cover & Metadata Editor
- **Custom Artwork Studio**: Pick from curated high-resolution photography covers, modern multi-stop vibrant color gradients, or supply any custom image URL.
- **Metadata Management**: Edit playlist title and rich description with instantaneous library state synchronization.

### 6. 💾 Offline Music Caching (IndexedDB Storage)
- **Zero-Bandwidth Playback**: Download any track directly to browser `IndexedDB` storage (`doodle_offline_db`) as binary audio blobs.
- **Dedicated Library Offline Filter**: Instant "Offline Cache" filter tab in Your Library showing cached track count, storage details, and one-click offline play or removal.
- **Offline Indicator Badges**: Visual confirmation on downloaded tracks across the player bar and track tables.

### 7. 🎤 Synchronized Moving Lyrics (Live LRCLIB Integration & Precision Calibration)
- **Genuine Lyrics Syncing**: Real-time LRCLIB API integration (`/api/lyrics`) fetching exact timestamped LRC lyrics for any track playing (catalog, YouTube Music, or Audius).
- **24-Hour Server & Client Caching**: Blazing fast responses (<2ms) on repeated lookups to reduce network overhead.
- **Millisecond Precision Audio Synchronization**: Animated glowing line fill visualizer tracking playback timing in real-time.
- **Timing Offset Calibration**: On-the-fly `[-0.5s] [Offset: 0.0s] [+0.5s]` buttons allowing users to micro-adjust sync for Bluetooth headphones or internet latency.
- **Full Song vs Preview Toggle**: Instant switch between 30s preview snippet sync and full-length song lyrics.
- **Click-to-Seek Navigation**: Click any timestamp or lyric line to jump playback directly to that position.
- **Karaoke Focus Mode & Sing-Along HUD**: Floating high-contrast sing-along bar displaying active line and next verse preview.
- **Persistent Favorites & Library Sync**: Responsive heart buttons on player bar, playlist detail view, and library cards backed by `localStorage` events.

### 8. 👥 Real-Time Party Rooms ("Listen Together")
- **Multi-Client Playback Sync**: Sub-180ms drift auto-correction between host and guests.
- **Room Sharing & Presence**: Unique 6-character room codes with live participant counter and host broadcast controls.

### 9. ⚡ Persistent Global Audio Engine & HTTP 206 Streaming
- **Uninterrupted Playback**: Singleton `AudioContext` maintains persistent playback during navigation across views and modals.
- **RFC 7233 Byte-Range Requests**: High-throughput chunk streaming with HTTP 206 partial content support for ultra-fast scrubbing and minimal buffer lag.
- **Multi-Engine Audio Switching**: Seamless fallback between local HTTP 206 streaming, Audius decentralized tracks, and YouTube background audio/video playback.
- **Queue Reordering**: Drag-and-drop or reorder tracks in the active queue drawer with next-track preloading.

---

## 🏗️ Architecture & Tech Stack

```
                               ┌───────────────────────────┐
                               │     DOODLE Web Client     │
                               │  (React 19 + TypeScript)  │
                               └─────────────┬─────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
         ┌───────────────────────────┐               ┌───────────────────────────┐
         │     Express / Vite API    │               │  Go HTTP 206 Stream Worker│
         │  (Auth, Metadata, Party)  │               │   (RFC 7233 Range Engine) │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
          ┌────────────┴────────────┐                              │
          ▼                         ▼                              ▼
┌──────────────────┐      ┌──────────────────┐           ┌──────────────────┐
│  PostgreSQL 16   │      │     Redis 7      │           │    MinIO / S3    │
│ (Trigrams + GIN) │      │ (Sync & Sessions)│           │  (Audio Chunks)  │
└──────────────────┘      └──────────────────┘           └──────────────────┘
```

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: `motion`
- **Icons**: Lucide React

### Backend & Audio Pipeline
- **Web API**: Node.js + Express
- **Audio Streaming Worker**: Go (`server/stream_worker.go`) handling HTTP 206 `Content-Range` and `Accept-Ranges: bytes`
- **Database**: PostgreSQL 16 with `pg_trgm` trigram similarity & tsvector full-text search (`schema.sql` & `prisma/schema.prisma`)
- **Cache / PubSub**: Redis 7 for session cache and party playback sync
- **Storage**: MinIO / S3 object storage for audio chunking

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- [Docker](https://www.docker.com/) and Docker Compose (optional for local multi-service container testing)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/doodle.git
cd doodle

# Install dependencies
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

### 4. Development Server
```bash
# Start the full-stack dev server (Vite + Express on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Production Deployment

To spin up the entire production infrastructure (PostgreSQL with GIN indexes, Redis, MinIO S3, Go Stream Worker, and Web App):

```bash
docker-compose up --build -d
```

### Exposed Endpoints:
| Service | Internal Port | Host Port | Description |
| :--- | :--- | :--- | :--- |
| **Web App** | `3000` | `3000` | Full-stack UI & Express API |
| **Stream Worker** | `8080` | `8080` | Go HTTP 206 Streaming Engine |
| **PostgreSQL** | `5432` | `5432` | Relational database with full-text search |
| **Redis** | `6379` | `6379` | Session cache & party sync |
| **MinIO API** | `9000` | `9000` | S3-compatible object storage |
| **MinIO Console**| `9001` | `9001` | MinIO web management UI |

---

## 🧪 Testing Range Streaming

You can verify the HTTP 206 Partial Content range streaming engine directly from your terminal:

```bash
# Request the first 1MB chunk of track 1
curl -i -X GET http://localhost:3000/api/stream/track_1 \
  -H "Range: bytes=0-1048575"
```

Expected Response:
```http
HTTP/1.1 206 Partial Content
Content-Type: audio/mpeg
Accept-Ranges: bytes
Content-Range: bytes 0-1048575/3145728
Content-Length: 1048576
```

---

## 📁 Repository Structure

```
.
├── docker-compose.yml        # Production Docker multi-container stack
├── schema.sql                # PostgreSQL DDL with pg_trgm & GIN indexes
├── prisma/
│   └── schema.prisma         # Prisma ORM models
├── server.ts                 # Express server with Vite middleware & audio generator
├── server/
│   ├── audioGenerator.ts     # In-memory WAV/MP3 synthetic audio generator for dev
│   └── stream_worker.go      # Go S3 HTTP 206 Range Stream Worker
├── src/
│   ├── App.tsx               # Primary app shell and view router
│   ├── components/           # UI components (PlayerBar, Sidebar, Modals, EQ, MiniPlayer)
│   ├── context/              # Global AudioContext (Player, Queue, Timer) and PartyContext
│   ├── data/                 # Curated mock catalog (artists, albums, playlists)
│   ├── services/             # Audio services (Equalizer, Radio Queue, Offline IndexedDB)
│   ├── views/                # Views (Home, Search, Library, Playlist, Artist, Album, Lyrics)
│   └── types.ts              # TypeScript domain types
└── README.md
```

---

## 🤝 Contributing & Community

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started with setup, conventions, and submitting PRs.
- Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating in discussions or submitting issues.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE). Built with ❤️ for scalable audio streaming.
