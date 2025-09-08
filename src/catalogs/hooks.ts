import { useQueryClient, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { CorporateCatalog, PaginatedResponse } from '@src/app/types';
import { getPartnerCatalogs, getCatalogDetails } from './api';

export const usePartnerCatalogs = ({ partnerId, pageIndex, pageSize }) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};
export const useCatalogDetails = ({ partnerId, catalogId }) => {
  const queryClient = useQueryClient();

  const allCatalogs = queryClient
    .getQueriesData<PaginatedResponse<CorporateCatalog>>({ queryKey: ['partnerCatalogs', partnerId] })
    .flatMap(([, data]) => data?.results ?? []);
  const catalogCached: CorporateCatalog | undefined = allCatalogs.find((catalog) => catalog.id === catalogId);

  const { data: catalogDetails, isLoading } = useQuery({
    queryKey: ['catalogsDetails', partnerId, catalogId],
    queryFn: () => getCatalogDetails(partnerId, catalogId),
    enabled: !catalogCached,
  });

  return {
    catalogDetails: catalogCached || catalogDetails,
    isLoadingCatalogDetails: isLoading,
  };
};
