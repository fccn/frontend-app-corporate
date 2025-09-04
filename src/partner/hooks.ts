import { CorporatePartner } from '@src/app/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPartnerDetails } from './api';

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
