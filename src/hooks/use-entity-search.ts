'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseEntitySearchParams {
  params: { search: string; page: number; [key: string]: unknown };
  setParams: (params: Record<string, unknown>) => void;
}

export const useEntitySearch = ({ params, setParams }: UseEntitySearchParams) => {
  const [searchValue, setSearchValue] = useState(params.search || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setSearchValue(params.search || '');
  }, [params.search]);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setParams({ ...params, search: value, page: 1 });
      }, 300);
    },
    [params, setParams],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return { searchValue, onSearchChange };
};
