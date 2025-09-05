import { useQueryClient, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerCatalogs, getCatalogDetails } from './api';
import { CorporateCatalog } from '@src/app/types';

export const usePartnerCatalogs = ({ partnerId, pageIndex, pageSize }) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};
export const useCatalogDetails = ({ partnerId, catalogId }) => {

  const queryClient = useQueryClient();
  // Aggregate all cached paginated catalog results for this partner
  const allCatalogs = queryClient
    .getQueriesData({ queryKey: ['partnerCatalogs', partnerId] })
    .flatMap(([, data]) => (Array.isArray(data?.results) ? data.results : []));

    // Find the catalog by id/code
  const catalogCached = allCatalogs.find((catalog) => catalog.id === catalogId);
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
