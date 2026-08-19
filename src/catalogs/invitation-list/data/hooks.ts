import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appId } from '@src/constants';
import { queryKey as learnersQueryKey } from '@src/catalogs/learner-list/data/hooks';
import { getCatalogInvitations, resendInvitation, cancelInvitation } from './api';

export const queryKey = {
  all: [appId, 'catalogs'],
  catalogInvitations: () => [...queryKey.all, 'invitations'],
  catalogInvitationsList: (
    catalogId: string,
    pageIndex?: number,
    pageSize?: number,
    ordering?: string,
    search?: string,
    status?: string,
  ) => [
    ...queryKey.catalogInvitations(), catalogId, pageIndex, pageSize, ordering, search, status,
  ],
};

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
  status?: string;
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

  return useMutation({
    mutationFn: async ({ catalogId, invitationId }: { catalogId: string; invitationId: number }) => (
      cancelInvitation(catalogId, invitationId)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.catalogInvitations() });
      queryClient.invalidateQueries({ queryKey: learnersQueryKey.catalogLearners() });
    },
  });
};
