import { useState, useCallback } from 'react';
import { ApiError, handleApiError } from '../utils/errorHandler';

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      const handledError = handleApiError(err);
      setError(handledError);
      throw handledError;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { execute, data, error, loading };
} 