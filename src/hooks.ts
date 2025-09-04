import { useState } from 'react';
import { useLocation } from 'wouter';

/**
 * A custom hook that provides a navigation function.
 * This function can be used to change the current route.
 */
export const useNavigate = () => useLocation()[1];

/**
 * A custom hook that provides the current page index, page size,
 * and a callback to trigger a page change.
 *
 * @returns An object with the following properties:
 * - pageIndex: The current page index (0-based).
 * - pageSize: The current page size.
 * - onPaginationChange: A callback to trigger a page change.
 *   The callback receives a pagination state object with pageIndex and pageSize properties.
 */
export const usePagination = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const onPaginationChange = (paginationState: { pageIndex: number; pageSize: number }) => {
    if (paginationState.pageIndex !== pageIndex) { setPageIndex(paginationState.pageIndex); }
    if (paginationState.pageSize !== pageSize) { setPageSize(paginationState.pageSize); }
  };

  return {
    pageIndex,
    pageSize,
    onPaginationChange,
  };
};
