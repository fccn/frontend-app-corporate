import { CorporatePartner } from '@src/app/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPartnerDetails, getPartners } from './api';

export const usePartnerDetails = ({ partnerId }) => {
  const queryClient = useQueryClient();
  const partnersCached: CorporatePartner[] | undefined = queryClient.getQueryData(['partners']);

  // Check if this specific partner is already cached
  const partnerCached = partnersCached?.find((partner) => partner.id === Number(partnerId));

  const { data: partnerDetails, isLoading } = useQuery({
    queryKey: ['partnerDetails', partnerId],
    queryFn: () => getPartnerDetails(partnerId),
    enabled: !partnerCached,
  });

  return {
    partnerDetails: partnerCached || partnerDetails,
    isLoadingPartnerDetails: isLoading,
  };
};

interface UsePartnersOptions {
  pageSize: number;
  pageIndex: number;
}

export function usePartners({ pageSize, pageIndex }: UsePartnersOptions) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['partners', pageSize, pageIndex],
    queryFn: () => getPartners({ pageSize, pageIndex }),
  });

  return {
    isLoading,
    partners: data?.results || [],
    count: data?.count || 0,
    pages: data?.numPages || 1,
    error,
  };
}
