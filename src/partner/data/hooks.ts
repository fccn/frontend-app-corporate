import { useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerDetails, getPartners } from './api';

const queryKey = {
  partners: () => ['partners'],
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
export const usePartners = () => useSuspenseQuery({
  queryKey: queryKey.partners(),
  queryFn: () => getPartners(),
});

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
