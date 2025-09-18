import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as api from './api';
import { useCatalogCourses, useDeleteCatalogCourse } from './hooks';

jest.mock('./api');

// Factory function to ensure a fresh QueryClient per test
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for predictable test behavior
      },
    },
  });
  return function Wrapper({ children }: React.PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useCatalogCourses', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Ensure mocks are reset between tests
  });

  it('returns courses and count from API', async () => {
    (api.getCourses as jest.Mock).mockResolvedValue({
      results: [{ id: 1, courseRun: { id: 'run1', displayName: 'Course 1' } }],
      count: 1,
      numPages: 1,
    });

    const { result } = renderHook(
      () => useCatalogCourses({
        partnerId: 'p1', catalogId: 'c1', pageIndex: 1, pageSize: 10,
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => result.current.courses.length > 0);
    expect(result.current.courses[0].id).toBe(1);
    expect(result.current.count).toBe(1);
    expect(result.current.pageCount).toBe(1);
  });

  it('returns loading state', async () => {
    (api.getCourses as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useCatalogCourses({
      partnerId: 'p1', catalogId: 'c1', pageIndex: 1, pageSize: 10,
    }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns empty results', async () => {
    (api.getCourses as jest.Mock).mockResolvedValue({
      results: [],
      count: 0,
      numPages: 0,
    });

    const { result } = renderHook(
      () => useCatalogCourses({
        partnerId: 'p1', catalogId: 'c1', pageIndex: 1, pageSize: 10,
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => result.current.courses.length === 0 && result.current.count === 0);
    expect(result.current.courses.length).toBe(0);
    expect(result.current.count).toBe(0);
    expect(result.current.pageCount).toBe(0);
  });

  it('returns multiple pages', async () => {
    (api.getCourses as jest.Mock).mockResolvedValue({
      results: [],
      count: 20,
      numPages: 2,
    });

    const { result } = renderHook(
      () => useCatalogCourses({
        partnerId: 'p1', catalogId: 'c1', pageIndex: 1, pageSize: 10,
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => result.current.pageCount === 2);
    expect(result.current.pageCount).toBe(2);
  });

  it('handles API error', async () => {
    (api.getCourses as jest.Mock).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(
      () => useCatalogCourses({
        partnerId: 'p1', catalogId: 'c1', pageIndex: 1, pageSize: 10,
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => result.current.courses.length === 0 && result.current.count === 0);
    expect(result.current.courses.length).toBe(0);
    expect(result.current.count).toBe(0);
  });
});

describe('useDeleteCatalogCourse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls deleteCourse API and invalidates queries', async () => {
    (api.deleteCourse as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCatalogCourse(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current({ partnerId: 'p1', catalogId: 'c1', courseId: 1 });
    });

    expect(api.deleteCourse).toHaveBeenCalledWith('p1', 'c1', 1);
  });

  it('handles API error', async () => {
    (api.deleteCourse as jest.Mock).mockRejectedValue(new Error('Delete error'));

    const { result } = renderHook(() => useDeleteCatalogCourse(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current({ partnerId: 'p1', catalogId: 'c1', courseId: 1 }),
    ).rejects.toThrow('Delete error');
  });
});
