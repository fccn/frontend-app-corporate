import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { getCourses, deleteCourse, updateCourse } from './api';

const queryKey = {
  all: [appId, 'courses'],
  courseList: (catalogId: string, pageIndex: number, pageSize: number) => [
    ...queryKey.all, catalogId, pageIndex, pageSize,
  ],
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
    mutationFn: async ({ catalogId, courseId }:
    { catalogId: string; courseId: string }) => deleteCourse(catalogId, courseId),
    onSettled: () => {
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
