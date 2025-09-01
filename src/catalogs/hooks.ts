import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CorporateCatalog, PaginatedResponse } from '@src/app/types';
import { getCatalogDetails, getPartnerCatalogs } from './api';

export const usePartnerCatalogs = (
  { partnerId, pageIndex, pageSize }: { partnerId: string; pageIndex: number; pageSize: number; },
) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};

export const useCatalogDetails = ({ partnerId, selectedCatalog, queryKeyVariables }) => {
  const queryClient = useQueryClient();
  const partnerCatalogsCached: PaginatedResponse<CorporateCatalog> | undefined = queryClient.getQueryData(
    ['partnerCatalogs', partnerId, ...queryKeyVariables],
  );

  const { data: catalogDetails, isLoading } = useQuery({
    queryKey: ['catalogDetails'],
    queryFn: () => getCatalogDetails(partnerId, selectedCatalog),
    enabled: !partnerCatalogsCached,
  });

  return {
    partnerDetails: partnerCatalogsCached
      ? partnerCatalogsCached.results?.find((catalog) => catalog.id === selectedCatalog)
      : catalogDetails,
    isLoadingCatalogDetails: isLoading,
  };
};
