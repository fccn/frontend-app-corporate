import { useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerDetails, getPartners } from './api';

const queryKey = {
  partners: () => ['partners'],
  partnerDetails: (partnerSlug: string) => ['partnerDetails', partnerSlug],
};

export const usePartners = () => useSuspenseQuery({
  queryKey: queryKey.partners(),
  queryFn: () => getPartners(),
});

export const usePartnerDetails = ({ partnerSlug }) => {
  const { data: partnerDetails } = useSuspenseQuery({
    queryKey: queryKey.partnerDetails(partnerSlug),
    queryFn: () => getPartnerDetails(partnerSlug),
  });

  return {
    partnerDetails,
  };
};
