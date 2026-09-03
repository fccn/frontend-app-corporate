import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CatalogInviteResponse, CatalogBulkInviteResponse } from '@src/types';
import { appId, CELERY_STATUS } from '@src/constants';
import {
  getBulkInviteTaskStatus,
  postBulkCatalogInviteLearners,
  postCatalogInviteLearners,
} from './api';

type InvitePayload = {
  emails?: string[];
  csvFile?: File;
};

/**
 * Hook to invite learners to a catalog.
 */
export const useInviteLearners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      { catalogId, data }: { catalogId: string; data: InvitePayload },
    ): Promise<CatalogInviteResponse | CatalogBulkInviteResponse> => {
      if (data.csvFile) {
        return postBulkCatalogInviteLearners(catalogId, { csvFile: data.csvFile });
      }
      return postCatalogInviteLearners(catalogId, { inviteEmail: data.emails || [], catalogId });
    },
    onSuccess: (_data) => {
      const response = _data as CatalogInviteResponse;
      if (!('taskId' in response)) {
        queryClient.invalidateQueries({ queryKey: [appId, 'catalogs', 'invitations'] });
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
