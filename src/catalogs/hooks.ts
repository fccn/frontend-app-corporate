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

export const useCatalogDetails = ({
  partnerId,
  selectedCatalog,
}: { partnerId: string; selectedCatalog: string | number; }) => {
  const queryClient = useQueryClient();

  const allCatalogs = queryClient
    .getQueriesData({ queryKey: ['partnerCatalogs', partnerId] })
    .flatMap(([, data]) => (data as PaginatedResponse<CorporateCatalog>)?.results ?? []);

  const catalogFromCache = allCatalogs.find((c) => c.id === selectedCatalog);

  const { data: catalogDetails, isLoading } = useQuery({
    queryKey: ['catalogDetails', partnerId, selectedCatalog],
    queryFn: () => getCatalogDetails(partnerId, selectedCatalog),
    enabled: !catalogFromCache && !!partnerId && !!selectedCatalog,
  });

  return {
    catalogDetails: catalogFromCache || catalogDetails || null,
    isLoadingCatalogDetails: isLoading,
  };
};
