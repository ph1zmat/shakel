'use client';

import { useEffect, useRef, useState } from 'react';

type EntityParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

type SetParams = (updater: (prev: EntityParams) => EntityParams) => void;

export function useEntitySearch({
  params,
  setParams,
}: {
  params: EntityParams;
  setParams: SetParams;
}) {
  const [searchValue, setSearchValue] = useState(params.search ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(params.search ?? '');
  }, [params.search]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: value, page: 1 }));
    }, 300);
  };

  return { searchValue, onSearchChange };
}
