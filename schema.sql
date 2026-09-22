-- ============================================================================
-- DOODLE CLOUD MUSIC STREAMING PLATFORM
-- Production PostgreSQL DDL Schema with Full-Text Search, GIN, and Trigrams
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum Types
CREATE TYPE user_role AS ENUM ('USER', 'ARTIST', 'ADMIN');
CREATE TYPE playlist_visibility AS ENUM ('PUBLIC', 'PRIVATE', 'COLLABORATIVE');
CREATE TYPE audio_codec AS ENUM ('MP3_320', 'AAC_256', 'FLAC_LOSSLESS', 'WAV_PCM');

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. REFRESH TOKENS (HttpOnly Auth rotation)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- 3. ARTISTS TABLE
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    monthly_listeners BIGINT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_artists_monthly_listeners ON artists(monthly_listeners DESC);
CREATE INDEX idx_artists_name_trgm ON artists USING gin (name gin_trgm_ops);

-- 4. ARTIST FOLLOWERS
CREATE TABLE artist_followers (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, artist_id)
);

-- 5. ALBUMS TABLE
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    cover_url TEXT,
    release_date DATE NOT NULL,
    genre VARCHAR(50) NOT NULL,
    total_tracks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_albums_artist_id ON albums(artist_id);
CREATE INDEX idx_albums_release_date ON albums(release_date DESC);
CREATE INDEX idx_albums_title_trgm ON albums USING gin (title gin_trgm_ops);

-- 6. TRACKS TABLE (with generated Full-Text Search tsvector)
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    duration_seconds INT NOT NULL,
    track_number INT,
    disc_number INT DEFAULT 1,
    audio_url TEXT NOT NULL,
    audio_file_key VARCHAR(500) NOT NULL,
    audio_file_size BIGINT NOT NULL,
    codec audio_codec NOT NULL DEFAULT 'MP3_320',
    bpm INT,
    genre VARCHAR(50) NOT NULL,
    lyrics_lrc TEXT,
    plays_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(genre, '')), 'B')
    ) STORED
);
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_plays_count ON tracks(plays_count DESC);
CREATE INDEX idx_tracks_search_vector ON tracks USING gin(search_vector);
CREATE INDEX idx_tracks_title_trgm ON tracks USING gin(title gin_trgm_ops);

-- 7. PLAYLISTS TABLE
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    cover_url TEXT,
    visibility playlist_visibility NOT NULL DEFAULT 'PUBLIC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlists_title_trgm ON playlists USING gin(title gin_trgm_ops);

-- 8. PLAYLIST TRACKS (Position-ordered join table)
CREATE TABLE playlist_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    position INT NOT NULL,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_playlist_position UNIQUE (playlist_id, position)
);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);

-- 9. LIKES TABLE (User Favorite Songs)
CREATE TABLE likes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_track_id ON likes(track_id);

-- 10. PLAYBACK HISTORY (Recently Played & Recommendation telemetry)
CREATE TABLE playback_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completion_percentage REAL NOT NULL DEFAULT 1.0,
    duration_listened_sec INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_playback_history_user_played ON playback_history(user_id, played_at DESC);
CREATE INDEX idx_playback_history_track_id ON playback_history(track_id);
