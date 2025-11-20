import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerDetails, getPartners } from './api';

export const usePartners = () => useSuspenseQuery({
  queryKey: ['partners'],
  queryFn: () => getPartners(),
});

export const usePartnerDetails = ({ partnerId }) => {
  const { data: partnerDetails, isLoading } = useQuery({
    queryKey: ['partnerDetails', partnerId],
    queryFn: () => getPartnerDetails(partnerId),
    enabled: !!partnerId,
  });

  return {
    partnerDetails,
    isLoadingPartnerDetails: isLoading,
  };
};
