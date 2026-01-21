import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerDetails, getPartners } from './api';
import { Partner, UseQueryResult } from '@src/types';
import { appId } from '@src/constants';

const queryKey = {
  all: [appId, 'partners'],
  partnerLists: () => [...queryKey.all, 'list'],
  partnerList: (pageIndex: number, pageSize: number, ordering?: string,
    search?: string,) => [
    ...queryKey.partnerLists(), pageIndex, pageSize, ordering, search,
  ],
  partnerDetails: (partnerSlug: string) => ['partnerDetails', partnerSlug],
};

/**
 * React hook to fetch the list of partners.
 *
 * @returns The query result from React Query, including the data.
 *
 * @example
 * ```ts
 * const { data: partners } = usePartners();
 * partners.map(partner => <div key={partner.id}>{partner.name}</div>);
 * ```
 */
export const usePartners = ({
  pageIndex,
  pageSize,
  ordering,
  search,
}: {
  pageIndex: number; pageSize: number, ordering?: string,
  search?: string,
}): UseQueryResult<{ partners: Partner[], count: number; pageCount: number }> => {
  const {
    data, isLoading, isError, error, isSuccess,
  } = useQuery({
    queryKey: queryKey.partnerList(pageIndex, pageSize, ordering, search),
    queryFn: () => getPartners(pageIndex, pageSize, ordering, search),
  });

  return {
    data: {
      partners: data?.results || [],
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
 * React hook to fetch the details of a specific partner by slug.
 *
 * @param partnerSlug - The unique slug identifier for the partner.
 *
 * @returns An object containing:
 * - `partnerDetails` – The detailed information of the partner.
 *
 * @example
 * ```ts
 * const { data: partnerDetails } = usePartnerDetails({ partnerSlug: 'acme-inc' });
 * ```
 */
export const usePartnerDetails = ({ partnerSlug }: { partnerSlug: string }) => useSuspenseQuery({
  queryKey: queryKey.partnerDetails(partnerSlug),
  queryFn: () => getPartnerDetails(partnerSlug),
});
