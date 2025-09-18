import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CorporateCourse, PaginatedResponse } from '@src/app/types';
import { getCourses, deleteCourse, getCourseDetails } from './api';

export const useCatalogCourses = ({
  partnerId, catalogId, pageIndex, pageSize, courseOverview,
} : {
  partnerId: string,
  catalogId: string,
  pageIndex?: number,
  pageSize?: number,
  courseOverview?: string,
}) => {
  const queryClient = useQueryClient();

  const courseCached = queryClient
    .getQueriesData<PaginatedResponse<CorporateCourse>>({ queryKey: ['catalogCourses'] })
    .flatMap(([, data]) => data?.results ?? [])
    .filter((course) => course.courseRun.id === courseOverview);

  const { data, isLoading } = useQuery({
    queryKey: ['catalogCourses', partnerId, catalogId, pageIndex, pageSize, courseOverview],
    queryFn: () => getCourses(partnerId, catalogId, pageIndex, pageSize, courseOverview),
    enabled: !courseCached.length,
  });

  return {
    courses: data?.results || courseCached, count: data?.count || 0, pageCount: data?.numPages, isLoading,
  };
};

export const useDeleteCatalogCourse = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ partnerId, catalogId, courseId }:
    { partnerId: string; catalogId: string; courseId: number }) => deleteCourse(partnerId, catalogId, courseId),
    onSettled: (_data, _error, args) => {
      queryClient.invalidateQueries({
        queryKey: ['catalogCourses', args.partnerId, args.catalogId],
        exact: false,
      });
    },
  });
  return mutateAsync;
};

export const useCourseDetails = (
  { partnerId, catalogId, courseId } : { partnerId: string; catalogId: string; courseId?: number },
) => {
  const queryClient = useQueryClient();

  const allCourses = queryClient
    .getQueriesData<PaginatedResponse<CorporateCourse>>({ queryKey: ['catalogCourses'] })
    .flatMap(([, data]) => data?.results ?? []);
  const courseCached: CorporateCourse | undefined = allCourses.find((course) => course.id === Number(courseId));

  const { data, isLoading } = useQuery({
    queryKey: ['courseDetails', partnerId, catalogId, courseId],
    queryFn: () => getCourseDetails(partnerId, catalogId, courseId!),
    enabled: !courseCached && !!courseId,
  });

  return {
    courseDetails: courseCached || data,
    isLoadingCourseDetails: isLoading,
  };
};
