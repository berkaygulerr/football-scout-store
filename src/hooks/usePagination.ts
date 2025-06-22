import { useState, useMemo, useEffect } from 'react';

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export function usePagination<T>(
  items: T[],
  initialPageSize: number = 12
) {
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: initialPageSize,
  });

  const totalPages = useMemo(() => {
    return items.length === 0 ? 1 : Math.ceil(items.length / pagination.pageSize);
  }, [items.length, pagination.pageSize]);

  useEffect(() => {
    if (items.length > 0 && pagination.page > totalPages && totalPages > 0) {
      setPagination(prev => ({ ...prev, page: totalPages }));
    }
  }, [items.length, totalPages]);

  const paginatedItems = useMemo(() => {
    if (items.length === 0) return [];
    
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, pagination]);

  const hasNextPage = pagination.page < totalPages && items.length > 0;
  const hasPrevPage = pagination.page > 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== pagination.page) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize, 
      page: 1
    }));
  };

  const resetPage = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const delta = 2;
    const pages: number[] = [];
    const rangeStart = Math.max(1, pagination.page - delta);
    const rangeEnd = Math.min(totalPages, pagination.page + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    return pages;
  };

  const startIndex = items.length === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endIndex = items.length === 0 ? 0 : Math.min(pagination.page * pagination.pageSize, items.length);

  return {
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    totalPages,
    totalItems: items.length,
    hasNextPage,
    hasPrevPage,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPage,
    getPageNumbers,
    startIndex,
    endIndex,
  };
} 