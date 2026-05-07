import { useCallback, useState } from 'react';

interface PaginationState {
  page: number;
  pageSize: number;
  offset: number;
  onChange: (page: number, pageSize: number) => void;
  reset: () => void;
}

export function usePagination(defaultPageSize: number = 20): PaginationState {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const onChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    onChange,
    reset,
  };
}
