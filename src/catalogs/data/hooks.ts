import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Catalog, CatalogUpdateRequest, PaginatedResponse } from '@src/types';
import { getCatalogDetails, getPartnerCatalogs, updateCatalog } from './api';

export const usePartnerCatalogs = (
  { partnerId, pageIndex, pageSize }: { partnerId: string; pageIndex: number; pageSize: number; },
) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};

export const useCatalogDetails = ({
  partnerId,
  selectedCatalogId,
}: { partnerId: number; selectedCatalogId: string }) => {
  const queryClient = useQueryClient();

  const allCatalogs = queryClient
    .getQueriesData({ queryKey: ['partnerCatalogs', partnerId] })
    .flatMap(([, data]) => (data as PaginatedResponse<Catalog>)?.results ?? []);

  // Match UUID string
  const catalogFromCache = allCatalogs.find(
    (c) => String(c.id) === String(selectedCatalogId)
  );

  const { data: catalogDetails, isLoading } = useQuery({
    queryKey: ['catalogDetails', partnerId, selectedCatalogId],
    queryFn: () => getCatalogDetails(partnerId, selectedCatalogId),
    enabled: !!partnerId && !!selectedCatalogId,
  });

  return {
    catalogDetails: catalogFromCache || catalogDetails || null,
    isLoadingCatalogDetails: isLoading,
  };
};


export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({
      partnerId, catalogId, data,
    }:
      { partnerId: string; catalogId: string; data: CatalogUpdateRequest }) => {
        data.availableStartDate = new Date(data.availableStartDate).toISOString();
        data.availableEndDate = new Date(data.availableEndDate).toISOString();
        updateCatalog(partnerId, catalogId, data);
    },
    onSettled: (_data, _error, args) => {
      queryClient.invalidateQueries({
        queryKey: ['catalogDetails', args.partnerId, args.catalogId],
        exact: false,
      });
    },
  });
  return mutate;
};