import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { useParams } from 'wouter';
import { deleteLearnersFromCatalog, getCatalogsLearners } from './api';

const queryKey = {
  all: [appId, 'catalogs'],
  catalogLearners: () => [...queryKey.all, 'learners'],
  catalogLearnersList: (
    catalogId: string,
    pageIndex?: number,
    pageSize?: number,
    ordering?: string,
    search?: string,
    active?: string,
  ) => [
    ...queryKey.catalogLearners(), catalogId, pageIndex, pageSize, ordering, search, active,
  ],
};

/**
 * Hook to fetch learners of a catalog.
 *
 * @param catalogId - The catalog's unique ID.
 * @param pageIndex - Current page index.
 * @param pageSize - Number of learners per page.
 * @param ordering - Optional ordering string.
 * @param search - Optional search string.
 * @param active - Optional active filter.
 *
 * @returns Query result from React Query.
 */
export const useCatalogLearners = ({
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
  queryKey: queryKey.catalogLearnersList(catalogId, pageIndex, pageSize, ordering, search, active),
  queryFn: () => getCatalogsLearners(catalogId, pageIndex, pageSize, ordering, search, active),
});

/**
 * Hook to remove learners from a catalog.
 *
 * Invalidates learners query on success.
 *
 * @returns mutation function for removing learners.
 */
export const useRemoveLearners = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string }>();

  return useMutation({
    mutationFn: async ({ catalogId, learnerIds }: {
      catalogId: string; learnerIds: number[]
    }) => deleteLearnersFromCatalog(catalogId, { learnerIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.catalogLearners() });
      queryClient.invalidateQueries({ queryKey: catalogsQueryKey.catalogDetail(catalogSlug) });
    },
  });
};
