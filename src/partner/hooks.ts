import { useQuery } from '@tanstack/react-query';
import { camelCaseObject } from '@edx/frontend-platform';
import { getPartners } from './api'; // Adjust the import path if needed

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
    partners: data?.results?.map((partnerData) => camelCaseObject(partnerData)) || [],
    count: data?.count || 0,
    pages: data?.numPages || 1,
    error,
  };
}
