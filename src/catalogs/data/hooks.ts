import {
  useMutation, useQuery, useQueryClient, useSuspenseQuery,
} from '@tanstack/react-query';
import {
  Catalog, CatalogUpdateRequest, UseQueryResult, CatalogInviteResponse, CatalogBulkInviteResponse,
} from '@src/types';
import { appId } from '@src/constants';
import { useParams } from 'wouter';
import {
  getCatalogDetails, getPartnerCatalogs, updateCatalog, getCatalogsLearners,
  postCatalogInviteLearners,
  postBulkCatalogInviteLearners,
  getCatalogEnrrollements,
  deleteLearnersFromCatalog,
  getBulkInviteTaskStatus,
} from './api';
import { fileUploadStatus } from '../components/utils';

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
  catalogDetail: (catalogSlug: string) => [...queryKey.all, 'detail', catalogSlug],
  catalogLearners: () => [...queryKey.all, 'learners'],
  catalogLearnersList: (
    catalogId: string,
    pageIndex?: number,
    pageSize?: number,
    ordering?: string,
    search?: string,
    active?: string,
  ) => [
    ...queryKey.catalogLearners(), catalogId, pageIndex, pageSize, ordering, search, active,
  ],
  catalogEnrollments: () => [...queryKey.all, 'enrollments'],
  catalogEnrollmentsList: (
    catalogId: string,
    pageIndex: number,
    pageSize: number,
    ordering?: string,
    search?: string,
    active?: string,
  ) => [
    ...queryKey.catalogEnrollments(), catalogId, pageIndex, pageSize, ordering, search, active,
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

/**
 * Hook to fetch catalog details.
 *
 * @param catalogSlug - The catalog's unique slug.
 * @returns catalogDetails object or null if not found.
 *
 * @example
 * const { catalogDetails } = useCatalogDetails({ catalogSlug: 'catalog-123' });
 */
export const useCatalogDetails = ({ catalogSlug }: { catalogSlug: string }) => useSuspenseQuery({
  queryKey: queryKey.catalogDetail(catalogSlug),
  queryFn: () => getCatalogDetails(catalogSlug),
});

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
          queryKey.catalogDetail(data.slug),
          data,
        );
      }
    },
  });
};

/**
 * Hook to fetch learners of a catalog.
 *
 * @param catalogId - The catalog's unique ID.
 * @param pageIndex - Current page index.
 * @param pageSize - Number of learners per page.
 * @param ordering - Optional ordering string.
 * @param search - Optional search string.
 * @param active - Optional active filter.
 *
 * @returns Query result from React Query.
 */
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
  queryKey: queryKey.catalogLearnersList(catalogId, pageIndex, pageSize, ordering, search, active),
  queryFn: () => getCatalogsLearners(catalogId, pageIndex, pageSize, ordering, search, active),
});

type InvitePayload = {
  emails?: string[];
  csvFile?: File;
};

/**
 * Hook to invite learners to a catalog.
 *
 * Supports both email invites and CSV file uploads.
 * Invalidates learners query on success.
 *
 * @returns mutation function for inviting learners.
 */
export const useInviteLearners = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string }>();

  return useMutation({
    mutationFn: async (
      { catalogId, data }: { catalogId: string; data: InvitePayload },
    ): Promise<CatalogInviteResponse | CatalogBulkInviteResponse> => {
      if (data.csvFile) {
        return postBulkCatalogInviteLearners(catalogId, { csvFile: data.csvFile });
      }
      return postCatalogInviteLearners(catalogId, { inviteEmail: data.emails || [], catalogId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.catalogLearners() });
      queryClient.invalidateQueries({ queryKey: queryKey.catalogDetail(catalogSlug) });
    },
  });
};

/**
 * Hook to remove learners from a catalog.
 *
 * Invalidates learners query on success.
 *
 * @returns mutation function for removing learners.
 */
export const useRemoveLearners = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string }>();

  return useMutation({
    mutationFn: async ({ catalogId, learnerIds }: {
      catalogId: string; learnerIds: number[]
    }) => deleteLearnersFromCatalog(catalogId, { learnerIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.catalogLearners() });
      queryClient.invalidateQueries({ queryKey: queryKey.catalogDetail(catalogSlug) });
    },
  });
};

/**
 * Hook to fetch catalog enrollments with pagination.
 *
 * @param catalogId - Catalog unique ID.
 * @param pageIndex - Current page index.
 * @param pageSize - Number of items per page.
 * @param ordering - Optional ordering string.
 * @param search - Optional search string.
 * @param active - Optional active filter.
 *
 * @returns Query result from React Query.
 */
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
  queryKey: queryKey.catalogEnrollmentsList(catalogId, pageIndex, pageSize, ordering, search, active),
  queryFn: () => getCatalogEnrrollements(catalogId, pageIndex, pageSize, ordering, search, active),
});

export const useBulkInviteTaskStatus = (
  catalogId: string,
  taskId: string | null,
) => useQuery({
  queryKey: ['bulkInviteTaskStatus', catalogId, taskId],
  queryFn: () => getBulkInviteTaskStatus(catalogId, taskId!),
  enabled: !!taskId,
  refetchInterval: (query) => (
    query.state.data?.status === fileUploadStatus.pending
      || query.state.data?.status === fileUploadStatus.started ? 2000 : false),
});
