import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CatalogUpdateRequest } from '@src/types';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { updateCatalog } from './api';

/**
 * Hook to update a catalog.
 *
 * Uses a React Query mutation to update a catalog and automatically
 * updates the cached catalog detail on success.
 *
 * @returns mutation function to update catalog.
 *
 * @example
 * const updateCatalog = useUpdateCatalog();
 * await updateCatalog.mutateAsync({ catalogId: 'c1', data: { name: 'New Name' } });
 */
export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ catalogId, data }: {
      catalogId: string; data: CatalogUpdateRequest
    }) => updateCatalog(catalogId, data),
    onSuccess(data) {
      if (data) {
        queryClient.setQueryData(
          catalogsQueryKey.catalogDetail(data.slug),
          data,
        );
      }
    },
  });
};
