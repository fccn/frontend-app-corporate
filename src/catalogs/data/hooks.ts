import { useSuspenseQuery } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { getCatalogDetails, getCourseDetails } from './api';

export const queryKey = {
  all: [appId, 'catalog.details'],
  catalogDetail: (catalogSlug: string) => [...queryKey.all, 'catalog', catalogSlug],
  courseDetails: (catalogId: string, courseId: string) => [...queryKey.all, 'course', catalogId, courseId],
};

/**
 * Hook to fetch catalog details.
 *
 * @param catalogSlug - The catalog's unique slug.
 * @returns catalogDetails object or null if not found.
 *
 * @example
 * const { catalogDetails } = useCatalogDetails({ catalogSlug: 'catalog-123' });
 */
export const useCatalogDetails = ({ catalogSlug }: { catalogSlug: string }) => useSuspenseQuery({
  queryKey: queryKey.catalogDetail(catalogSlug),
  queryFn: () => getCatalogDetails(catalogSlug),
});

/**
 * React hook for fetching detailed information about a specific course
 * within a catalog.
 *
 * @param catalogId - The unique identifier of the catalog.
 * @param courseId - The unique identifier of the course.
 *
 * @returns The result of the React Query `useQuery` call, including:
 * - `data` – The course details.
 * - `isLoading` – Whether the course details are currently being loaded.
 * - `error` – Any error encountered during fetching.
 * - isError – Whether there was an error during fetching.
 * - isSuccess – Whether the data was successfully fetched.
 *
 * @example
 * ```ts
 * const { data, isLoading, error } = useCatalogCourseDetails(catalogId, courseId);
 * ```
 */

export const useCatalogCourseDetails = (
  catalogId: string,
  courseId: string,
) => useSuspenseQuery({
  queryKey: queryKey.courseDetails(catalogId, courseId),
  queryFn: () => getCourseDetails(catalogId, courseId),
});
