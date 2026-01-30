import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { Course, UseQueryResult } from '@src/types';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { queryKey as enrollmentsQueryKey } from '@src/catalogs/enrollment-list';
import { useParams } from 'wouter';
import {
  getCourses, deleteCourse, updateCourse, getAvailableCourses,
  addCoursesToCatalog,
} from './api';

const queryKey = {
  all: [appId, 'courses'],
  courseLists: () => [...queryKey.all, 'lists'],
  courseList: (catalogId: string, pageIndex?: number, pageSize?: number, ordering?: string, search?: string) => [
    ...queryKey.courseLists(), catalogId, {
      pageIndex, pageSize, ordering, search,
    },
  ],
  availableCourses: (catalogId: string) => [...queryKey.all, 'available.list', catalogId],
};

/**
 * Fetches a paginated list of courses for a specific catalog,
 * supporting pagination, ordering, and search filtering.
 *
 * @param catalogId - The unique identifier of the catalog to fetch courses from.
 * @param pageIndex - The current page index (zero- or one-based depending on API).
 * @param pageSize - The number of courses to fetch per page.
 * @param ordering - The ordering criteria used to sort the courses.
 * @param search - A search string used to filter courses.
 *
 * @returns An object containing:
 * - `data` – An object with the list of courses, total count, and optional page count.
 * - `isLoading` – Whether the courses are currently being loaded.
 * - `isError` – Whether there was an error during fetching.
 * - `error` – The error encountered during fetching, if any.
 * - `isSuccess` – Whether the data was successfully fetched.
 *
 * @example
 * ```ts
 * const { data, isLoading, isError, error, isSuccess } = useCatalogCourses(
 *   catalogId,
 *   pageIndex,
 *   pageSize,
 *   ordering,
 *   search
 * );
 * ```
 */

export const useCatalogCourses = (
  catalogId: string,
  pageIndex: number,
  pageSize: number,
  ordering?: string,
  search?: string,
): UseQueryResult<{ courses: Course[]; count: number; pageCount?: number }> => {
  const {
    data, isLoading, isError, error, isSuccess,
  } = useQuery({
    queryKey: queryKey.courseList(catalogId, pageIndex, pageSize, ordering, search),
    queryFn: () => getCourses(catalogId, pageIndex, pageSize, ordering, search),
    enabled: !!catalogId,
  });

  return {
    data: {
      courses: data?.results.filter(Boolean) || [] as Course[],
      count: data?.count || 0,
      pageCount: data?.numPages,
    },
    isLoading,
    isError,
    error,
    isSuccess,
  };
};

/**
 * React hook for deleting one or more courses from a catalog.
 *
 * This hook wraps a React Query mutation that deletes catalog courses
 * by their identifiers. Upon successful deletion, all related queries
 * are invalidated to ensure cached data stays in sync.
 *
 * @returns A mutation function that deletes courses from a catalog.
 *
 * @example
 * ```ts
 * const deleteCatalogCourse = useDeleteCatalogCourse();
 *
 * await deleteCatalogCourse.mutate({
 *   catalogId: 'catalog-123',
 *   data: { catalogCourseIds: [1, 2, 3] },
 * });
 * ```
 */

export const useDeleteCatalogCourse = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string; }>();

  return useMutation({
    mutationFn: async ({
      catalogId,
      data,
    }: {
      catalogId: string;
      data: { catalogCourseIds: number[] };
    }) => deleteCourse(catalogId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.courseLists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKey.availableCourses(variables.catalogId),
      });
      queryClient.invalidateQueries({
        queryKey: catalogsQueryKey.catalogDetail(catalogSlug),
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentsQueryKey.catalogEnrollments(),
      });
    },
  });
};

/**
 * React hook for updating a catalog course.
 *
 * This hook provides a React Query mutation used to update properties
 * of a course within a catalog (such as its position/order).
 * After the mutation succeeds, related queries are invalidated
 * to keep cached data up to date.
 *
 * @returns A React Query mutation object for updating a catalog course.
 *
 * @example
 * ```ts
 * const updateCatalogCourse = useUpdateCatalogCourse();
 *
 * await updateCatalogCourse.mutateAsync({
 *   catalogId: 'catalog-123',
 *   courseId: 'course-456',
 *   data: { position: 2 },
 * });
 * ```
 */
export const useUpdateCatalogCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      catalogId,
      courseId,
      data,
    }: {
      catalogId: string;
      courseId: string;
      data: { position: number };
    }) => updateCourse(catalogId, courseId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.courseLists(),
      });
    },
  });
};

/**
 * React hook for fetching courses that are available to be added
 * to a specific catalog.
 *
 * This hook uses React Query to retrieve courses that are not yet
 * associated with the given catalog. The query is conditionally
 * enabled based on the `isOpen` flag (e.g., when a modal dialog or dropdown
 * is open).
 *
 * @param catalogId - The unique identifier of the catalog.
 * @param isOpen - Controls whether the query is enabled.
 *
 * @returns The result of the React Query `useQuery` call, including:
 * - `data` – The list of available courses.
 * - `isLoading` – Whether the available courses are currently being loaded.
 * - `error` – Any error encountered during fetching.
 * - Other React Query query state and helpers.
 *
 * @example
 * ```ts
 * const { data, isLoading } = useAvailableCourses(catalogId, isDialogOpen);
 * ```
 */

export const useAvailableCourses = (catalogId: string, isOpen: boolean) => useQuery({
  queryKey: queryKey.availableCourses(catalogId),
  queryFn: () => getAvailableCourses(catalogId),
  enabled: isOpen,
});

/**
 * React hook for adding one or more courses to a catalog.
 *
 * This hook wraps a React Query mutation that associates existing courses
 * with a specified catalog. After a successful mutation, related queries
 * are invalidated to ensure catalog data is refreshed.
 *
 * @returns The React Query mutation object used to add courses to a catalog,
 * including `mutate`, `mutateAsync`, status flags, and error state.
 *
 * @example
 * ```ts
 * const addCoursesToCatalog = useAddCoursesToCatalog();
 *
 * await addCoursesToCatalog.mutateAsync({
 *   catalogId: 'catalog-123',
 *   courseIds: ['course-1', 'course-2'],
 * });
 * ```
 */

export const useAddCoursesToCatalog = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string; }>();

  return useMutation({
    mutationFn: ({ catalogId, courseIds }: {
      catalogId: string;
      courseIds: string[]
    }) => addCoursesToCatalog(catalogId, { courseIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.courseLists(),
      });
      queryClient.invalidateQueries({
        queryKey: catalogsQueryKey.catalogDetail(catalogSlug),
      });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.availableCourses(variables.catalogId),
      });
    },
  });
};
