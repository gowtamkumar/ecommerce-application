type CacheEntry<T> = {
  value: T;
  expiry: number;
};

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 300000; // 5 minutes in ms

  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Helper for user-specific keys
  static getUserKey(userId: string | number): string {
    return `user_${userId}`;
  }
}

export const cacheService = new CacheService();
