import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appId } from '@src/constants';
import {
  getCourses, deleteCourse, updateCourse, getAvailableCourses,
  addCoursesToCatalog,
} from './api';

const queryKey = {
  all: [appId, 'courses'],
  courseList: (catalogId: string, pageIndex: number, pageSize: number) => [
    ...queryKey.all, catalogId, pageIndex, pageSize,
  ],
  availableCourses: (catalogId: string) => [...queryKey.all, 'available', catalogId],
};

export const useCatalogCourses = (catalogId: string, pageIndex, pageSize) => {
  const { data, isLoading } = useQuery({
    queryKey: queryKey.courseList(catalogId, pageIndex, pageSize),
    queryFn: () => getCourses(catalogId, pageIndex, pageSize),
    enabled: !!catalogId,
  });

  return {
    courses: data?.results || [], count: data?.count || 0, pageCount: data?.numPages, isLoading,
  };
};

export const useDeleteCatalogCourse = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ catalogId, data }:
    { catalogId: string; data: { courseIds: string[] } }) => deleteCourse(catalogId, data),
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
    mutationFn: ({ catalogId, catalogCourseIds }: {
      catalogId: string;
      catalogCourseIds: number[] }) => addCoursesToCatalog(catalogId, { catalogCourseIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.all,
      });
    },
  });
};
