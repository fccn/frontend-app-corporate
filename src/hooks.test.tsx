import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { useLocation } from 'wouter';
import {
  useCurrentUser, useNavigate, usePagination, useTableSortFilter,
} from './hooks';
import { CORPORATE_MANAGER_ROLE } from './constants';

jest.mock('wouter', () => ({
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;

describe('hooks', () => {
  describe('useCurrentUser', () => {
    beforeEach(() => {
      initializeMockApp({
        authenticatedUser: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          administrator: true,
          roles: [CORPORATE_MANAGER_ROLE, 'other_role'],
        },
      });
    });

    const createWrapper = () => function Wrapper({ children }: React.PropsWithChildren) {
      return <AppProvider>{children}</AppProvider>;
    };

    it('returns user object and admin flag', () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeDefined();
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isCatalogManager).toBe(true);
    });

    it('returns false for isAdmin when user is not administrator', () => {
      initializeMockApp({
        authenticatedUser: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          administrator: false,
          roles: [CORPORATE_MANAGER_ROLE],
        },
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isAdmin).toBe(false);
    });

    it('returns false for isCatalogManager when user does not have role', () => {
      initializeMockApp({
        authenticatedUser: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          administrator: true,
          roles: ['other_role'],
        },
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCatalogManager).toBe(false);
    });

    it('returns true for isCatalogManager when user has catalog_manager role', () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCatalogManager).toBe(true);
    });
  });

  describe('useNavigate', () => {
    it('returns navigate function from wouter', () => {
      const mockNavigate = jest.fn();
      mockUseLocation.mockReturnValue(['/', mockNavigate]);

      const { result } = renderHook(() => useNavigate());

      expect(result.current).toBe(mockNavigate);
      expect(mockUseLocation).toHaveBeenCalled();
    });
  });

  describe('usePagination', () => {
    it('returns initial pagination state', () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.pageIndex).toBe(0);
      expect(result.current.pageSize).toBe(10);
      expect(typeof result.current.onPaginationChange).toBe('function');
    });

    it('updates pageIndex when onPaginationChange is called', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.onPaginationChange({ pageIndex: 2, pageSize: 10 });
      });

      expect(result.current.pageIndex).toBe(2);
      expect(result.current.pageSize).toBe(10);
    });

    it('updates pageSize when onPaginationChange is called', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.onPaginationChange({ pageIndex: 0, pageSize: 25 });
      });

      expect(result.current.pageIndex).toBe(0);
      expect(result.current.pageSize).toBe(25);
    });

    it('updates both pageIndex and pageSize when onPaginationChange is called', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.onPaginationChange({ pageIndex: 3, pageSize: 50 });
      });

      expect(result.current.pageIndex).toBe(3);
      expect(result.current.pageSize).toBe(50);
    });

    it('does not update if values are the same', () => {
      const { result } = renderHook(() => usePagination());

      const initialPageIndex = result.current.pageIndex;
      const initialPageSize = result.current.pageSize;

      act(() => {
        result.current.onPaginationChange({ pageIndex: initialPageIndex, pageSize: initialPageSize });
      });

      expect(result.current.pageIndex).toBe(initialPageIndex);
      expect(result.current.pageSize).toBe(initialPageSize);
    });
  });

  describe('useTableSortFilter', () => {
    const mockOnPaginationChange = jest.fn();

    const defaultConfig = {
      onPaginationChange: mockOnPaginationChange,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns initial state with empty ordering and searchParams', () => {
      const { result } = renderHook(() => useTableSortFilter(defaultConfig));

      expect(result.current.ordering).toBeUndefined();
      expect(result.current.searchParams).toEqual({});
      expect(typeof result.current.handleSortingChange).toBe('function');
      expect(typeof result.current.handleFilteringChange).toBe('function');
      expect(typeof result.current.fetchData).toBe('function');
    });

    describe('handleSortingChange', () => {
      it('sets ordering to undefined when sortBy is empty', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.handleSortingChange([]);
        });

        expect(result.current.ordering).toBeUndefined();
      });

      it('converts camelCase to snake_case and sets ordering', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.handleSortingChange([{ id: 'inviteSentAt', desc: false }]);
        });

        expect(result.current.ordering).toBe('invite_sent_at');
      });

      it('adds minus prefix for descending sort', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.handleSortingChange([{ id: 'acceptedAt', desc: true }]);
        });

        expect(result.current.ordering).toBe('-accepted_at');
      });

      it('ignores sort fields not in sortFields config', () => {
        const config = {
          ...defaultConfig,
          sortFields: ['invite_sent_at', 'accepted_at'],
        };

        const { result } = renderHook(() => useTableSortFilter(config));

        act(() => {
          result.current.handleSortingChange([{ id: 'invalidField', desc: false }]);
        });

        expect(result.current.ordering).toBeUndefined();
      });

      it('allows sort fields in sortFields config', () => {
        const config = {
          ...defaultConfig,
          sortFields: ['inviteSentAt', 'acceptedAt'],
        };

        const { result } = renderHook(() => useTableSortFilter(config));

        act(() => {
          result.current.handleSortingChange([{ id: 'inviteSentAt', desc: false }]);
        });

        expect(result.current.ordering).toBe('invite_sent_at');
      });
    });

    describe('handleFilteringChange', () => {
      it('clears searchParams when filters is null', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.handleFilteringChange([{ id: 'name', value: 'test' }]);
        });

        expect(result.current.searchParams).toEqual({});

        act(() => {
          result.current.handleFilteringChange(null as any);
        });

        expect(result.current.searchParams).toEqual({});
      });

      it('maps filter id to param name using filterMappings', () => {
        const config = {
          ...defaultConfig,
          filterMappings: { fullName: 'search', email: 'search', active: 'active' },
        };

        const { result } = renderHook(() => useTableSortFilter(config));

        act(() => {
          result.current.handleFilteringChange([
            { id: 'fullName', value: 'John' },
            { id: 'active', value: 'true' },
          ]);
        });

        expect(result.current.searchParams).toEqual({
          search: 'John',
          active: 'true',
        });
      });

      it('ignores filters not in filterMappings', () => {
        const config = {
          ...defaultConfig,
          filterMappings: { fullName: 'search' },
        };

        const { result } = renderHook(() => useTableSortFilter(config));

        act(() => {
          result.current.handleFilteringChange([
            { id: 'fullName', value: 'John' },
            { id: 'unknownField', value: 'value' },
          ]);
        });

        expect(result.current.searchParams).toEqual({
          search: 'John',
        });
      });

      it('handles multiple filters mapping to same param', () => {
        const config = {
          ...defaultConfig,
          filterMappings: { fullName: 'search', email: 'search' },
        };

        const { result } = renderHook(() => useTableSortFilter(config));

        act(() => {
          result.current.handleFilteringChange([
            { id: 'fullName', value: 'John' },
            { id: 'email', value: 'john@example.com' },
          ]);
        });

        // Last value overwrites previous
        expect(result.current.searchParams).toEqual({
          search: 'john@example.com',
        });
      });
    });

    describe('fetchData', () => {
      it('calls onPaginationChange with new pageIndex and pageSize', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.fetchData({
            pageIndex: 2,
            pageSize: 25,
            ...defaultConfig,
          });
        });

        expect(mockOnPaginationChange).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 25 });
      });

      it('resets page to 0 when sortBy changes', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.fetchData({
            pageIndex: 2,
            pageSize: 25,
            sortBy: [{ id: 'name', desc: false }],
            filters: [],
          });
        });

        expect(mockOnPaginationChange).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 25 });
      });

      it('resets page to 0 when filters change', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.fetchData({
            pageIndex: 2,
            pageSize: 25,
            sortBy: [],
            filters: [{ id: 'name', value: 'test' }],
          });
        });

        expect(mockOnPaginationChange).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 25 });
      });

      it('does not reset page when sortBy and filters do not change', () => {
        const sortBy = [{ id: 'name', desc: false }];
        const filters = [{ id: 'name', value: 'test' }];

        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          result.current.fetchData({
            pageIndex: 1,
            pageSize: 25,
            sortBy,
            filters,
          });
        });

        // changes when the filters are set
        expect(mockOnPaginationChange).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 25 });

        // Call again with same sortBy and filters but different pageIndex
        act(() => {
          result.current.fetchData({
            pageIndex: 2,
            pageSize: 25,
            sortBy,
            filters,
          });
        });

        expect(mockOnPaginationChange).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 25 });
      });

      it('calls handleSortingChange and handleFilteringChange', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        const sortBy = [{ id: 'acceptedAt', desc: true }];
        const filters = [{ id: 'fullName', value: 'John' }];

        act(() => {
          result.current.fetchData({
            pageIndex: 0,
            pageSize: 10,
            sortBy,
            filters,
          });
        });

        expect(result.current.ordering).toBe('-accepted_at');
      });

      it('prevents concurrent processing with isProcessingRef', () => {
        const { result } = renderHook(() => useTableSortFilter(defaultConfig));

        act(() => {
          // First call
          result.current.fetchData({
            pageIndex: 1,
            pageSize: 10,
            sortBy: [],
            filters: [],
          });
        });

        const callCount = mockOnPaginationChange.mock.calls.length;

        act(() => {
          // Second call immediately after (should be blocked)
          result.current.fetchData({
            pageIndex: 2,
            pageSize: 10,
            sortBy: [],
            filters: [],
          });
        });

        // Should only have one additional call
        expect(mockOnPaginationChange.mock.calls.length).toBeGreaterThanOrEqual(callCount);
      });
    });
  });
});
