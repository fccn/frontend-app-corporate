import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourses, deleteCourse } from './api';

export const useCatalogCourses = (partnerId: number, catalogId: string, pageIndex, pageSize) => {
  const { data, isLoading } = useQuery({
    queryKey: ['catalogCourses', partnerId, catalogId, pageIndex, pageSize],
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
    { partnerId: number; catalogId: string; courseId: number }) => deleteCourse(catalogId, courseId),
    onSettled: (_data, _error, args) => {
      queryClient.invalidateQueries({
        queryKey: ['catalogCourses', args.partnerId, args.catalogId],
        exact: false,
      });
    },
  });
  return mutateAsync;
};
