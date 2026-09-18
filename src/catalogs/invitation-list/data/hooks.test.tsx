import { act, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { renderHookWrapper } from '@src/setupTest';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { useCancelInvitation, useResendInvitation } from './hooks';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

const mockHttpClient = {
  post: jest.fn(),
};

(getAuthenticatedHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

// Does `invalidateQueries({ queryKey: prefix })` refresh the query stored under `key`?
const isPrefixOf = (prefix: unknown[], key: unknown[]) => prefix.every((part, i) => part === key[i]);

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

  it('useCancelInvitation refreshes the catalog detail so header seat counts update', async () => {
    const { result } = renderHookWrapper(() => useCancelInvitation());

    await act(async () => {
      result.current.mutate({ catalogId: 'catalog-1', invitationId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const detailKey = catalogsQueryKey.catalogDetail('some-catalog-slug');
    expect(invalidatedKeys().some((key) => isPrefixOf(key, detailKey))).toBe(true);
  });

  it('useResendInvitation does not refresh the catalog detail', async () => {
    const { result } = renderHookWrapper(() => useResendInvitation());

    await act(async () => {
      result.current.mutate({ catalogId: 'catalog-1', invitationId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const detailKey = catalogsQueryKey.catalogDetail('some-catalog-slug');
    expect(invalidatedKeys().some((key) => isPrefixOf(key, detailKey))).toBe(false);
  });
});
