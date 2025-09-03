import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePartnerCatalogs, useCatalogDetails } from './hooks';
import * as api from './api';
import { CorporateCatalog, PaginatedResponse } from '../app/types';

// Mock the API functions
jest.mock('./api');
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
    const mockCatalogsResponse: PaginatedResponse<CorporateCatalog> = {
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
          enrollments: 100,
          certified: 80,
          completionRate: 0.8,
          supportEmail: 'support@test.com',
          emailRegexes: ['@test.com'],
          courseEnrollmentLimit: 1000,
          userLimit: 500,
          availableStartDate: new Date('2023-01-01'),
          availableEndDate: new Date('2023-12-31'),
          catalogAlternativeLink: 'https://test.com/catalog',
          isSelfEnrollment: true,
          customCourses: false,
          authorizationAdditionalMessage: 'Test message',
          isPublic: true,
          courses: 50,
          corporatePartner: 1,
        },
        {
          id: '2',
          name: 'Test Catalog 2',
          slug: 'test-catalog-2',
          enrollments: 200,
          certified: 160,
          completionRate: 0.8,
          supportEmail: 'support@test2.com',
          emailRegexes: ['@test2.com'],
          courseEnrollmentLimit: 2000,
          userLimit: 1000,
          availableStartDate: new Date('2023-01-01'),
          availableEndDate: new Date('2023-12-31'),
          catalogAlternativeLink: 'https://test2.com/catalog',
          isSelfEnrollment: false,
          customCourses: true,
          authorizationAdditionalMessage: 'Test message 2',
          isPublic: false,
          courses: 75,
          corporatePartner: 1,
        },
      ],
    };

    it('should fetch partner catalogs successfully', async () => {
      mockedGetPartnerCatalogs.mockResolvedValueOnce(mockCatalogsResponse);

      const { result } = renderHook(
        () => usePartnerCatalogs({ partnerId: '1', pageIndex: 1, pageSize: 10 }),
        { wrapper: createWrapper },
      );

      await waitFor(() => {
        expect(result.current.partnerCatalogs).toEqual(mockCatalogsResponse);
        expect(result.current.isLoadingCatalogs).toBe(false);
      });

      expect(mockedGetPartnerCatalogs).toHaveBeenCalledWith('1', 1, 10);
      expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(1);
    });

    it('should use correct query key for caching', async () => {
      const secondPageResponse: PaginatedResponse<CorporateCatalog> = {
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
        ({ partnerId, pageIndex, pageSize }) => usePartnerCatalogs({ partnerId, pageIndex, pageSize }),
        {
          wrapper: createWrapper,
          initialProps: { partnerId: '1', pageIndex: 1, pageSize: 10 },
        },
      );

      expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(result.current.partnerCatalogs).toEqual(mockCatalogsResponse);
      });

      // Rerender with same params should not call API again due to caching
      rerender({ partnerId: '1', pageIndex: 1, pageSize: 10 });
      expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(1);

      // Rerender with different params should call API again
      rerender({ partnerId: '1', pageIndex: 2, pageSize: 10 });
      await waitFor(() => {
        expect(mockedGetPartnerCatalogs).toHaveBeenCalledTimes(2);
        expect(result.current.partnerCatalogs).toEqual(secondPageResponse);
      });
    });
  });

  describe('useCatalogDetails', () => {
    const mockCatalog: CorporateCatalog = {
      id: '1',
      name: 'Test Catalog Details',
      slug: 'test-catalog-details',
      enrollments: 300,
      certified: 240,
      completionRate: 0.8,
      supportEmail: 'support@details.com',
      emailRegexes: ['@details.com'],
      courseEnrollmentLimit: 3000,
      userLimit: 1500,
      availableStartDate: new Date('2023-01-01'),
      availableEndDate: new Date('2023-12-31'),
      catalogAlternativeLink: 'https://details.com/catalog',
      isSelfEnrollment: true,
      customCourses: true,
      authorizationAdditionalMessage: 'Details message',
      isPublic: true,
      courses: 100,
      corporatePartner: 1,
    };

    it('should fetch catalog details when not in cache', async () => {
      mockedGetCatalogDetails.mockResolvedValueOnce(mockCatalog);

      const { result } = renderHook(
        () => useCatalogDetails({ partnerId: '1', selectedCatalog: '1' }),
        { wrapper: createWrapper },
      );

      await waitFor(() => {
        expect(result.current.catalogDetails).toEqual(mockCatalog);
        expect(result.current.isLoadingCatalogDetails).toBe(false);
      });

      expect(mockedGetCatalogDetails).toHaveBeenCalledWith('1', '1');
      expect(mockedGetCatalogDetails).toHaveBeenCalledTimes(1);
    });

    it('should return cached catalog when available', async () => {
      // Propulate the cache with partner catalogs
      const mockCatalogsResponse: PaginatedResponse<CorporateCatalog> = {
        next: null,
        previous: null,
        count: 1,
        numPages: 1,
        currentPage: 1,
        start: 0,
        results: [mockCatalog],
      };

      queryClient.setQueryData(['partnerCatalogs', '1', 1, 10], mockCatalogsResponse);

      const { result } = renderHook(
        () => useCatalogDetails({ partnerId: '1', selectedCatalog: '1' }),
        { wrapper: createWrapper },
      );

      // Should return cached catalog immediately without calling API
      expect(mockedGetCatalogDetails).not.toHaveBeenCalled();
      expect(result.current.catalogDetails).toEqual(mockCatalog);
      expect(result.current.isLoadingCatalogDetails).toBe(false);
    });

    it('should not fetch when partnerId or selectedCatalog is missing', () => {
      const { result: resultNoPartner } = renderHook(
        () => useCatalogDetails({ partnerId: '', selectedCatalog: '1' }),
        { wrapper: createWrapper },
      );

      const { result: resultNoCatalog } = renderHook(
        () => useCatalogDetails({ partnerId: '1', selectedCatalog: '' }),
        { wrapper: createWrapper },
      );

      expect(mockedGetCatalogDetails).not.toHaveBeenCalled();

      expect(resultNoPartner.current.catalogDetails).toBeNull();
      expect(resultNoPartner.current.isLoadingCatalogDetails).toBe(false);

      expect(resultNoCatalog.current.catalogDetails).toBeNull();
      expect(resultNoCatalog.current.isLoadingCatalogDetails).toBe(false);
    });
  });
});
