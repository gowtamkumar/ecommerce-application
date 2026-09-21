import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Re-run the fetcher (used after create/update/delete mutations). */
  refresh: () => void;
}

/**
 * Shared data-fetching hook.
 * Each component owns its own loading state - no global store churn,
 * so refactoring or replacing it never touches other modules.
 *
 * - Starts loading on mount.
 * - `refresh()` flips a version counter which re-runs the fetcher
 *   (and can be re-triggered from any event handler).
 * - `refreshKey` changes also re-run the fetcher (for parameterized lists).
 */
export const useAsyncData = <T,>(fetcher: () => Promise<T>, refreshKey?: unknown): AsyncDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let mounted = true;

    fetcherRef.current()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [refreshKey, version]);

  // Called from event handlers (after mutations), so it's safe to set loading here.
  const refresh = useCallback(() => {
    setLoading(true);
    setVersion((v) => v + 1);
  }, []);

  return { data, loading, error, refresh };
};