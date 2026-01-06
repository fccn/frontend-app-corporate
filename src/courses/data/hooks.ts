import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appId } from '@src/constants';
import {
  getCourses, deleteCourse, updateCourse, getAvailableCourses,
  addCoursesToCatalog,
  getCourseDetails,
  getCourseLearnersStatus,
} from './api';

const queryKey = {
  all: [appId, 'courses'],
  courseList: (catalogId: string, pageIndex: number, pageSize: number, ordering?: string, search?: string) => [
    ...queryKey.all, catalogId, pageIndex, pageSize, ordering, search,
  ],
  courseDetails: (catalogId: string, courseId: string) => [...queryKey.all, 'details', catalogId, courseId],
  availableCourses: (catalogId: string) => [...queryKey.all, 'available', catalogId],
  courseLearnersList: (catalogId: string, courseId: string, pageIndex: number, pageSize: number) => [
    ...queryKey.all, 'learners', catalogId, courseId, pageIndex, pageSize,
  ],
};

export const useCatalogCourses = (catalogId, pageIndex, pageSize, ordering, search) => {
  const { data, isLoading } = useQuery({
    queryKey: queryKey.courseList(catalogId, pageIndex, pageSize, ordering, search),
    queryFn: () => getCourses(catalogId, pageIndex, pageSize, ordering, search),
    enabled: !!catalogId,
  });

  return {
    courses: data?.results.filter(item => item != null) || [],
    count: data?.count || 0,
    pageCount: data?.numPages,
    isLoading,
  };
};

export const useCatalogCourseDetails = (catalogId: string, courseId: string) => useQuery({
  queryKey: queryKey.courseDetails(catalogId, courseId),
  queryFn: () => getCourseDetails(catalogId, courseId),
  enabled: !!catalogId && !!courseId,
});

export const useDeleteCatalogCourse = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ catalogId, data }:
    { catalogId: string; data: { catalogCourseIds: number[] } }) => deleteCourse(catalogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.all,
        exact: false,
      });
    },
  });
  return mutateAsync;
};

export const useUpdateCatalogCourse = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ catalogId, courseId, data }:
    { catalogId: string; courseId: string; data: { position: number } }) => updateCourse(catalogId, courseId, data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.all,
        exact: false,
      });
    },
  });
  return mutateAsync;
};

export const useAvailableCourses = (catalogId: string, isOpen: boolean) => useQuery({
  queryKey: queryKey.availableCourses(catalogId),
  queryFn: () => getAvailableCourses(catalogId),
  enabled: isOpen,
});

export const useAddCoursesToCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ catalogId, courseIds }: {
      catalogId: string;
      courseIds: string[] }) => addCoursesToCatalog(catalogId, { courseIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.all,
      });
    },
  });
};

export const useCourseLearnersStatus = (catalogId: string, courseId: string, pageIndex, pageSize) => {
  const { data, isLoading } = useQuery({
    queryKey: queryKey.courseLearnersList(catalogId, courseId, pageIndex, pageSize),
    queryFn: () => getCourseLearnersStatus(catalogId, courseId, pageIndex, pageSize),
    enabled: !!catalogId,
  });

  return {
    data,
    isLoading,
  };
};
