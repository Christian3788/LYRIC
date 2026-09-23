# DOODLE 🎵 — Cloud Audio Streaming Platform

A modern, high-performance, production-ready music streaming platform inspired by Spotify, architected with scalable audio delivery, HTTP 206 Partial Content range requests, persistent global playback state, and real-time synchronized listening sessions.

---

## 🌐 Live URLs

- **Public Production (Shared App):** [https://ais-pre-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app](https://ais-pre-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app)
- **Development Preview:** [https://ais-dev-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app](https://ais-dev-plw472jcyhmheexx7l3wfz-537735573587.europe-west2.run.app)

---

## 🌟 Highlights & Key Features

- **Persistent Global Audio Engine**: Seamless background audio playback across page navigations with singleton `AudioContext` state, track preloading, volume normalization, and MediaSession API integration.
- **HTTP 206 Byte-Range Streaming**: High-throughput audio chunk delivery supporting RFC 7233 byte-range requests (`bytes=start-end`), random seeking, and low initial playback latency.
- **Live Interactive Architecture Modal & Test Lab**: In-app architectural inspector featuring production PostgreSQL DDL with `pg_trgm`, Prisma schemas, Go streaming worker source, Docker Compose manifests, and a live HTTP 206 Range Request Test Lab.
- **Real-Time Party Rooms ("Listen Together")**: Synchronized multi-client playback rooms with sub-180ms drift auto-correction and real-time participant state.
- **Queue Management & Preloading**: Dynamic queue drawer with drag/reorder capability, history, and seamless next-track preloading into memory.
- **Rich Catalog Views**: Full-featured views for Home, Search (real-time filtering by track, artist, and genre), Library, Playlist Details, Album Details, and Artist Profiles.
- **Synchronized Lyrics**: Dedicated full-screen lyrics visualizer with real-time highlighted timestamps.

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
│   ├── components/           # UI components (PlayerBar, Sidebar, Modals, Navbar)
│   ├── context/              # Global AudioContext and PartyContext
│   ├── data/                 # Curated mock catalog (artists, albums, playlists)
│   ├── views/                # Views (Home, Search, Library, Playlist, Artist, Album)
│   └── types.ts              # TypeScript domain types
└── README.md
```

---

## 📄 License
MIT License. Built with ❤️ for scalable audio streaming.
