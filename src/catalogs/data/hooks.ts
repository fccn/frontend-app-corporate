import {
  useMutation, useQuery, useQueryClient, useSuspenseQuery,
} from '@tanstack/react-query';
import { CatalogUpdateRequest } from '@src/types';
import { appId } from '@src/constants';
import {
  getCatalogDetails, getPartnerCatalogs, updateCatalog, getCatalogsLearners,
  postCatalogInviteLearners,
  postBulkCatalogInviteLearners,
  getCatalogEnrrollements,
  deleteLearnersFromCatalog,
} from './api';

const queryKey = {
  all: [appId, 'catalogs'],
  catalogList: (partnerId: number, pageIndex: number, pageSize: number) => [
    ...queryKey.all, partnerId, pageIndex, pageSize,
  ],
  catalogDetail: (catalogSlug: string) => [...queryKey.all, 'detail', catalogSlug],
  catalogLearners: (
    catalogId: string,
    pageIndex?: number,
    pageSize?: number,
    ordering?: string,
    search?: string,
    active?: string,
  ) => [
    ...queryKey.all, 'learners', catalogId, pageIndex, pageSize, ordering, search, active,
  ],
  catalogEnrollments: (
    catalogId: string,
    pageIndex: number,
    pageSize: number,
    ordering?: string,
    search?: string,
    active?: string,
  ) => [
    ...queryKey.all, 'enrollments', catalogId, pageIndex, pageSize, ordering, search, active,
  ],
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
  queryKey: queryKey.catalogLearners(catalogId, pageIndex, pageSize, ordering, search, active),
  queryFn: () => getCatalogsLearners(catalogId, pageIndex, pageSize, ordering, search, active),
});

type InvitePayload = {
  emails?: string[];
  csvFile?: File;
};

export const useInviteLearners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      catalogId,
      data,
    }: {
      catalogId: string;
      data: InvitePayload;
    }) => {
      // Emails
      if (data.emails?.length) {
        await postCatalogInviteLearners(catalogId, {
          inviteEmail: data.emails,
          catalogId,
        });
      }

      // CSV
      if (data.csvFile) {
        await postBulkCatalogInviteLearners(catalogId, {
          csvFile: data.csvFile,
        });
      }
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.catalogLearners(variables.catalogId),
      });
    },
  });
};

export const useRemoveLearners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      catalogId,
      learnerIds,
    }: {
      catalogId: string;
      learnerIds: number[];
    }) => {
      deleteLearnersFromCatalog(catalogId, {
        learnerIds,
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.catalogLearners(variables.catalogId),
      });
    },
  });
};

export const useCatalogEnrollments = ({
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
  queryKey: queryKey.catalogEnrollments(catalogId, pageIndex, pageSize, ordering, search, active),
  queryFn: () => getCatalogEnrrollements(catalogId, pageIndex, pageSize, ordering, search, active),
});
