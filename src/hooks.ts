import { useContext, useState } from 'react';
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
    const isAdmin = authenticatedUser.isAdmin;
    const isCatalogManager = authenticatedUser.roles.includes(CORPORATE_MANAGER_ROLE);
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
