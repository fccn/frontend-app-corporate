import { Partner } from '@src/types';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerDetails, getPartners } from './api';


export const usePartners = ()=> useSuspenseQuery({
  queryKey: ['partners'],
  queryFn: () => getPartners(),
});

export const usePartnerDetails = ({ partnerId }) => {
  const queryClient = useQueryClient();
  const partnersCached: Partner[] | undefined = queryClient.getQueryData(['partners']);

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
