import { waitFor } from '@testing-library/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useCatalogs } from './hooks';
import { renderHookWrapper } from '@src/setupTest';

jest.mock('@edx/frontend-platform/auth', () => ({
    getAuthenticatedHttpClient: jest.fn(),
}));

const mockHttpClient = {
    get: jest.fn(),
};

(getAuthenticatedHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

describe('useCatalogs Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and returns catalogs successfully', async () => {
        const mockData = {
            results: [
                { id: 1, name: 'Catalog 1', slug: 'cat-1' },
                { id: 2, name: 'Catalog 2', slug: 'cat-2' },
            ],
            count: 2,
            num_pages: 1,
        };

        mockHttpClient.get.mockResolvedValue({ data: mockData });

        const { result } = renderHookWrapper(() => useCatalogs({
            partnerId: 1,
            pageIndex: 1,
            pageSize: 10,
        }));

        // Initial state
        expect(result.current.isLoading).toBe(true);

        // Wait for success
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data.catalogs).toHaveLength(2);
        expect(result.current.data.catalogs[0].name).toBe('Catalog 1');
        expect(result.current.data.count).toBe(2);
        expect(result.current.data.pageCount).toBe(1);
        expect(result.current.isLoading).toBe(false);
    });

    it('passes correct parameters to the API', async () => {
        mockHttpClient.get.mockResolvedValue({ data: { results: [], count: 0 } });

        renderHookWrapper(() => useCatalogs({
            partnerId: 123,
            pageIndex: 2,
            pageSize: 20,
            ordering: 'name',
            search: 'python',
        }));

        await waitFor(() => expect(mockHttpClient.get).toHaveBeenCalledTimes(1));

        const calledUrl = new URL(mockHttpClient.get.mock.calls[0][0]);
        expect(calledUrl.searchParams.get('partner')).toBe('123');
        expect(calledUrl.searchParams.get('page')).toBe('2');
        expect(calledUrl.searchParams.get('page_size')).toBe('20');
        expect(calledUrl.searchParams.get('ordering')).toBe('name');
        expect(calledUrl.searchParams.get('search')).toBe('python');
    });

    it('handles API errors gracefully', async () => {
        // The api implementation catches errors and returns empty result
        mockHttpClient.get.mockRejectedValue(new Error('API Error'));

        const { result } = renderHookWrapper(() => useCatalogs({
            partnerId: 1,
            pageIndex: 1,
            pageSize: 10,
        }));

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data.catalogs).toEqual([]);
        expect(result.current.data.count).toBe(0);
        expect(result.current.isError).toBe(true);
    });
});
