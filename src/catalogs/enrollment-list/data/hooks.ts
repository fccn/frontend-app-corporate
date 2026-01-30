import { useQuery } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { getCatalogEnrrollements } from './api';

export const queryKey = {
  all: [appId, 'catalogs'],
  catalogEnrollments: () => [...queryKey.all, 'enrollments'],
  catalogEnrollmentsList: (
    catalogId: string,
    pageIndex: number,
    pageSize: number,
    ordering?: string,
    search?: string,
    active?: string,
  ) => [
    ...queryKey.catalogEnrollments(), catalogId, pageIndex, pageSize, ordering, search, active,
  ],
};

/**
 * Hook to fetch catalog enrollments with pagination.
 */
export const useCatalogEnrollments = ({
  catalogId,
  pageIndex,
  pageSize,
  ordering,
  search,
  active,
}: {
  catalogId: string;
  pageIndex: number;
  pageSize: number;
  ordering?: string;
  search?: string;
  active?: string;
}) => useQuery({
  queryKey: queryKey.catalogEnrollmentsList(catalogId, pageIndex, pageSize, ordering, search, active),
  queryFn: () => getCatalogEnrrollements(catalogId, pageIndex, pageSize, ordering, search, active),
});
