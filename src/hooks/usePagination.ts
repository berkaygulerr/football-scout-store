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

  // Auto-correct current page if it's out of range
  useEffect(() => {
    if (items.length > 0 && pagination.page > totalPages && totalPages > 0) {
      setPagination(prev => ({ ...prev, page: totalPages }));
    }
  }, [items.length, totalPages]);

  const paginatedItems = useMemo(() => {
    if (items.length === 0) return [];
    
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const result = items.slice(startIndex, endIndex);
    
    return result;
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
      page: 1 // Reset to first page when changing page size
    }));
  };

  // Reset to first page when items change (e.g., after filtering)
  const resetPage = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const delta = 2; // Number of pages to show on each side
    const pages: number[] = [];
    const rangeStart = Math.max(1, pagination.page - delta);
    const rangeEnd = Math.min(totalPages, pagination.page + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Calculate start and end indices
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