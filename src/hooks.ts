import {
  useContext, useState, useRef, useCallback, useMemo,
} from 'react';
import { useLocation } from 'wouter';
import { AppContext } from '@edx/frontend-platform/react';
import { CORPORATE_MANAGER_ROLE } from './constants';

/**
 * A React hook that provides convenient access to the currently authenticated user
 * and their authorization flags.
 *
 * @returns An object containing:
 * - `user`: The authenticated user object from the `AppContext`.
 * - `isAdmin`: Whether the current user has administrative privileges.
 * - `isCatalogManager`: Whether the current user has the `catalog_manager` role.
 *
 * @example
 * ```ts
 * const { user, isAdmin, isCatalogManager } = useCurrentUser();
 *
 * if (isAdmin) {
 *   // Render admin-only UI
 * }
 * ```
 */

export const useCurrentUser = () => {
  const { authenticatedUser } = useContext<AppContext>(AppContext);
  const isAdmin = authenticatedUser?.administrator;
  const isCatalogManager = authenticatedUser?.roles.includes(CORPORATE_MANAGER_ROLE);
  return {
    user: authenticatedUser,
    isAdmin,
    isCatalogManager,
  };
};

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

  const onPaginationChange = useCallback((paginationState: { pageIndex: number; pageSize: number }) => {
    if (paginationState.pageIndex !== pageIndex) { setPageIndex(paginationState.pageIndex); }
    if (paginationState.pageSize !== pageSize) { setPageSize(paginationState.pageSize); }
  }, [pageIndex, pageSize]);

  return {
    pageIndex,
    pageSize,
    onPaginationChange,
  };
};

type SortResolver =
  | string
  | {
    asc: string;
    desc: string;
  };

interface SortFilterConfig {
  // optional list of allowed sort fields
  sortMappings?: Record<string, SortResolver>;
  // map filter id to param name, e.g. { 'name': 'search', 'status': 'status' }
  filterMappings?: { [key: string]: string };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
}

/**
 * A React hook that translates table sorting, filtering, and pagination state
 * into backend-compatible query parameters.
 *
 * The hook decouples table column accessors from backend field names, supports
 * custom sort resolution (including direction-dependent fields such as date
 * ranges), and automatically resets pagination when sorting or filtering changes.
 *
 * @returns An object containing:
 * - `ordering`: A backend-compatible ordering string (e.g. `"name"`, `"-created_at"`),
 *   or `undefined` when no sorting is applied.
 * - `searchParams`: An object of backend query parameters derived from table filters.
 * - `handleSortingChange`: A handler that converts table sort state into `ordering`.
 * - `handleFilteringChange`: A handler that converts table filter state into `searchParams`.
 * - `fetchData`: A table state handler that coordinates sorting, filtering, and pagination
 *   updates and resets pagination when necessary.
 *
 * @example
 * ```ts
 * const {
 *   ordering,
 *   searchParams,
 *   fetchData,
 * } = useTableSortFilter({
 *   sortMappings: {
 *     name: "organization__name",
 *     dateRange: { asc: "start_date", desc: "end_date" },
 *   },
 *   filterMappings: {
 *     name: "search",
 *   },
 *   onPaginationChange: setPagination,
 * });
 *
 * // Pass ordering & searchParams directly to your API request
 * fetchList({ ordering, ...searchParams });
 * ```
 */

export const useTableSortFilter = (config: SortFilterConfig) => {
  const [ordering, setOrdering] = useState<string>();
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({});

  const previousSortByRef = useRef<Array<{ id: string; desc: boolean }>>();
  const previousFiltersRef = useRef<Array<{ id: string; value: string }>>();
  const isProcessingRef = useRef(false);

  const handleSortingChange = useCallback(
    (sortBy: Array<{ id: string; desc: boolean }>) => {
      if (!sortBy || sortBy.length === 0) {
        setOrdering(undefined);
        return;
      }

      const { id, desc } = sortBy[0];

      const resolver = config.sortMappings?.[id];
      if (!resolver) {
        // not allowed / unknown sort column
        return;
      }

      let backendField: string;

      if (typeof resolver === 'string') {
        backendField = resolver;
      } else {
        backendField = desc ? resolver.desc : resolver.asc;
      }

      setOrdering(desc ? `-${backendField}` : backendField);
    },
    [config.sortMappings],
  );

  const handleFilteringChange = useCallback((filters: Array<{ id: string; value: string }>) => {
    if (!filters) {
      setSearchParams({});
    } else {
      const params: { [key: string]: string } = {};
      filters.forEach(f => {
        const param = config.filterMappings?.[f.id];
        if (param) {
          params[param] = f.value;
        }
      });
      setSearchParams(params);
    }
  }, [config.filterMappings]);

  const fetchData = useCallback((state: any) => {
    if (isProcessingRef.current) { return; }
    isProcessingRef.current = true;

    const {
      pageIndex: newPageIndex, pageSize: newPageSize, sortBy, filters,
    } = state;

    const sortByChanged = JSON.stringify(sortBy) !== JSON.stringify(previousSortByRef.current);
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(previousFiltersRef.current);

    if (sortByChanged || filtersChanged) {
      // Reset page to 0
      config.onPaginationChange({ pageIndex: 0, pageSize: newPageSize });
    } else {
      config.onPaginationChange({ pageIndex: newPageIndex, pageSize: newPageSize });
    }

    previousSortByRef.current = sortBy;
    previousFiltersRef.current = filters;

    handleSortingChange(sortBy);
    handleFilteringChange(filters);

    isProcessingRef.current = false;
  }, [config, handleSortingChange, handleFilteringChange]);

  return useMemo(() => ({
    ordering,
    searchParams,
    handleSortingChange,
    handleFilteringChange,
    fetchData,
  }), [ordering, searchParams, handleSortingChange, handleFilteringChange, fetchData]);
};
