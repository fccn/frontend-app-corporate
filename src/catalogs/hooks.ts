import { useSuspenseQuery } from '@tanstack/react-query';
import { getPartnerCatalogs } from './api';

export const usePartnerCatalogs = ({ partnerId, pageIndex, pageSize }) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};
