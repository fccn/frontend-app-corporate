import {
  useMutation, useQuery, useQueryClient, useSuspenseQuery,
} from '@tanstack/react-query';
import { appId } from '@src/constants';
import { Course, LearnerStatus, UseQueryResult } from '@src/types';
import {
  getCourses, deleteCourse, updateCourse, getAvailableCourses,
  addCoursesToCatalog,
  getCourseDetails,
  getCourseLearnersStatus,
} from './api';

const queryKey = {
  all: [appId, 'courses'],
  courseLists: () => [...queryKey.all, 'lists'],
  courseList: (catalogId: string, pageIndex?: number, pageSize?: number, ordering?: string, search?: string) => [
    ...queryKey.courseLists(), catalogId, {
      pageIndex, pageSize, ordering, search,
    },
  ],
  courseDetails: (catalogId: string, courseId: string) => [...queryKey.all, 'details', catalogId, courseId],
  availableCourses: (catalogId: string) => [...queryKey.all, 'available.list', catalogId],
  courseLearnersList: (catalogId: string, courseId: string, pageIndex: number, pageSize: number) => [
    ...queryKey.all, 'learners', catalogId, courseId, pageIndex, pageSize,
  ],
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

  return useMutation({
    mutationFn: async ({
      catalogId,
      data,
    }: {
      catalogId: string;
      data: { catalogCourseIds: number[] };
    }) => deleteCourse(catalogId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.courseLists(),
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

    onSettled: () => {
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

  return useMutation({
    mutationFn: ({ catalogId, courseIds }: {
      catalogId: string;
      courseIds: string[]
    }) => addCoursesToCatalog(catalogId, { courseIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.courseLists(),
      });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.availableCourses(variables.catalogId),
      });
    }
  });
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
export const useCourseLearnersStatus = (
  catalogId: string,
  courseId: string,
  pageIndex: number,
  pageSize: number,
): UseQueryResult<{ results: LearnerStatus[], count: number, pageCount: number }> => {
  const {
    data, isLoading, isError, error, isSuccess,
  } = useQuery({
    queryKey: queryKey.courseLearnersList(catalogId, courseId, pageIndex, pageSize),
    queryFn: () => getCourseLearnersStatus(catalogId, courseId, pageIndex, pageSize),
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
