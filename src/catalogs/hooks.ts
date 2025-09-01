import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CorporatePartner } from '@src/app/types';
import { getPartnerCatalogs, getPartnerDetails } from './api';

export const usePartnerCatalogs = ({ partnerId, pageIndex, pageSize }) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};

export const usePartnerDetails = ({ partnerId }) => {
  const queryClient = useQueryClient();
  const partnersCached: CorporatePartner[] | undefined = queryClient.getQueryData(['partners']);

  const { data: partnerDetails, isLoading } = useQuery({
    queryKey: ['partnerDetails', partnerId],
    queryFn: () => getPartnerDetails(partnerId),
    enabled: !partnersCached,
  });

  return {
    partnerDetails: partnersCached
      ? partnersCached?.find((partner) => partner.id === Number(partnerId))
      : partnerDetails,
    isLoadingPartnerDetails: isLoading,
  };
};
