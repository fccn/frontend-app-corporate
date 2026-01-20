import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePartners, usePartnerDetails } from './hooks';
import * as api from './api';
import { Partner, PaginatedResponse } from '../../types';

jest.mock('./api');
const mockedGetPartners = api.getPartners as jest.MockedFunction<typeof api.getPartners>;
const mockedGetPartnerDetails = api.getPartnerDetails as jest.MockedFunction<typeof api.getPartnerDetails>;

describe('Partner Hooks', () => {
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

  describe('usePartners', () => {
    const mockPartnersResponse: PaginatedResponse<Partner> = {
      next: null,
      previous: null,
      count: 2,
      numPages: 1,
      currentPage: 1,
      start: 0,
      results: [
        {
          id: 1,
          slug: 'partner-1',
          name: 'Partner One',
          logo: 'https://example.com/logo1.png',
          homepageUrl: 'https://partner1.com',
          catalogs: 5,
          courses: 12,
          enrollments: 1000,
          certified: 400,
        },
        {
          id: 2,
          slug: 'partner-2',
          name: 'Partner Two',
          logo: 'https://example.com/logo2.png',
          homepageUrl: 'https://partner2.com',
          catalogs: 3,
          courses: 8,
          enrollments: 500,
          certified: 200,
        },
      ],
    };

    it('should fetch partners successfully', async () => {
      mockedGetPartners.mockResolvedValueOnce(mockPartnersResponse);

      const { result } = renderHook(() => usePartners(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockPartnersResponse);
      });

      expect(mockedGetPartners).toHaveBeenCalledTimes(1);
    });

    it('should use correct query key for caching', async () => {
      mockedGetPartners.mockResolvedValueOnce(mockPartnersResponse);

      const { result, rerender } = renderHook(() => usePartners(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(mockedGetPartners).toHaveBeenCalledTimes(1);

      // Rerender should use cached data
      rerender();

      // Should still only be called once due to caching
      expect(mockedGetPartners).toHaveBeenCalledTimes(1);
    });

    it('should handle empty results', async () => {
      const emptyResponse: PaginatedResponse<Partner> = {
        next: null,
        previous: null,
        count: 0,
        numPages: 0,
        currentPage: 0,
        start: 0,
        results: [],
      };

      mockedGetPartners.mockResolvedValueOnce(emptyResponse);

      const { result } = renderHook(() => usePartners(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(emptyResponse);
      });

      expect(result.current.data.results).toHaveLength(0);
      expect(result.current.data.count).toBe(0);
    });
  });

  describe('usePartnerDetails', () => {
    const mockPartner: Partner = {
      id: 1,
      slug: 'test-partner',
      name: 'Test Partner',
      logo: 'https://example.com/logo.png',
      homepageUrl: 'https://testpartner.com',
      catalogs: 10,
      courses: 25,
      enrollments: 2000,
      certified: 800,
    };

    it('should fetch partner details by slug', async () => {
      mockedGetPartnerDetails.mockResolvedValueOnce(mockPartner);

      const { result } = renderHook(
        () => usePartnerDetails({ partnerSlug: 'test-partner' }),
        { wrapper: createWrapper },
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockPartner);
      });

      expect(mockedGetPartnerDetails).toHaveBeenCalledWith('test-partner');
      expect(mockedGetPartnerDetails).toHaveBeenCalledTimes(1);
    });

    it('should use correct query key for caching', async () => {
      mockedGetPartnerDetails.mockResolvedValueOnce(mockPartner);

      const { result, rerender } = renderHook(
        ({ partnerSlug }) => usePartnerDetails({ partnerSlug }),
        {
          wrapper: createWrapper,
          initialProps: { partnerSlug: 'test-partner' },
        },
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(mockedGetPartnerDetails).toHaveBeenCalledTimes(1);

      // Rerender with same slug should use cache
      rerender({ partnerSlug: 'test-partner' });
      expect(mockedGetPartnerDetails).toHaveBeenCalledTimes(1);

      // Rerender with different slug should fetch again
      const mockPartner2 = { ...mockPartner, slug: 'other-partner', name: 'Other Partner' };
      mockedGetPartnerDetails.mockResolvedValueOnce(mockPartner2);
      rerender({ partnerSlug: 'other-partner' });

      await waitFor(() => {
        expect(mockedGetPartnerDetails).toHaveBeenCalledTimes(2);
        expect(mockedGetPartnerDetails).toHaveBeenCalledWith('other-partner');
      });
    });

    it('should handle undefined slug', async () => {
      const emptyPartner: Partner = {
        id: 0,
        slug: '',
        name: '',
        logo: '',
        homepageUrl: '',
        catalogs: 0,
        courses: 0,
        enrollments: 0,
        certified: 0,
      };

      mockedGetPartnerDetails.mockResolvedValueOnce(emptyPartner);

      const { result } = renderHook(
        () => usePartnerDetails({ partnerSlug: undefined as any }),
        { wrapper: createWrapper },
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(mockedGetPartnerDetails).toHaveBeenCalledWith(undefined);
    });
  });
});
