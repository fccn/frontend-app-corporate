import {
  useMutation, useQuery, useQueryClient, useSuspenseQuery,
} from '@tanstack/react-query';
import { CatalogUpdateRequest } from '@src/types';
import { appId } from '@src/constants';
import { getCatalogDetails, getPartnerCatalogs, updateCatalog } from './api';

const queryKey = {
  all: [appId, 'catalogs'],
  catalogList: (partnerId: number, pageIndex: number, pageSize: number) => [...queryKey.all, partnerId, pageIndex, pageSize],
  catalogDetail: (partnerId: number, catalogId: string) => [...queryKey.all, 'detail', partnerId, catalogId],
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
  partnerId,
  selectedCatalogId,
}: { partnerId: number; selectedCatalogId: string }) => {
  const { data: catalogDetails, isLoading } = useQuery({
    queryKey: queryKey.catalogDetail(partnerId, selectedCatalogId),
    queryFn: () => getCatalogDetails(partnerId, selectedCatalogId),
    enabled: !!partnerId && !!selectedCatalogId,
  });

  return {
    catalogDetails: catalogDetails || null,
    isLoadingCatalogDetails: isLoading,
  };
};

export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({
      partnerId, catalogId, data,
    }:
    { partnerId: number; catalogId: string; data: CatalogUpdateRequest }) => {
      data.availableStartDate = new Date(data.availableStartDate).toISOString();
      data.availableEndDate = new Date(data.availableEndDate).toISOString();
      updateCatalog(partnerId, catalogId, data);
    },
    onSettled: (_data, _error, args) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.catalogDetail(args.partnerId, args.catalogId),
        exact: false,
      });
    },
  });
  return mutate;
};
