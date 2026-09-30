import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { CatalogInviteResponse, CatalogBulkInviteResponse } from '@src/types';
import { appId, CELERY_STATUS } from '@src/constants';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { queryKey as learnersQueryKey } from '@src/catalogs/learner-list/data/hooks';
import {
  cancelInvitation,
  getBulkInviteTaskStatus,
  getCatalogInvitations,
  postBulkCatalogInviteLearners,
  postCatalogInviteLearners,
  resendInvitation,
} from './api';

export const queryKey = {
  all: [appId, 'catalogs'],
  catalogInvitations: () => [...queryKey.all, 'invitations'],
  catalogInvitationsList: (
    catalogId: string,
    pageIndex?: number,
    pageSize?: number,
    ordering?: string,
    search?: string,
    status?: number,
  ) => [
    ...queryKey.catalogInvitations(), catalogId, pageIndex, pageSize, ordering, search, status,
  ],
};

type InvitePayload = {
  emails?: string[];
  csvFile?: File;
};

/**
 * Hook returning a callback that refreshes everything a new invitation changes:
 * the invitations list and the catalog detail, whose pending count feeds the header.
 */
export const useInvalidateInvitations = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string }>();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKey.catalogInvitations() });
    queryClient.invalidateQueries({ queryKey: catalogsQueryKey.catalogDetail(catalogSlug) });
  }, [queryClient, catalogSlug]);
};

/**
 * Hook to invite learners to a catalog.
 */
export const useInviteLearners = () => {
  const invalidateInvitations = useInvalidateInvitations();

  return useMutation({
    mutationFn: async (
      { catalogId, data }: { catalogId: string; data: InvitePayload },
    ): Promise<CatalogInviteResponse | CatalogBulkInviteResponse> => {
      if (data.csvFile) {
        return postBulkCatalogInviteLearners(catalogId, { csvFile: data.csvFile });
      }
      return postCatalogInviteLearners(catalogId, { inviteEmail: data.emails || [], catalogId });
    },
    onSuccess: (data) => {
      // The bulk path returns a task id and is refreshed by InviteAction when the
      // celery task reports back; only the immediate path needs invalidating here.
      if (!('taskId' in data)) {
        invalidateInvitations();
      }
    },
  });
};

export const useBulkInviteTaskStatus = (
  catalogId: string,
  taskId: string | null,
) => useQuery({
  queryKey: ['bulkInviteTaskStatus', catalogId, taskId],
  queryFn: () => getBulkInviteTaskStatus(catalogId, taskId!),
  enabled: !!taskId,
  refetchInterval: (query) => (
    query.state.data?.status === CELERY_STATUS.PENDING
      || query.state.data?.status === CELERY_STATUS.STARTED ? 2000 : false),
});

export const useCatalogInvitations = ({
  catalogId,
  pageIndex,
  pageSize,
  ordering,
  search,
  status,
}: {
  catalogId: string;
  pageIndex: number;
  pageSize: number;
  ordering?: string;
  search?: string;
  status?: number;
}) => useQuery({
  queryKey: queryKey.catalogInvitationsList(catalogId, pageIndex, pageSize, ordering, search, status),
  queryFn: () => getCatalogInvitations(catalogId, pageIndex, pageSize, ordering, search, status),
});

export const useResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ catalogId, invitationId }: { catalogId: string; invitationId: number }) => (
      resendInvitation(catalogId, invitationId)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.catalogInvitations() });
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();
  const { catalogSlug } = useParams<{ catalogSlug: string }>();

  return useMutation({
    mutationFn: async ({ catalogId, invitationId }: { catalogId: string; invitationId: number }) => (
      cancelInvitation(catalogId, invitationId)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.catalogInvitations() });
      queryClient.invalidateQueries({ queryKey: learnersQueryKey.catalogLearners() });
      queryClient.invalidateQueries({ queryKey: catalogsQueryKey.catalogDetail(catalogSlug) });
    },
  });
};
