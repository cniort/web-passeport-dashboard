"use client";

import { useState, useEffect, useRef } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number;
  key?: string;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function useCache<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = [],
  options: CacheOptions = {}
) {
  const { ttl = DEFAULT_TTL, key } = options;
  const cacheKey = key || `cache_${JSON.stringify(dependencies)}`;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchedRef = useRef(false);

  const getCachedData = (): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      
      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return entry.data;
    } catch {
      localStorage.removeItem(cacheKey);
      return null;
    }
  };

  const setCachedData = (data: T) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Fetch failed");
      setError(error);
      setData(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const invalidateCache = () => {
    localStorage.removeItem(cacheKey);
    refresh();
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Vérifier le cache d'abord
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Sinon, charger les données
    refresh();
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidateCache,
  };
}

// Hook pour la gestion du cache global
export function useCacheManager() {
  const clearAll = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith("cache_")) {
        localStorage.removeItem(key);
      }
    });
  };

  const getStats = () => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith("cache_"));
    let totalSize = 0;
    let validEntries = 0;
    let expiredEntries = 0;

    cacheKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          const entry: CacheEntry<unknown> = JSON.parse(value);
          const now = Date.now();
          
          if (now - entry.timestamp > entry.ttl) {
            expiredEntries++;
          } else {
            validEntries++;
          }
        }
      } catch {
        // Invalid entry, ignore
      }
    });

    return {
      totalEntries: cacheKeys.length,
      validEntries,
      expiredEntries,
      totalSize: Math.round(totalSize / 1024), // KB
    };
  };

  const cleanExpired = () => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith("cache_"));
    let cleaned = 0;

    cacheKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const entry: CacheEntry<unknown> = JSON.parse(value);
          const now = Date.now();
          
          if (now - entry.timestamp > entry.ttl) {
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      } catch {
        localStorage.removeItem(key);
        cleaned++;
      }
    });

    return cleaned;
  };

  return {
    clearAll,
    getStats,
    cleanExpired,
  };
}