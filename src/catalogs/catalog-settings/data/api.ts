import { camelCaseObject, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getCorporateApi } from '@src/constants';
import { Catalog, CatalogUpdateRequest } from '@src/types';

export const updateCatalog = async (
  catalogId: string | number,
  data: CatalogUpdateRequest,
): Promise<Catalog | null> => {
  try {
    const url = getCorporateApi(`manage/catalogs/${catalogId}/`);
    const response = await getAuthenticatedHttpClient().patch(url, snakeCaseObject(data));
    return camelCaseObject(response.data);
  } catch (error) {
    logError(error);
    throw error;
  }
};
