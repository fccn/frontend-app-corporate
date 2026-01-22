import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCatalogs, useCatalogDetails } from './hooks';
import * as api from './api';
import { Catalog, PaginatedResponse } from '../../types';

jest.mock('./api');
jest.mock('wouter', () => ({
  useParams: () => ({ catalogSlug: 'Catalog 1' }),
}));
const mockedGetPartnerCatalogs = api.getPartnerCatalogs as jest.MockedFunction<typeof api.getPartnerCatalogs>;
const mockedGetCatalogDetails = api.getCatalogDetails as jest.MockedFunction<typeof api.getCatalogDetails>;

describe('Catalog Hooks', () => {
  let queryClient: QueryClient;

  const createWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
    jest.clearAllMocks();
  });

  describe('usePartnerCatalogs', () => {
    const mockCatalogsResponse: PaginatedResponse<Catalog> = {
      next: null,
      previous: null,
      count: 2,
      numPages: 1,
      currentPage: 1,
      start: 0,
      results: [
        {
          id: '1',
          name: 'Test Catalog 1',
          slug: 'test-catalog-1',
          image: 'https://test.com/image1.jpg',
          enrollments: 100,
          certified: 80,
          completionRate: 0.8,
          supportEmail: 'support@test.com',
          emailRegexes: ['@test.com'],
          courseEnrollmentsLimit: 1000,
          userLimit: 500,
          availableStartDate: '2023-01-01',
          availableEndDate: '2023-12-31',
          alternativeLink: 'https://test.com/catalog',
          isSelfEnrollment: true,
          authorizationMessage: 'Test message',
          courses: 50,
          totalLearners: 100,
          activeLearners: 80,
          partnerId: 1,
        },
        {
          id: '2',
          name: 'Test Catalog 2',
          slug: 'test-catalog-2',
          image: 'https://test.com/image2.jpg',
          enrollments: 200,
          certified: 160,
          completionRate: 0.8,
          supportEmail: 'support@test2.com',
          emailRegexes: ['@test2.com'],
          courseEnrollmentsLimit: 2000,
          userLimit: 1000,
          availableStartDate: '2023-01-01',
          availableEndDate: '2023-12-31',
          alternativeLink: 'https://test2.com/catalog',
          isSelfEnrollment: false,
          authorizationMessage: 'Test message 2',
          courses: 75,
          totalLearners: 200,
          activeLearners: 160,
          partnerId: 1,
        },
      ],
    };

    it('should fetch partner catalogs successfully', async () => {
      mockedGetPartnerCatalogs.mockResolvedValueOnce(mockCatalogsResponse);

      const { result } = renderHook(
        () => useCatalogs({ partnerId: 1, pageIndex: 1, pageSize: 10 }),
        { wrapper: createWrapper },
      );

      await waitFor(() => {
        expect(result.current.data).toEqual({
          catalogs: mockCatalogsResponse.results,
          count: mockCatalogsResponse.count,
          pageCount: mockCatalogsResponse.numPages,
        });
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedGetPartnerCatalogs).toHaveBeenCalledWith(1, 1, 10, undefined, undefined);
      expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(1);
    });

    it('should use correct query key for caching', async () => {
      const secondPageResponse: PaginatedResponse<Catalog> = {
        ...mockCatalogsResponse,
        currentPage: 2,
        start: 10,
        results: [
          {
            ...mockCatalogsResponse.results[0],
            id: '3',
            name: 'Test Catalog 3',
            slug: 'test-catalog-3',
          },
        ],
      };

      mockedGetPartnerCatalogs
        .mockResolvedValueOnce(mockCatalogsResponse)
        .mockResolvedValueOnce(secondPageResponse);

      const { result, rerender } = renderHook(
        ({ partnerId, pageIndex, pageSize }) => useCatalogs({ partnerId, pageIndex, pageSize }),
        {
          wrapper: createWrapper,
          initialProps: { partnerId: 1, pageIndex: 1, pageSize: 10 },
        },
      );

      expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(result.current.data).toEqual({
          catalogs: mockCatalogsResponse.results,
          count: mockCatalogsResponse.count,
          pageCount: mockCatalogsResponse.numPages,
        });
      });

      // Rerender with same params should not call API again due to caching
      rerender({ partnerId: 1, pageIndex: 1, pageSize: 10 });
      expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(1);

      // Rerender with different params should call API again
      rerender({ partnerId: 1, pageIndex: 2, pageSize: 10 });
      await waitFor(() => {
        expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(2);
        expect(result.current.data).toEqual({
          catalogs: secondPageResponse.results,
          count: secondPageResponse.count,
          pageCount: secondPageResponse.numPages,
        });
      });
    });
  });

  describe('useCatalogDetails', () => {
    const mockCatalog: Catalog = {
      id: '1',
      name: 'Test Catalog Details',
      slug: 'test-catalog-details',
      image: 'https://details.com/image.jpg',
      enrollments: 300,
      certified: 240,
      completionRate: 0.8,
      supportEmail: 'support@details.com',
      emailRegexes: ['@details.com'],
      courseEnrollmentsLimit: 3000,
      userLimit: 1500,
      availableStartDate: '2023-01-01',
      availableEndDate: '2023-12-31',
      alternativeLink: 'https://details.com/catalog',
      isSelfEnrollment: true,
      authorizationMessage: 'Details message',
      courses: 100,
      totalLearners: 300,
      activeLearners: 240,
      partnerId: 1,
    };

    it('should fetch catalog details', async () => {
      mockedGetCatalogDetails.mockResolvedValueOnce(mockCatalog);

      const { result } = renderHook(
        () => useCatalogDetails({ catalogSlug: '1' }),
        { wrapper: createWrapper },
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockCatalog);
      });

      expect(mockedGetCatalogDetails).toHaveBeenCalledWith('1');
      expect(mockedGetCatalogDetails).toHaveBeenCalledTimes(1);
    });
  });
});
