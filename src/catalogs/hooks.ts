import { useCallback } from 'react';
import { FieldValues, Resolver } from 'react-hook-form';
import { SchemaOf } from 'yup';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { CorporateCatalog, PaginatedResponse } from '@src/app/types';
import { getCatalogDetails, getPartnerCatalogs } from './api';

export const usePartnerCatalogs = (
  { partnerId, pageIndex, pageSize }: { partnerId: string; pageIndex: number; pageSize: number; },
) => {
  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  return { partnerCatalogs, isLoadingCatalogs };
};

export const useCatalogDetails = ({
  partnerId,
  selectedCatalog,
}: { partnerId: string; selectedCatalog: string | number; }) => {
  const queryClient = useQueryClient();

  const allCatalogs = queryClient
    .getQueriesData({ queryKey: ['partnerCatalogs', partnerId] })
    .flatMap(([, data]) => (data as PaginatedResponse<CorporateCatalog>)?.results ?? []);

  const catalogFromCache = allCatalogs.find((c) => c.id === selectedCatalog);

  const { data: catalogDetails, isLoading } = useQuery({
    queryKey: ['catalogDetails', partnerId, selectedCatalog],
    queryFn: () => getCatalogDetails(partnerId, selectedCatalog),
    enabled: !catalogFromCache && !!partnerId && !!selectedCatalog,
  });

  return {
    catalogDetails: catalogFromCache || catalogDetails || null,
    isLoadingCatalogDetails: isLoading,
  };
};

/**
 * Creates a resolver function that validates form values using a Yup schema.
 * The returned resolver function takes form values, validates them against the schema,
 * and returns an object with either validated values or error messages.
 *
 * https://react-hook-form.com/advanced-usage#CustomHookwithResolver
 *
 * @param validationSchema - The Yup schema to validate against.
 * @returns A resolver function that validates form values using the provided schema.
 */
export const useYupValidationResolver = <TFieldValues extends FieldValues>(
  validationSchema: SchemaOf<TFieldValues>,
): Resolver<TFieldValues> => useCallback(
    async (values) => {
      try {
        await validationSchema.validate(values, { abortEarly: false });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );
