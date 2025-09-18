import { useQuery } from '@tanstack/react-query';
import { getCourseEnrollments } from './api';

export const useCatalogCourseEnrollments = ({
  partnerId, catalogId, pageIndex, pageSize, courseId,
} : {
  partnerId: string,
  catalogId: string,
  pageIndex?: number,
  pageSize?: number,
  courseId?: number,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['courseLearners', courseId],
    queryFn: () => getCourseEnrollments({
      partnerId, catalogId, courseId: courseId!, pageIndex, pageSize,
    }),
    enabled: !!courseId,
  });

  return {
    enrollments: data?.results || [], count: data?.count || 0, pageCount: data?.numPages, isLoading,
  };
};
