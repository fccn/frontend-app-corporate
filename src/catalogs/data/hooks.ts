import {
  useMutation, useQuery, useQueryClient, useSuspenseQuery,
} from '@tanstack/react-query';
import { CatalogUpdateRequest } from '@src/types';
import { appId } from '@src/constants';
import {
  getCatalogDetails, getPartnerCatalogs, updateCatalog, getCatalogsLearners,
} from './api';

const queryKey = {
  all: [appId, 'catalogs'],
  catalogList: (partnerId: number, pageIndex: number, pageSize: number) => [
    ...queryKey.all, partnerId, pageIndex, pageSize,
  ],
  catalogDetail: (catalogSlug: string) => [...queryKey.all, 'detail', catalogSlug],
  catalogLearners: (partnerId: number, catalogId: string) => [...queryKey.all, 'learners', partnerId, catalogId],
};

export const usePartnerCatalogs = (
  { partnerId, pageIndex, pageSize }: { partnerId: number; pageIndex: number; pageSize: number; },
) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: queryKey.catalogList(partnerId, pageIndex, pageSize),
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};

export const useCatalogDetails = ({
  catalogSlug,
}: { catalogSlug: string }) => {
  const { data: catalogDetails } = useSuspenseQuery({
    queryKey: queryKey.catalogDetail(catalogSlug),
    queryFn: () => getCatalogDetails(catalogSlug),
  });

  return {
    catalogDetails: catalogDetails || null,
  };
};

export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ catalogId, data }:
    { catalogId: string; data: CatalogUpdateRequest }) => updateCatalog(catalogId, data),
    onSuccess(data) {
      if (data) {
        queryClient.setQueryData(
          queryKey.catalogDetail(data.slug),
          data,
        );
      }
    },
  });
};

export const useCatalogLearners = ({
  partnerId,
  catalogId,
}: { partnerId: number; catalogId: string }) => useQuery({
  queryKey: queryKey.catalogLearners(partnerId, catalogId),
  queryFn: () => getCatalogsLearners(catalogId),
});
