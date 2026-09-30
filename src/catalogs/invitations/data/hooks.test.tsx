import { act, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { renderHookWrapper } from '@src/setupTest';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { queryKey as learnersQueryKey } from '@src/catalogs/learner-list/data/hooks';
import {
  queryKey, useCancelInvitation, useInviteLearners, useResendInvitation,
} from './hooks';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('wouter', () => ({
  useParams: () => ({ catalogSlug: 'test-catalog' }),
}));

const mockHttpClient = {
  post: jest.fn(),
};

(getAuthenticatedHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

describe('invitation mutation hooks', () => {
  let invalidateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHttpClient.post.mockResolvedValue({ data: { id: 1, status: 'cancelled' } });
    invalidateSpy = jest.spyOn(QueryClient.prototype, 'invalidateQueries');
  });

  afterEach(() => {
    invalidateSpy.mockRestore();
  });

  const invalidatedKeys = () => invalidateSpy.mock.calls.map(([filters]) => filters.queryKey);
  const catalogDetailKey = catalogsQueryKey.catalogDetail('test-catalog');

  it('useCancelInvitation refreshes invitations, learners and the catalog detail header', async () => {
    const { result } = renderHookWrapper(() => useCancelInvitation());

    await act(async () => {
      result.current.mutate({ catalogId: 'catalog-1', invitationId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidatedKeys()).toEqual(expect.arrayContaining([
      queryKey.catalogInvitations(),
      learnersQueryKey.catalogLearners(),
      catalogDetailKey,
    ]));
  });

  it('useResendInvitation refreshes invitations but not the catalog detail', async () => {
    const { result } = renderHookWrapper(() => useResendInvitation());

    await act(async () => {
      result.current.mutate({ catalogId: 'catalog-1', invitationId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidatedKeys()).toContainEqual(queryKey.catalogInvitations());
    expect(invalidatedKeys()).not.toContainEqual(catalogDetailKey);
  });

  it('useInviteLearners refreshes invitations and the pending count after an immediate invite', async () => {
    mockHttpClient.post.mockResolvedValue({ data: { invitations: [], created_count: 1, total_requested: 1 } });
    const { result } = renderHookWrapper(() => useInviteLearners());

    await act(async () => {
      result.current.mutate({ catalogId: 'catalog-1', data: { emails: ['a@example.com'] } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidatedKeys()).toEqual(expect.arrayContaining([
      queryKey.catalogInvitations(),
      catalogDetailKey,
    ]));
  });

  it('useInviteLearners leaves the bulk path to the task poller', async () => {
    mockHttpClient.post.mockResolvedValue({ data: { task_id: 'task-1' } });
    const { result } = renderHookWrapper(() => useInviteLearners());

    await act(async () => {
      result.current.mutate({ catalogId: 'catalog-1', data: { csvFile: new File(['a@example.com'], 'invites.csv') } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
