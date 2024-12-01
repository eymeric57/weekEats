import {useState, useCallback} from 'react';

export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const withLoading = useCallback(async callback => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callback();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {isLoading, error, withLoading, setError};
};
