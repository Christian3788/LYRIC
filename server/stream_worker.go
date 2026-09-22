// Package main provides a high-throughput, low-latency audio streaming worker in Go (Golang).
// It implements RFC 7233 HTTP 206 Partial Content range requests against S3/MinIO or local filesystem.
package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// StreamWorker coordinates S3/MinIO chunk streaming and metrics
type StreamWorker struct {
	s3Client   *minio.Client
	bucketName string
	chunkSize  int64 // e.g. 1048576 (1MB default chunk slice)
}

func NewStreamWorker(endpoint, accessKey, secretKey, bucket string, useSSL bool) (*StreamWorker, error) {
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to init S3 client: %w", err)
	}

	return &StreamWorker{
		s3Client:   client,
		bucketName: bucket,
		chunkSize:  1024 * 1024, // 1MB buffer ceiling per burst
	}, nil
}

// StreamAudioHandler handles HTTP 206 Partial Content Range Requests
func (w *StreamWorker) StreamAudioHandler(rw http.ResponseWriter, req *http.Request) {
	// Extract object key from URL (e.g. /stream/tracks/:trackKey)
	trackKey := strings.TrimPrefix(req.URL.Path, "/stream/tracks/")
	if trackKey == "" {
		http.Error(rw, "track key required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(req.Context(), 60*time.Second)
	defer cancel()

	// 1. Stat the object to retrieve total size and ETag
	stat, err := w.s3Client.StatObject(ctx, w.bucketName, trackKey, minio.StatObjectOptions{})
	if err != nil {
		log.Printf("[STREAM] Object stat error for key %s: %v", trackKey, err)
		http.Error(rw, "audio track not found", http.StatusNotFound)
		return
	}

	totalSize := stat.Size
	etag := stat.ETag

	// Verify If-None-Match for 304 Not Modified browser caching
	if match := req.Header.Get("If-None-Match"); match != "" && match == etag {
		rw.WriteHeader(http.StatusNotModified)
		return
	}

	rangeHeader := req.Header.Get("Range")

	// EDGE CASE 1: Missing Range Header -> Stream full track with 200 OK
	if rangeHeader == "" {
		rw.Header().Set("Content-Type", "audio/mpeg")
		rw.Header().Set("Content-Length", strconv.FormatInt(totalSize, 10))
		rw.Header().Set("Accept-Ranges", "bytes")
		rw.Header().Set("ETag", etag)
		rw.Header().Set("Cache-Control", "public, max-age=86400")

		obj, err := w.s3Client.GetObject(ctx, w.bucketName, trackKey, minio.GetObjectOptions{})
		if err != nil {
			http.Error(rw, "failed to read audio stream", http.StatusInternalServerError)
			return
		}
		defer obj.Close()

		rw.WriteHeader(http.StatusOK)
		_, _ = io.Copy(rw, obj)
		return
	}

	// 2. Parse RFC 7233 Range header (e.g., "bytes=0-1048575", "bytes=1048576-", "bytes=-500000")
	start, end, err := parseRange(rangeHeader, totalSize)
	if err != nil {
		// EDGE CASE 2: Invalid range or start >= totalSize -> HTTP 416 Range Not Satisfiable
		rw.Header().Set("Content-Range", fmt.Sprintf("bytes */%d", totalSize))
		http.Error(rw, "Requested Range Not Satisfiable", http.StatusRequestedRangeNotSatisfiable)
		return
	}

	// EDGE CASE 3: Cap chunk size to prevent memory exhaust / excessive egress bandwidth
	if (end - start + 1) > w.chunkSize {
		end = start + w.chunkSize - 1
		if end >= totalSize {
			end = totalSize - 1
		}
	}

	contentLength := end - start + 1

	// 3. Fetch specific byte range from S3/MinIO
	opts := minio.GetObjectOptions{}
	if err := opts.SetRange(start, end); err != nil {
		http.Error(rw, "internal range error", http.StatusInternalServerError)
		return
	}

	obj, err := w.s3Client.GetObject(ctx, w.bucketName, trackKey, opts)
	if err != nil {
		log.Printf("[STREAM] Failed to fetch byte range (%d-%d): %v", start, end, err)
		http.Error(rw, "stream read error", http.StatusBadGateway)
		return
	}
	defer obj.Close()

	// 4. Send HTTP 206 Partial Content Response with RFC compliance
	rw.Header().Set("Content-Type", "audio/mpeg")
	rw.Header().Set("Accept-Ranges", "bytes")
	rw.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, totalSize))
	rw.Header().Set("Content-Length", strconv.FormatInt(contentLength, 10))
	rw.Header().Set("ETag", etag)
	rw.Header().Set("Cache-Control", "no-cache") // Granular seek resilience

	rw.WriteHeader(http.StatusPartialContent)

	// Stream chunk directly to client socket
	if _, err := io.Copy(rw, obj); err != nil {
		// Client disconnected/aborted playback early (normal during scrubbing/seeking)
		return
	}
}

// parseRange parses single byte range syntax
func parseRange(rangeHeader string, totalSize int64) (int64, int64, error) {
	if !strings.HasPrefix(rangeHeader, "bytes=") {
		return 0, 0, fmt.Errorf("invalid byte unit")
	}

	spec := strings.TrimPrefix(rangeHeader, "bytes=")
	parts := strings.Split(spec, "-")
	if len(parts) != 2 {
		return 0, 0, fmt.Errorf("malformed range syntax")
	}

	// Case 1: Suffix range "bytes=-500" (last 500 bytes)
	if parts[0] == "" {
		suffixLen, err := strconv.ParseInt(parts[1], 10, 64)
		if err != nil || suffixLen <= 0 {
			return 0, 0, fmt.Errorf("invalid suffix range")
		}
		if suffixLen > totalSize {
			suffixLen = totalSize
		}
		return totalSize - suffixLen, totalSize - 1, nil
	}

	// Case 2: Standard range "bytes=100-200" or open range "bytes=100-"
	start, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil || start < 0 || start >= totalSize {
		return 0, 0, fmt.Errorf("start offset out of bounds")
	}

	var end int64
	if parts[1] == "" {
		end = totalSize - 1
	} else {
		end, err = strconv.ParseInt(parts[1], 10, 64)
		if err != nil || end < start {
			return 0, 0, fmt.Errorf("end offset invalid")
		}
		if end >= totalSize {
			end = totalSize - 1
		}
	}

	return start, end, nil
}

func main() {
	endpoint := os.Getenv("S3_ENDPOINT")
	if endpoint == "" {
		endpoint = "minio:9000"
	}
	accessKey := os.Getenv("S3_ACCESS_KEY")
	if accessKey == "" {
		accessKey = "minioadmin"
	}
	secretKey := os.Getenv("S3_SECRET_KEY")
	if secretKey == "" {
		secretKey = "minioadmin"
	}
	bucket := os.Getenv("S3_BUCKET_NAME")
	if bucket == "" {
		bucket = "spotify-audio-tracks"
	}

	worker, err := NewStreamWorker(endpoint, accessKey, secretKey, bucket, false)
	if err != nil {
		log.Fatalf("Fatal worker startup error: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/stream/tracks/", worker.StreamAudioHandler)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"go-audio-stream-worker"}`))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Go Audio Streaming Engine listening on port %s...", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Server shutdown: %v", err)
	}
}
