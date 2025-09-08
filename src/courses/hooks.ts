
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourses, deleteCourse } from './api';



export const useCatalogCourses = (partnerId: string, catalogId: string, pageIndex, pageSize) => {

  const { data, isLoading } = useQuery({
    queryKey: ['catalogCourses', partnerId, catalogId, pageIndex, pageSize],
    queryFn: () => getCourses(partnerId, catalogId, pageIndex, pageSize),
  })

  return { courses: data?.results || [], count: data?.count || 0, pageCount: data?.numPages, isLoading };
};

export const useDeleteCatalogCourse = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ partnerId, catalogId, courseId }: { partnerId: string; catalogId: string; courseId: number }) => {
      return deleteCourse(partnerId, catalogId, courseId);
    },
    onSettled: (_data, _error, args) => {
      queryClient.invalidateQueries({
        queryKey: ['catalogCourses', args.partnerId, args.catalogId],
        exact: false,
      });
    },
  });
  return mutateAsync;
};