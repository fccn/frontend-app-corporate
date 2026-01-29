import { useQuery } from '@tanstack/react-query';
import { Catalog, UseQueryResult } from '@src/types';
import { appId } from '@src/constants';
import { getPartnerCatalogs } from './api';

const queryKey = {
  all: [appId, 'catalogs'],
  catalogLists: () => [...queryKey.all, 'list'],
  catalogList: (
    partnerId: number,
    pageIndex: number,
    pageSize: number,
    ordering?: string,
    search?: string,
  ) => [
    ...queryKey.catalogLists(), partnerId, pageIndex, pageSize, ordering, search,
  ],
};

/**
 * Hook to fetch catalogs for a partner.
 *
 * @param partnerId - The partner's ID.
 * @param pageIndex - Current page index.
 * @param pageSize - Number of catalogs per page.
 * @returns partnerCatalogs and loading state.
 *
 * @example
 * const { partnerCatalogs, isLoadingCatalogs } = usePartnerCatalogs({ partnerId: 1, pageIndex: 1, pageSize: 20 });
 */
export const useCatalogs = ({
  partnerId,
  pageIndex,
  pageSize,
  ordering,
  search,
}: {
  partnerId: number; pageIndex: number; pageSize: number, ordering?: string,
  search?: string,
}): UseQueryResult<{ catalogs: Catalog[], count: number; pageCount: number }> => {
  const {
    data, isLoading, isError, error, isSuccess,
  } = useQuery({
    queryKey: queryKey.catalogList(partnerId, pageIndex, pageSize, ordering, search),
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize, ordering, search),
  });

  return {
    data: {
      catalogs: data?.results || [],
      count: data?.count || 0,
      pageCount: data?.numPages || 0,
    },
    isLoading,
    isError,
    error,
    isSuccess,
  };
};
