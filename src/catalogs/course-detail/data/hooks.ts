import { useQuery } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { LearnerStatus, UseQueryResult } from '@src/types';
import { getCourseLearners } from './api';

const queryKey = {
  all: [appId, 'courses'],
  courseLearnersList: (
    catalogId: string,
    courseId: string,
    pageIndex: number,
    pageSize: number,
    ordering?: string,
    search?: string,
  ) => [
    ...queryKey.all, 'learners', catalogId, courseId, pageIndex, pageSize, ordering, search,
  ],
};

/**
 * React hook for fetching the learners' status for a specific course
 * within a catalog.
 *
 * This hook uses React Query to retrieve paginated information about
 * learners enrolled in a course. It provides default empty data to
 * simplify UI rendering and avoid null checks.
 *
 * @param catalogId - The unique identifier of the catalog.
 * @param courseId - The unique identifier of the course.
 * @param pageIndex - The current page index.
 * @param pageSize - The number of learners per page.
 *
 * @returns A standardized UseQueryResult containing:
 * - `data` – The learners' status data.
 * - `isLoading` – Loading state.
 * - `isError` – Error state.
 * - `error` – Error object, if any.
 * - `isSuccess` – Success state.
 *
 * @example
 * ```ts
 * const { data, isLoading, isError } = useCourseLearnersStatus(
 *   'catalog-123',
 *   'course-456',
 *   1,
 *   20
 * );
 * ```
 */
export const useCourseLearners = (
  catalogId: string,
  courseId: string,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
): UseQueryResult<{ results: LearnerStatus[], count: number, pageCount: number }> => {
  const {
    data, isLoading, isError, error, isSuccess,
  } = useQuery({
    queryKey: queryKey.courseLearnersList(catalogId, courseId, pageIndex, pageSize, ordering, search),
    queryFn: () => getCourseLearners(catalogId, courseId, pageIndex, pageSize, ordering, search),
    enabled: !!catalogId && !!courseId,
  });

  return {
    data: {
      results: data?.results.filter(Boolean) || [],
      count: data?.count || 0,
      pageCount: data?.numPages || 0,
    },
    isLoading,
    isError,
    error,
    isSuccess,
  };
};
