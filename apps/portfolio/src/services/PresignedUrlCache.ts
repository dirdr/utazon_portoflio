/**
 * In-memory cache for presigned video URLs with expiration tracking
 * Ensures URLs are refreshed before expiration for seamless video playback
 */

interface CachedUrl {
  url: string;
  expiresAt: number; // Unix timestamp in milliseconds
  fetchedAt: number; // Unix timestamp in milliseconds
}

class PresignedUrlCache {
  private cache = new Map<string, CachedUrl>();
  private readonly SAFETY_MARGIN_MS = 60 * 1000; // 1 minute safety margin

  /**
   * Store a presigned URL with expiration tracking
   * @param objectKey - The R2 object key (e.g., "fooh/details.mp4")
   * @param url - The presigned URL from the API
   * @param expiresIn - Expiration time in seconds from API response
   */
  set(objectKey: string, url: string, expiresIn: number): void {
    const now = Date.now();
    const expiresAt = now + expiresIn * 1000;

    this.cache.set(objectKey, {
      url,
      expiresAt,
      fetchedAt: now,
    });
  }

  /**
   * Retrieve a cached presigned URL if it exists and hasn't expired
   * @param objectKey - The R2 object key
   * @returns The presigned URL or null if not cached or expired
   */
  get(objectKey: string): string | null {
    const cached = this.cache.get(objectKey);

    if (!cached) {
      return null;
    }

    if (this.isExpired(objectKey)) {
      this.clear(objectKey);
      return null;
    }

    return cached.url;
  }

  /**
   * Check if a cached URL has expired (with safety margin)
   * @param objectKey - The R2 object key
   * @returns True if expired or about to expire
   */
  isExpired(objectKey: string): boolean {
    const cached = this.cache.get(objectKey);

    if (!cached) {
      return true;
    }

    const now = Date.now();
    return now >= cached.expiresAt - this.SAFETY_MARGIN_MS;
  }

  /**
   * Remove a specific entry from the cache
   * @param objectKey - The R2 object key
   */
  clear(objectKey: string): void {
    this.cache.delete(objectKey);
  }

  /**
   * Clear all cached URLs
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics for debugging
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        expiresIn: Math.max(
          0,
          Math.floor((value.expiresAt - Date.now()) / 1000),
        ),
        age: Math.floor((Date.now() - value.fetchedAt) / 1000),
      })),
    };
  }
}

// Export singleton instance
export const presignedUrlCache = new PresignedUrlCache();
